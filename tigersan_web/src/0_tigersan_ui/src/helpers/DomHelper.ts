export class DomHelper {
    /** 添加“样式” */
    static AddCss(url: string) {
        const exist = document.head.querySelector(`link[href="${url}"]`)
        if (exist) return

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = url
        document.head.appendChild(link)
    }

    /** 移除“样式” */
    static RemoveCss(url: string) {
        const links = document.head.querySelectorAll(`link[href="${url}"]`)

        links.forEach(link => {
            link.remove()
        })
    }

    /** 添加“类” */
    static AddClass(name: string) {
        document.body.classList.add(name)
    }

    /** 移除“类” */
    static RemoveClass(name: string) {
        document.body.classList.remove(name)
    }
}