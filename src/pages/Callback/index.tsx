import {AuthCallback} from 'casdoor-react-sdk'
import {CASDOOR_SDK, goToLink, serverUrl, setToken} from '@/settings/index.ts'

// 服务端的响应接口的类型
interface SigninReply {
	data: string
	state: string
}

// 获取服务器的登录接口返回的token
const saveToken = (res: Response) => {
	console.log('saveTokenFromResponse data:', res)
	const result = res as unknown as SigninReply
	setToken(result.data)
	goToLink('/profile')
}

// 根据服务器返回的字段来判断请求是否成功
const verifyToken = (res: Response) => {
	console.log('isGetTokenSuccessful res:', res)
	const result = res as unknown as SigninReply
	return result.state === 'ok'
}

/**
 *@returns JSXElement
 */
export default function CallbackPage() {
	console.log('CASDOOR_SDK:', CASDOOR_SDK)
	return (
		<AuthCallback
			sdk={CASDOOR_SDK}
			serverUrl={serverUrl}
			saveTokenFromResponse={saveToken}
			isGetTokenSuccessful={verifyToken}
		/>
	)
}
