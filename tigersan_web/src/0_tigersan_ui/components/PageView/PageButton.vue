<template>
    <div class="page-button" @click="OnClick" :class="{
        selected: model.IsSelected.value
    }">
        <div class="sub-border">
            <div class="icon iconfont">{{ model.Icon }}</div>
            <div class="title ellipsis">{{ model.Title }}</div>
            <button class="close iconfont circle-button" @click.stop="Close">{{ Icons.Close }}</button>
        </div>
        <div class="line"></div>
    </div>
</template>

<script lang="ts" setup>
import { Icons } from '../../base'
import { DeleteItem, GetFirstItem } from '../../helpers'
import { NavBarModel, NavButtonModel } from '../../models'

// 字段:
let { model } = defineProps({
    model: {
        type: NavButtonModel,
        default: NavBarModel._defaultButtonModel
    }
})

// 方法:
function OnClick() {
    model.NavBarModel.SelectedButtonModel = model;
}

function Close() {
    const oldIsSelected = model.IsSelected.value
    DeleteItem(model.NavBarModel.OpenedButtonModels, model)

    if (oldIsSelected) {
        model.NavBarModel.SelectedButtonModel = GetFirstItem(model.NavBarModel.OpenedButtonModels)
    }
}
</script>

<style lang="less" scoped>
.page-button {
    position: relative;
    border-radius: 10px 10px 0px 0px;
    color: var(--color-primary-text);
    transition: var(--Global-Duration);

    .sub-border {
        display: flex;
        align-items: center;
        width: 150px;
        padding: 5px;
        border-radius: 10px;
        cursor: pointer;
        transition: var(--Global-Duration);

        .icon {
            flex-shrink: 0;
            font-size: var(--PageButton-FontSize);
        }

        .title {
            flex-grow: 1;
            margin: 0px 5px;
            font-size: var(--PageButton-FontSize);
        }

        .close {
            flex-shrink: 0;
        }
    }

    .line {
        position: absolute;
        right: 0;
        top: 50%;
        width: 2px;
        height: 20px;
        transform: translateY(-50%);
        background: var(--color-white-25);
        transition: var(--Global-Duration);
    }

    &:hover {
        .sub-border {
            background: var(--color-white-10);
        }

        .line {
            background: transparent;
        }
    }

    &.selected {
        font-weight: bold;
        background: var(--color-brand-25);

        * {
            color: var(--color-brand);
        }

        .sub-border {
            background: transparent;
        }

        .line {
            background: transparent;
        }
    }
}
</style>