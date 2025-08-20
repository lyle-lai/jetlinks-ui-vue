<template>
    <div>
        <j-button type="primary" @click="showApiSelectModal">从Swagger导入</j-button>
        <j-button @click="addApiManually">手动添加API</j-button>

        <a-table :columns="columns" :data-source="formData.apis" row-key="path" style="margin-top: 16px;">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'limit'">
                    <a-input v-model:value="record.limit" placeholder="例如: 60次/分钟" />
                </template>
                <template v-if="column.key === 'needSignature'">
                    <a-switch v-model:checked="record.needSignature" />
                </template>
                <template v-if="column.key === 'action'">
                    <j-button type="link" @click="removeApi(record.path)">移除</j-button>
                </template>
            </template>
        </a-table>

        <ApiSelectModal v-model:visible="apiSelectModalVisible" @select="handleApiSelect" />
    </div>
</template>

<script setup lang="ts" name="OpenPlatformApiConfig">
import { ref, watch, defineProps, defineEmits } from 'vue';
import ApiSelectModal from './ApiSelectModal.vue';
import type { ApiInfo } from '../../typing.d.ts';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const formData = ref({
    apis: []
});
const apiSelectModalVisible = ref(false);

const columns = [
    { title: 'API路径', dataIndex: 'path', key: 'path' },
    { title: '请求方法', dataIndex: 'method', key: 'method' },
    { title: '调用次数限制', key: 'limit' },
    { title: '签名校验', key: 'needSignature' },
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

const showApiSelectModal = () => {
    apiSelectModalVisible.value = true;
};

const addApiManually = () => {
    if (!formData.value.apis) {
        formData.value.apis = [];
    }
    formData.value.apis.push({ path: '', method: 'GET', limit: '60/m', needSignature: true });
};

const removeApi = (path: string) => {
    formData.value.apis = formData.value.apis.filter((api: ApiInfo) => api.path !== path);
};

const handleApiSelect = (selectedApis: ApiInfo[]) => {
    if (!formData.value.apis) {
        formData.value.apis = [];
    }
    // Basic merge logic, could be improved to avoid duplicates
    formData.value.apis = [...formData.value.apis, ...selectedApis];
    apiSelectModalVisible.value = false;
};

</script>