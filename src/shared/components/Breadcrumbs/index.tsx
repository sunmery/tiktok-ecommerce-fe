import {Link, useMatches} from '@tanstack/react-router'
import {Breadcrumbs as JoyBreadcrumbs} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Typography from '@mui/material/Typography'
import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'

interface BreadcrumbItem {
    name: string;
    path: string;
    isLast: boolean;
    element: React.ReactNode;
}

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
export default function Breadcrumbs({pathMap = {}, sx = {}}: BreadcrumbsProps) {
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
    const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
        // 过滤掉根路由和带$的参数路由
        const validMatches = matches
            .filter(match => {
                const path = match.pathname
                return path !== '/' && !path.includes('$')
            })

        // 分割路径并生成层级
        const pathSegments = validMatches
            .flatMap(match =>
                match.pathname
                    .split('/')
                    .filter(p => p)
                    .map((segment, index, arr) => ({
                        path: '/' + arr.slice(0, index + 1).join('/'),
                        name: segment
                    }))
            )

        // 去重处理
        const uniqueSegments = pathSegments.reduce((acc, curr) => {
            if (!acc.some(item => item.path === curr.path)) {
                acc.push(curr)
            }
            return acc
        }, [] as Array<{ path: string, name: string }>)

        return uniqueSegments.map((segment, index) => {
            const isLast = index === uniqueSegments.length - 1;
            return {
                name: getPathName(segment.name),
                path: segment.path,
                isLast,
                element: isLast ? (
                    <Typography key={segment.path} fontSize="sm">
                        {getPathName(segment.name)}
                    </Typography>
                ) : (
                    <Link
                        key={segment.path}
                        to={segment.path}
                        style={{textDecoration: 'none', fontSize: '0.875rem'}}
                    >
                        {getPathName(segment.name)}
                    </Link>
                )
            };
        })
    }, [matches, defaultPathMap])

    return (
        <JoyBreadcrumbs
            separator={<NavigateNextIcon fontSize="small"/>}
            sx={{mb: 3, ...sx}}
        >
            {breadcrumbItems.map(item => item.element)}
        </JoyBreadcrumbs>
    )
}
