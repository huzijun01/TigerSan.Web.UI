import { computed, shallowReactive, shallowRef } from "vue"
import { ArrayHelper, Colors, EditorModes, Icons, PointModel, SvgModel, Texts } from '../../../packages'

export class StationEntity {
    macAddr = ''
    x = 0
    y = 0
}

export class SvgPageModel {
    //#region 【Fields】
    /** “SVG”模型 */
    readonly _svg = new SvgModel()

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => {
        const station = new StationEntity()
        const p = this._svg.TempPoint.value
        if (!p) return station
        station.x = p.X.value
        station.y = p.Y.value
        return station
    }
    //#endregion 【Fields】

    //#region 【Props】
    readonly IsEditing = this._svg.IsEditing
    /** 被选中的点 */
    readonly SelectedPoint = shallowRef<PointModel>()
    readonly Tags = shallowReactive<PointModel[]>([])
    readonly Stations = shallowReactive<PointModel[]>([])
    readonly AllowedDelete = computed(() => this.SelectedPoint.value != undefined)
    //#endregion 【Props】

    //#region 【Ctor】
    constructor() {
        // this._svg.BgStyle.value = {
        //     width: '500px',
        //     height: '300px',
        // }
        // this._svg.IsShowGrid.value = true
        this._svg.BgUrl.value = '餐厅.jpeg'
        this._svg._isAutoClear = true
        this._svg.SetLayers([
            { Points: this.Tags },
            { Points: this.Stations }
        ])
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Refresh = async () => {
        this.SelectedPoint.value = undefined
        this._svg.Clear()
        this._svg.Cancel()
        this._svg.SetBg('餐厅.jpeg')
    }

    readonly AddTag = (x: number, y: number, macAddr: string) => {
        const p = new PointModel({
            X: x,
            Y: y,
            Text: macAddr,
            Icon: Icons.Tag_Planar_2,
        })
        p.IconFill.value = p.TextFill.value = Colors.Brand
        p._onClick = model => {
            this.SelectedPoint.value = model
            this._svg.SetPosition(model.X.value, model.Y.value)
        }
        this.Tags.push(p)
    }

    readonly AddStation = (x: number, y: number, macAddr: string) => {
        const p = new PointModel({
            X: x,
            Y: y,
            Text: macAddr,
            Icon: Icons.Router_Planar_2,
        })
        p.IconFill.value = p.TextFill.value = Colors.Warning
        p._onClick = model => {
            this.SelectedPoint.value = model
            this._svg.SetPosition(model.X.value, model.Y.value)
        }
        this.Stations.push(p)
    }

    readonly AddTag1 = () => {
        this._svg.Edit(EditorModes.Point)
        this._svg._onSave = () => {
            const p = this._svg.TempPoint.value
            if (!p) return
            let macAddr = null
            while (!macAddr) {
                macAddr = prompt(Texts.MacAddr.value)
            }
            this.AddTag(p.X.value, p.Y.value, macAddr)
        }
    }

    readonly AddStation1 = () => {
        this._svg.Edit(EditorModes.Point)
        this._svg._onSave = () => {
            const p = this._svg.TempPoint.value
            if (!p) return
            let macAddr = null
            while (!macAddr) {
                macAddr = prompt(Texts.MacAddr.value)
            }
            this.AddStation(p.X.value, p.Y.value, macAddr)
        }
    }

    readonly EditLine = () => {
        this._svg.Edit(EditorModes.Line)
    }

    readonly EditRect = () => {
        this._svg.Edit(EditorModes.Rect)
    }

    readonly EditCircle = () => {
        this._svg.Edit(EditorModes.Circle)
    }

    readonly DeletePoint = () => {
        const p = this.SelectedPoint.value
        if (!p) return
        ArrayHelper.Delete(this.Tags, p)
        ArrayHelper.Delete(this.Stations, p)
        this._svg.DeletePosition()
        this.SelectedPoint.value = undefined
    }

    readonly Save = () => {
        this._svg.Save()
    }

    readonly Cancel = () => {
        this._svg.Cancel()
    }

    readonly OnMouseDown = (e: MouseEvent) => {
        this._svg.OnMouseDown(e)
    }

    readonly OnMouseMove = (e: MouseEvent) => {
        this._svg.OnMouseMove(e)
    }

    readonly OnMouseUp = (e: MouseEvent) => {
        this._svg.OnMouseUp(e)
    }

    readonly OnPointClick = (p: PointModel) => {
    }
    //#endregion 【Functions】
}
