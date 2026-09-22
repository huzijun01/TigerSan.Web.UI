import { ref } from "vue"
import { nanoid } from "nanoid"
import { Colors } from "@/0_tigersan_ui/tigerui"

export class PointModel<T> {
    readonly _id = nanoid()
    _data?: T

    readonly X = ref(0)
    readonly Y = ref(0)
    readonly Text = ref('●')
    readonly Fill = ref(Colors.Brand)

    constructor(x: number = 0, y: number = 0) {
        this.X.value = x
        this.Y.value = y
    }

    readonly Log = () => {
        console.log('x', this.X.value, 'y', this.Y.value)
    }
}

export class LineModel {
    readonly _id = nanoid()

    readonly X1 = ref(0)
    readonly Y1 = ref(0)
    readonly X2 = ref(0)
    readonly Y2 = ref(0)
    readonly Stroke = ref('red')
    readonly StrokeWidth = ref('1px')

    constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
        this.X1.value = x1
        this.Y1.value = y1
        this.X2.value = x2
        this.Y2.value = y2
    }

    readonly Log = () => {
        console.log('x1', this.X1.value, 'y1', this.Y1.value, 'x2', this.X2.value, 'y2', this.Y2.value)
    }
}

export class RectModel {
    readonly _id = nanoid()

    readonly X = ref(0)
    readonly Y = ref(0)
    readonly W = ref(0)
    readonly H = ref(0)
    readonly Stroke = ref('red')
    readonly StrokeWidth = ref('1px')
    readonly Fill = ref('transparent')

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.X.value = x
        this.Y.value = y
        this.W.value = w
        this.H.value = h
    }

    readonly Log = () => {
        console.log('x', this.X.value, 'y', this.Y.value, 'w', this.W.value, 'h', this.H.value)
    }
}

export class CircleModel {
    readonly _id = nanoid()

    readonly X = ref(0)
    readonly Y = ref(0)
    readonly R = ref(0)
    readonly Stroke = ref('red')
    readonly StrokeWidth = ref('1px')
    readonly Fill = ref('transparent')

    constructor(x: number = 0, y: number = 0, r: number = 0) {
        this.X.value = x
        this.Y.value = y
        this.R.value = r
    }

    readonly Log = () => {
        console.log('x', this.X.value, 'y', this.Y.value)
    }
}

export class SvgHelper {
    /** 获取点击位置 */
    static GetPoint(e: MouseEvent) {
        const svg = e.currentTarget as SVGSVGElement
        const pt = svg.createSVGPoint()
        pt.x = e.clientX
        pt.y = e.clientY
        return pt.matrixTransform(svg.getScreenCTM()?.inverse())
    }
}