import {Box, Button, Input, List, ListItem, Typography} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import type {ChangeEvent} from 'react'
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import type {CreditCard} from '@/types/creditCards.ts'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/cards/')({
    component: () => <Cards/>,
})

/**
 *@returns Element
 */
export default function Cards() {
    const [carts, setCarts] = useState<CreditCard>({
        brand: "",
        country: "",
        createdTime: "",
        currency: "",
        id: 0,
        name: "",
        owner: "",
        type: "",
        number: '2538-1487-1909-0064',
        cvv: "1234",
        expYear: "2050",
        expMonth: "12"

    })
    const updateField = (field: keyof typeof carts, value: any) => {
        setCarts((prevCarts) => ({
            ...prevCarts,
            [field]: value,
        }))
    }

    const addCard = async (card: CreditCard) => {
        console.log(card)
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
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* Breadcrumb navigation */}
            <Breadcrumbs pathMap={{'cards': t('cards.management')}}/>

            <Typography level="h2" sx={{mb: 3}}>{t('cards.management')}</Typography>

            <List>
                <ListItem>
                    <Input
                        placeholder="creditCardNumber"
                        variant="plain"
                        value={carts.number}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('number', event.target.value)
                        }
                    />
                </ListItem>
                <ListItem>
                    <Input
                        placeholder="creditCardCvv"
                        variant="plain"
                        value={carts.cvv}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('cvv', event.target.value)
                        }
                    />
                </ListItem>
                <ListItem>
                    <Input
                        placeholder="creditCardExpirationYear"
                        variant="plain"
                        value={carts.expYear}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('expYear', event.target.value)
                        }
                    />
                </ListItem>
                <ListItem>
                    <Input
                        placeholder="creditCardExpirationMonth"
                        variant="plain"
                        value={carts.expMonth}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('expMonth', event.target.value)
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
