<template>
  <a-modal :visible="visible" title="添加授权规则" @ok="handleOk" @cancel="handleCancel" width="1000px">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="DEVICE" tab="设备">
        <div class="list-wrapper">
          <pro-search type="simple" :columns="deviceColumns" @search="onDeviceSearch" />
          <j-pro-table
            ref="deviceTableRef"
            modeValue="CARD"
            :columns="deviceColumns"
            :request="queryDevicesApi"
            :params="deviceFinalParams"
            :rowSelection="{ selectedRowKeys: selectedDeviceKeys, onSelect: onSelectDevice, onSelectAll: onSelectAllDevices }"
          >
            <template #card="slotProps">
              <CardBox
                  :value="slotProps"
                  :active="selectedDeviceKeys.includes(slotProps.id)"
                  :show-status="false"
                  :actions="[]"
                  @click="onSelectDevice(slotProps, !selectedDeviceKeys.includes(slotProps.id))"
              >
                  <template #img>
                      <img :src="deviceIcon" />
                  </template>
                  <template #content>
                      <div class="card-item-heard-name">
                          <j-ellipsis>{{ slotProps.name }}</j-ellipsis>
                      </div>
                      <div class="card-item-content-text">
                          ID: {{ slotProps.id }}
                      </div>
                  </template>
              </CardBox>
            </template>
          </j-pro-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="PRODUCT" tab="产品">
        <div class="list-wrapper">
          <pro-search type="simple" :columns="productColumns" @search="onProductSearch" />
          <j-pro-table
            ref="productTableRef"
            modeValue="CARD"
            :columns="productColumns"
            :request="queryProductsApi"
            :params="productFinalParams"
            :rowSelection="{ selectedRowKeys: selectedProductKeys, onSelect: onSelectProduct, onSelectAll: onSelectAllProducts }"
          >
            <template #card="slotProps">
              <CardBox
                  :value="slotProps"
                  :active="selectedProductKeys.includes(slotProps.id)"
                  :show-status="false"
                  :actions="[]"
                  @click="onSelectProduct(slotProps, !selectedProductKeys.includes(slotProps.id))"
              >
                  <template #img>
                      <img :src="productIcon" />
                  </template>
                  <template #content>
                      <div class="card-item-heard-name">
                          <j-ellipsis>{{ slotProps.name }}</j-ellipsis>
                      </div>
                      <div class="card-item-content-text">
                          ID: {{ slotProps.id }}
                      </div>
                  </template>
              </CardBox>
            </template>
          </j-pro-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="ORGANIZATION" tab="组织">
        <div class="list-wrapper">
          <pro-search type="simple" :columns="organizationColumns" @search="onOrganizationSearch" />
          <a-table
              :loading="organizationLoading"
              :columns="organizationColumns"
              :data-source="organizationData"
              :row-selection="{ selectedRowKeys: selectedOrganizationKeys, onSelect: onSelectOrganization, onSelectAll: onSelectAllOrganizations }"
              :pagination="false"
              row-key="id"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="less" scoped>
.list-wrapper {
  height: 600px; // or a calculated height
  overflow-y: auto;
}
</style>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  getDeviceList_api as queryDevicesApi,
  getTreeData_api as queryOrganizationsApi,
  getDeviceProduct_api as queryProductsApi
} from '@/api/system/department';
import { onlyMessage } from '@/utils/comm';
import CardBox from '@/components/CardBox/index.vue';
import deviceIcon from '@/assets/device-product.png';
import productIcon from '@/assets/device-product.png';
import { ArrayToTree } from '@/views/system/Department/util';

const props = defineProps<{ 
    visible: boolean, 
    appId: string,
    mode: 'WHITELIST' | 'BLACKLIST'
}>();
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

const getQueryColumn = (resourceType: 'device' | 'product' | 'organization') => {
    const operator = 'in';
    const dimension = 'open-platform-asset';
    const notFlag = 'not';
    const resource = resourceType.toLowerCase();
    const mode = props.mode.toLowerCase();
    return 'id$' + operator + '-' + dimension + '$' + notFlag + '$' + resource + '$' + mode;
};

const createFinalParams = (searchParams: any, resourceType: 'device' | 'product' | 'organization') => {
    return {
        ...searchParams,
        terms: [
            ...(searchParams.terms || []),
            {
                column: getQueryColumn(resourceType),
                value: props.appId,
                type: 'and'
            }
        ]
    };
};

// Device related
const deviceSearchParams = ref({});
const deviceFinalParams = computed(() => createFinalParams(deviceSearchParams.value, 'device'));
const deviceColumns = [
  { title: '设备名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '设备ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const onDeviceSearch = (e: any) => { deviceSearchParams.value = e; };
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
const productSearchParams = ref({});
const productFinalParams = computed(() => createFinalParams(productSearchParams.value, 'product'));
const productColumns = [
  { title: '产品名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '产品ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const onProductSearch = (e: any) => { productSearchParams.value = e; };
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
const organizationSearchParams = ref({});
const organizationFinalParams = computed(() => createFinalParams(organizationSearchParams.value, 'organization'));
const organizationColumns = [
  { title: '组织名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
  { title: '组织ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
];
const onOrganizationSearch = (e: any) => { organizationSearchParams.value = e; };

const organizationLoading = ref(false);
const organizationData = ref<any[]>([]);

const fetchOrganizations = async () => {
    organizationLoading.value = true;
    try {
        const resp = await queryOrganizationsApi({ ...organizationFinalParams.value, paging: false });
        if (resp.success) {
            organizationData.value = ArrayToTree(resp.result || []);
        } else {
            organizationData.value = [];
        }
    } catch (e) {
        organizationData.value = [];
    } finally {
        organizationLoading.value = false;
    }
};

watch([() => props.visible, organizationFinalParams], () => {
    if (props.visible && activeTab.value === 'ORGANIZATION') {
        fetchOrganizations();
    }
}, { immediate: true, deep: true });

watch(activeTab, (newTab) => {
    if (newTab === 'ORGANIZATION' && props.visible) {
        fetchOrganizations();
    }
});

const onSelectOrganization = (record: any, selected: boolean) => {
  const allRecordsToChange: any[] = [];
  const collectRecords = (node: any) => {
      if (!node) return;
      allRecordsToChange.push(node);
      if (node.children && node.children.length > 0) {
          node.children.forEach(collectRecords);
      }
  };
  collectRecords(record);

  allRecordsToChange.forEach(rec => {
      updateSelectedItems(rec, selected, 'ORGANIZATION');
  });
};

const onSelectAllOrganizations = (selected: boolean) => {
  const allRecords: any[] = [];
  const collectAll = (nodes: any[]) => {
      for (const node of nodes) {
          allRecords.push(node);
          if (node.children) {
              collectAll(node.children);
          }
      }
  };
  collectAll(organizationData.value);

  allRecords.forEach(item => {
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
    deviceSearchParams.value = {};
    productSearchParams.value = {};
    organizationSearchParams.value = {};
  }
});
</script>
