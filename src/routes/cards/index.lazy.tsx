import {Box, Button, Input, List, ListItem, Typography} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import type {ChangeEvent} from 'react'
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import type {Carts} from '@/types/cards.ts'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/cards/')({  
	component: () => <Cards />,
})

/**
 *@returns Element
 */
export default function Cards() {
	const [carts, setCarts] = useState<Carts>({
		creditCardNumber: '2538-1487-1909-0064',
		creditCardCvv: 1234,
		creditCardExpirationYear: 2050,
		creditCardExpirationMonth: 12,
	})
	const updateField = (field: keyof typeof carts, value: any) => {
		setCarts((prevCarts) => ({
			...prevCarts,
			[field]: value,
		}))
	}

	const addCard = async (carts: Carts) => {
		console.log(carts)
		const res = await fetch(`${import.meta.env.VITE_CHECKOUT_URL}`, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...carts,
			}),
		})
		return res.json()
	}
	const mutation = useMutation({
		mutationFn: addCard,
	})
	return (
		<Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
			{/* 面包屑导航 */}
			<Breadcrumbs pathMap={{ 'cards': '卡片管理' }} />
			
			<Typography level="h2" sx={{ mb: 3 }}>卡片管理</Typography>
			
			<List>
				<ListItem>
					<Input
						placeholder="creditCardNumber"
						variant="plain"
						value={carts.creditCardNumber}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('creditCardNumber', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="creditCardCvv"
						variant="plain"
						value={carts.creditCardCvv}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('creditCardCvv', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="creditCardExpirationYear"
						variant="plain"
						value={carts.creditCardExpirationYear}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('creditCardExpirationYear', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="creditCardExpirationMonth"
						variant="plain"
						value={carts.creditCardExpirationMonth}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('creditCardExpirationMonth', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Button
						onClick={() => {
							mutation.mutate(carts)
						}}
					>
						Submit
					</Button>
				</ListItem>
			</List>
		</Box>
	)
}
