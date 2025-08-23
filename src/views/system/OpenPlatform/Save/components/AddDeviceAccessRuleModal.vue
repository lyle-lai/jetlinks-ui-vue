<template>
  <a-modal :visible="visible" :title="title" @ok="handleOk" @cancel="handleCancel" width="1000px">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="DEVICE" tab="设备">
        <pro-search type="simple" :columns="deviceColumns" @search="onDeviceSearch" />
        <j-pro-table
          ref="deviceTableRef"
          :columns="deviceColumns"
          :request="queryDevices"
          :params="deviceQueryParams"
          :rowSelection="{ selectedRowKeys: selectedDeviceKeys, onSelect: onSelectDevice, onSelectAll: onSelectAllDevices }"
        />
      </a-tab-pane>
      <a-tab-pane key="PRODUCT" tab="产品">
        <pro-search type="simple" :columns="productColumns" @search="onProductSearch" />
        <j-pro-table
          ref="productTableRef"
          :columns="productColumns"
          :request="queryProducts"
          :params="productQueryParams"
          :rowSelection="{ selectedRowKeys: selectedProductKeys, onSelect: onSelectProduct, onSelectAll: onSelectAllProducts }"
        />
      </a-tab-pane>
      <a-tab-pane key="ORGANIZATION" tab="组织">
        <pro-search type="simple" :columns="organizationColumns" @search="onOrganizationSearch" />
        <j-pro-table
          ref="organizationTableRef"
          :columns="organizationColumns"
          :request="queryOrganizations"
          :params="organizationQueryParams"
          :rowSelection="{ selectedRowKeys: selectedOrganizationKeys, onSelect: onSelectOrganization, onSelectAll: onSelectAllOrganizations }"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  getDeviceList_api as queryDevicesApi,
  getTreeData_api as queryOrganizationsApi,
  getDeviceProduct_api as queryProductsApi
} from '@/api/system/department';
import { onlyMessage } from '@/utils/comm';
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['update:visible', 'select']);

const activeTab = ref('DEVICE');

// Helper to manage selected items (full records)
const selectedItemsMap = ref<Map<string, any>>(new Map()); // Stores {id: record}

const updateSelectedItems = (record: any, selected: boolean, type: string) => {
  const key = `${type}-${record.id}`; // Unique key for map
  if (selected) {
    selectedItemsMap.value.set(key, { ...record, type });
  } else {
    selectedItemsMap.value.delete(key);
  }
};

const getSelectedKeysForTab = (type: string) => {
  const keys: string[] = [];
  selectedItemsMap.value.forEach((value, key) => {
    if (key.startsWith(`${type}-`)) {
      keys.push(value.id);
    }
  });
  return keys;
};

// Device related
const deviceQueryParams = ref({});
const deviceColumns = [
  { title: '设备名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '设备ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const queryDevices = async (params: any) => {
  const resp = await queryDevicesApi(params);
  return resp;
};
const onDeviceSearch = (e: any) => { deviceQueryParams.value = e; };
const onSelectDevice = (record: any, selected: boolean) => {
  updateSelectedItems(record, selected, 'DEVICE');
};
const onSelectAllDevices = (selected: boolean, _: any[], changeRows: any) => {
  changeRows.forEach((item: any) => {
    updateSelectedItems(item, selected, 'DEVICE');
  });
};
const selectedDeviceKeys = computed(() => getSelectedKeysForTab('DEVICE'));


// Product related
const productQueryParams = ref({});
const productColumns = [
  { title: '产品名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '产品ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const queryProducts = async (params: any) => {
  const resp = await queryProductsApi(params);
  return resp;
};
const onProductSearch = (e: any) => { productQueryParams.value = e; };
const onSelectProduct = (record: any, selected: boolean) => {
  updateSelectedItems(record, selected, 'PRODUCT');
};
const onSelectAllProducts = (selected: boolean, _: any[], changeRows: any) => {
  changeRows.forEach((item: any) => {
    updateSelectedItems(item, selected, 'PRODUCT');
  });
};
const selectedProductKeys = computed(() => getSelectedKeysForTab('PRODUCT'));


// Organization related
const organizationQueryParams = ref({});
const organizationColumns = [
  { title: '组织名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '组织ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const queryOrganizations = async (params: any) => {
  const resp = await queryOrganizationsApi({ ...params, paging: false });
  if (resp.success) {
    return {
      result: {
        data: resp.result,
        pageIndex: 0,
        pageSize: resp.result.length,
        total: resp.result.length,
      }
    };
  }
  return { result: { data: [], pageIndex: 0, pageSize: 0, total: 0 } };
};
const onOrganizationSearch = (e: any) => { organizationQueryParams.value = e; };
const onSelectOrganization = (record: any, selected: boolean) => {
  updateSelectedItems(record, selected, 'ORGANIZATION');
};
const onSelectAllOrganizations = (selected: boolean, _: any[], changeRows: any) => {
  changeRows.forEach((item: any) => {
    updateSelectedItems(item, selected, 'ORGANIZATION');
  });
};
const selectedOrganizationKeys = computed(() => getSelectedKeysForTab('ORGANIZATION'));


const handleOk = () => {
  const selectedRules: any[] = Array.from(selectedItemsMap.value.values());

  if (selectedRules.length === 0) {
    onlyMessage('请选择至少一个授权规则', 'warning');
    return;
  }
  emit('select', selectedRules);
  handleCancel();
};

const handleCancel = () => {
  emit('update:visible', false);
  selectedItemsMap.value.clear(); // Clear all selections
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    activeTab.value = 'DEVICE';
    selectedItemsMap.value.clear();
    deviceQueryParams.value = {};
    productQueryParams.value = {};
    organizationQueryParams.value = {};
  }
});
</script>
