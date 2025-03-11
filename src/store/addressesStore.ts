import {proxy, subscribe} from 'valtio'
import type {Address} from '@/types/addresses.ts'

// 定义购物车状态
export interface AddressesState {
  addresses: Address[]
  defaultAddress: Address
}

// 恢复本地存储的数据
// const savedAddresses = localStorage.getItem('addresses')
// const initialItems: Address[] = savedAddresses ? JSON.parse(savedAddresses) : []

export const addressesStore = proxy<AddressesState>({
  addresses: [],
  defaultAddress: {
    id: 0,
    userId: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  }
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(addressesStore, () => {
  localStorage.setItem('addresses', JSON.stringify(addressesStore.addresses))
})

export const setAddresses = (addresses: Address[]) => {
  // 过滤掉 addressesStore 中已经存在的地址（根据 id）
  const uniqueAddresses = addresses.filter((newAddress) => {
    return !addressesStore.addresses.some(
      (existingAddress) => existingAddress.id === newAddress.id,
    )
  })

  // 将去重后的地址添加到 addressesStore
  addressesStore.addresses.push(...uniqueAddresses)
}
