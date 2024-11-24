import {Box, Button, Input, List, ListItem} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import type {ChangeEvent} from 'react'
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'

export const Route = createLazyFileRoute('/cards/')({
	component: () => <Cards />,
})

interface Carts {
	credit_card_number: string
	credit_card_cvv: number
	credit_card_expiration_year: number
	credit_card_expiration_month: number
}

/**
 *@returns Element
 */
export default function Cards() {
	const [carts, setCarts] = useState<Carts>({
		credit_card_number: '2538-1487-1909-0064',
		credit_card_cvv: 1234,
		credit_card_expiration_year: 2050,
		credit_card_expiration_month: 12,
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
		<Box>
			<List>
				<ListItem>
					<Input
						placeholder="credit_card_number"
						variant="plain"
						value={carts.credit_card_number}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('credit_card_number', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="credit_card_cvv"
						variant="plain"
						value={carts.credit_card_cvv}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('credit_card_cvv', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="credit_card_expiration_year"
						variant="plain"
						value={carts.credit_card_expiration_year}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('credit_card_expiration_year', event.target.value)
						}
					/>
				</ListItem>
				<ListItem>
					<Input
						placeholder="credit_card_expiration_month"
						variant="plain"
						value={carts.credit_card_expiration_month}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							updateField('credit_card_expiration_month', event.target.value)
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
