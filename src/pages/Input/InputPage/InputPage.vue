<template>
  <PageCard>
    <div class="inputs flex-center">
      <input type="text">
      <Checkbox :model="checkbox" />
      <DatePicker :model="date" />
      <Password />
      <Search :model="search" />
      <Select :model="select" />
      <Switch :model="_switch" />
      <TextBox :model="text" />
      <Upload :model="upload" />
      <button @click="ShowChecked">ShowChecked</button>
      <Tree :model="tree" />
    </div>
  </PageCard>
</template>

<script lang="ts" setup>
import { Tree, TreeModel, Upload, PageCard, Checkbox, CheckboxModel, DatePicker, DatePickerModel, Password, Search, SearchModel, Select, SelectModel, Switch, SwitchModel, TextBox, TextBoxModel, IdName, DialogHelper, Texts, DateType, UploadModel, ApiResult } from '../../../packages'

// 复选框:
const checkbox = new CheckboxModel()
checkbox.Text.value = 'A'
checkbox.Value.value = 'A'
checkbox._onChange = model => {
  if (!model.Value.value) return
  DialogHelper.Information(model.Value.value + ' = ' + model.IsChecked.value)
}

// 日期选择器:
const date = new DatePickerModel()
date._type = DateType.datetimerange
date._onChange = value => { if (value) DialogHelper.Information(value.toString()) }

// 搜索框:
const search = new SearchModel()
search._onSearch = value => { if (value) DialogHelper.Information(value) }
search._onEnter = search._onSearch

// 选择框:
const select = new SelectModel<IdName>()
select.Placeholder.value = Texts.Person
select.SetItems([
  { id: 1n, name: 'Amy' },
  { id: 2n, name: 'Bob' },
  { id: 3n, name: 'Carly' },
])
select._converter = source => source.name
select._onChange = value => {
  if (!value) return
  DialogHelper.Information(value.id + ', ' + value.name)
}

// 开关:
const _switch = new SwitchModel()
_switch._onChange = value => DialogHelper.Information(value.toString())

const text = new TextBoxModel()
text._onChange = value => DialogHelper.Information(value)

// 上传器:
const upload = new UploadModel({
  upload: async file => {
    return ApiResult.Success(Texts.UploadedSuccessfully.value, { name: file.name, url: '' })
  },
  delete: async config => {
    return ApiResult.Success(Texts.DeletedSuccessfully.value)
  },
  getImages: async () => []
})

// 树:
const tree = new TreeModel([
  {
    Text: '1',
    _data: 1,
    Childs: [
      {
        Text: '1-1',
        _data: 11,
        Childs: [
          {
            Text: '1-1-1',
            _data: 111,
          },
          {
            Text: '1-1-2',
            _data: 112,
          },
        ]
      },
      {
        Text: '1-2',
        _data: 12,
      },
    ]
  },
  {
    Text: '2',
    _data: 12,
    Childs: [
      {
        Text: '2-1',
        _data: 111,
      },
      {
        Text: '2-2',
        _data: 112,
      },
    ]
  },
])
function ShowChecked() {
  DialogHelper.Information(tree.CheckedNodeArray.value.map(i => i.Text.value).join('\r\n'))
}
tree._onActive = node => {
  DialogHelper.Information(node._data?.toString() ?? '')
}
</script>

<style lang="less" scoped>
.inputs {
  flex-direction: column;

  &>* {
    margin-bottom: 15px;
  }
}
</style>