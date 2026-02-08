import { SelectModel } from '@/tigerui'

const operationTypeSelect = new SelectModel()
operationTypeSelect.Width.value = 150
operationTypeSelect.Placeholder.value = '请选择'
operationTypeSelect.Value.value = '全部'
operationTypeSelect.Items.push(...[
    '全部',
    '修改参数',
    '升级',
    '亮灯',
    '恢复出厂',
    '关机',
    '连接状态',
    '参数同步',
    '响铃命令',
    '关灯命令',
    '亮灯&响铃',
    '设备导入',
    '关闭铃声',
    '传感器',
])

const productTypeSelect = new SelectModel()
productTypeSelect.Width.value = 350
productTypeSelect.Placeholder.value = '请选择'
productTypeSelect.Value.value = 'MBT02可连接资产标签'
productTypeSelect.Items.push(...[
    'MBT02可连接资产标签',
    'MBT02资产中继器',
    'MST03 Light Sensor',
])

export default {
    operationTypeSelect,
    productTypeSelect,
}