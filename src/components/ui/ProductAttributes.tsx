import React from 'react';
import {AttributeValue} from '@/types/products';
import {Box, Chip, Sheet, Stack, Typography} from '@mui/joy';

interface ProductAttributesProps {
    attributes: Record<string, AttributeValue>;
    className?: string;
}

const AttributeItem: React.FC<{
    name: string;
    value: AttributeValue;
    level?: number;
}> = ({name, value, level = 0}) => {
    const paddingLeft = `${level * 12}px`;

    // 格式化属性名称
    const formatName = (name: string) => {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    // 渲染不同类型的值
    const renderValue = (value: AttributeValue) => {
        if (Array.isArray(value)) {
            return (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {value.map((item, index) => (
                        <Chip
                            key={index}
                            size="sm"
                            variant="soft"
                        >
                            {item}
                        </Chip>
                    ))}
                </Stack>
            );
        }

        if (typeof value === 'object' && value !== null) {
            return (
                <Stack spacing={1} sx={{mt: 0.5}}>
                    {Object.entries(value).map(([key, val]) => (
                        <AttributeItem
                            key={key}
                            name={key}
                            value={val}
                            level={level + 1}
                        />
                    ))}
                </Stack>
            );
        }

        return (
            <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                {String(value)}
            </Typography>
        );
    };

    return (
        <Box sx={{paddingLeft, py: 0.5}}>
            <Typography level="body-sm" fontWeight="md">
                {formatName(name)}
            </Typography>
            <Box sx={{mt: 0.5}}>
                {renderValue(value)}
            </Box>
        </Box>
    );
};

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
                                                                        attributes,
                                                                    }) => {
    if (!attributes || Object.keys(attributes).length === 0) {
        return <Typography level="body-sm">无属性</Typography>;
    }

    return (
        <Sheet variant="outlined" sx={{p: 1, maxHeight: '200px', overflow: 'auto'}}>
            <Stack spacing={1}>
                {Object.entries(attributes).map(([name, value]) => (
                    <AttributeItem key={name} name={name} value={value}/>
                ))}
            </Stack>
        </Sheet>
    );
};
