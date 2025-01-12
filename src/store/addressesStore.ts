import {proxy, subscribe} from 'valtio'
import type {Address} from '@/types/addresses.ts'

// 定义购物车状态
export interface AddressesState {
	default_address: Address
	addresses: Address[]
}

// 恢复本地存储的数据
const savedAddresses = localStorage.getItem('addresses')
const initialItems: Address[] = savedAddresses ? JSON.parse(savedAddresses) : []

export const addressesStore = proxy<AddressesState>({
	addresses: initialItems,
	default_address: {
		id: 1,
		street_address: 'Connecticut',
		city: 'Hermannbury',
		state: 'Wisconsin',
		country: 'elit',
		zip_code: '94832-4784',
	},
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(addressesStore, () => {
	localStorage.setItem('addresses', JSON.stringify(addressesStore.addresses))
})
