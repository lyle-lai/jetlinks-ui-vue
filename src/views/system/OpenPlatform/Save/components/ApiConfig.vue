<template>
    <div>
        <a-form layout="vertical">
            <j-button type="primary" @click="showApiSelectModal">从Swagger导入</j-button>
            <j-button @click="addApiManually" style="margin-left: 8px">手动添加API</j-button>

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

            <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center; margin-top: 24px;">
                <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
                <a-button style="margin-left: 8px" @click="loadData">重置</a-button>
            </a-form-item>
        </a-form>

        <ApiSelectModal v-model:visible="apiSelectModalVisible" @select="handleApiSelect" />
    </div>
</template>

<script setup lang="ts" name="OpenPlatformApiConfig">
import { ref, watch } from 'vue';
import ApiSelectModal from './ApiSelectModal.vue';
import type { ApiInfo } from '../../typing.d.ts';
import { getApiConfig, saveApiConfig } from '@/api/system/openPlatform'; // 假设的API
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{ id: string }>();

const loading = ref(false);
const formData = ref<any>({
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

const loadData = () => {
    if (props.id) {
        // loading.value = true;
        // getApiConfig(props.id).then(resp => {
        //     if (resp.success) {
        //         formData.value = resp.result;
        //     }
        // }).finally(() => {
        //     loading.value = false;
        // });
        // 模拟数据
        formData.value = { apis: [] };
    }
}

watch(() => props.id, () => {
    loadData();
}, { immediate: true });

const handleSave = async () => {
    loading.value = true;
    try {
        // const resp = await saveApiConfig(props.id, formData.value);
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
