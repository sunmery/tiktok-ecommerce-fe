import React, {useState, useEffect} from 'react';
import {
    Alert,
    AspectRatio,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormLabel,
    Grid,
    Input,
    styled,
    SvgIcon,
    Textarea,
    Typography,
    Select,
    Option
} from '@mui/joy';
import {AttributeValue, Product, CategoryInfo} from '@/types/products';
import PhotoIcon from '@mui/icons-material/PhotoCamera';
import {useTranslation} from 'react-i18next';
import {categoryService} from '@/api/categoryService';
import {Category} from '@/types/category';

interface ProductEditFormProps {
    product?: Product;
    onSubmit: (product: Partial<Product>) => void;
    onCancel: () => void;
}

const AttributeEditor: React.FC<{
    name: string;
    value: AttributeValue;
    onChange: (value: AttributeValue) => void;
}> = ({name, value, onChange}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const handleEdit = () => {
        if (Array.isArray(value)) {
            setEditValue(value.join(', '));
        } else if (typeof value === 'string') {
            setEditValue(value);
        } else {
            setEditValue(JSON.stringify(value));
        }
        setIsEditing(true);
    };

    const handleSave = () => {
        try {
            if (Array.isArray(value)) {
                onChange(editValue.split(',').map(v => v.trim()));
            } else if (typeof value === 'string') {
                onChange(editValue);
            } else {
                onChange(JSON.parse(editValue));
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <Box sx={{mb: 2}}>
            <FormLabel>{name}</FormLabel>
            {isEditing ? (
                <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={handleSave}>保存</Button>
                    <Button variant="outlined" onClick={handleCancel}>取消</Button>
                </Box>
            ) : (
                <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                    <Input
                        value={
                            Array.isArray(value)
                                ? value.join(', ')
                                : typeof value === 'string'
                                    ? value
                                    : JSON.stringify(value)
                        }
                        readOnly
                        fullWidth
                    />
                    <Button onClick={handleEdit}>编辑</Button>
                </Box>
            )}
        </Box>
    );
};

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

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
                                                                    product,
                                                                    onSubmit,
                                                                    onCancel,
                                                                }): JSX.Element => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState<Partial<Product>>(
        product || {
            name: '',
            description: '',
            price: 0,
            status: 0,
            merchantId: '',
            picture: '',
            images: [],
            quantity: 0,
            attributes: {},
            inventory: {productId: '', merchantId: '', stock: 0},
            category: {
                categoryId: 0,
                categoryName: ''
            }
        }
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(product?.picture || '');
    const [uploadStatus, setUploadStatus] = useState<{
        loading: boolean;
        error: string | null;
    }>({
        loading: false,
        error: null
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);

    // 获取分类列表
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                // 获取叶子分类
                const result = await categoryService.listLeafCategories();
                setCategories(result.categories || []);
            } catch (error) {
                console.error('获取分类列表失败:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            setUploadStatus({
                loading: false,
                error: t('products.onlyImageAllowed')
            });
            return;
        }

        // 验证文件大小（最大5MB）
        if (file.size > 5 * 1024 * 1024) {
            setUploadStatus({
                loading: false,
                error: t('products.fileTooLarge')
            });
            return;
        }

        setSelectedFile(file);
        setUploadStatus({
            loading: false,
            error: null
        });

        // 创建预览URL
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                setImagePreview(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedFile) return null;

        try {
            const response = await fetch(`https://gw.localhost/v1/products/uploadfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    method: "POST",
                    contentType: selectedFile.type,
                    bucketName: "ecommerce",
                    fileName: selectedFile.name
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();

            if (data.downloadUrl) {
                const uploadResponse = await fetch(data.downloadUrl, {
                    method: 'PUT',
                    body: selectedFile
                });

                if (uploadResponse.status === 200) {
                    // 从downloadUrl中提取永久访问URL
                    const permanentUrl = data.downloadUrl.split('?')[0];
                    return permanentUrl;
                } else {
                    throw new Error(`Upload failed with status ${uploadResponse.status}`);
                }
            } else {
                throw new Error('No download URL received');
            }
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadStatus({loading: true, error: null});

        try {
            let updatedFormData = {...formData};

            // 如果有选择新图片，先上传图片
            if (selectedFile) {
                try {
                    const imageUrl = await handleImageUpload();
                    if (imageUrl) {
                        updatedFormData = {
                            ...updatedFormData,
                            picture: imageUrl,
                            images: [{url: imageUrl, isPrimary: true, sortOrder: 0}]
                        };
                    }
                } catch (error) {
                    console.error('Image upload failed:', error);
                    setUploadStatus({
                        loading: false,
                        error: t('products.uploadFailed')
                    });
                    return; // 如果图片上传失败，不继续提交表单
                }
            }

            // 提交表单数据
            await onSubmit(updatedFormData);
            setUploadStatus({loading: false, error: null});
        } catch (error) {
            console.error('Form submission failed:', error);
            setUploadStatus({
                loading: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };

    const handleAttributeChange = (name: string, value: AttributeValue) => {
        setFormData(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [name]: value,
            },
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography level="h4" sx={{mb: 2}}>{t('products.productImage')}</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: {xs: 'column', sm: 'row'},
                                gap: 2,
                                alignItems: 'flex-start'
                            }}>
                                <Box sx={{width: {xs: '100%', sm: 200}, flexShrink: 0}}>
                                    <AspectRatio ratio="1" sx={{
                                        width: '100%',
                                        bgcolor: 'neutral.100',
                                        borderRadius: 'md',
                                        mb: 1
                                    }}>
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt={t('products.preview')}
                                                style={{
                                                    objectFit: 'contain',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'text.tertiary'
                                            }}>
                                                <PhotoIcon sx={{fontSize: 40}}/>
                                            </Box>
                                        )}
                                    </AspectRatio>
                                </Box>

                                <Box sx={{flexGrow: 1}}>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mb: 2}}>
                                        <Button
                                            component="label"
                                            role={undefined}
                                            tabIndex={-1}
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
                                            {t('products.selectImage')}
                                            <VisuallyHiddenInput type="file" accept="image/*"
                                                                 onChange={handleImageChange}/>
                                        </Button>
                                    </Box>

                                    {uploadStatus.error && (
                                        <Alert color="danger" sx={{mb: 2}}>
                                            {uploadStatus.error}
                                        </Alert>
                                    )}

                                    <Typography level="body-sm">
                                        {t('products.imageRequirements')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <FormLabel>{t('products.name')}</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData(prev => ({...prev, name: e.target.value}))
                                    }
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <FormLabel>{t('products.description')}</FormLabel>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData(prev => ({...prev, description: e.target.value}))
                                    }
                                    minRows={3}
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl sx={{width: '100%'}}>
                                <FormLabel>{t('products.price')}</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData(prev => ({...prev, price: Number(e.target.value)}))
                                    }
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl sx={{width: '100%'}}>
                                <FormLabel>{t('products.stock')}</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.inventory?.stock || 0}
                                    onChange={(e) => {
                                        const stockValue = Number(e.target.value);
                                        setFormData(prev => {
                                            // 确保inventory对象结构正确
                                            const inventory = prev.inventory
                                                ? {
                                                    ...prev.inventory,
                                                    stock: stockValue,
                                                    productId: prev.inventory.productId || '',
                                                    merchantId: prev.inventory.merchantId || ''
                                                }
                                                : {
                                                    stock: stockValue,
                                                    productId: '',
                                                    merchantId: ''
                                                };

                                            return {
                                                ...prev,
                                                inventory
                                            };
                                        });
                                    }}
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <FormLabel>{t('products.category')}</FormLabel>
                                <Select
                                    placeholder="请选择分类"
                                    value={formData.category?.categoryId || null}
                                    onChange={(_, value) => {
                                        if (value === null) return;
                                        // 找到选中的分类
                                        const selectedCategory = categories.find(cat => cat.id === String(value));
                                        setFormData(prev => ({
                                            ...prev,
                                            category: {
                                                categoryId: Number(value),
                                                categoryName: selectedCategory?.name || ''
                                            }
                                        }));
                                    }}
                                >
                                    {categoriesLoading ? (
                                        <Option value={0} disabled>加载中...</Option>
                                    ) : categories.length > 0 ? (
                                        categories.map((category) => (
                                            <Option key={category.id} value={Number(category.id)}>
                                                {category.name}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option value={0} disabled>暂无可用分类</Option>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <Typography level="h4" sx={{mb: 2}}>商品属性</Typography>
                            {Object.entries(formData.attributes || {}).map(([name, value]) => (
                                <AttributeEditor
                                    key={name}
                                    name={name}
                                    value={value}
                                    onChange={(newValue) => handleAttributeChange(name, newValue)}
                                />
                            ))}
                            <Button
                                onClick={() => {
                                    const newName = prompt('请输入属性名称');
                                    if (newName) {
                                        handleAttributeChange(newName, '');
                                    }
                                }}
                                sx={{mt: 2}}
                            >
                                添加属性
                            </Button>
                        </Grid>

                        <Grid xs={12}>
                            <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                                <Button variant="outlined" onClick={onCancel}>
                                    {t('products.cancel')}
                                </Button>
                                <Button type="submit" loading={uploadStatus.loading}>
                                    {t('products.save')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}; 
