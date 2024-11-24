import {createLazyFileRoute} from '@tanstack/react-router'
// import {Link} from 'react-router-dom'
import {useMemo, useState} from 'react'
import {
	CASDOOR_SDK,
	getUserinfo,
	getUsers,
	goToLink,
	isLoggedIn,
	showMessage,
} from '@/settings/index.ts'
import type {Account} from '@/types/casdoor'
// 如果需要静默登录，返回 SilentSignin 组件，它会帮你发起登录请求，登录成功后会调用函数 handleReceivedSilentSigninSuccessEvent ，登录失败时也会调用函数 handleReceivedSilentSigninFailureEvent
import {isSilentSigninRequired, SilentSignin} from 'casdoor-react-sdk'

/**
 *@returns JSXElement
 */
export default function Profile() {
	const [account, setAccount] = useState<Account>({
		id: '',
		email: '',
		name: '',
		owner: '',
		type: '',
		avatar: '',
	})
	const [users, setUsers] = useState()
	useMemo(() => {
		console.log('users: ', users)
	}, [users])

	useMemo(() => {
		if (isLoggedIn()) {
			getUserinfo().then((res) => {
				if (res?.state === 'ok') {
					setAccount({
						id: res.data.id,
						avatar: res.data.avatar,
						email: res.data.email,
						name: res.data.name,
						owner: res.data.owner,
						type: res.data.type,
					})
				} else {
					showMessage(`getUserinfo() error: ${res?.msg}`)
				}
			})

			getUsers().then((res) => {
				if (res?.status === 'ok') {
					setUsers(res.data)
				} else {
					showMessage(`getUsers() error: ${res?.msg}`)
				}
			})
		}
	}, [])
	return (
		<main>
			<table>
				<caption>Account</caption>
				<thead>
					<tr>
						<th>id</th>
						<th>email</th>
						<th>name</th>
						<th>owner</th>
						<th>type</th>
						<th>avatar</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{account.id}</td>
						<td>{account.email}</td>
						<td>{account.name}</td>
						<td>{account.owner}</td>
						<td>{account.type}</td>
						<td>
							<img
								src={account.avatar}
								alt={account.name}
							/>
						</td>
						<td>{account.name}</td>
					</tr>
				</tbody>
			</table>

			{/* 静默登录组件, 不需要静默登录注释掉即可 */}
			{/* 如果需要静默登录，返回 SilentSignin 组件，它会帮你发起登录请求，登录成功后会调用函数 handleReceivedSilentSigninSuccessEvent ，登录失败时也会调用函数 handleReceivedSilentSigninFailureEvent */}
			<div>
				call:
				{isSilentSigninRequired() ?? (
					<div
						style={{
							marginTop: 200,
							textAlign: 'center',
							alignItems: 'center',
						}}
					>
						<SilentSignin
							sdk={CASDOOR_SDK}
							isLoggedIn={isLoggedIn}
							handleReceivedSilentSigninSuccessEvent={() => goToLink('/')}
							handleReceivedSilentSigninFailureEvent={() => {}}
						/>
						<p>Logging in...</p>
					</div>
				)}
			</div>
		</main>
	)
}

export const Route = createLazyFileRoute('/profile/')({
	component: () => <Profile />,
})
