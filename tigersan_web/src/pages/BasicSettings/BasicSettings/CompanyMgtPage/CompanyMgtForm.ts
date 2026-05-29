import { ref } from 'vue'
import { Colors, DialogHelper, Verify, ObjectHelper, DialogMode, DialogState, FormModel, FormConfig, FormItemConfig, BigintHelper, GetSubmitResult, IdNameModel, MyActionResult, loading, TreeModel, ArrayHelper } from '@/0_tigersan_ui/tigerui'
import { companyHelper, CompanyHelper, CompanyModel } from '@/models'

export class CompanyMgtForm {
    //#region 【Fields】
    /** 树 */
    readonly tree = new TreeModel<CompanyModel>()
    /** “公司”选择框 */
    readonly selectCompany = companyHelper.GetIdNameSelectModel()
    /** “父公司”选择框 */
    readonly selectParentCompany = companyHelper.GetIdNameSelectModel()

    /** “公司名称”项目配置 */
    readonly configName: FormItemConfig<CompanyModel, string> = {
        _propName: 'name',
        PropText: '公司名称',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.name)
        }
    }

    /** “公司地址”项目配置 */
    readonly configAddr: FormItemConfig<CompanyModel, string> = {
        _propName: 'addr',
        PropText: '公司地址',
        IsEquired: true,
        Target: ref(),
        _isVerifyOk: source => {
            return Verify.IsNotUndefinedOrEmpty(source.addr)
        }
    }

    /** “父公司”项目配置 */
    readonly configParent: FormItemConfig<CompanyModel, IdNameModel> = {
        _propName: 'parent',
        PropText: '父公司',
        IsEquired: false,
        Target: this.selectParentCompany.Value,
        _getValue: async (obj, propName) => this.selectParentCompany.Items.find(i => BigintHelper.IsEqualAndNotUndefined(i.id, obj.parent)),
        _setValue: (obj, propName, value) => {
            obj.parent = value ? value.id : undefined
        }
    }

    /** “增”源数据获取方法 */
    readonly AddGetSource = () => {
        return new CompanyModel()
    }

    /** “组织机构”表单配置 */
    readonly configCompanyForm: FormConfig<CompanyModel> = {
        CancelText: '取消',
        SubmitText: '确定',
        _getSource: this.AddGetSource,
        _beforeInitAsync: async isEdit => {
            this.selectParentCompany._getItemsAsync = isEdit ? this.EditGetItemsAsync : this.AddGetItemsAsync
            await this.selectParentCompany.UpdateItemsAsync()
        },
        _itemConfigs: [
            this.configName,
            this.configAddr,
            this.configParent,
        ]
    }

    /** “组织机构”表单模型 */
    readonly companyForm = new FormModel(this.configCompanyForm)
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        // 树:
        this.tree.IsShowCheckbox.value = false
        this.tree._onActive = node => {
            if (!node._data) {
                console.warn('The _data is undefined!')
                return
            }
            this.selectCompany.Value.value = this.selectCompany.Items.find(n => BigintHelper.IsEqualAndNotUndefined(n.id, node._data?.id))
        }
        this.tree._onUnactive = () => {
            this.selectCompany.Value.value = undefined
        }
        this.tree._onInited = () => this.tree.SetActiveNode(this.selectCompany.Text.value)

        this.selectCompany._onChange = () => {
            this.tree.ActiveNode.value = this.tree.NodeArray.value.find(n => BigintHelper.IsEqualAndNotUndefined(n._data?.id, this.selectCompany.Value.value?.id))
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await companyHelper.GetList({}).then(arr => {
                this.tree.Clear()
                this.tree.Init(CompanyHelper.Companies2Tree(arr))
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 增 */
    readonly Add = async () => {
        this.companyForm.Title.value = '新增公司'

        this.companyForm._getSource = this.AddGetSource

        this.companyForm._onSubmitAsync = async source => {
            const res = await companyHelper.Add(source as CompanyModel)
            await this.Refresh()
            return GetSubmitResult(res, '添加成功')
        }

        this.companyForm.Show()
    }

    /** 改 */
    readonly Edit = async () => {
        const model = this.tree.ActiveData.value
        if (!model) {
            console.warn('The model is undefined!')
            return
        }

        this.companyForm.Title.value = '修改公司'

        this.companyForm._getSource = () => {
            return ObjectHelper.ShallowCopy(model)
        }

        this.companyForm._onSubmitAsync = async source => {
            const res = await companyHelper.Edit(source)
            await this.Refresh()
            return GetSubmitResult(res, '修改成功')
        }

        this.companyForm.Show(true)
    }

    /** 删 */
    readonly Delete = () => {
        DialogHelper.ShowDialog(
            '确认',
            '是否确定删除该公司及其下级公司？',
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const model = this.tree.ActiveData.value
        if (!model) {
            console.warn('The model is undefined!')
            return
        }

        try {
            loading.IsShow.value = true

            await companyHelper.Delete(model.id).then(res => {
                this.Refresh()
                MyActionResult.ShowResult(res, '删除成功')
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    readonly AddGetItemsAsync = this.selectParentCompany._getItemsAsync
    readonly EditGetItemsAsync = async () => {
        const arr = await companyHelper.GetIdNames()

        const active = this.tree.ActiveNode.value
        if (!active) {
            console.warn('The node is undefined!')
            return arr
        }

        // 剔除“自身节点”及“后代节点”:
        const ids = active.GetArray().map(n => n._data?.id)
        ArrayHelper.Filter(arr, i => !BigintHelper.IsContain(ids, i.id))

        return arr
    }
    //#endregion 【Functions】
}