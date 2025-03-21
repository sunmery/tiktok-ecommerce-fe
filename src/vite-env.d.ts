/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string
	readonly VITE_HUSKY: string
	readonly VITE_URL: string
	readonly HUSKY: string
	readonly URL: string
	readonly VITE_USERS_URL: string
	readonly VITE_AUTH_URL: string
	readonly VITE_CASDOOR_URL: string
	readonly VITE_CHECKOUT_URL: string
	readonly VITE_CREDIT_CARDS_URL: string
	readonly VITE_ORDERS_URL: string
	readonly VITE_PAYMENT_URL: string
	readonly VITE_PRODUCERS_URL: string
	readonly VITE_ADDRESSES_URL: string
	readonly VITE_BALANCE_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
