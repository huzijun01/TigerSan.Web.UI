import { computed, ref, watch } from "vue"
import { ChartModel, loading, PieModel, StringHelper, Texts } from "@/0_tigersan_ui/tigerui"
import { siteHelper } from "./SiteModel"
import { assetHelper } from "../Home/AssetModel"
import { AssetStates } from "../base/AssetStates"
import { tagHelper } from "../Equipments/TagModel"
import { baseStationHelper } from "../Equipments/BaseStationModel"

export class CompanyInfoModel {
    //#region 【Fields】
    /** 资产状态 */
    readonly assetStates: PieModel
    readonly pie1 = new ChartModel()
    readonly pie2 = new ChartModel()
    readonly pie3 = new ChartModel()
    //#endregion 【Fields】

    //#region 【Properties】
    readonly Id = ref<bigint | undefined>()
    readonly Name = ref<string | undefined>()
    readonly Addr = ref<string | undefined>()
    readonly SiteCount = ref(0)
    readonly BaseStationCount = ref(0)
    readonly AssetCount = ref(0)
    readonly TagCount = ref(0)
    readonly IsShowAddr = computed(() => { return StringHelper.IsNotEmpty(this.Addr.value) })
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        watch(this.Id, this.Refresh)

        this.assetStates = new PieModel(async () => {
            return {
                title: {
                    text: Texts.AssetState.value,
                },
                label: {
                    show: true,
                    position: 'center',
                },
                legend: {
                    show: true,
                },
                labelLine: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    show: true,
                },
                data: await this.GetAssetStates()
            }
        })
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

            this.assetStates.Init()
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

    readonly GetAssetStates = async () => {
        try {
            loading.IsShow.value = true

            const id = this.Id.value
            if (!id) return

            return [
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.NoRecord }),
                    name: Texts.NoRecord.value
                },
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.Inbound }),
                    name: Texts.Inbound.value
                },
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.InStore }),
                    name: Texts.InStore.value
                },
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.Stolid }),
                    name: Texts.Stolid.value
                },
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.Outbound }),
                    name: Texts.Outbound.value
                },
                {
                    value: await assetHelper.GetCount({ company: id, state: AssetStates.InTransit }),
                    name: Texts.InTransit.value
                },
            ]
        } finally {
            loading.IsShow.value = false
        }
    }
    //#endregion 【Functions】
}