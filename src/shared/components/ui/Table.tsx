import {ChangeEvent, useState} from 'react';
import * as XLSX from 'xlsx';
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Box, createTheme, styled, ThemeProvider} from '@mui/material';
import {zhCN} from '@mui/x-data-grid/locales';

type CellValue = string | number | boolean | null;

export default function Table() {
    const [data, setData] = useState<CellValue[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);

    // 模拟的Excel数据
    const sampleExcelData: (string | number)[][] = [
        ['姓名', '年龄', '城市', '职业'],
        ['张三', 28, '北京', '工程师'],
        ['李四', 32, '上海', '设计师'],
        ['王五', 25, '广州', '产品经理'],
        ['赵六', 30, '深圳', '市场专员']
    ];

    // 处理文件上传
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (!event.target?.result) return;
            const data = new Uint8Array(event.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});

            // 获取第一个工作表
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, {header: 1});

            if (jsonData.length > 0) {
                setHeaders(jsonData[0].map(header => String(header))); // 第一行作为表头，确保是字符串
                setData(jsonData.slice(1) as CellValue[][]); // 剩余行作为数据
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // 加载示例数据
    const loadSampleData = () => {
        setHeaders(sampleExcelData[0].map(header => String(header)));
        setData(sampleExcelData.slice(1) as CellValue[][]);
    };
    const theme = createTheme(
        {
            palette: {
                primary: {main: '#1976d2'},
            },
        },
        zhCN,
    );

    return (
        <Box style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
            <Box style={{marginBottom: '20px'}}>
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    style={{marginRight: '10px'}}
                />
                <button onClick={loadSampleData}>加载示例数据</button>
            </Box>


            <Box sx={{display: 'flex', flexDirection: 'column', height: 600}}>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        rows={data.map((row, index) => ({
                            id: index,
                            ...headers.reduce((obj, header, i) => ({
                                ...obj,
                                [header]: row[i] || ''
                            }), {})
                        }))}
                        columns={headers.map(header => ({
                            field: header,
                            headerName: header,
                            width: 150
                        }))}
                        pageSizeOptions={[5, 10, 20, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {pageSize: 100}
                            }
                        }}
                        pagination
                        slots={{noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar}}
                        sx={{'--DataGrid-overlayHeight': '300px'}}
                    />
                </ThemeProvider>
            </Box>


            {data.length === 0 && (
                <div style={{marginTop: '20px', color: '#666'}}>
                    <p>请上传Excel文件或点击"加载示例数据"按钮</p>
                    <p>支持格式: .xlsx, .xls, .csv</p>
                </div>
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
