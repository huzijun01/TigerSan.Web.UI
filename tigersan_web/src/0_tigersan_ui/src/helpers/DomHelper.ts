class DomHelper {
    /** 添加“样式” */
    static AddCss(url: string) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = url
        document.head.appendChild(link)
    }

    /** 移除“样式” */
    static RemoveCss(url: string) {
        const links = document.head.querySelectorAll('link[rel="stylesheet"]')

        links.forEach(element => {
            const link = element as HTMLLinkElement

            if (link.href === url) {
                link.remove()
            }
        })
    }
}

export {
    DomHelper
}