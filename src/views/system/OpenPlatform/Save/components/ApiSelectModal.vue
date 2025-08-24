<template>
  <a-modal :visible="visible" title="从Swagger选择API" @ok="handleOk" @cancel="handleCancel" width="900px" :body-style="{ padding: '0 24px 24px 24px' }">
    <div class="api-select-container">
      <div class="header">
        <a-input-search v-model:value="searchText" placeholder="根据API路径或说明搜索" allow-clear />
      </div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="filteredTreeData"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onSelect: onSelect,
            onSelectAll: onSelectAll,
          }"
          row-key="id"
          :pagination="false"
          :scroll="{ y: 400 }"
          v-model:expandedRowKeys="expandedRowKeys"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'method'">
              <a-tag :color="getMethodColor(record.method)">{{ record.method }}</a-tag>
            </template>
          </template>
        </a-table>
      </div>
      <div class="footer">
        已选择 {{ selectedRowKeys.length }} 项
      </div>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.api-select-container {
  .header {
    padding: 16px 0;
  }
  .footer {
    margin-top: 16px;
    text-align: right;
    color: #999;
  }
}
</style>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type { ApiInfo } from '../../typing.d.ts';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['update:visible', 'select']);

// --- Mock Data ---
const mockSwaggerData = {
  tags: [
    { name: 'device-manager', description: '设备管理' },
    { name: 'user-manager', description: '用户管理' },
    { name: 'un-tagged', description: '未分类' },
  ],
  paths: {
    '/api/v1/device/{id}': {
      get: { summary: '获取设备详情', tags: ['device-manager'] },
      put: { summary: '更新设备信息', tags: ['device-manager'] },
      delete: { summary: '删除设备', tags: ['device-manager'] },
    },
    '/api/v1/devices': {
      get: { summary: '查询设备列表', tags: ['device-manager'] },
      post: { summary: '新增设备', tags: ['device-manager'] },
    },
    '/api/v1/user/{id}': {
      get: { summary: '获取用户详情', tags: ['user-manager'] },
    },
    '/api/v1/user/list': {
      get: { summary: '获取用户列表', tags: ['user-manager'] },
    },
    '/api/v1/authenticate': {
      post: { summary: '用户认证' }, // No tags
    },
  },
};

// --- Refs and State ---
const searchText = ref('');
const apiTreeData = ref<any[]>([]);
const allApis = ref<any[]>([]);
const selectedRowKeys = ref<string[]>([]);
const expandedRowKeys = ref<string[]>([]);

// --- Columns and Table ---
const columns = [
    { title: 'API名称', dataIndex: 'summary', key: 'summary', ellipsis: true },
    { title: '请求方式', dataIndex: 'method', key: 'method', width: 120, align: 'center' },
    { title: 'API路径', dataIndex: 'path', key: 'path', ellipsis: true },
];

const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
        case 'GET': return 'blue';
        case 'POST': return 'green';
        case 'PUT': return 'orange';
        case 'DELETE': return 'red';
        default: return 'default';
    }
};

// --- Data Processing ---
const processSwaggerData = (swaggerData: any) => {
    const allApisList: any[] = [];
    const tagsMap = new Map(swaggerData.tags.map((t: any) => [t.name, { ...t, id: t.name, summary: t.description, children: [], isLeaf: false, selectable: false }]));

    for (const path in swaggerData.paths) {
        for (const method in swaggerData.paths[path]) {
            const apiInfo = swaggerData.paths[path][method];
            const tagName = apiInfo.tags?.[0] || 'un-tagged';
            const api = {
                id: `${method.toUpperCase()}:${path}`,
                path: path,
                method: method.toUpperCase(),
                summary: apiInfo.summary || path,
                isLeaf: true,
            };
            allApisList.push(api);
            if (tagsMap.has(tagName)) {
                tagsMap.get(tagName)!.children.push(api);
            }
        }
    }
    allApis.value = allApisList;
    apiTreeData.value = Array.from(tagsMap.values()).filter(tag => tag.children.length > 0);
    expandedRowKeys.value = Array.from(tagsMap.keys()); // Default expand all
};

// --- Search and Filter ---
const filteredTreeData = computed(() => {
    if (!searchText.value) {
        return apiTreeData.value;
    }
    const lowerCaseSearch = searchText.value.toLowerCase();
    const filtered: any[] = [];

    apiTreeData.value.forEach(tag => {
        const matchingChildren = tag.children.filter((api: any) => 
            api.path.toLowerCase().includes(lowerCaseSearch) || 
            api.summary.toLowerCase().includes(lowerCaseSearch)
        );
        if (matchingChildren.length > 0) {
            filtered.push({ ...tag, children: matchingChildren });
        }
    });
    return filtered;
});

// --- Selection Logic ---
const getChildrenKeys = (node: any, keys: string[] = []) => {
    if (node.isLeaf) {
        keys.push(node.id);
    } else if (node.children) {
        node.children.forEach((child: any) => getChildrenKeys(child, keys));
    }
    return keys;
};

const onSelect = (record: any, selected: boolean) => {
    const childKeys = getChildrenKeys(record);
    const currentSelected = new Set(selectedRowKeys.value);
    if (selected) {
        childKeys.forEach(key => currentSelected.add(key));
    } else {
        childKeys.forEach(key => currentSelected.delete(key));
    }
    selectedRowKeys.value = Array.from(currentSelected);
};

const onSelectAll = (selected: boolean) => {
    if (selected) {
        selectedRowKeys.value = allApis.value.map(api => api.id);
    } else {
        selectedRowKeys.value = [];
    }
};

// --- Modal Actions ---
const handleOk = () => {
    const selectedApis = allApis.value
        .filter(api => selectedRowKeys.value.includes(api.id))
        .map(api => ({
            apiPath: api.path,
            requestMethod: api.method,
            rateLimit: '60/m', // default value
            signatureVerificationEnabled: true // default value
        } as ApiInfo));

    emit('select', selectedApis);
    handleCancel();
};

const handleCancel = () => {
    emit('update:visible', false);
};

// --- Lifecycle ---
onMounted(() => {
    // In a real scenario, this would call an API.
    // For now, we use mock data.
    processSwaggerData(mockSwaggerData);
});

</script>
