import { defineStore } from 'pinia'
import { UserInfo } from '@/models'

/* 仓库 */
const useUserInfo = defineStore('userInfo', () => {
    return new UserInfo()
})

export {
    useUserInfo
}