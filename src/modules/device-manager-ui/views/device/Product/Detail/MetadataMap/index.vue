<template>
    <div class="metadata-map">
        <div class="left">
          <a-space style="margin-bottom: 24px">
                <a-select @change="onSearchChange" show-search allow-clear :placeholder="$t('MetadataMap.index.130045-0')" style="width: 250px;">
                    <a-select-option :label="item.name" v-for="item in dataSourceCache" :value="item?.id" :key="item?.id">{{item?.name}}</a-select-option>
                </a-select>
                <a-button type="primary" @click="onSearch"><AIcon type="SearchOutlined" /></a-button>
            </a-space>
            <div class="box">
                <j-scrollbar height="100%">
                    <a-table
                        :columns="columns"
                        :data-source="dataSource"
                        :pagination="false"
                        :rowSelection="{
                            selectedRowKeys: selectedKeys,
                            hideSelectAll: true,
                            columnWidth: 0,
                        }"
                        rowKey="id"
                        :customRow="customRow"
                    >
                        <template #headerCell="{ column }">
                            <template v-if="column.dataIndex === 'plugin'">
                                <div
                                    style="
                                        width: 100%;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                    "
                                >
                                    <span>
                                        {{ $t('MetadataMap.index.130045-1') }}<a-tooltip
                                            :title="$t('MetadataMap.index.130045-2')"
                                        >
                                            <AIcon
                                                style="margin-left: 10px"
                                                type="QuestionCircleOutlined"
                                            />
                                        </a-tooltip>
                                    </span>
                                    <a-tag
                                        v-if="filterValue !== undefined"
                                        color="#87d068"
                                        closable
                                        @close="onClose"
                                        ><AIcon
                                            type="ArrowUpOutlined"
                                        /><span>{{
                                            filterValue ? $t('MetadataMap.index.130045-3') : $t('MetadataMap.index.130045-4')
                                        }}</span></a-tag
                                    >

                                </div>
                            </template>
                          <template v-if="column.dataIndex === 'transformation'">
                            <div
                                style="
                                width: 100%;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;"
                            >
                              <span>{{ column.title }}</span>
                              <a-dropdown>
                                <AIcon type="FilterOutlined" />
                                <template #overlay>
                                  <a-menu @click="onFilter">
                                    <a-menu-item :key="true"
                                    >{{ $t('MetadataMap.index.130045-5') }}</a-menu-item
                                    >
                                    <a-menu-item :key="false"
                                    >{{ $t('MetadataMap.index.130045-6') }}</a-menu-item
                                    >
                                  </a-menu>
                                </template>
                              </a-dropdown>
                            </div>
                          </template>

                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'name'">
                                <span class="metadata-title">
                                    <j-ellipsis>
                                        {{ text }} ({{ record.id }})
                                    </j-ellipsis>
                                </span>
                            </template>
                            <template v-if="column.dataIndex === 'plugin'">
                                <a-select
                                    v-model:value="record.plugin"
                                    style="width: 100%"
                                    allowClear
                                    @change="(id) => pluginChange(record, id)"
                                >
<!--                                  :disabled="
                                            selectedPluginKeys.includes(item.id)
                                        "-->
                                    <a-select-option
                                        v-for="(item, index) in pluginOptions"
                                        :key="index + '_' + item.id"
                                        :value="item.value"
                                        >
<!--                                      <a-tooltip-->
<!--                                            :title="-->
<!--                                                selectedPluginKeys.includes(-->
<!--                                                    item.id,-->
<!--                                                )-->
<!--                                                    ? $t('MetadataMap.index.130045-7')-->
<!--                                                    : ''-->
<!--                                            "-->
<!--                                        >-->
                                            {{ item.label }} ({{ item.id }})
<!--                                        </a-tooltip>-->
                                    </a-select-option
                                    >
                                </a-select>
                            </template>
                        </template>
                      <template #transformationRender="{ record }">
                        <a-button type="text" @click="openTransformationModal(record)">
                          {{ $t('MetadataMap.index.130045-29') }}
                        </a-button>
                      </template>
                    </a-table>
                </j-scrollbar>
            </div>
        </div>

        <!-- 值转换配置模态框 -->
        <a-modal
            v-model:visible="transformationModalVisible"
            :title="$t('MetadataMap.index.130045-28')"
            :footer="null"
            destroyOnClose
        >
            <a-tabs v-model:activeKey="transformationType" @change="handleTransformationTypeChange">
                <a-tab-pane :tab="$t('MetadataMap.index.130045-31')" key="mapping">
                    <div class="mapping-container">
                        <a-table
                            :columns="mappingColumns"
                            :data-source="mappingRules"
                            :pagination="false"
                            bordered
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.dataIndex === 'source'">
                                    <a-input v-model:value="record.source" :placeholder=" $t('MetadataMap.index.130045-33') " />
                                </template>
                                <template v-if="column.dataIndex === 'target'">
                                    <a-input v-model:value="record.target" :placeholder=" $t('MetadataMap.index.130045-35') " />
                                </template>
                                <template v-if="column.dataIndex === 'action'">
                                    <a-button
                                        type="text"
                                        danger
                                        @click="removeMappingRule(index)"
                                        :disabled="mappingRules.length <= 1"
                                    >
                                        <DeleteOutlined /> {{ $t('MetadataMap.index.130045-41') }}
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                        <a-button
                            type="dashed"
                            style="width: 100%; margin-top: 16px"
                            @click="addMappingRule"
                        >
                            <plus-outlined /> {{ $t('MetadataMap.index.130045-36') }}
                        </a-button>
                    </div>
                </a-tab-pane>
                <a-tab-pane :tab="$t('MetadataMap.index.130045-32')" key="math">
                    <a-textarea
                        v-model:value="mathExpression"
                        :rows="4"
                        :placeholder="$t('MetadataMap.index.130045-37')"
                    />
                    <div class="math-example">
                        <p>{{ $t('MetadataMap.index.130045-38') }}</p>
                    </div>
                </a-tab-pane>
            </a-tabs>
            <div class="modal-footer" style="margin-top: 24px; text-align: right">
                <a-button @click="transformationModalVisible = false">{{ $t('MetadataMap.index.130045-39') }}</a-button>
                <a-button type="primary" @click="saveTransformationConfig">{{ $t('MetadataMap.index.130045-40') }}</a-button>
            </div>
        </a-modal>
        <div class="right">
            <j-scrollbar>
                <div class="title">{{ $t('MetadataMap.index.130045-8') }}</div>
                <p>
                    {{ $t('MetadataMap.index.130045-9') }}
                    <b>{{ $t('MetadataMap.index.130045-10') }}</b>{{ $t('MetadataMap.index.130045-11') }}
                    <b>{{ $t('MetadataMap.index.130045-12') }}</b
                    >{{ $t('MetadataMap.index.130045-13') }}
                    <b>{{ $t('MetadataMap.index.130045-14') }}</b>{{ $t('MetadataMap.index.130045-15') }}<b>{{ $t('MetadataMap.index.130045-16') }}</b>{{ $t('MetadataMap.index.130045-17') }}
                </p>
                <p>
                    {{ $t('MetadataMap.index.130045-18') }}
                </p>
                <p>
                    {{ $t('MetadataMap.index.130045-19') }}<b>{{ $t('MetadataMap.index.130045-20') }}</b>{{ $t('MetadataMap.index.130045-21') }}<b>{{ $t('MetadataMap.index.130045-22') }}</b>{{ $t('MetadataMap.index.130045-23') }}
                </p>
                <div class="title">{{ $t('MetadataMap.index.130045-24') }}</div>
                <div>
                    <img :src="device.metadataMap" />
                </div>
            </j-scrollbar>
        </div>
    </div>
</template>

<script setup lang='ts' name='MetadataMap'>
import { storeToRefs } from 'pinia';
import { device } from '../../../../../assets';
import { useProductStore } from '../../../../../store/product';
import { detail as queryPluginAccessDetail } from '../../../../../api/link/accessConfig';
import { getPluginData, getProductByPluginId } from '../../../../../api/link/plugin';
import { onlyMessage } from '@/utils/comm';
import { getMetadataMapById, metadataMapById, getProtocolMetadata } from '../../../../../api/instance';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { create, all } from 'mathjs';

const { t: $t } = useI18n();
const math = create(all);

const productStore = useProductStore();
const { current: productDetail } = storeToRefs(productStore);
const dataSourceCache = ref([]);
const dataSource = ref([]);
const pluginOptions = ref<any[]>([]);

const filterValue = ref<boolean | undefined>(undefined);
const originalData = ref([]);
const searchValue = ref<any>(undefined);
const _delTag = ref<boolean>(false);

// const tableFilter = (value: string, record: any) => {
//   return true
// }

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Modal, Tabs, TabPane, Form, Input, Button, Table, Space, message } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';


const mappingColumns = [
  {
    title: $t('MetadataMap.index.130045-33'),
    dataIndex: 'source',
    key: 'source',
    width: '35%',
  },
  {
    title: $t('MetadataMap.index.130045-35'),
    dataIndex: 'target',
    key: 'target',
    width: '35%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '20%',
  },
];

const columns = [
    {
        title: $t('MetadataMap.index.130045-25'),
        dataIndex: 'index',
        width: 100,
    },
    {
        title: $t('MetadataMap.index.130045-26'),
        dataIndex: 'name',
    },
    {
            title: $t('MetadataMap.index.130045-1'),
            dataIndex: 'plugin',
            width: 250,
            // sorter: tableFilter
        },
        {
          title: $t('MetadataMap.index.130045-28'),
          dataIndex: 'transformation',
          width: 180,
          slots: { customRender: 'transformationRender' } // Vue 3 用 slots
        }
];

const _value = ref<any>(undefined);
const transformationModalVisible = ref(false);
const currentRecord = ref<any>(null);
const transformationType = ref('mapping');
const mappingRules = ref([{ source: '', target: '' }]);
const mathExpression = ref('');

const transformationModal = ref<any>(null);

const handleTransformationTypeChange = (key: string) => {
    transformationType.value = key;
};

const openTransformationModal = (record: any) => {
  currentRecord.value = record;
  // 加载已保存的转换配置
  if (record.transformationConfig) {
    if (record.transformationConfig.type === 'mapping') {
      transformationType.value = 'mapping';
      mappingRules.value = record.transformationConfig.rules || [{ source: '', target: '' }];
      mathExpression.value = '';
    } else {
      transformationType.value = 'math';
      mathExpression.value = record.transformationConfig.expression || '';
      mappingRules.value = [{ source: '', target: '' }];
    }
  } else {
    // 默认值
    transformationType.value = 'mapping';
    mappingRules.value = [{ source: '', target: '' }];
    mathExpression.value = '';
  }
  transformationModalVisible.value = true;
};

const addMappingRule = () => {
  mappingRules.value.push({ source: '', target: '' });
};

const removeMappingRule = (index: number) => {
  mappingRules.value.splice(index, 1);
  if (mappingRules.value.length === 0) {
    mappingRules.value.push({ source: '', target: '' });
  }
};

const saveTransformationConfig = () => {
  if (!currentRecord.value) return;

  // 数学公式验证
  if (transformationType.value === 'math') {
    const { valid, message: errorMessage } = validateMathExpression(mathExpression.value);
    if (!valid) {
      message.error(errorMessage);
      return;
    }
  }

  const config = transformationType.value === 'mapping'
    ? { type: 'mapping', rules: mappingRules.value }
    : { type: 'math', expression: mathExpression.value };

  // 保存到记录中
  currentRecord.value.transformationConfig = config;

  // 构造包含转换规则的API请求参数
  const arr = [
    {
      metadataType: 'property',
      metadataId: currentRecord.value.id,
      originalId: currentRecord.value.plugin,
      others: { transformationConfig: config } // 添加到others字段
    }
  ];

  // 调用现有API保存方法
  onMapData(arr, true);

  transformationModalVisible.value = false;
};

const selectedKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item) => !!item?.plugin)
            .map((item) => item.id) || []
    );
});

const selectedPluginKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item) => !!item?.plugin)
            .map((item) => item.plugin) || []
    );
});

const getMetadataMapData = () => {
    return new Promise((resolve) => {
      if(productDetail.value?.id){
        getMetadataMapById('product', productDetail.value?.id).then((res) => {
          if (res.success) {
            resolve(
                res.result
                    ?.filter((item) => item.customMapping)
                    ?.map((item) => {
                      return {
                        id: item.metadataId,
                        pluginId: item.originalId,
                        customMapping: item?.customMapping,
                        others: item.others
                      };
                    }) || [],
            );
          }
        });
      } else {
        resolve([])
      }
    });
};

// 添加公式验证函数
const validateMathExpression = (expression) => {
  // 支持表达式为空
  if (!expression.trim()) {
    return { valid: true};
  }
  try {
    // 检查表达式语法是否有效
    const node = math.parse(expression);

    const variables = new Set();

    // 遍历AST收集所有变量
    node.traverse((n) => {
      if (n.type === 'SymbolNode') {
        variables.add(n.name);
      }
    });

    // 检查是否只包含变量x
    if (variables.size > 0) {
      if (!variables.has('x') || variables.size > 1) {
        return {
          valid: false,
          message: $t('MetadataMap.index.130045-43') // 需要添加国际化消息: "表达式只能包含变量x"
        };
      }
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      message: $t('MetadataMap.index.130045-43') + error.message
    };
  }
};

const customRow = (record: any) => {
    return {
        id: record.id,
        class: _value.value === record?.name ? 'metadata-search-row' : '',
    };
};
const onSearchChange = (_: any, options: any) => {
    searchValue.value = options?.label
}

const onSearch = () => {
    if (searchValue.value) {
        const _item: any = dataSourceCache.value.find((item: any) => {
            return searchValue.value === item?.name;
        });
        if(_item) {
          _value.value = _item?.name;
          document.getElementById(_item?.id)?.scrollIntoView(); // 滚动到可视区域
        }

    } else {
        _value.value = undefined;
    }
};

const getDefaultMetadata = async () => {
    const metadata = JSON.parse(productDetail.value?.metadata || '{}');
    const properties = metadata.properties;
    const pluginMetadata = await getMetadata();
    const pluginProperties = pluginMetadata?.properties || [];
    const metadataMap: any = await getMetadataMapData();
    pluginOptions.value = pluginProperties.map((item) => ({
        ...item,
        label: item?.name,
        value: item.id,
    }));

    // const concatProperties = [ ...pluginProperties.map(item => ({ id: item.id, pluginId: item.id})), ...metadataMap]
    const concatProperties = [...metadataMap];
    if(!concatProperties.length) {
        _delTag.value = true
        const arr = concatProperties.map((item) => item.id);
        const _arr = concatProperties.map((item) => item.pluginId);

        pluginProperties.map((item) => {
            // 添加默认映射，但是该选项还没被其他属性映射
            if (!arr.includes(item.id) && !_arr.includes(item.id)) {
                concatProperties.push({ id: item.id, pluginId: item.id, customMapping: item?.customMapping, });
            }
        });
    }
    dataSource.value =
        properties?.map((item: any, index: number) => {
            const _m = concatProperties.find((p) => p.id === item.id);
            return {
                index: index + 1,
                id: item.id, // 产品物模型id
                name: item?.name,
                type: item.valueType?.type,
                customMapping: _m?.customMapping,
                plugin: _m?.pluginId, // 插件物模型id
                transformationConfig: _m?.others?.transformationConfig
            };
        }) || [];
    dataSourceCache.value = dataSource.value;
};

const getPluginMetadata = (): Promise<{ properties: any[] }> => {
    return new Promise((resolve) => {
        queryPluginAccessDetail(productDetail.value?.accessId!).then(
            async (res) => {
                if (res.success) {
                    const _channelId = (res.result as any)!.channelId;
                    const pluginRes = await getPluginData(
                        'product',
                        productDetail.value?.accessId || '',
                        productDetail.value?.id,
                    ).catch(() => ({ success: false, result: {} }));
                    const resp = await getProductByPluginId(_channelId).catch(
                        () => ({ success: false, result: [] }),
                    );
                    if (resp.success) {
                        const _item = (resp.result as any[])?.find(
                            (item: any) =>
                                item.id ===
                                (pluginRes?.result as any)?.externalId,
                        );

                        resolve(_item ? _item.metadata : { properties: [] });
                    }
                }
                resolve({ properties: [] });
            },
        );
    });
};
const getMetadata = (): Promise<{ properties: any[] }> => {
    return new Promise((resolve) => {
        const transport = productDetail.value?.transportProtocol;
        getProtocolMetadata(productDetail.value?.messageProtocol || '', transport).then(
            (res: any) => {
                if (res.success) {
                    resolve(JSON.parse(res?.result || '{}'));
                }
                resolve({ properties: [] });
            },
        );
    });
};

const onMapData = async (arr: any[], flag?: boolean) => {
    const res = await metadataMapById('product', productDetail.value?.id, arr);
    if (res.success && flag) {
        onlyMessage($t('MetadataMap.index.130045-27'));
    }
};

const pluginChange = async (value: any, id: string) => {
    if ((!id && value?.customMapping) || id) {
        // 映射 / 取消映射
        const arr = [
            {
                metadataType: 'property',
                metadataId: value.id,
                originalId: id,
            },
        ];
        onMapData(arr, true)
    }
};

const onFilter = ({ key }: any) => {
    originalData.value = dataSource.value;
    const _dataSource = cloneDeep(dataSource.value).sort((a: any, b: any) => {
        if (!key) {
            return (a.plugin ? 1 : -1) - (b.plugin ? 1 : -1);
        } else {
            return (b.plugin ? 1 : -1) - (a.plugin ? 1 : -1);
        }
    });

    dataSource.value = _dataSource;
    filterValue.value = key;
};

const onClose = () => {
    filterValue.value = undefined;
    dataSource.value = originalData.value;
};

onMounted(() => {
    getDefaultMetadata();
});

onUnmounted(() => {
    if (_delTag.value && dataSourceCache.value.length) {
        // 保存数据.filter((i: any) => i?.plugin)
        const arr = dataSourceCache.value.map((item: any) => {
            return {
                metadataType: 'property',
                metadataId: item.id,
                originalId: item.plugin || null,
            }
        })
        onMapData(arr)
    }
});
</script>

<style scoped lang='less'>
.metadata-map {
    // position: relative;
    min-height: 100%;
    display: flex;
    gap: 24px;

    .left {
        // margin-right: 44px;
        flex: 1;

        .box {
            height: calc(100vh - 392px);
            overflow: hidden;

            :deep(.metadata-search-row) {
                td {
                    background: #ffff80 !important;
                }
            }
        }
    }

    .right {
        // position: absolute;
        border: 1px solid rgba(0, 0, 0, 0.08);
        min-height: 100%;
        min-width: 410px;
        width: 33.33333%;
        // top: 0;
        // right: 0;
        padding: 16px;

        .title {
            margin-bottom: 16px;
            color: rgba(#000, 0.85);
            font-weight: bold;

            p {
                initial-letter: 28px;
                color: #666666;
            }
        }
    }

    .metadata-title {
    color: #666666;
}

.mapping-container {
    margin-bottom: 16px;
}

.math-example {
    margin-top: 8px;
    color: #666;
    font-size: 12px;
}

.arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
}

    :deep(.ant-table-selection-column) {
        padding: 0;
        label {
            display: none;
        }
    }
}
</style>