import { TreeModel, TreeNodeConfig } from "@/0_tigersan_ui/tigerui"

export class AuthorityHelper {
    static GetTreeModel() {
        const tree = new TreeModel(configs, true)
        return tree
    }
}

const configs: TreeNodeConfig<unknown>[] = [
    {
        Text: '基础设置',
        Childs: [
            {
                Text: '组织机构'
            },
            {
                Text: '角色管理'
            },
            {
                Text: '人员管理'
            },
            {
                Text: '权限管理'
            },
            {
                Text: '场地管理'
            },
        ]
    },
    {
        Text: '基站管理',
        Childs: [
            {
                Text: '基站管理'
            },
        ]
    },
    {
        Text: '标签管理',
        Childs: [
            {
                Text: '人员管理标签'
            },
            {
                Text: '资产管理标签'
            },
            {
                Text: '传感器标签'
            },
        ]
    },
    {
        Text: '设备管理',
        Childs: [
            {
                Text: '4G定位终端'
            },
        ]
    },
    {
        Text: '操作管理',
        Childs: [
            {
                Text: '操作记录'
            },
            {
                Text: '操作重试'
            },
        ]
    },
    {
        Text: '系统设置',
        Childs: [
            {
                Text: '设备设置'
            },
            {
                Text: '报警设置'
            },
        ]
    },
]