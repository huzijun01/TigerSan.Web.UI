import { ref, shallowRef } from "vue"
import { CircleModel, LineModel, PointModel, RectModel, SvgHelper } from "./Shapes"

// 导出编辑模式枚举，供外部切换图形类型使用
export enum EditorModes {
    Line,
    Rect,
    Circle,
    Point,
}

/** “CSV”编辑器 */
export class CsvEditor<T> {
    //#region 【内部状态字段】
    /** 当前编辑模式 */
    private _mode = EditorModes.Line
    /** 拖拽起始X坐标 */
    private _startX = 0
    /** 拖拽起始Y坐标 */
    private _startY = 0
    /** 鼠标是否按下状态 */
    private _isPressed = false
    /** 是否“自动清除” */
    _isAutoClear = true
    /** 图形最小有效尺寸，小于该值判定为误操作 */
    _minSize = 15
    /** 保存后 */
    _onSave?: Function
    //#endregion

    //#region 【Props】
    /** 是否处于编辑状态 */
    readonly IsEditing = ref(false)
    /** 当前编辑/已绘制的线 */
    readonly Line = shallowRef<LineModel | undefined>()
    /** 当前编辑/已绘制的矩形 */
    readonly Rect = shallowRef<RectModel | undefined>()
    /** 当前编辑/已绘制的圆 */
    readonly Circle = shallowRef<CircleModel | undefined>()
    /** 当前编辑/已绘制的点 */
    readonly Point = shallowRef<PointModel<T> | undefined>()
    //#endregion 【Props】

    //#region 【点】
    /** 点：鼠标按下直接在点击位置生成 */
    private readonly handlePointDown = (svgP: { x: number; y: number }) => {
        this.Point.value = new PointModel(svgP.x, svgP.y)
    }

    /** 点：鼠标移动实时更新坐标，支持拖拽调整位置 */
    private readonly handlePointMove = (svgP: { x: number; y: number }) => {
        const point = this.Point.value
        if (!point) return
        point.X.value = svgP.x
        point.Y.value = svgP.y
    }

    /** 点：抬起时直接保留，不做最小尺寸校验 */
    private readonly handlePointUp = () => {
        // 点类型只要生成就视为有效，无需额外校验
    }
    //#endregion 【点】

    //#region 【线】
    /** 线：鼠标按下初始化 */
    private readonly handleLineDown = (svgP: { x: number; y: number }) => {
        this.Line.value = new LineModel(svgP.x, svgP.y, svgP.x, svgP.y)
    }

    /** 线：鼠标移动更新终点 */
    private readonly handleLineMove = (svgP: { x: number; y: number }) => {
        const line = this.Line.value
        if (!line) return
        line.X2.value = svgP.x
        line.Y2.value = svgP.y
    }

    /** 线：抬起/保存时校验有效性 */
    private readonly handleLineUp = () => {
        const line = this.Line.value
        if (!line) return
        const dx = line.X2.value - line.X1.value
        const dy = line.Y2.value - line.Y1.value
        const length = Math.sqrt(dx * dx + dy * dy)
        if (length < this._minSize) this.Line.value = undefined
    }
    //#endregion 【线】

    //#region 【矩形】
    /** 矩形：鼠标按下初始化 */
    private readonly handleRectDown = (svgP: { x: number; y: number }) => {
        this.Rect.value = new RectModel(svgP.x, svgP.y, 0, 0)
    }

    /** 矩形：鼠标移动更新尺寸（支持任意方向拖拽） */
    private readonly handleRectMove = (svgP: { x: number; y: number }) => {
        const rect = this.Rect.value
        if (!rect) return
        const x = Math.min(this._startX, svgP.x)
        const y = Math.min(this._startY, svgP.y)
        const w = Math.abs(svgP.x - this._startX)
        const h = Math.abs(svgP.y - this._startY)
        rect.X.value = x
        rect.Y.value = y
        rect.W.value = w
        rect.H.value = h
    }

    /** 矩形：抬起/保存时校验有效性 */
    private readonly handleRectUp = () => {
        const rect = this.Rect.value
        if (!rect) return
        if (rect.W.value < this._minSize && rect.H.value < this._minSize) {
            this.Rect.value = undefined
        }
    }
    //#endregion 【矩形】

    //#region 【圆】
    /** 圆：鼠标按下初始化（按下点为圆心） */
    private readonly handleCircleDown = (svgP: { x: number; y: number }) => {
        this.Circle.value = new CircleModel(svgP.x, svgP.y, 0)
    }

    /** 圆：鼠标移动更新半径（拖拽距离为半径） */
    private readonly handleCircleMove = (svgP: { x: number; y: number }) => {
        const circle = this.Circle.value
        if (!circle) return
        const dx = svgP.x - this._startX
        const dy = svgP.y - this._startY
        const r = Math.sqrt(dx * dx + dy * dy)
        circle.R.value = r
    }

    /** 圆：抬起/保存时校验有效性 */
    private readonly handleCircleUp = () => {
        const circle = this.Circle.value
        if (!circle) return
        if (circle.R.value < this._minSize) this.Circle.value = undefined
    }
    //#endregion 【圆】

    //#region 【Functions】
    //#region [private]
    /** 重置交互状态 */
    private readonly Init = () => {
        this._startX = 0
        this._startY = 0
        this._isPressed = false
    }
    //#endregion [private]

    /** 进入指定图形的编辑模式 */
    readonly Edit = (mode = EditorModes.Line) => {
        this.Init()
        this._mode = mode
        this.IsEditing.value = true
    }

    /** 清除 */
    readonly Clear = () => {
        this.Line.value = undefined
        this.Rect.value = undefined
        this.Circle.value = undefined
        this.Point.value = undefined
    }

    /** 保存图形并退出编辑 */
    readonly Save = () => {
        // 处理拖拽中途直接保存的边界情况
        if (this._isPressed) {
            this._isPressed = false
            switch (this._mode) {
                case EditorModes.Line: this.handleLineUp(); break
                case EditorModes.Rect: this.handleRectUp(); break
                case EditorModes.Circle: this.handleCircleUp(); break
                case EditorModes.Point: this.handlePointUp(); break
            }
        }
        this.Init()
        this.IsEditing.value = false
        this._onSave?.()
        if (this._isAutoClear) this.Clear()
    }

    /** 取消 */
    readonly Cancel = () => {
        this.Clear()
        this.Save()
    }

    /** 鼠标按下事件（绑定到SVG容器） */
    readonly OnMouseDown = (e: MouseEvent) => {
        if (!this.IsEditing.value || this._isPressed) return

        this._isPressed = true
        const svgP = SvgHelper.GetPoint(e)
        this._startX = svgP.x
        this._startY = svgP.y

        // 按模式分发到对应图形处理逻辑
        switch (this._mode) {
            case EditorModes.Line: this.handleLineDown(svgP); break
            case EditorModes.Rect: this.handleRectDown(svgP); break
            case EditorModes.Circle: this.handleCircleDown(svgP); break
            case EditorModes.Point: this.handlePointDown(svgP); break
        }
    }

    /** 鼠标移动事件（绑定到SVG容器） */
    readonly OnMouseMove = (e: MouseEvent) => {
        if (!this.IsEditing.value || !this._isPressed) return
        const svgP = SvgHelper.GetPoint(e)

        // 按模式分发到对应图形处理逻辑
        switch (this._mode) {
            case EditorModes.Line: this.handleLineMove(svgP); break
            case EditorModes.Rect: this.handleRectMove(svgP); break
            case EditorModes.Circle: this.handleCircleMove(svgP); break
            case EditorModes.Point: this.handlePointMove(svgP); break
        }
    }

    /** 鼠标抬起事件（绑定到SVG容器） */
    readonly OnMouseUp = (e: MouseEvent) => {
        if (!this.IsEditing.value) return
        this._isPressed = false

        // 按模式分发校验逻辑
        switch (this._mode) {
            case EditorModes.Line: this.handleLineUp(); break
            case EditorModes.Rect: this.handleRectUp(); break
            case EditorModes.Circle: this.handleCircleUp(); break
            case EditorModes.Point: this.handlePointUp(); break
        }
    }
    //#endregion 【Functions】
}
