import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'

import {AspectRatio, Box, Button, Card, CardContent, CardOverflow, Grid, IconButton, Input, Typography} from "@mui/joy";
import {Clear, Search, SearchTwoTone} from "@mui/icons-material";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {Product} from "@/types/products.ts";
import {useQuery} from "@tanstack/react-query";
import {userService} from '@/api/userService';
import Favorites from "@/components/Favorites";

export const Route = createLazyFileRoute('/consumer/favorites/')({
    component: FavoritesPage,
})

function FavoritesPage() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();
    const {t} = useTranslation()

    const {data, error, isLoading} = useQuery({
        queryKey: ['getFavorites'],
        queryFn: async () => {
            return await userService.getFavorites(1, 100)
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return <div className="loading">{t('loading')}</div>;
    }
    if (error) {
        return <div className="error">{error.message}</div>;
    }
    const filteredItems = data?.items.filter((product: Product) => {
        const lowerKeyword = searchKeyword.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.description?.toLowerCase().includes(lowerKeyword) ||
            product.category?.categoryName.toLowerCase().includes(lowerKeyword)
        )
    }) || [];
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        mb: 4,
                    }}>{t('favorites.title')}</Typography>
                    <Typography>{t('favorites.introduce')}</Typography>
                </Box>

                <Box sx={{
                    position: 'relative',
                }}>
                    <Input
                        placeholder={t('consumer.favorites.searchPlaceholder')}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        startDecorator={<Search/>}
                        endDecorator={searchKeyword && (
                            <IconButton
                                variant="plain"
                                size="sm"
                                onClick={() => setSearchKeyword('')}
                            >
                                <Clear/>
                            </IconButton>
                        )}
                        sx={{
                            my: 2,
                            maxWidth: '100%',
                            minWidth: '200px',
                            minHeight: '40px',
                            maxHeight: '50px',
                            borderRadius: '20px',
                        }}
                    />
                    <SearchTwoTone
                        sx={{
                            position: 'absolute',
                            width: '30px',
                            height: '30px',
                            right: '5%',
                            top: '35%',
                            transform: 'translateY(-50%)',
                        }}/>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                mt: 2
            }}>
                {filteredItems.length === 0 ? (
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{my: 2, width: '100%'}}>
                            <Typography level="body-lg">{t('consumer.favorites.noResults')}</Typography>
                        </Card>
                    </Grid>
                ) : (
                    filteredItems.map((product: Product, index: number) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.name + index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 'lg'
                                    }
                                }}
                                onClick={async (e) => {
                                    if (e.defaultPrevented) return;
                                    await navigate({
                                        to: `/products/${product.id}`,
                                        search: (prev) => ({...prev, merchantId: product.merchantId})
                                    });
                                }}
                            >
                                <CardOverflow>
                                    <AspectRatio ratio="4/3" objectFit="cover">
                                        <img
                                            src={product.images && product.images.length > 0 ? product.images[0].url : "https://picsum.photos/300/200"}
                                            loading="lazy"
                                            alt={product.name}
                                        />
                                    </AspectRatio>
                                </CardOverflow>

                                <CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 1}}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Typography level="title-lg" sx={{
                                            fontSize: 'md',
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: 1.2
                                        }}>
                                            {product.name}
                                        </Typography>


                                    </Box>

                                    <Typography level="body-sm" sx={{
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        minHeight: '2.5em',
                                        mb: 1
                                    }}>
                                        {product.description || t('noDescription')}
                                    </Typography>

                                    {product.category && (
                                        <Typography
                                            level="body-xs"
                                            sx={{
                                                color: 'primary.500',
                                                fontWeight: 'md'
                                            }}
                                        >
                                            {product.category.categoryName}
                                        </Typography>
                                    )}

                                    <Box sx={{
                                        mt: 'auto',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Box>
                                            <Typography level="body-xs"
                                                        sx={{color: 'text.secondary'}}>{t('price')}</Typography>
                                            <Typography
                                                level="h4"
                                                sx={{
                                                    color: 'primary.600',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ¥{product.price}
                                            </Typography>
                                            <Typography level="body-xs" sx={{color: 'text.secondary'}}>
                                                {t('stock')}: {product.inventory?.stock || product.quantity || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Favorites />
                                    <Button sx={{
                                        borderRadius: '15px',
                                        backgroundColor: 'deeppink',
                                    }}>Buy</Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}
