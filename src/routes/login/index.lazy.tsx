import {Button} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import {getSigninUrl, goToLink} from '@/utils/casdoor'

export const Route = createLazyFileRoute('/login/')({
	component: () => <Login />,
})

/**
 *@returns Element
 */
export default function Login() {
	const casdoorLogin = () => {
		goToLink(getSigninUrl())
	}
	return <Button onClick={casdoorLogin}>Login</Button>
}
