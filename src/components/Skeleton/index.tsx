import {Box, Card, CardContent, Skeleton as JoySkeleton, Stack} from '@mui/joy'

interface SkeletonProps {
    // 骨架屏类型
    variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'list' | 'product' | 'order';
    // 高度
    height?: number | string;
    // 宽度
    width?: number | string;
    // 数量（用于列表类型）
    count?: number;
    // 自定义样式
    sx?: any;
}

/**
 * 通用骨架屏组件
 * 用于在内容加载时显示占位符
 */
export default function Skeleton({
                                     variant = 'rectangular',
                                     height,
                                     width,
                                     count = 1,
                                     sx = {}
                                 }: SkeletonProps) {
    // 文本骨架屏
    if (variant === 'text') {
        return (
            <Stack spacing={1} sx={sx}>
                {Array(count).fill(0).map((_, index) => (
                    <JoySkeleton
                        key={index}
                        variant="text"
                        level="body-md"
                        width={width || '100%'}
                    />
                ))}
            </Stack>
        )
    }

    // 圆形骨架屏（通常用于头像）
    if (variant === 'circular') {
        return (
            <JoySkeleton
                variant="circular"
                width={width || 40}
                height={height || 40}
                sx={sx}
            />
        )
    }

    // 卡片骨架屏
    if (variant === 'card') {
        return (
            <Stack spacing={2} sx={sx}>
                {Array(count).fill(0).map((_, index) => (
                    <Card key={index} variant="outlined" sx={{width: width || '100%'}}>
                        <CardContent>
                            <JoySkeleton variant="rectangular" width="100%" height={height || 120}/>
                            <Stack spacing={1} sx={{mt: 2}}>
                                <JoySkeleton variant="text" level="h3" width="60%"/>
                                <JoySkeleton variant="text" level="body-sm" width="90%"/>
                                <JoySkeleton variant="text" level="body-sm" width="40%"/>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        )
    }

    // 列表骨架屏
    if (variant === 'list') {
        return (
            <Stack spacing={2} sx={sx}>
                {Array(count).fill(0).map((_, index) => (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <JoySkeleton variant="circular" width={40} height={40}/>
                        <Stack spacing={1} sx={{flex: 1}}>
                            <JoySkeleton variant="text" level="body-sm" width="40%"/>
                            <JoySkeleton variant="text" level="body-xs" width="70%"/>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        )
    }

    // 产品卡片骨架屏
    if (variant === 'product') {
        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 3,
                ...sx
            }}>
                {Array(count).fill(0).map((_, index) => (
                    <Card key={index} variant="outlined">
                        <JoySkeleton variant="rectangular" width="100%" height={200}/>
                        <CardContent>
                            <Stack spacing={1}>
                                <JoySkeleton variant="text" level="title-md" width="70%"/>
                                <JoySkeleton variant="text" level="body-sm" width="90%"/>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}>
                                    <JoySkeleton variant="text" level="h3" width="30%"/>
                                    <JoySkeleton variant="rectangular" width={80} height={32}/>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        )
    }

    // 订单骨架屏
    if (variant === 'order') {
        return (
            <Stack spacing={3} sx={sx}>
                {/* 订单基本信息 */}
                <Card variant="outlined">
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <JoySkeleton variant="text" level="title-lg" width="40%"/>
                            <JoySkeleton variant="rectangular" width={80} height={32} sx={{borderRadius: 'sm'}}/>
                        </Box>
                        <JoySkeleton variant="rectangular" width="100%" height={1} sx={{my: 2}}/>
                        <Stack spacing={1}>
                            <JoySkeleton variant="text" level="body-md" width="60%"/>
                            <JoySkeleton variant="text" level="body-md" width="40%"/>
                            <JoySkeleton variant="text" level="body-md" width="70%"/>
                        </Stack>
                    </CardContent>
                </Card>

                {/* 订单商品列表 */}
                <Card variant="outlined">
                    <CardContent>
                        <JoySkeleton variant="text" level="title-lg" width="30%" sx={{mb: 2}}/>
                        <JoySkeleton variant="rectangular" width="100%" height={1} sx={{my: 2}}/>

                        {Array(3).fill(0).map((_, index) => (
                            <Box key={index} sx={{mb: 2}}>
                                <Box sx={{display: 'flex', gap: 2}}>
                                    <JoySkeleton variant="rectangular" width={60} height={60}
                                                 sx={{borderRadius: 'sm'}}/>
                                    <Stack spacing={1} sx={{flex: 1}}>
                                        <JoySkeleton variant="text" level="title-sm" width="50%"/>
                                        <JoySkeleton variant="text" level="body-sm" width="30%"/>
                                    </Stack>
                                    <Stack alignItems="flex-end">
                                        <JoySkeleton variant="text" level="body-md" width={40}/>
                                        <JoySkeleton variant="text" level="body-md" width={60}/>
                                    </Stack>
                                </Box>
                                {index < 2 && <JoySkeleton variant="rectangular" width="100%" height={1} sx={{my: 2}}/>}
                            </Box>
                        ))}

                        <JoySkeleton variant="rectangular" width="100%" height={1} sx={{my: 2}}/>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <JoySkeleton variant="text" level="title-lg" width={120}/>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        )
    }

    // 默认矩形骨架屏
    return (
        <JoySkeleton
            variant="rectangular"
            width={width || '100%'}
            height={height || 100}
            sx={sx}
        />
    )
}
