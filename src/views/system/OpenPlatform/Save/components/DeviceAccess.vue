<template>
    <div>
        <a-form layout="vertical">
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

             <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center; margin-top: 24px;">
                <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
                <a-button style="margin-left: 8px" @click="loadData">重置</a-button>
            </a-form-item>
        </a-form>

        <!-- 添加授权规则弹窗 -->
        <j-modal v-model:visible="addRuleModalVisible" title="添加授权规则" @ok="handleAddRule">
            <p>在这里选择授权类型（设备、产品、科室组）并搜索添加资源。</p>
            <!-- Resource selection form will go here -->
        </j-modal>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformDeviceAccess">
import { ref, watch } from 'vue';
import { getDeviceAccess, saveDeviceAccess } from '@/api/system/openPlatform'; // 假设的API
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{ id: string }>();

const loading = ref(false);
const formData = ref<any>({ // 后面用具体类型替换
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

const loadData = () => {
    if (props.id) {
        // loading.value = true;
        // getDeviceAccess(props.id).then(resp => {
        //     if (resp.success) {
        //         formData.value = resp.result;
        //     }
        // }).finally(() => {
        //     loading.value = false;
        // });
        // 模拟数据
        formData.value = { mode: 'whitelist', rules: [] };
    }
}

watch(() => props.id, () => {
    loadData();
}, { immediate: true });

const handleSave = async () => {
    loading.value = true;
    try {
        // const resp = await saveDeviceAccess(props.id, formData.value);
        // if (resp.success) {
        //     onlyMessage.success('保存成功');
        // }
        onlyMessage.success('保存成功（模拟）');
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
}

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
