import {Box, Chip, Container, Grid, Typography} from '@mui/joy';
import {Category} from '@/types/category';
import {useState} from 'react';
import {t} from 'i18next';
import CategoryNavigator from '@/components/CategoryNavigator';

export function Categories() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // 在实际应用中，这里可以根据选择的分类加载相关商品
        console.log('Selected category:', category);
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography level="h1" component="h1" sx={{mb: 4}}>
                {t('category.pageTitle')}
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
                            {t('category.browseCategories')}
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
                                        <Chip size="sm" color="success">{t('category.leafNode')}</Chip>
                                    )}
                                </Box>
                                <Typography level="body-sm" sx={{mb: 2}}>
                                    {t('category.pathLabel')}: {selectedCategory.path}
                                </Typography>

                                <Box sx={{mt: 4}}>
                                    <Typography level="body-md">
                                        {t('category.productListHint', {name: selectedCategory.name})}
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
                                    {t('category.selectPrompt')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}