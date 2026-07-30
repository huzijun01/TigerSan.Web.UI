import { shallowRef } from "vue"
import { loading, MyActionResult } from "@/0_tigersan_ui/tigerui"
import { AssetDto, TagDto, assetHelper, tagHelper } from "@/models"

/** “资产状态”模型 */
export class AssetStateModel {
    //#region 【Props】
    /** 资产 */
    readonly Asset = shallowRef<AssetDto | undefined>()
    /** 标签 */
    readonly Tag = shallowRef<TagDto | undefined>()
    //#endregion 【Props】

    //#region 【Functions】
    /** 初始化 */
    readonly Init = async (assetId: string): Promise<boolean> => {
        loading.IsShow.value = true

        try {
            const resAsset = await assetHelper.GetFull(undefined, assetId)
            if (!resAsset.data) {
                MyActionResult.ShowResult(resAsset, undefined, false)
                return false
            }

            if (resAsset.data.tagId) {
                const resTag = await tagHelper.GetFull(resAsset.data.tagId)
                if (!resTag.data) {
                    MyActionResult.ShowResult(resTag, undefined, false)
                    return false
                }
                this.Tag.value = resTag.data
            } else {
                this.Tag.value = undefined
            }

            this.Asset.value = resAsset.data
            return true
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}