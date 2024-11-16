import {Box, Button} from '@mui/joy'

import {goToLink, getSigninUrl} from '@/settings/index.ts'

/**
 * @returns JSXElement
 */
export default function Login() {
	const handleLogin = () => {
		goToLink(getSigninUrl())
	}

	return (
		<Box>
			<Button
				type="button"
				onClick={() => handleLogin()}
			>
				Login
			</Button>
		</Box>
	)
}
