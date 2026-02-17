import { defineStore } from 'pinia'
import { StoreIDs } from './base/StoreIDs'
import { PageModel, RouterPageModel } from '../models'

/* 仓库 */
const useRouter = defineStore(StoreIDs.router, () => {
    return new RouterPageModel([])
})

function createRouter(pages: PageModel[]) {
    const router = useRouter()
    router.SetPages(pages)
}

export {
    useRouter,
    createRouter,
}