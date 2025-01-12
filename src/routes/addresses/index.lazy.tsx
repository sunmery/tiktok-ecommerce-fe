import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {addressesStore, setAddresses} from '@/store/addressesStore'
import type {Addresses} from '@/types/addresses.ts'

export const Route = createLazyFileRoute('/addresses/')({
	component: () => <AddressesRoute />,
})

/**
 *@returns Element
 */
function AddressesRoute() {
	const {account} = useSnapshot(userStore)
	const {addresses} = useSnapshot(addressesStore)
	useEffect(() => {
		fetch(
			`${import.meta.env.VITE_ADDRESSES_URL}?owner=${account.owner}&name=${account.name}`,
			{
				method: 'GET',
				headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
			},
		)
			.then((data) => data.json())
			.then((data: Addresses) => {
				setAddresses(data.addresses)
			})
	}, [])
	return (
		<div>
			{addresses.length > 0 ? (
				addresses.map((address) => (
					<ul key={address.id}>
						<li>id: {address.id}</li>
						<li>street_address: {address.street_address}</li>
						<li>city: {address.city}</li>
						<li>state: {address.state}</li>
						<li>country: {address.country}</li>
						<li>zip_code: {address.zip_code}</li>
					</ul>
				))
			) : (
				<div>暂无数据</div>
			)}
		</div>
	)
}
