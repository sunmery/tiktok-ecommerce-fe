import {createLazyFileRoute} from '@tanstack/react-router'

export const Route = createLazyFileRoute('/logout/')({
	component: () => <LogoutCompose />,
})
/**
 *@returns Element
 */
function LogoutCompose() {
	const logout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('creditCards')
		localStorage.removeItem('cart')
		localStorage.removeItem('addresses')
	}
	return <button onClick={logout}>Logout</button>
}
