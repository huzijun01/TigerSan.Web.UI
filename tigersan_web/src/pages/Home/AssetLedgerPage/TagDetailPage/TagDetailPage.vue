<template>
    <div class="tag-detail-page">
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Tag.value" :prop-value="Tag?.tagId" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Asset.value" :prop-value="Tag?.brandId" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Batch.value" :prop-value="Batch" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Type.value" :prop-value="Type" />
        <KeyValue :isAutoHidden="true" prop-name="RFID" :prop-value="Tag?.rfid" />
        <KeyValue :isAutoHidden="true" prop-name="IMEI" :prop-value="Tag?.imei" />
        <KeyValue :isAutoHidden="true" prop-name="ICCID" :prop-value="Tag?.iccid" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Battery.value" :prop-value="Tag?.battery" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Signal.value" :prop-value="Tag?.signal" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Temperature.value" :prop-value="Tag?.temperature" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Comment.value" :prop-value="Tag?.comment" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.ReportTime.value" :prop-value="Tag?.reportTime" />
        <KeyValue :isAutoHidden="true" :prop-name="Texts.Address.value" :prop-value="Tag?.address" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { DialogHelper, loading, KeyValue, Texts } from '@/0_tigersan_ui/tigerui'
import { tagHelper, TagModel, batchHelper, tagTypeHelper } from '@/models';

// 【字段】:
const { tagId } = defineProps({
    tagId: {
        type: String,
        default: ''
    }
})

const Tag = ref<TagModel | undefined>()
const Batch = ref<string | undefined>()
const Type = ref<string | undefined>()

// 【过程】:
onMounted(async () => {
    if (!tagId) {
        console.warn('The tag is undefined!')
        return
    }

    try {
        loading.IsShow.value = true

        const res = await tagHelper.GetFull(tagId)
        const tag = res.data as TagModel
        if (!tag) {
            DialogHelper.ShowError(res.message)
            return
        }

        Tag.value = tag
        Batch.value = await batchHelper.GetValue(tag.batch, true)
        Type.value = await tagTypeHelper.GetNameAsync(tag.type, true)
    } finally {
        loading.IsShow.value = false
    }
})

// 【方法】:
</script>

<style lang="less" scoped>
.tag-detail-page {
    &>* {
        margin-bottom: 10px;
    }
}
</style>