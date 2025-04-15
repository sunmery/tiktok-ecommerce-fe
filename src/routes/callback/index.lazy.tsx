import {createLazyFileRoute} from '@tanstack/react-router'
import {AuthCallback} from 'casdoor-react-sdk'
import {CASDOOR_SDK} from '@/core/conf/casdoor'
import type {SigninReply} from '@/types/callback'
import {showMessage} from "@/utils/showMessage";
import {userService} from "@/api/userService.ts";
import { t } from 'i18next';

export const Route = createLazyFileRoute('/callback/')({
    component: () => (
        <AuthCallback
            sdk={CASDOOR_SDK}
            serverUrl={import.meta.env.VITE_URL}
            saveTokenFromResponse={saveToken}
            isGetTokenSuccessful={verifyToken}
        />
    ),
})

const saveToken = (res: Response) => {
    const result = res as unknown as SigninReply
    console.log("Result:", result)

    userService.setToken(result.data)

    showMessage(t('auth.loginSuccess'), 'success')

    userService.getUserinfo().then((userInfo) => {
        console.log('User info:', userInfo)

        if (userInfo && userInfo.role) {
            if (userInfo.role === 'merchant') {
                userService.goToLink('/merchant')
            } else if (userInfo.role === 'admin') {
                userService.goToLink('/admin')
            } else {
                userService.goToLink('/profile')
            }
        } else {
            showMessage(t('auth.getRoleFailed'), 'error')
            userService.goToLink('/')
        }
    }).catch(error => {
        console.error(t('auth.getUserInfoFailed'), error)
        userService.goToLink('/profile')
    })

}

// Verify token based on server response
const verifyToken = (res: Response) => {
    console.log('isGetTokenSuccessful res:', res)
    const result = res as unknown as SigninReply
    return result.state === 'ok'
}
