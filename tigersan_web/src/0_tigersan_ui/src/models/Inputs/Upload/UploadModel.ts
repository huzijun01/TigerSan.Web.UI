import { nanoid } from 'nanoid'
import type { Property } from 'csstype'
import { computed, ref, shallowReactive, type StyleValue } from 'vue'
import { Texts } from '../../../texts'
import { UploadBase, FileTypes } from '../../UploadBase'
import { ImagePreviewModel } from '../../Dialog/ImagePreviewModel'
import { ActionResultCode, MyActionResult } from '../../MyActionResult'
import { Methods, ArrayHelper, AxiosBase, KeyValueModel, WatchBehavior } from '../../../helpers'

export type ImageConfig = { name: string, url: string, params?: KeyValueModel[] }
export type FnUpload = (file: File) => Promise<MyActionResult<ImageConfig>>
export type FnUploaded = (config: ImageConfig) => Promise<void>
export type FnDelete = (config: ImageConfig) => Promise<MyActionResult<any>>
export type FnDeleted = (config: ImageConfig) => Promise<void>
export type FnGetImages = () => Promise<ImageConfig[] | undefined>

/** “图片”模型 */
export class UploadImageModel {
    //#region 【Fields】
    /** 所属“上传器” */
    private readonly _upload: UploadModel
    /** ID */
    readonly _id = nanoid()
    /** “URL”监听器 */
    readonly _watchUrl
    /** Query参数 */
    _params
    //#endregion 【Fields】

    //#region 【Props】
    /** 名称 */
    readonly Name = ref<string>('')
    /** URL
     * （会触发“加载”） */
    readonly Url = ref<string>('')
    /** Blob URL
     * （由“ImageModel”内部维护） */
    readonly BlobUrl = ref<string | undefined>()
    //#endregion 【Props】

    //#region 【Ctor】
    constructor(upload: UploadModel, config: ImageConfig) {
        this._upload = upload
        this.Name.value = config.name
        this.Url.value = config.url
        this._params = config.params

        this._watchUrl = new WatchBehavior(this.Url, (value, oldValue) => {
            if (value === oldValue || !value) return
            this.Load()
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 获取“默认模型” */
    static GetDefault() {
        return new UploadImageModel(UploadModel.GetDefault(), { name: '', url: '' })
    }

    /** 加载 */
    readonly Load = async () => {
        this._watchUrl.Start()

        if (this.BlobUrl.value) {
            URL.revokeObjectURL(this.BlobUrl.value)
            this.BlobUrl.value = undefined
        }

        if (!this.Url.value || this.Url.value === '') return

        try {
            const blob = await this._upload._axiosBase.GetBlob(this.Url.value, this._params, this._upload._method)
            if (!blob) return
            this.BlobUrl.value = URL.createObjectURL(blob)
        } catch (error) {
            console.error(error)
        }
    }

    /** 销毁 */
    readonly Dispose = () => {
        this._watchUrl.Stop()

        if (this.BlobUrl.value) {
            URL.revokeObjectURL(this.BlobUrl.value)
            this.BlobUrl.value = undefined
        }

        this.Url.value = ''
        this._params = undefined
    }

    /** 打开 */
    readonly Open = () => {
        this._upload._preview.IsShow.value = true
        this._upload._preview.Title.value = this.Name.value
        this._upload._preview.Url.value = this.BlobUrl.value
    }

    /** 删除 */
    readonly Delete = async () => {
        if (this._upload.IsInoperable.value) return
        this._upload.IsLoading.value = true

        try {
            if (this.Url.value) {
                const res = await this._upload._delete({
                    name: this.Name.value,
                    url: this.Url.value,
                    params: this._params
                })
                if (res.code === ActionResultCode.Error) {
                    return MyActionResult.ShowResult(res)
                } else {
                    MyActionResult.ShowResult(res, undefined, false)
                }
            }
            await this._upload._onDeleted?.({ name: this.Name.value, url: this.Url.value, params: this._params })
            ArrayHelper.Delete(this._upload.Images, this)
        } finally {
            this._upload.IsLoading.value = false
        }
    }
    //#endregion 【Functions】
}

/** “上传器”模型 */
export class UploadModel extends UploadBase {
    //#region 【Fields】
    /** 图片预览
     * （由“UploadModel”内部维护） */
    readonly _preview = new ImagePreviewModel()
    /** “Axios基类”实例 */
    readonly _axiosBase: AxiosBase
    /** 是否“自动加载” */
    _isAutoLoad = true
    /** “获取图片”请求方法 */
    _method = Methods.Get
    /** “上传”方法 */
    _upload: FnUpload
    /** “删除”方法 */
    _delete: FnDelete
    /** “获取图片集合”方法 */
    _getImages: FnGetImages
    /** “上传”后 */
    _onUploaded?: FnUploaded
    /** “删除”后 */
    _onDeleted?: FnDeleted
    //#endregion 【Fields】

    //#region 【Props】
    /** 尺寸 */
    readonly Size = ref(150)
    /** 是否“允许多个” */
    readonly IsAllowMulti = ref(true)
    /** 填充方式 */
    readonly ObjectFit = ref<Property.ObjectFit>('contain')
    /** “图片”集合 */
    readonly Images = shallowReactive<UploadImageModel[]>([])
    /** 是否“正在加载”
     * （由“UploadModel”内部维护） */
    readonly IsLoading = ref(false)

    //#region [computed]
    /** 是否“不可操作” */
    readonly IsInoperable = computed(() => this.IsProcessing.value || this.IsLoading.value)
    /** 是否“允许添加” */
    readonly IsAllowAdd = computed(() => this.IsAllowMulti.value || this.Images.length < 1)
    readonly RootStyle = computed((): StyleValue => {
        return {
            '--size': this.Size.value + 'px',
            '--object-fit': this.ObjectFit.value,
        }
    })
    //#endregion [computed]
    //#endregion 【Props】

    //#region 【Ctor】
    constructor(opts: {
        axiosBase?: AxiosBase
        upload: FnUpload
        delete: FnDelete
        getImages: FnGetImages
    }) {
        super(files => {
            const file = files[0]
            if (file) this.UploadAsync(file)
        })
        this.Type = FileTypes.Image
        this._axiosBase = opts.axiosBase ?? new AxiosBase()
        this._upload = opts.upload
        this._delete = opts.delete
        this._getImages = opts.getImages
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 获取“默认模型” */
    static GetDefault() {
        return new UploadModel({
            upload: async () => MyActionResult.Success(Texts.UploadedSuccessfully.value),
            delete: async () => MyActionResult.Success(Texts.DeletedSuccessfully.value),
            getImages: async () => [],
        })
    }

    /** 加载 */
    readonly Load = async () => {
        this.Images.splice(0)
        if (!this._getImages) return
        const arr = await this._getImages()
        if (!arr) return
        arr.forEach(i => this.Add(i))
    }

    /** 添加 */
    readonly Add = (config: ImageConfig) => {
        if (!this.IsAllowAdd.value) return

        this.Images.push(new UploadImageModel(this, config))
    }

    /** 上传（异步） */
    readonly UploadAsync = async (file: File) => {
        if (this.IsInoperable.value) return
        if (!this.IsAllowAdd.value) return

        if (!this._upload) {
            console.warn('The _upload is undefined!')
            return
        }

        this.IsLoading.value = true

        try {
            this.Controller.value = new AbortController()
            const res = await this._upload(file)
            if (!res.data) {
                MyActionResult.ShowResult(res, res.message, false)
                return
            }
            this.Add(res.data)
            this._onUploaded?.(res.data)
            MyActionResult.ShowResult(res, undefined, false)
        } finally {
            this.Percent.value = 0
            this.Controller.value = undefined
            this.IsLoading.value = false
        }
    }

    /** 删除 */
    readonly Delete = async () => {
        const fnDeletes = this.Images.map(i => i.Delete)
        for (let i = 0; i < fnDeletes.length; i++) {
            const fnDelete = fnDeletes[i]
            await fnDelete?.()
        }
    }
    //#endregion 【Functions】
}