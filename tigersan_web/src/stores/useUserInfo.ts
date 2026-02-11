import { defineStore } from 'pinia'
import { StoreIDs } from '@/tigerui'
import { UserInfo } from '@/models'

/* 仓库 */
const useUserInfo = defineStore(StoreIDs.userInfo, () => {
    return new UserInfo()
})

export {
    useUserInfo
}