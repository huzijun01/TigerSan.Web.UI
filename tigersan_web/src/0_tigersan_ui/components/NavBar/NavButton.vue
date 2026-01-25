<template>
    <div class="border" ref="refRoot" v-if="model.IsShow" @click="OnClick" :class="{
        selected: model.IsSelected.value
    }">
        <div class="icon iconfont">{{ model.Icon }}</div>
        <div class="title ellipsis">{{ model.Title }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NavBarModel, NavButtonModel } from '../../models';

// 字段:
const refRoot = ref<HTMLElement | undefined>()

let { model } = defineProps({
    model: {
        type: NavButtonModel,
        default: NavBarModel._defaultButtonModel
    }
})

// 导出:
defineExpose({
    GetHeight: () => refRoot.value?.offsetHeight
})

// 方法:
function OnClick() {
    model.Clicked?.(model)

    if (!model.IsSelected.value) {
        model.Checked?.(model)
    }

    model.NavBarModel.SelectedButtonModel = model

    if (!model.NavBarModel.OpenedButtonModels.includes(model)) {
        model.NavBarModel.OpenedButtonModels.push(model)
    }
}
</script>

<style lang="less" scoped>
.border {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    color: var(--color-primary-text);
    transition: var(--Global-Duration);

    &:hover {
        color: var(--color-brand);
    }

    &.selected {
        font-weight: bold;
        color: var(--color-brand);
        background: var(--color-brand-10);
    }

    .icon {
        flex-shrink: 0;
        font-size: var(--NavIcon-FontSize);
    }

    .title {
        flex-grow: 1;
        margin: 0px 8px;
        font-size: var(--NavText-FontSize);
    }
}
</style>