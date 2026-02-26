import { Language, useSetting } from "./stores"

/** 文本模型 */
class Text {
    en: string
    zhCn: string

    constructor(en: string, zhCn: string) {
        this.en = en
        this.zhCn = zhCn
    }

    Get(): string {
        const setting = useSetting()
        switch (setting.Locale) {
            case Language.en:
                return this.en
            case Language.zhCn:
                return this.zhCn
            default:
                return this.en
        }
    }
}

/** 文本类 */
class Texts {
    static get Count() {
        return new Text('Count', '总数').Get()
    }
    static get To() {
        return new Text('To', '到').Get()
    }
    static get page() {
        return new Text('page', '页').Get()
    }
    static get Select() {
        return new Text('Select', '选中').Get()
    }
    static get Colon() {
        return new Text(': ', '：').Get()
    }
}

export {
    Texts,
}