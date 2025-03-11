import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Button } from '@mui/joy'
import Breadcrumbs from '@/components/Breadcrumbs'
import { showMessage } from '@/utils/casdoor.ts'

export const Route = createLazyFileRoute('/logout/')({  
	component: () => <LogoutCompose />,
})
/**
 *@returns Element
 */
function LogoutCompose() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	
	const logout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('creditCards')
		localStorage.removeItem('cart')
		localStorage.removeItem('addresses')
		
		// 显示退出成功提示
		showMessage('退出登录成功', 'success')
		
		// 登出后重定向到首页
		navigate({ to: '/' }).then(()=>{
			console.log("to/")
		}).catch(err=>{
			console.error(err)
		})
	}
	
	return (
		<Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
			{/* 面包屑导航 */}
			<Breadcrumbs pathMap={{ 'logout': '退出登录' }} />
			
			<Typography level="h2" sx={{ mb: 3 }}>退出登录</Typography>
			
			<Button variant="solid" color="danger" onClick={logout}>{t('nav.logout')}</Button>
		</Box>
	)
}
