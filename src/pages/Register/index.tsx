import type {ChangeEvent} from 'react'
import {useState} from 'react'
import {skipToken, useQuery} from '@tanstack/react-query'
import {Alert, Button, Input, Stack} from '@mui/joy'

interface RegisterUser {
	username: string
	fullName: string
	password: string
	email: string
}

interface RegisterResponse {
	user: {
		username: string
		full_name: string
		email: string
		password_change_at: string
		create_at: string
	}
}

const createUser = async (user: RegisterUser) => {
	try {
		const res = await fetch(`${import.meta.env.VITE_URL}/v1/create_user`, {
			// const res = await fetch(`http://http.api-r.com:30001/v1/create_user`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Host': 'http.api-r.com',
			},
			body: JSON.stringify({...user}),
			redirect: 'follow',
		})
		const data: RegisterResponse = await res.json()
		console.log(data)
		return data
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message)
		}
		throw new Error(String(error))
	}
}

interface User {
	username: string
	fullName: string
	email: string
	password: string
}

/**
 * @returns JSXElement
 */
export default function Register() {
	const [user, setUser] = useState<User>({
		username: 'test user',
		fullName: 'test fullName',
		email: 'test@example.com',
		password: '123456',
	})
	const [query, setQuery] = useState<boolean>(false)

	const {isError, data, error} = useQuery({
		queryKey: ['register', user],
		queryFn: query ? () => createUser(user) : skipToken,
	})

	if (isError) {
		return <span>Error: {error.message}</span>
	}

	const handleRegister = () => {
		setQuery(true)
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setUser((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	if (data) {
		return (
			<Alert
				variant="solid"
				color="success"
			>
				注册成功! 欢迎您 {data.user.full_name}
			</Alert>
		)
	}

	return (
		<Stack
			direction="column"
			spacing={1}
			sx={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			Username:
			<Input
				type="outlined"
				name="username"
				id=""
				value={user.username}
				onChange={handleInputChange}
			/>
			FullName:
			<Input
				type="text"
				name="fullName"
				id=""
				value={user.fullName}
				onChange={handleInputChange}
			/>
			Email:
			<Input
				type="email"
				name="email"
				id=""
				value={user.email}
				onChange={handleInputChange}
			/>
			Password:
			<Input
				type="password"
				name="password"
				id=""
				value={user.password}
				onChange={handleInputChange}
			/>
			重复密码:
			<Input
				type="password"
				name="repPassword"
				id=""
				value={user.password}
			/>
			<Button
				type="submit"
				onClick={handleRegister}
			>
				Register
			</Button>
		</Stack>
	)
}
