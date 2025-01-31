export interface Address {
  id: number
  street_address: string
  city: string
  state: string
  country: string
  zip_code: string
}

export interface Addresses {
  addresses: Address[]
}
