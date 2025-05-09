import {FC, useCallback, useEffect, useState} from 'react';
import {Box, List, ListItem, ListItemButton, ListItemContent, Typography} from '@mui/joy';
import {Category} from '@/types/category';
import {categoryService} from '@/api/categoryService';

interface CategoryNavigatorProps {
    onCategorySelect: (category: Category) => void;
}

const CategoryNavigator: FC<CategoryNavigatorProps> = ({
    onCategorySelect,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // 加载分类数据
    const loadCategories = useCallback(async (parentId: string = '0') => {
        try {
            setLoading(true);
            setError(null);
            const response = await categoryService.getDirectSubCategories({parentId});
            if (response && response.categories) {
                setCategories(response.categories);
            }
        } catch (err) {
            console.error('加载分类失败:', err);
            setError('加载分类数据失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    }, []);

    // 获取分类路径
    const loadCategoryPath = useCallback(async (categoryId: string) => {
        try {
            const response = await categoryService.getCategoryPath({categoryId});
            if (response && response.categories) {
                // 这里可以处理分类路径，例如显示面包屑导航
                console.log('Category path:', response.categories);
            }
        } catch (err) {
            console.error('获取分类路径失败:', err);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleCategoryClick = async (category: Category) => {
        setSelectedCategoryId(category.id);
        onCategorySelect(category);

        if (!category.isLeaf) {
            await loadCategories(category.id);
        }

        await loadCategoryPath(category.id);
    };

    if (loading) {
        return (
            <Box sx={{p: 2}}>
                <Typography level="body-sm">加载中...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{p: 2}}>
                <Typography level="body-sm" color="danger">{error}</Typography>
            </Box>
        );
    }

    return (
        <List
            size="sm"
            sx={{
                '--ListItem-radius': '0',
                '--ListItem-minHeight': '32px',
                '--ListItem-gap': '4px',
            }}
        >
            {categories.map((category) => (
                <ListItem key={category.id}>
                    <ListItemButton
                        selected={category.id === selectedCategoryId}
                        onClick={() => handleCategoryClick(category)}
                    >
                        <ListItemContent>
                            <Typography level="body-sm">
                                {category.name}
                                {category.isLeaf && ' 🍃'}
                            </Typography>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
            ))}

            {categories.length === 0 && (
                <ListItem>
                    <ListItemContent>
                        <Typography level="body-sm" sx={{textAlign: 'center', py: 2}}>
                            暂无分类数据
                        </Typography>
                    </ListItemContent>
                </ListItem>
            )}
        </List>
    );
};

export default CategoryNavigator;