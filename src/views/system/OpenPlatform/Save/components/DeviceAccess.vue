<template>
    <div>
        <a-form-item label="授权模式">
            <a-radio-group v-model:value="formData.mode">
                <a-radio value="whitelist">白名单模式</a-radio>
                <a-radio value="blacklist">黑名单模式</a-radio>
            </a-radio-group>
            <div class="form-item-explain">
                <p v-if="formData.mode === 'whitelist'">白名单模式：仅允许访问列表中的设备资源。</p>
                <p v-else>黑名单模式：禁止访问列表中的设备资源。</p>
            </div>
        </a-form-item>

        <j-button type="primary" @click="showAddRuleModal">添加授权</j-button>

        <a-table :columns="columns" :data-source="formData.rules" row-key="id" style="margin-top: 16px;">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <j-button type="link" @click="removeRule(record.id)">移除</j-button>
                </template>
            </template>
        </a-table>

        <!-- 添加授权规则弹窗 -->
        <j-modal v-model:visible="addRuleModalVisible" title="添加授权规则" @ok="handleAddRule">
            <p>在这里选择授权类型（设备、产品、科室组）并搜索添加资源。</p>
            <!-- Resource selection form will go here -->
        </j-modal>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformDeviceAccess">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const formData = ref({
    mode: 'whitelist',
    rules: []
});
const addRuleModalVisible = ref(false);

const columns = [
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '资源名称', dataIndex: 'name', key: 'name' },
    { title: '添加时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '操作', key: 'action' },
];

watch(() => props.modelValue, (newData) => {
    if (newData) {
        formData.value = newData;
    }
}, { immediate: true, deep: true });

watch(formData, (newData) => {
    emit('update:modelValue', newData);
}, { deep: true });

const showAddRuleModal = () => {
    addRuleModalVisible.value = true;
};

const handleAddRule = () => {
    // Logic to add selected resource to rules list
    addRuleModalVisible.value = false;
};

const removeRule = (id: string) => {
    formData.value.rules = formData.value.rules.filter((rule: any) => rule.id !== id);
};

</script>

<style lang="less" scoped>
.form-item-explain {
    color: #999;
    font-size: 12px;
    margin-top: 4px;
}
</style>