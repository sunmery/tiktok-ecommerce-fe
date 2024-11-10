import {useEffect, useState} from 'react'

function App() {
	const [email, setEmail] = useState('test@mail.com')
	const [password, setPassword] = useState('123456')
	useEffect(() => {
		fetch(`http://localhost:8000/v1/create_user`, {
			method: 'PUT',
			headers: {'Context-Type': 'application/json'},
			body: JSON.stringify({email, password}),
		}).then(res => res.json())
			.then(data => {
				console.log(data)
			}).catch(err => console.error(err))
	}, [email, password])

	return (
		<>
			<label htmlFor="email"></label>
			<input id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

			<label htmlFor="password"></label>
			<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
		</>
	)
}

export default App
