import { type Component } from "vue"
import { DefaultPage } from "../../components"

/** 页面模型 */
class PageModel {
    path = ''
    component: Component = DefaultPage
}

/** 路由页面模型 */
class RouterPageModel {
    //#region 【Fields】
    /** 页面改变时
     * （由“RouterPage”传入） */
    static _onPageChange?: (page: PageModel) => void
    //#endregion 【Fields】

    //#region 【Properties】
    /** 页面 */
    GetPage = () => {
        return this._page
    }
    SetPage = (page: PageModel) => {
        this._page = page
        if (RouterPageModel._onPageChange) {
            RouterPageModel._onPageChange(page)
        }
    }
    private _page = new PageModel()

    /** “页面”集合 */
    GetPages = () => {
        return this._pages
    }
    SetPages = (pages: PageModel[]) => {
        this._pages = pages
        this.GoTo('/')
    }
    private _pages: PageModel[]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(pages: PageModel[]) {
        this._pages = pages
        this.GoTo('/')
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 跳转 */
    GoTo = (path: string) => {
        const page = this._pages.find(p => p.path === path)
        if (page) {
            this.SetPage(page)
        }
    }
    //#endregion 【Functions】
}

export {
    PageModel,
    RouterPageModel
}