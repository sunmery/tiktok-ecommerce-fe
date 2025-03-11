import {createLazyFileRoute} from '@tanstack/react-router'
import {AuthCallback} from 'casdoor-react-sdk'
import {CASDOOR_SDK, goToLink, setToken} from '@/utils/casdoor.ts'
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
	// goToLink('/profile')

	// 显示登录成功提示
	import('@/utils/casdoor.ts').then(module => {
		module.showMessage('登录成功', 'success')
	})

	// 直接跳转，不依赖 React Router
	setTimeout(() => {
		window.location.replace('/profile');
	}, 0); // 下一个事件循环执行
}

// 根据服务器返回的字段来判断请求是否成功
const verifyToken = (res: Response) => {
	console.log('isGetTokenSuccessful res:', res)
	const result = res as unknown as SigninReply
	return result.state ==='ok'
}
