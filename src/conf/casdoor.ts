export const CASDOOR_CONF = {
	// 第三方或自有的Casdoor服务端的URL
	// serverUrl: 'http://localhost:8000',
	serverUrl: 'http://node8.apikv.com:31922',
	// 注册登录的接口, 默认为/api/signin
	signinPath: '/v1/user',
	// signinPath:'/api/signin',
	// 客户端ID, 在第三方或自有的Casdoor服务端生成
	clientId: '58ae47eed5903ca1c3ce',
	// 组织名, 在第三方或自有的Casdoor服务端生成
	organizationName: 'tiktok',
	// 应用名, 在第三方或自有的Casdoor服务端生成
	appName: 'e-commence',
	// 重新向到哪个路由
	redirectPath: '/callback',
}
