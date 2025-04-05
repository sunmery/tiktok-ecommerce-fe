import {Link, useMatches} from '@tanstack/react-router'
import {Breadcrumbs as JoyBreadcrumbs, Typography} from '@mui/joy'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'

interface BreadcrumbsProps {
    // 自定义路径映射，用于显示中文名称
    pathMap?: Record<string, string>;
    // 是否显示首页图标
    showHomeIcon?: boolean;
    // 自定义样式
    sx?: any;
}

/**
 * 通用面包屑导航组件
 * 自动根据当前路由路径生成面包屑
 */
export default function Breadcrumbs({pathMap = {}, showHomeIcon = true, sx = {}}: BreadcrumbsProps) {
    // 获取当前匹配的路由
    const matches = useMatches()
    const {t} = useTranslation()

    // 默认路径映射
    const defaultPathMap = useMemo(() => ({
        '': t('nav.home'),
        'products': t('allProducts'),
        'category': t('category'),
        'consumer': t('profile.consumerCenter'),
        'merchant': t('profile.merchantCenter'),
        'admin': t('profile.adminPanel'),
        'orders': t('orders.title'),
        'profile': t('profile'),
        'carts': t('nav.cart'),
        'checkout': t('checkout'),
        'addresses': t('addresses.title'),
        'credit_cards': t('payment.title'),
        ...pathMap
    } as Record<string, string>), [t, pathMap])

    // 处理路径显示名称
    const getPathName = (path: string): string => {
        return defaultPathMap[path] || path
    }

    // 生成面包屑项
    const breadcrumbItems = useMemo(() => {
        // 过滤掉根路由
        const filteredMatches = matches.filter(match => match.pathname !== '/')

        // 如果没有匹配的路由，只显示首页
        if (filteredMatches.length === 0) {
            return [
                <Link key="home" to="/"
                      style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                    {showHomeIcon ? <HomeIcon fontSize="small" sx={{mr: 0.5}}/> : null}
                    <Typography color="neutral">{getPathName('')}</Typography>
                </Link>
            ]
        }

        // 生成面包屑数组
        return [
            // 首页链接
            <Link key="home" to="/"
                  style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                {showHomeIcon ? <HomeIcon fontSize="small" sx={{mr: 0.5}}/> : null}
                <Typography color="neutral">{getPathName('')}</Typography>
            </Link>,
            // 中间路径
            ...filteredMatches.map((match, index) => {
                // 获取路径段
                const pathSegments = match.pathname.split('/').filter(Boolean)
                const currentSegment = pathSegments[pathSegments.length - 1]

                // 如果是最后一个，不使用链接
                if (index === filteredMatches.length - 1) {
                    return (
                        <Typography key={match.pathname}>
                            {getPathName(currentSegment)}
                        </Typography>
                    )
                }

                // 构建到当前路径的链接
                return (
                    <Link
                        key={match.pathname}
                        to={match.pathname}
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        <Typography color="neutral">
                            {getPathName(currentSegment)}
                        </Typography>
                    </Link>
                )
            })
        ]
    }, [matches, showHomeIcon])

    return (
        <JoyBreadcrumbs
            separator={<NavigateNextIcon fontSize="small"/>}
            sx={{mb: 3, ...sx}}
        >
            {breadcrumbItems}
        </JoyBreadcrumbs>
    )
}
