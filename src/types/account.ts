export interface Account {
	id: string
	owner: string
	type: string
	name: string
	avatar: string
	email: string
	user_currency: string
}

export interface Role {
	owner: string
	name: string
	createdTime: string
	displayName: string
	description: string
	roles: string[]
	domains: string[]
	isEnabled: boolean
}

export interface JwtPayload {
	owner: string
	name: string
	createdTime: string
	updatedTime: string
	deletedTime: string
	id: string
	type: string
	password: string
	passwordSalt: string
	passwordType: string
	displayName: string
	firstName: string
	lastName: string
	avatar: string
	avatarType: string
	permanentAvatar: string
	email: string
	emailVerified: boolean
	phone: string
	countryCode: string
	region: string
	location: string
	address: string[]
	affiliation: string
	title: string
	idCardType: string
	idCard: string
	homepage: string
	bio: string
	language: string
	gender: string
	birthday: string
	education: string
	score: number
	karma: number
	ranking: number
	isDefaultAvatar: boolean
	isOnline: boolean
	isAdmin: boolean
	isForbidden: boolean
	isDeleted: boolean
	signupApplication: string
	hash: string
	preHash: string
	accessKey: string
	accessSecret: string
	github: string
	google: string
	qq: string
	wechat: string
	facebook: string
	dingtalk: string
	weibo: string
	gitee: string
	linkedin: string
	wecom: string
	lark: string
	gitlab: string
	createdIp: string
	lastSigninTime: string
	lastSigninIp: string
	preferredMfaType: string
	recoveryCodes: null | string[]
	totpSecret: string
	mfaPhoneEnabled: boolean
	mfaEmailEnabled: boolean
	ldap: string
	properties: Record<string, unknown>
	roles: Role[]
	permissions: Permission[]
	groups: string[]
	lastSigninWrongTime: string
	signinWrongTimes: number
	tokenType: string
	tag: string
	scope: string
	iss: string
	sub: string
	aud: string[]
	exp: number
	nbf: number
	iat: number
	jti: string
}

export interface Permission {
	owner: string
	name: string
	createdTime: string
	displayName: string
	description: string
	users: string[] | null
	groups: string[]
	roles: string[]
	domains: string[]
	model: string
	adapter: string
	resourceType: string
	resources: string[]
	actions: string[]
	effect: string
	isEnabled: boolean
	submitter: string
	approver: string
	approveTime: string
	state: string
}
