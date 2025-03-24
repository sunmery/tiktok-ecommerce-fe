import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Grid,
    Typography,
    Card,
    CardContent,
} from '@mui/joy';
import { Product, AttributeValue } from '@/types/products';

interface ProductEditFormProps {
    product?: Product;
    onSubmit: (product: Partial<Product>) => void;
    onCancel: () => void;
}

const AttributeEditor: React.FC<{
    name: string;
    value: AttributeValue;
    onChange: (value: AttributeValue) => void;
}> = ({ name, value, onChange }) => {
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
        <Box sx={{ mb: 2 }}>
            <FormLabel>{name}</FormLabel>
            {isEditing ? (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={handleSave}>保存</Button>
                    <Button variant="outlined" onClick={handleCancel}>取消</Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
    product,
    onSubmit,
    onCancel,
}) => {
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
            inventory: { productId: '', merchantId: '', stock: 0 },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                            <FormControl fullWidth>
                                <FormLabel>商品名称</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, name: e.target.value }))
                                    }
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl fullWidth>
                                <FormLabel>商品描述</FormLabel>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, description: e.target.value }))
                                    }
                                    minRows={3}
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormLabel>价格</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, price: Number(e.target.value) }))
                                    }
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormLabel>库存</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.inventory?.stock || 0}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            inventory: {
                                                ...prev.inventory,
                                                stock: Number(e.target.value),
                                            },
                                        }))
                                    }
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <Typography level="h4" sx={{ mb: 2 }}>商品属性</Typography>
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
                                sx={{ mt: 2 }}
                            >
                                添加属性
                            </Button>
                        </Grid>

                        <Grid xs={12}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={onCancel}>
                                    取消
                                </Button>
                                <Button type="submit">
                                    保存
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}; 