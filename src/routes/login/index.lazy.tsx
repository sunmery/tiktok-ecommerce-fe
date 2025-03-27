import {Box, Button, Typography} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import {getSigninUrl, goToLink} from '@/utils/casdoor'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/login/')({
    component: () => <Login/>,
})

/**
 *@returns Element
 */
export default function Login() {
    const casdoorLogin = () => {
        goToLink(getSigninUrl())
    }
    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'login': '登录'}}/>

            <Typography level="h2" sx={{mb: 3}}>登录</Typography>

            <Button onClick={casdoorLogin}>Login</Button>
        </Box>
    )
}
