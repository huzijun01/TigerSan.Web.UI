<template>
    <div class="page-bar-panel" ref="refRoot">
        <div class="page-bar" :style="{ width: strWidth }">
            <PageButton v-for="b in model.OpenedButtonModels" :key="b._id" :model="b" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { PageButton } from '../../components';
import { NavBarModel } from '../../models';

// 字段:
let offset = 0
const width = ref(-1)
const refRoot = ref<HTMLElement | undefined>()

let { model } = defineProps({
    model: {
        type: NavBarModel,
        default: new NavBarModel()
    }
})

const strWidth = computed(() => width.value < 0 ? "auto" : `${width.value}px`)

// 过程:
onMounted(() => {
    UpdateOffset()
    InitResizeObserver()
    UpdatePagePanelWidth()
})

// 方法:
function InitResizeObserver() {
    window.addEventListener('resize', UpdatePagePanelWidth)

    watch(model.IsOpen, UpdatePagePanelWidth)
}

function UpdatePagePanelWidth() {
    width.value = window.innerWidth
        - (model.IsOpen.value ? model.Width.value : 0)
        - offset
}

function UpdateOffset() {
    let refRootWidth = GetWidth()
    if (!refRootWidth) {
        console.log('The refRootWidth is undefined!')
        return
    }

    offset = window.innerWidth - refRootWidth

    if (model.IsOpen.value) {
        offset -= model.Width.value
    }
}

function GetWidth() {
    return refRoot.value?.offsetWidth
}
</script>

<style lang="less" scoped>
.page-bar-panel {
    flex-grow: 1;
    margin: 10px 5px 0px 5px;
    overflow: hidden;

    .page-bar {
        display: flex;
        overflow: auto;
    }
}
</style>