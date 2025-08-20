<template>
    <j-modal :visible="visible" title="从Swagger选择API" @ok="handleOk" @cancel="handleCancel" width="800px">
        <p>正在加载Swagger API列表...</p>
        <!-- API list will be displayed here, likely in a tree or table with checkboxes -->
        <a-tree
            v-if="apiTreeData.length"
            v-model:checkedKeys="checkedKeys"
            checkable
            :tree-data="apiTreeData"
            :field-names="{ title: 'summary', key: 'id' }"
        />
        <a-alert v-else-if="loadingError" message="Swagger API加载失败" type="error" />
        <a-spin v-else />
    </j-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';
// import axios from 'axios'; // Or other http client

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['update:visible', 'select']);

const apiTreeData = ref([]);
const checkedKeys = ref<string[]>([]);
const allApis = ref<any[]>([]);
const loadingError = ref(false);

onMounted(() => {
    if (props.visible) {
        loadSwaggerApis();
    }
});

const loadSwaggerApis = async () => {
    try {
        // const response = await axios.get('/swagger.json');
        // const swaggerData = response.data;
        // const processedData = processSwaggerData(swaggerData);
        // allApis.value = processedData.allApis;
        // apiTreeData.value = processedData.treeData;
    } catch (error) {
        console.error("Failed to load swagger.json", error);
        loadingError.value = true;
    }
};

// This is a simplified parser. A real one would be more robust.
const processSwaggerData = (swaggerData: any) => {
    const treeData: any[] = [];
    const allApis: any[] = [];
    const tags = swaggerData.tags.map((t: any) => ({ ...t, children: [] }));

    for (const path in swaggerData.paths) {
        for (const method in swaggerData.paths[path]) {
            const apiInfo = swaggerData.paths[path][method];
            const api = {
                id: `${method}:${path}`,
                path: path,
                method: method.toUpperCase(),
                summary: apiInfo.summary || path,
                tags: apiInfo.tags,
            };
            allApis.push(api);
            const parentTag = tags.find(t => t.name === api.tags?.[0]);
            if (parentTag) {
                parentTag.children.push(api);
            }
        }
    }
    return { treeData: tags, allApis };
};

const handleOk = () => {
    const selectedApis = allApis.value.filter(api => checkedKeys.value.includes(api.id));
    emit('select', selectedApis);
    handleCancel();
};

const handleCancel = () => {
    emit('update:visible', false);
};

</script>
