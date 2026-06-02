import { loading, StringHelper } from "@/0_tigersan_ui/tigerui"
import { computed, ref, watch } from "vue"
import { siteHelper } from "./SiteModel"
import { assetHelper } from "../Home/AssetModel"
import { tagHelper } from "../Equipments/TagModel"
import { baseStationHelper } from "../Equipments/BaseStationModel"

export class CompanyInfoModel {
    readonly Id = ref<bigint | undefined>()
    readonly Name = ref<string | undefined>()
    readonly Addr = ref<string | undefined>()
    readonly SiteCount = ref(0)
    readonly BaseStationCount = ref(0)
    readonly AssetCount = ref(0)
    readonly TagCount = ref(0)
    readonly IsShowAddr = computed(() => { return StringHelper.IsNotEmpty(this.Addr.value) })

    //#region 【Ctor】
    constructor() {
        watch(this.Id, this.Refresh)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true
            this.Clear()
            const id = this.Id.value
            if (!id) return

            this.SiteCount.value = await siteHelper.GetCount({ company: id })
            this.BaseStationCount.value = await baseStationHelper.GetCount({ company: id })
            this.AssetCount.value = await assetHelper.GetCount({ company: id })
            this.TagCount.value = await tagHelper.GetCount({ company: id })
        } finally {
            loading.IsShow.value = false
        }
    }

    readonly Clear = async () => {
        this.SiteCount.value = 0
        this.BaseStationCount.value = 0
        this.AssetCount.value = 0
        this.TagCount.value = 0
    }
    //#endregion 【Functions】
}