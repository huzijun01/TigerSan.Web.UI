<template>
    <div class="company">
        <img :src="img" @click="OnClick" />
        <div class="text">公司名称: {{ model.name }}</div>
        <div class="text">公司地址: {{ model.addr }}</div>
        <div class="button-panel flex-right">
            <span class="btn iconfont" @click="OnDelete">{{ Icons.Delete_Linear }}</span>
            <span class="btn iconfont" @click="OnEdit">{{ Icons.Edit }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { Icons, StringHelper } from '@/0_tigersan_ui/tigerui'
import { CompanyMgtModel } from '@/pages/BasicSettings/CompanyMgtPage/CompanyMgtTable'

//字段:
const { model } = defineProps({
    model: {
        type: Object as PropType<CompanyMgtModel>,
        default: () => new CompanyMgtModel()
    },
})

const img = 'http://www.tigersan.cn/0_file/image/company.png'
// const img = StringHelper.IsNotEmpty(model.image) ? model.image : 'http://www.tigersan.cn/0_file/image/company.png'

//方法:
function OnClick() {
    if (model.onClick) {
        model.onClick(model)
    }
}

function OnDelete() {
    if (model.onDelete) {
        model.onDelete(model)
    }
}

function OnEdit() {
    if (model.onEdit) {
        model.onEdit(model)
    }
}
</script>

<style lang="less" scoped>
.company {
    display: grid;
    grid-template-rows: 1fr auto auto;
    width: 400px;
    height: 270px;
    padding: 5px;
    border: 1px solid;
    border-radius: 2px;
    border-color: var(--theme-border);

    &:hover {
        border-color: var(--theme-border-hover);
    }

    &:focus {
        border-color: var(--theme-border-active);
    }

    &:disabled {
        border-color: var(--theme-border-disabled);
    }

    &>img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .text {
        padding: 2px 0px;
        user-select: text;
    }

    .button-panel {
        .btn {
            cursor: pointer;
            padding-left: 10px;
            font-size: 16px;
            transition: var(--Global-Transition);

            &:hover {
                color: var(--theme-brand);
            }
        }
    }
}
</style>