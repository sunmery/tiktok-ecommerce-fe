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
	}
	return <button onClick={logout}>Logout</button>
}
