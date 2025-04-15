import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/api/userService.ts";
import {Box, Grid} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/joy/IconButton";
import Clear from "@mui/icons-material/Clear";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import Card from "@mui/joy/Card";
import {Product} from "@/types/products.ts";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import Button from "@mui/joy/Button";

export const Route = createLazyFileRoute('/consumer/favorites/')({
    component: FavoritesPage,
})

function FavoritesPage() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [searchKeyword, setSearchKeyword] = useState('');
    const queryClient = useQueryClient()

    // 使用useQuery获取用户信息
    const {data, error, isLoading} = useQuery({
        queryKey: ['getFavorites'],
        queryFn: async () => {
            return await userService.getFavorites(1, 10)
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
    })

    const filteredItems = data?.items.filter(product => {
        const lowerKeyword = searchKeyword.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.description?.toLowerCase().includes(lowerKeyword) ||
            product.category?.categoryName.toLowerCase().includes(lowerKeyword)
        )
    }) || [];

    const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());
    const [isPending, setIsPending] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: ({productId, merchantId}: {
            productId: string,
            merchantId: string
        }) => userService.deleteFavorites(productId, merchantId),
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries({queryKey: ['getFavorites']})
                setDeletedItems(new Set())
            }, 5000)
        }
    })

    const addMutation = useMutation({
        mutationFn: ({productId, merchantId}: {
            productId: string,
            merchantId: string
        }) => userService.addFavorite(productId, merchantId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getFavorites']}).then(() => {
                console.log("invalidateQueries")
            })
        }
    })

    const handleFavoriteClick = async (productId: string, merchantId: string) => {
        if (isPending) return;
        setIsPending(true);

        try {
            if (deletedItems.has(productId)) {
                await addMutation.mutateAsync({productId, merchantId})
                setDeletedItems(prev => new Set([...prev].filter(id => id !== productId)))
            } else {
                await deleteMutation.mutateAsync({productId, merchantId})
                setDeletedItems(prev => new Set([...prev, productId]))
            }
        } finally {
            setIsPending(false);
        }
    }

    if (isLoading) {
        return <div className="loading">{t('loading')}</div>;
    }
    if (error) {
        return <div className="error">{error.message}</div>;
    }

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
                    }}>Favorites</Typography>
                    <Typography>Find your saved items and get ready to order them.</Typography>
                </Box>

                <Box sx={{
                    position: 'relative',
                }}>
                    <Input
                        placeholder={t('consumer.favorites.searchPlaceholder')}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        startDecorator={<SearchIcon/>}
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
                    <SearchTwoToneIcon
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

            <Grid container direction="row" sx={{
                justifyContent: "space-around",
                alignItems: "center",
            }}>
                <Grid component="div" xs={6}>
                    {filteredItems.length === 0 ? (
                        <Card variant="outlined" sx={{my: 2, width: '100%'}}>
                            <Typography level="body-lg">{t('consumer.favorites.noResults')}</Typography>
                        </Card>
                    ) : (
                        filteredItems.map((product: Product, index: number) => (
                            <Card
                                key={product.name + index}
                                sx={{
                                    width: '100%',
                                    maxWidth: 320,
                                    minWidth: 170,
                                    m: 1,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
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
                                    <FavoriteTwoToneIcon
                                        sx={{
                                            width: '35px',
                                            height: '35px',
                                            color: deletedItems.has(product.id) ? 'grey' : 'deeppink'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteClick(product.id, product.merchantId)
                                        }}
                                    />
                                    <Button sx={{
                                        borderRadius: '15px',
                                        backgroundColor: 'deeppink',
                                    }}>Buy</Button>
                                </Box>
                            </Card>
                        )))
                    }
                </Grid>
            </Grid>
        </Box>
    );
}
