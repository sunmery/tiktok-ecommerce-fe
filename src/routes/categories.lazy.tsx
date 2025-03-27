import {createLazyFileRoute} from '@tanstack/react-router';
import {Box, Chip, Container, Grid, Typography} from '@mui/joy';
import CategoryNavigator from '@/components/CategoryNavigator';
import {Category} from '@/types/category';
import {useState} from 'react';

export const Route = createLazyFileRoute('/categories')({
    component: Categories,
});

function Categories() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // 在实际应用中，这里可以根据选择的分类加载相关商品
        console.log('Selected category:', category);
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography level="h1" component="h1" sx={{mb: 4}}>
                商品分类
            </Typography>

            <Grid container spacing={4}>
                <Grid xs={12} md={4}>
                    {/* 分类导航器 */}
                    <Box sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        overflow: 'hidden'
                    }}>
                        <Typography
                            level="title-md"
                            sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.level1'
                            }}
                        >
                            浏览分类
                        </Typography>
                        <CategoryNavigator onCategorySelect={handleCategorySelect}/>
                    </Box>
                </Grid>

                <Grid xs={12} md={8}>
                    {/* 选中分类的内容区域 */}
                    <Box sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        p: 3,
                        height: '100%',
                        minHeight: '400px'
                    }}>
                        {selectedCategory ? (
                            <div>
                                <Typography level="h4" component="h2" sx={{mb: 2}}>
                                    {selectedCategory.name}
                                </Typography>
                                <Box sx={{display: 'flex', gap: 1, mb: 2}}>
                                    <Chip size="sm" color="primary">ID: {selectedCategory.id}</Chip>
                                    <Chip size="sm" color="neutral">层级: {selectedCategory.level}</Chip>
                                    {selectedCategory.isLeaf && (
                                        <Chip size="sm" color="success">叶子节点</Chip>
                                    )}
                                </Box>
                                <Typography level="body-sm" sx={{mb: 2}}>
                                    路径: {selectedCategory.path}
                                </Typography>

                                <Box sx={{mt: 4}}>
                                    <Typography level="body-md">
                                        在这里展示分类 "{selectedCategory.name}" 的商品列表
                                    </Typography>
                                </Box>
                            </div>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}
                            >
                                <Typography level="body-lg" color="neutral">
                                    请从左侧选择一个分类
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
} 
