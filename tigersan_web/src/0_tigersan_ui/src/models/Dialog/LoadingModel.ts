import Loading from "../../components/Dialog/Loading.vue"
import { ref, watch, type App } from "vue"
import { PanelBehavior } from "../../helpers/PanelBehavior"

export class LoadingModel {
    private _loading?: App<any>
    private behavior: PanelBehavior

    readonly IsShow = ref(false)

    constructor() {
        this.behavior = new PanelBehavior(
            'loading-panel',
            Loading,
            () => this._loading,
            (content) => this._loading = content
        )

        watch(this.IsShow, isShow => {
            if (isShow) {
                this.behavior.AddContent()
            } else {
                this.behavior.RemoveContent()
            }
        })
    }
}

export const loading = new LoadingModel()