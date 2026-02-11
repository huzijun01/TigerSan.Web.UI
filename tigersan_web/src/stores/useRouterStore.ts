import { defineStore } from 'pinia'
import { StoreIDs } from '@/tigerui'

class RouterHelper {
    go: (path: string) => void = () => { }
}

/* 仓库 */
const useRouterStore = defineStore(StoreIDs.router, () => {
    let routerHelper = new RouterHelper()
    return routerHelper
})

export {
    RouterHelper,
    useRouterStore,
}