import { ref, shallowReactive } from "vue"
import { Colors, FormConfig, FormItemConfig, FormModel, Icons, SizeBehavior, SubmitResult, Texts, Verify } from "@/0_tigersan_ui/tigerui"
import { BlobBehavior } from "./BlobBehavior"
import { CsvEditor, EditorModes } from "@/models/Shapes/CsvEditor"
import { RectModel, PointModel, CircleModel } from "@/models/Shapes/Shapes"
import { PositionListModel } from "@/pages/Home/AssetMapPage/PositionList/PositionListModel"
import { PositionDto, PositionTypes } from "@/models"

export class StationEntity {
    macAddr = ''
    x = 0
    y = 0
}

export class IndoorPositionPageModel {
    //#region 【Fields】
    /** 背景文件 */
    readonly _bgBlob = new BlobBehavior()
    readonly _size = new SizeBehavior()
    readonly _svgEditor = new CsvEditor()
    /** “标签”列表 */
    readonly tagList = new PositionListModel()
    /** “基站”列表 */
    readonly stationList = new PositionListModel()

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => {
        const station = new StationEntity()
        const p = this._svgEditor.Point.value
        if (!p) return station
        station.x = p.X.value
        station.y = p.Y.value
        return station
    }

    /** “MAC地址”项目配置 */
    readonly configMacAddr: FormItemConfig<StationEntity, string> = {
        _propName: 'macAddr',
        PropText: Texts.MacAddr,
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsValidMacAddr(source.macAddr)
    }

    /** “X”项目配置 */
    readonly configX: FormItemConfig<StationEntity, string> = {
        _propName: 'x',
        PropText: 'X',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsGreaterThan(source.x)
    }

    /** “Y”项目配置 */
    readonly configY: FormItemConfig<StationEntity, string> = {
        _propName: 'y',
        PropText: 'Y',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => Verify.IsGreaterThan(source.y)
    }

    /** “基站”表单配置 */
    readonly configAssetRecordForm: FormConfig<StationEntity> = {
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
        },
        _onSubmitAsync: async (source, isEdit) => {
            if (isEdit) {
            } else {
                this.AddStation(source.x, source.y, source.macAddr)
            }
            this.stationList.SetPositions(this.Stations.map(i => i._data ?? new PositionDto()))
            return new SubmitResult(Texts.AddedSuccessfully.value)
        },
        _onClose: () => {
            this._svgEditor.Clear()
        },
        _itemConfigs: [
            this.configMacAddr,
            this.configX,
            this.configY,
        ]
    }

    /** “基站”表单模型 */
    readonly stationForm = new FormModel(this.configAssetRecordForm)
    //#endregion 【Fields】

    //#region 【Props】
    readonly BgUrl = this._bgBlob.Url
    readonly IsEditing = this._svgEditor.IsEditing
    readonly EditingPoint = this._svgEditor.Point
    readonly EditingLine = this._svgEditor.Line
    readonly EditingRect = this._svgEditor.Rect
    readonly EditingCircle = this._svgEditor.Circle
    readonly Tags = shallowReactive<PointModel<PositionDto>[]>([])
    readonly Stations = shallowReactive<PointModel<PositionDto>[]>([])
    readonly Rects = shallowReactive<RectModel[]>([])
    readonly Circles = shallowReactive<CircleModel[]>([])
    //#endregion 【Props】

    //#region 【Ctor】
    constructor() {
        this._bgBlob.Name.value = '餐厅.jpeg'
        this._svgEditor._isAutoClear = false
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Refresh = async () => {
        this._bgBlob.Load()
    }

    readonly Dispose = () => {
        this._bgBlob.Dispose()
    }

    readonly AddTag = (x: number, y: number, macAddr: string) => {
        const dto = new PositionDto()
        dto.info = macAddr
        dto.type = PositionTypes.Station

        const p = new PointModel<PositionDto>(x, y)
        p._data = dto
        p.Fill.value = Colors.Brand
        p.Text.value = Icons.Tag_Planar_2
        this.Tags.push(p)
    }

    readonly AddStation = (x: number, y: number, macAddr: string) => {
        const dto = new PositionDto()
        dto.info = macAddr
        dto.type = PositionTypes.Station

        const p = new PointModel<PositionDto>(x, y)
        p._data = dto
        p.Fill.value = Colors.Warning
        p.Text.value = Icons.Router_Planar_2
        this.Stations.push(p)
    }

    readonly AddStation1 = () => {
        this._svgEditor.Edit(EditorModes.Point)
        this._svgEditor._onSave = () => {
            const p = this._svgEditor.Point.value
            if (!p) return
            this.stationForm.Show()
        }
    }

    readonly EditLine = () => {
        this._svgEditor.Edit(EditorModes.Line)
    }

    readonly EditRect = () => {
        this._svgEditor.Edit(EditorModes.Rect)
    }

    readonly EditCircle = () => {
        this._svgEditor.Edit(EditorModes.Circle)
    }

    readonly Save = () => {
        this._svgEditor.Save()
    }

    readonly Cancel = () => {
        this._svgEditor.Cancel()
    }

    readonly OnMouseDown = (e: MouseEvent) => {
        this._svgEditor.OnMouseDown(e)
    }

    readonly OnMouseMove = (e: MouseEvent) => {
        this._svgEditor.OnMouseMove(e)
    }

    readonly OnMouseUp = (e: MouseEvent) => {
        this._svgEditor.OnMouseUp(e)
    }

    readonly OnPointClick = (p: PointModel<PositionDto>) => {
    }
    //#endregion 【Functions】
}
