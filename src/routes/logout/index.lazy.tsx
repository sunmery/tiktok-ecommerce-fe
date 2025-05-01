import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useTranslation} from 'react-i18next'
import {Box, Button, Typography} from '@mui/joy'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {useQueryClient} from '@tanstack/react-query'
import {showMessage} from "@/utils/showMessage";

export const Route = createLazyFileRoute('/logout/')({
    component: () => <LogoutCompose/>,
})

/**
 *@returns Element
 */
function LogoutCompose() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const queryClient = useQueryClient()

    const logout = () => {
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('creditCards')
        localStorage.removeItem('cart')
        localStorage.removeItem('addresses')

        // 清除React Query缓存，特别是userinfo查询
        queryClient.removeQueries({queryKey: ['userinfo']})
        // 清除所有查询缓存
        queryClient.clear()

        // 显示退出成功提示
        showMessage(t('common.Logout'), 'success')

        // 登出后重定向到首页
        navigate({to: '/'}).then(() => {
            console.log("to/")
        }).catch(err => {
            console.error(err)
        })
    }

    return (
        <Box sx={{p: 2, maxWidth: '100vw', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'logout': t('common.Logout')}}/>

            <Typography level="h2" sx={{mb: 3}}>{t('common.Logout')}</Typography>

            <Button variant="solid" color="danger" onClick={logout}>{t('nav.logout')}</Button>
        </Box>
    )
}
