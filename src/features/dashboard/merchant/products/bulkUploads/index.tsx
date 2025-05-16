import { ChangeEvent, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { DataGrid, GridRowModel, GridToolbar } from "@mui/x-data-grid"; // Import GridRowModel
import { Box, createTheme, styled, ThemeProvider } from '@mui/material';
import { zhCN } from '@mui/x-data-grid/locales';
import Button from "@mui/joy/Button";
import { Upload } from "@mui/icons-material";
import { productService } from "@/api/productService";
import { useTranslation } from 'react-i18next';
import Typography from "@mui/joy/Typography";
import { showMessage } from '@/utils/showMessage';
import { ProductRow, ProductRows } from "./types.ts";
import SvgIcon from '@mui/joy/SvgIcon';

// 类型定义
type CellValue = string | number | boolean | Date;

interface FieldMapping {
    [localizedHeader: string]: string; // 示例: { "商品名称": "name" }
}

// 字段映射配置（可异步加载）
const FIELD_MAPPINGS: Record<string, FieldMapping> = {
    'zh': {
        '商品名称': 'name',
        '商品描述': 'description',
        '商品价格': 'price',
        '分类.ID': 'category.categoryId',
        '分类.名称': 'category.categoryName',
        '库存数量': 'stock',
        '图片.链接': 'images'  // 修改此处路径映射
    },
    'en': {
        'Product Name': 'name',
        'Price': 'price',
        'Description': 'description',
        'Category.ID': 'category.categoryId',
        'Category.Name': 'category.categoryName',
        'Stock': 'stock',
        'Image URL': 'images'  // 同步修改英文映射
    }
};

// 属性字段正则表达式
const ATTRIBUTE_REGEX = {
    'zh': /^属性\.(.*)/,
    'en': /^Attributes\.(.*)/
};

export default function ProductBulkUploads() {
    const [data, setData] = useState<CellValue[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedData, setUploadedData] = useState<ProductRows>({products: []});
    const {t} = useTranslation()

    // 模拟的Excel数据
    const sampleExcelData: (string | number)[][] = [
        ['商品名称', '商品描述', '商品价格', '职业'],
        ['张三', 28, '北京', '工程师'],
        ['李四', 32, '上海', '设计师'],
        ['王五', 25, '广州', '产品经理'],
        ['赵六', 30, '深圳', '市场专员']
    ];
    // 数据处理核心方法
    const processExcelData = (
        rows: CellValue[][],
        headerPaths: string[],
        lang: string
    ) => {
        const validProducts: ProductRow[] = [];
        const errors: Array<{ row: number; column: string; message: string }> = [];
        const missingRequiredHeaders = ['name', 'price'].filter(field =>
            !headerPaths.some(path => path.startsWith(field))
        );

        // 属性处理逻辑
        const processDynamicAttributes = (product: ProductRow, path: string, value: any) => {
            // 移除前缀并分割路径
            const attrPath = path.replace('attributes.', '').split('.');
            let current = product.attributes ||= {};

            // 构建嵌套结构
            attrPath.slice(0, -1).forEach(key => {
                current[key] = current[key] || {};
                current = current[key];
            });

            // 设置最终属性值
            const lastKey = attrPath[attrPath.length - 1];
            current[lastKey] = value;
        };

        if (missingRequiredHeaders.length > 0) {
            errors.push({
                row: 1, // 表头行
                column: 'ALL',
                message: `缺少必要列头: ${missingRequiredHeaders.join(', ')}`
            });
        }

        rows.forEach((row, rowIndex) => {
            const product: ProductRow = {};
            const rowErrors: typeof errors = [];

            headerPaths.forEach((path, colIndex) => {
                const rawValue = row[colIndex];
                const cellPosition = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;

                try {
                    // 处理动态属性
                    if (path.startsWith('attributes.')) {
                        processDynamicAttributes(product, path, rawValue);
                        return;
                    }

                    // 处理图片字段
                    if (path === 'images') {
                        // 确保rawValue不为空且有效
                        if (rawValue && String(rawValue).trim()) {
                            // 处理可能包含方括号和反引号的URL字符串
                            let urlStr = String(rawValue).trim();
                            // 移除可能存在的方括号和反引号
                            urlStr = urlStr.replace(/^\s*\[\s*/, '').replace(/\s*\]\s*$/, '');
                            urlStr = urlStr.replace(/`/g, '');

                            // 将逗号分隔的URL字符串转换为对象数组结构
                            product.images = urlStr.split(',').map((url, index) => ({
                                url: url.trim(),
                                isPrimary: index === 0,  // 第一张图片设为主图
                                sortOrder: index       // 按顺序设置排序值
                            })).filter(img => img.url.length > 0);
                        } else {
                            // 保证 images 字段始终为数组，即使没有图片
                            product.images = [];
                        }
                        return;
                    }
                    // 跳过未知列
                    if (path.startsWith('__UNKNOWN')) {
                        rowErrors.push({
                            row: rowIndex + 2,
                            column: cellPosition,
                            message: `无法识别的列头: ${path.split('.')[1]}`
                        });
                        return;
                    }

                    // 解析嵌套路径
                    const parsedPath = parseFieldPath(path);
                    const convertedValue = convertValueType(rawValue, parsedPath.dataType, parsedPath.pathParts.join('.'));

                    // 设置嵌套值
                    setNestedValue(product, parsedPath.pathParts, convertedValue);

                    // 数据校验
                    validateField(parsedPath, convertedValue, rowErrors, rowIndex, cellPosition, lang);

                } catch (error) {
                    rowErrors.push({
                        row: rowIndex + 2,
                        column: cellPosition,
                        message: error instanceof Error ? error.message : '未知错误'
                    });
                }
            });

            if (rowErrors.length === 0) {
                validProducts.push(product);
            } else {
                errors.push(...rowErrors);
            }
        });

        return {validProducts, errors};
    };

// 辅助函数：解析字段路径（示例: 'category.id:number' → { pathParts: ['category', 'id'], dataType: 'number' }）
    const parseFieldPath = (path: string) => {
        const [fullPath, type] = path.split(':');
        return {
            pathParts: fullPath
                .replace(/\[(\d+)]/g, '.$1') // 转换数组索引
                .split('.'),
            dataType: type || 'auto'
        };
    };

// 辅助函数：设置嵌套值
    const setNestedValue = (obj: any, path: string[], value: any) => {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];

            // 自动创建数组或对象
            if (!current[key]) {
                current[key] = isNaN(Number(path[i + 1])) ? {} : [];
            }

            current = current[key];
        }

        const lastKey = path[path.length - 1];
        current[lastKey] = value;
    };

// 类型转换
    const convertValueType = (value: CellValue, dataType: string, path: string) => {
        // 处理空值
        if (value === null || value === undefined || value === '') return null;

        // 处理图片字段
        if (path === 'images') {
            // 处理可能包含方括号的URL字符串
            let urlStr = String(value).trim();
            // 移除可能存在的方括号
            urlStr = urlStr.replace(/^\s*\[\s*/, '').replace(/\s*\]\s*$/, '');

            return urlStr
                .split(',')
                .map((url, index) => ({
                    url: url.trim(),
                    isPrimary: index === 0,  // 第一张图片设为主图
                    sortOrder: index       // 按顺序设置排序值
                }))
                .filter(img => img.url.length > 0);
        }

        // 处理嵌套属性
        if (path.startsWith('attributes.')) {
            // 保留原始字符串格式
            return typeof value === 'string' ? value : String(value);
        }
        if (dataType === 'auto') {
            // 处理数字类型（包含货币符号）
            if (typeof value === 'string' && /\D/.test(value)) {
                return value; // 包含非数字字符时保留原值
            }

            // 智能类型推断
            if (typeof value === 'number') return value;
            if (value instanceof Date) return value.toISOString();
            if (typeof value !== 'string') return String(value);

            // 尝试转换为数字
            if (!isNaN(Number(value)) && value !== '') return Number(value);

            // 布尔值检测
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;

            return value;
        }

        // 强制类型转换
        switch (dataType) {
            case 'number':
                return Number(value) || 0;
            case 'boolean':
                return Boolean(value);
            default:
                return String(value);
        }
    };
    // 数据校验
    // URL校验工具函数
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
    const validateField = (
        parsedPath: ReturnType<typeof parseFieldPath>,
        value: any,
        errors: any,
        rowIndex: number,
        column: string,
        lang: string
    ) => {
        // 图片链接校验
        if (parsedPath.pathParts[0] === 'images') {
            const urls = Array.isArray(value) ? value : [value];
            // 处理新的图片对象结构
            const invalidUrls = urls.filter(item => {
                const url = typeof item === 'object' && item.isPrimary !== undefined ? item.url : item;
                return !isValidUrl(typeof url === 'string' ? url : String(url));
            });

            if (invalidUrls.length > 0) {
                errors.push({
                    row: rowIndex + 2,
                    column,
                    message: `无效的图片链接: ${invalidUrls.map(item => typeof item === 'object' && item.isPrimary !== undefined ? item.url : item).join(', ')}`
                });
            }
        }

        // 属性值长度校验
        if (parsedPath.pathParts[0] === 'attributes') {
            if (String(value).length > 100) {
                errors.push({
                    row: rowIndex + 2,
                    column,
                    message: `属性值长度不能超过100字符`
                });
            }
        }

        // 必填校验
        if (parsedPath.pathParts.includes('name') && !value) {
            errors.push({
                row: rowIndex + 2,
                column,
                message: getLocalizedError('field_required', lang, '商品名称')
            });
        }

        // 数字范围校验
        if (parsedPath.dataType === 'number' && value < 0) {
            errors.push({
                row: rowIndex + 2,
                column,
                message: getLocalizedError('invalid_number', lang, '价格')
            });
        }

        // 自定义校验规则
    };

    // 多语言错误信息
    const ERROR_MESSAGES = {
        field_required: {
            'zh': (field: string) => `${field}不能为空`,
            'en': (field: string) => `${field} is required`
        },
        invalid_number: {
            'zh': (field: string) => `${field}必须大于0`,
            'en': (field: string) => `${field} must be positive`
        }
    };

    const getLocalizedError = (code: keyof typeof ERROR_MESSAGES, lang: string, field: string) => {
        return (ERROR_MESSAGES[code][lang] || ERROR_MESSAGES[code]['zh'])(field);
    };

    // 展平函数
    const flattenObject = (obj: any, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
            const pre = prefix ? `${prefix}.` : '';
            const value = obj[key];

            // 特殊处理属性字段
            if (key === 'attributes') {
                // 递归处理嵌套属性
                const processAttributes = (attrs: any, attrPrefix = '') => {
                    Object.entries(attrs).forEach(([subKey, subVal]) => {
                        if (typeof subVal === 'object' && subVal !== null && !Array.isArray(subVal)) {
                            // 递归处理嵌套对象
                            processAttributes(subVal, `${attrPrefix}${subKey}.`);
                        } else {
                            // 处理数组或基本类型
                            const displayValue = Array.isArray(subVal) ? subVal.join(', ') : subVal;
                            acc[`attributes_${attrPrefix}${subKey}`] = displayValue;
                        }
                    });
                };

                processAttributes(value);
                return acc;
            } else if (Array.isArray(value) && key === 'images') {
                // 处理图片对象数组
                acc[`${pre}images`] = value.map((img: any) => typeof img === 'object' ? img.url : img).join(', ');
            } else if (typeof value === 'object' && value !== null) {
                Object.assign(acc, flattenObject(value, pre + key));
            } else {
                acc[pre + key] = value;
            }

            return acc;
        }, {} as Record<string, any>);
    };

// 字段名转换函数
    const getDisplayHeader = (path: string) => {
        const rawHeaders = uploadedData.rawData?.[0] || [];

        // 处理属性字段
        if (path.startsWith('attributes.')) {
            const attrPath = path.replace('attributes.', '');
            // 查找原始表头中匹配的属性字段
            const attrHeader = rawHeaders.find((h: string) => {
                return ATTRIBUTE_REGEX['zh'].test(h) &&
                    h.replace(/^属性\./, '') === attrPath;
            });
            return attrHeader || attrPath;
        }

        // 处理其他字段
        return rawHeaders.find((h: string) =>
            FIELD_MAPPINGS['zh'][h.trim()] === path
        ) || path;
    };
    // 读取文件
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, lang: string = 'zh') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (!event.target?.result) return;
            const data = new Uint8Array(event.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: 'array', codepage: 936});

            // 获取第一个工作表
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 转换为JSON数据
            const jsonData = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, {header: 1});

            if (jsonData.length > 0) {
                // 步骤1：处理表头映射
                const rawHeaders = jsonData[0].map(header => String(header).trim());
                const fieldMapping = FIELD_MAPPINGS[lang] || FIELD_MAPPINGS['zh'];

                // 转换后的表头路径数组（包含嵌套信息）
                const headerPaths = rawHeaders.map(header => {
                    // 检查是否是属性字段
                    const attrMatch = ATTRIBUTE_REGEX[lang]?.exec(header);
                    if (attrMatch && attrMatch[1]) {
                        return `attributes.${attrMatch[1]}`;
                    }
                    return fieldMapping[header] || `__UNKNOWN.${header}`; // 未知字段特殊处理
                });

                // 步骤2：处理数据行
                const {validProducts, errors} = processExcelData(
                    jsonData.slice(1) as CellValue[][],
                    headerPaths,
                    lang
                );

                console.log('原始表头:', rawHeaders);
                console.log('映射后的路径:', headerPaths);
                console.log('转换后的商品数据:', validProducts);
                console.log('发现的错误:', errors);

                // 更新状态
                setHeaders(headerPaths)
                // setHeaderPaths(headerPaths)
                setUploadedData({
                    products: validProducts,
                    errors,
                    rawData: jsonData
                });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // 清除文件和数据
    const handleClearFile = () => {
        setData([]);
        setHeaders([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 重置文件输入框
        }
    };

    // 加载示例数据
    const loadSampleData = () => {
        setHeaders(sampleExcelData[0].map(header => String(header)));
        setData(sampleExcelData.slice(1) as CellValue[][]);
    };

    // 处理行更新
    const handleProcessRowUpdate = (newRow: GridRowModel): GridRowModel => {
        const updatedData = [...data];
        const rowIndex = newRow.id as number; // Assuming id is the index
        updatedData[rowIndex] = headers.map(header => newRow[header]);
        setData(updatedData);
        return newRow; // Return the new row to update the grid state
    };

    const theme = createTheme(
        {
            palette: {
                primary: {main: '#1976d2'},
            },
        },
        zhCN,
    );
    const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
    return (
        <Box style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
            <Box style={{marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
                {/*<input*/}
                {/*    ref={fileInputRef} // 关联 ref*/}
                {/*    type="file"*/}
                {/*    accept=".xlsx, .xls"*/}
                {/*    onChange={handleFileUpload}*/}
                {/*    style={{marginRight: '10px'}}*/}
                {/*/>*/}
                <Button
                    sx={{
                        mr:2,
                    }}
                    component="label"
                    role={undefined}
                    ref={fileInputRef} // 关联 ref
                    accept=".xlsx, .xls"
                    tabIndex={-1}
                    onChange={handleFileUpload}
                    variant="outlined"
                    color="neutral"
                    startDecorator={
                        <SvgIcon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>
                        </SvgIcon>
                    }
                >
                    选择文件
                    <VisuallyHiddenInput type="file" />
                </Button>
                <Button onClick={handleClearFile}
                        style={{marginRight: '10px'}}>{t('common.reset')}</Button> {/* 添加清除按钮 */}
                {/*<Button onClick={loadSampleData}>{t('products.loadMockData')}</Button>*/}
                <Button
                    component="label"
                    startDecorator={<Upload/>}
                    onClick={() => {
                        if (uploadedData.products.length === 0) {
                            showMessage(t('products.noDataWarning'), 'warning');
                            return;
                        }

                        productService.createProductBatch({products: uploadedData.products})
                            .then((res) => {
                                console.log('上传成功', res);
                                // 根据返回值显示友好的提示
                                if (res.successCount > 0) {
                                    showMessage(
                                        t('products.uploadSuccess', {
                                            successCount: res.successCount,
                                            totalCount: res.successCount + res.failedCount
                                        }),
                                        'success'
                                    );
                                }

                                if (res.failedCount > 0) {
                                    showMessage(
                                        t('products.uploadPartialFailed', {
                                            failedCount: res.failedCount,
                                            totalCount: res.successCount + res.failedCount
                                        }),
                                        'warning'
                                    );
                                }

                                if (res.errors && res.errors.length > 0) {
                                    res.errors.forEach(error => {
                                        showMessage(error, 'error');
                                    });
                                }

                                handleClearFile();
                            })
                            .catch((err) => {
                                console.error('上传失败', err);
                                showMessage(t('products.uploadFailed'), 'error');
                            });
                    }}
                >
                    {t('products.batchUpload')}
                </Button>
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'column', height: 600}}>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
                        rows={uploadedData.products.map((product, index) => {
                            const flat = flattenObject(product);
                            return {
                                id: index,
                                ...Object.keys(flat).reduce((acc, key) => {
                                    acc[key.replace(/\./g, '_')] = flat[key];
                                    return acc;
                                }, {} as Record<string, any>)
                            };
                        })}
                        columns={[...headers
                            .filter(path => !path.startsWith('__UNKNOWN'))
                            .map(path => {
                                const fieldName = path.replace(/\./g, '_');
                                const displayHeader = getDisplayHeader(path);
                                return {
                                    field: fieldName,
                                    headerName: displayHeader,
                                    width: 150,
                                    editable: false
                                };
                            })]
                        }

                        pageSizeOptions={[5, 10, 20, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {pageSize: 100}
                            }
                        }}
                        pagination
                        slots={{noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar}}
                        processRowUpdate={handleProcessRowUpdate} // Add row update handler
                        sx={{
                            '--DataGrid-overlayHeight': '300px',
                            fontFamily: '"Microsoft YaHei", "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif'
                        }}
                    />
                </ThemeProvider>
            </Box>


            {data.length === 0 && (
                <Box style={{marginTop: '20px', color: '#666'}}>
                    <Typography>请上传Excel文件或点击"加载示例数据"按钮</Typography>
                    <Typography>支持格式: .xlsx, .xls</Typography>
                </Box>
            )}
        </Box>
    );
};

const StyledGridOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#3D4751',
        ...theme.applyStyles('light', {
            fill: '#AEB8C2',
        }),
    },
    '& .no-rows-secondary': {
        fill: '#1D2126',
        ...theme.applyStyles('light', {
            fill: '#E8EAED',
        }),
    },
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{mt: 2}}>No rows</Box>
        </StyledGridOverlay>
    );
}
