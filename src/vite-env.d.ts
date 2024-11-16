/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string
	readonly VITE_HUSKY: string
	readonly HUSKY: string
	readonly URL: string
	// 更多环境变量...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
