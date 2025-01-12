import {createLazyFileRoute} from '@tanstack/react-router'
import type {ChangeEvent} from 'react'
import {useEffect, useState} from 'react'
import {setUserBalance, userStore} from '@/store/user.ts'

import {useSnapshot} from 'valtio/react'
import {Box, List, ListItem, Input, Button} from '@mui/joy'

export const Route = createLazyFileRoute('/balance/')({
	component: RouteComponent,
})

/**
 *@returns Element
 */
function RouteComponent() {
	const [balance, setBalance] = useState<number>(0)
	const {account} = useSnapshot(userStore)
	const changeBalance = () => {
		fetch(`${import.meta.env.VITE_BALANCE_URL}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				owner: account.owner,
				name: account.name,
				balance: balance,
			}),
		})
			.then(async (res) => await res.json())
			.then((res) => {
				console.log(res)
				setUserBalance(res.balance)
			})
			.catch((err) => console.error(err))
	}
	useEffect(() => {
		fetch(
			`${import.meta.env.VITE_BALANCE_URL}?owner=${account.owner}&name=${account.name}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
				},
			},
		)
			.then(async (res) => await res.json())
			.then((res) => {
				console.log(res)
				setUserBalance(res)
			})
			.catch((err) => console.error(err))
	}, [])
	return (
		<Box>
			<List>
				<ListItem>owner: {account.owner}</ListItem>
				<ListItem>name: {account.name}</ListItem>
				<ListItem>balance: {account.balance}</ListItem>
			</List>

			<Input
				sx={{
					width: '200px',
				}}
				placeholder="Change your balance"
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setBalance(parseFloat(e.target.value))
				}
			/>
			<Button
				type="submit"
				onClick={changeBalance}
			>
				Submit
			</Button>
		</Box>
	)
}
