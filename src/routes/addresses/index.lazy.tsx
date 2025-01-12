import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import type {Addresses} from '@/types/addresses.ts'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'

export const Route = createLazyFileRoute('/addresses/')({
	component: () => <AddressesRoute />,
})

/**
 *@returns Element
 */
function AddressesRoute() {
	const [addresses, setAddresses] = useState<Addresses>({
		addresses: [
			{
				id: 1,
				street_address: 'string',
				city: 'string',
				state: 'string',
				country: 'string',
				zip_code: 'string',
			},
		],
	})
	const {account} = useSnapshot(userStore)
	useEffect(() => {
		fetch(
			`${import.meta.env.VITE_ADDRESSES_URL}?owner=${account.owner}&name=${account.name}`,
			{
				method: 'GET',
				headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
			},
		)
			.then((data) => data.json())
			.then((data) => {
				console.log(data)
				setAddresses(data)
			})
	}, [])
	return (
		<div>
			{addresses.addresses.length > 0 ? (
				addresses.addresses.map((address) => (
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
