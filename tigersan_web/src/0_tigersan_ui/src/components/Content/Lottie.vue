<template>
    <div class="lottie-panel flex-center" ref="refLottiePanel"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'
import mapJson from '@/assets/lottie/map.json'

// 字段:
let { map } = defineProps({
    map: {
        type: Object,
        default: mapJson
    }
})

let lottieInstance = null
const refLottiePanel = ref<HTMLElement | undefined>()

onMounted(() => {
    if (!refLottiePanel.value) {
        console.warn('The refLottiePanel is undefined!')
        return
    }

    lottieInstance = lottie.loadAnimation({
        container: refLottiePanel.value,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: map
    })
})
</script>

<style lang="less" scoped></style>