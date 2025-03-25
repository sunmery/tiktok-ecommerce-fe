import {createLazyFileRoute} from '@tanstack/react-router'
import {AuthCallback} from 'casdoor-react-sdk'
import {CASDOOR_SDK, setToken} from '@/utils/casdoor.ts'
import type {SigninReply} from '@/types/callback.ts'

export const Route = createLazyFileRoute('/callback/')({
	component: () => (
		<AuthCallback
			sdk={CASDOOR_SDK}
			serverUrl={import.meta.env.VITE_URL}
			saveTokenFromResponse={saveToken}
			isGetTokenSuccessful={verifyToken}
		/>
	),
})

// 获取服务器的登录接口返回的token
const saveToken = (res: Response) => {
	const result = res as unknown as SigninReply
	console.log("Result:", result)
	setToken(result.data)
	
	// 显示登录成功提示
	import('@/utils/casdoor.ts').then(module => {
		module.showMessage('登录成功', 'success')
		
		// 获取用户信息并根据角色跳转到不同页面
		module.getUserinfo().then((userInfo) => {
			console.log('User info:', userInfo)
			
			// 根据用户角色跳转到不同页面
			if (userInfo && userInfo.role) {
				if (userInfo.role === 'merchant') {
					module.goToLink('/merchant')
				} else if (userInfo.role === 'admin') {
					module.goToLink('/admin')
				} else {
					// 默认为普通用户，跳转到个人中心
					module.goToLink('/profile')
				}
			} else {
				// 如果获取不到角色信息，默认跳转到个人中心
				module.goToLink('/profile')
			}
		}).catch(error => {
			console.error('获取用户信息失败:', error)
			// 获取用户信息失败时，默认跳转到个人中心
			module.goToLink('/profile')
		})
	})
}

// 根据服务器返回的字段来判断请求是否成功
const verifyToken = (res: Response) => {
	console.log('isGetTokenSuccessful res:', res)
	const result = res as unknown as SigninReply
	return result.state ==='ok'
}
