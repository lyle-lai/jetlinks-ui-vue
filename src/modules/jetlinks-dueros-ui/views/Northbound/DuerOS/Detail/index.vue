<template>
  <div v-show="typeof noData === 'boolean'">
    <div class="box" v-if="!noData">
      <div class="left">
        <div class="left-content">
          <TitleComponent :data="$t('Detail.index.670916-0')"/>
          <a-alert
              v-if="_error && modelRef?.id"
              style="margin: 10px 0"
              type="warning"
          >
            <template #message>
              <div
                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                "
              >
                                <span
                                    style="
                                        width: calc(100% - 100px);
                                        text-align: center;
                                    "
                                >{{ _error }}</span
                                >
                <j-permission-button
                    :popConfirm="{
                                        title: $t('Detail.index.670916-1'),
                                        onConfirm: onActiveProduct,
                                    }"
                    size="small"
                    :hasPermission="'device/Product:action'"
                >
                  {{ $t('Detail.index.670916-2') }}
                </j-permission-button>
              </div>
            </template>
          </a-alert>
          <a-form
              :layout="'vertical'"
              ref="formRef"
              :model="modelRef"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item
                    :label="$t('Detail.index.670916-3')"
                    name="name"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.670916-4'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Detail.index.670916-5'),
                                        },
                                    ]"
                >
                  <a-input
                      :placeholder="$t('Detail.index.670916-4')"
                      v-model:value="modelRef.name"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Detail.index.670916-6')"
                    name="id"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.670916-7'),
                                        },
                                        {
                                            validator: _validator,
                                            trigger: 'change',
                                        },
                                    ]"
                >
                  <MSelect
                      v-model:value="modelRef.id"
                      :options="productList"
                      @change="productChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    name="applianceType"
                    :rules="{
                                        required: true,
                                        message: $t('Detail.index.670916-8'),
                                    }"
                >
                  <template #label>
                                        <span>
                                            {{ $t('Detail.index.670916-9') }}
                                            <a-tooltip
                                                :title="$t('Detail.index.670916-10')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                  </template>
                  <a-select
                      :placeholder="$t('Detail.index.670916-8')"
                      v-model:value="modelRef.applianceType"
                      show-search
                      optionFilterProp="label"
                      @change="typeChange"
                  >
                    <a-select-option
                        v-for="item in typeList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    >{{ item.name }}
                    </a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item
                    name="productName"
                    v-show="false"
                    :label="$t('Detail.index.670916-11')"
                >
                  <a-input
                      v-model:value="modelRef.productName"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <p>{{ $t('Detail.index.670916-12') }}</p>
                <a-collapse
                    v-if="modelRef.actionMappings.length"
                    :activeKey="actionActiveKey"
                    @change="onActionCollChange"
                >
                  <a-collapse-panel
                      v-for="(
                                            item, index
                                        ) in modelRef.actionMappings"
                      :key="index"
                      :header="
                                            item.action
                                                ? findApplianceType.actions.find(
                                                      (i) =>
                                                          i.id === (item.action.value || item.action),
                                                  )?.name
                                                : `${ $t('Detail.index.670916-12')}${index + 1}`
                                        "
                  >
                    <template #extra>
                      <div
                          style="width: 20px"
                          @click.stop
                      >
                        <ConfirmModal
                            :title="$t('Detail.index.670916-14')"
                            :onConfirm="
                                                        () => delItem(index)
                                                    "
                        >
                          <AIcon
                              type="DeleteOutlined"
                          />
                        </ConfirmModal>
                      </div>
                    </template>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item
                            :name="[
                                                        'actionMappings',
                                                        index,
                                                        'action',
                                                    ]"
                            :rules="{
                                                        required: true,
                                                        message: $t('Detail.index.670916-15'),
                                                    }"
                        >
                          <template #label>
                                                        <span>
                                                            {{ $t('Detail.index.670916-16') }}
                                                            <a-tooltip
                                                                :title="$t('Detail.index.670916-17')"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </a-tooltip>
                                                        </span>
                          </template>
                          <a-select
                              :placeholder="$t('Detail.index.670916-15')"
                              v-model:value="
                                                            item.action
                                                        "
                              show-search
                              optionFilterProp="label"
                          >
                            <a-select-option
                                v-for="i in getTypesActions(
                                                                item.action ||
                                                                    '',
                                                            )"
                                :key="i.id"
                                :value="i.id"
                                :label="i.name"
                            >{{
                                i.name
                              }}
                            </a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item
                            :name="[
                                                        'actionMappings',
                                                        index,
                                                        'actionType',
                                                    ]"
                            :rules="{
                                                        required: true,
                                                        message: $t('Detail.index.670916-18'),
                                                    }"
                        >
                          <template #label>
                                                        <span>
                                                            {{ $t('Detail.index.670916-19') }}
                                                            <a-tooltip
                                                                :title="$t('Detail.index.670916-20')"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </a-tooltip>
                                                        </span>
                          </template>
                          <a-select
                              :placeholder="$t('Detail.index.670916-18')"
                              v-model:value="
                                                            item.actionType
                                                        "
                              show-search
                              :options="[
                                { label: $t('Detail.index.670916-21'), value: 'command' },
                                { label: $t('Detail.index.670916-22'), value: 'latestData' },
                              ]"
                              optionFilterProp="label"
                              @change="
                                                            () =>
                                                                onActionTypeChange(
                                                                    index,
                                                                )
                                                        "
                          >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col
                          :span="24"
                          v-if="item.actionType"
                      >
                        <a-form-item
                            :name="[
                                                        'actionMappings',
                                                        index,
                                                        'command',
                                                    ]"
                        >
                          <Command
                              ref="command"
                              :metadata="
                                                            findProductMetadata
                                                        "
                              v-model:modelValue="
                                                            item.command
                                                        "
                              :actionType="
                                                            item.actionType
                                                        "
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-collapse-panel>
                </a-collapse>
                <a-card v-else>
                  <a-empty/>
                </a-card>
              </a-col>
              <a-col :span="24">
                <a-button
                    type="dashed"
                    style="width: 100%; margin-top: 10px"
                    @click="addItem"
                >
                  <AIcon
                      type="PlusOutlined"
                      style="margin-left: 2px"
                  />
                  {{ $t('Detail.index.670916-23') }}
                </a-button>
              </a-col>
              <a-col :span="24">
                <p style="margin-top: 20px">{{ $t('Detail.index.670916-24') }}</p>
                <a-collapse
                    v-if="modelRef.propertyMappings.length"
                    :activeKey="propertyActiveKey"
                    @change="onPropertyCollChange"
                >
                  <a-collapse-panel
                      v-for="(
                                            item, index
                                        ) in modelRef.propertyMappings"
                      :key="index"
                      :header="
                                            item.source
                                                ? findApplianceType?.properties.find(
                                                      (i) =>
                                                          i.id === (item.source.value || item.source),
                                                  )?.name
                                                : `${ $t('Detail.index.670916-24') }${index + 1}`
                                        "
                  >
                    <template #extra>
                      <div
                          style="width: 20px"
                          @click.stop
                      >
                        <ConfirmModal
                            :title="$t('Detail.index.670916-14')"
                            :onConfirm="
                                                        () =>
                                                            delPropertyItem(
                                                                index,
                                                            )
                                                    "
                        >
                          <AIcon
                              type="DeleteOutlined"
                          />
                        </ConfirmModal>
                      </div>
                    </template>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item
                            :label="$t('Detail.index.670916-26')"
                            :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'source',
                                                    ]"
                            :rules="{
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.670916-27'),
                                                    }"
                        >
                          <a-select
                              :placeholder="$t('Detail.index.670916-27')"
                              v-model:value="
                                                            item.source
                                                        "
                              show-search
                              optionFilterProp="label"
                          >
                            <a-select-option
                                v-for="i in getDuerOSProperties(
                                                                item.source ||
                                                                    '',
                                                            )"
                                :key="i.id"
                                :value="i.id"
                            >{{
                                i.name
                              }}
                            </a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item
                            :label="$t('Detail.index.670916-28')"
                            :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'target',
                                                    ]"
                            :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.670916-29'),
                                                        },
                                                    ]"
                        >
                          <MSelect
                              v-model:value="
                                                            item.target
                                                        "
                              type="target"
                              :options="
                                                            getProductProperties(
                                                                item.target,
                                                            )
                                                        "
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-collapse-panel>
                </a-collapse>
                <a-card v-else>
                  <a-empty/>
                </a-card>
              </a-col>
              <a-col :span="24">
                <a-button
                    type="dashed"
                    style="width: 100%; margin-top: 10px"
                    @click="addPropertyItem"
                >
                  <AIcon
                      type="PlusOutlined"
                      style="margin-left: 2px"
                  />
                  {{ $t('Detail.index.670916-30') }}
                </a-button>
              </a-col>
              <a-col :span="24" style="margin-top: 20px">
                <a-form-item
                    :label="$t('Detail.index.670916-31')"
                    name="description"
                    :rules="{
                                        max: 200,
                                        message: $t('Detail.index.670916-32'),
                                    }"
                >
                  <a-textarea
                      v-model:value="modelRef.description"
                      :placeholder="$t('Detail.index.670916-33')"
                      showCount
                      :maxlength="200"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <div class="right">
        <Doc/>
      </div>
      <div class="control">
        <a-space>
          <j-permission-button
              v-if="data?.id"
              hasPermission="Northbound/DuerOS:delete"
              danger
              :disabled="data?.state?.value !== 'disabled'"
              :tooltip="{
                            title:
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.670916-34')
                                    : $t('Detail.index.670916-35'),
                        }"
              :popConfirm="{
                            title: $t('Detail.index.670916-36'),
                            onConfirm: deleteData,
                        }"
          >{{ $t('Detail.index.670916-35') }}
          </j-permission-button>
          <j-permission-button
              v-if="data?.id"
              type="primary"
              ghost
              hasPermission="Northbound/DuerOS:action"
              :tooltip="{
                            title:
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.670916-37')
                                    : $t('Detail.index.670916-38'),
                        }"
              :popConfirm="{
                            title: `确认${
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.670916-37')
                                    : $t('Detail.index.670916-38')
                            }?`,
                            onConfirm: actionDuerOS,
                        }"
          >{{
              data?.state?.value !== 'disabled' ? $t('Detail.index.670916-37') : $t('Detail.index.670916-38')
            }}
          </j-permission-button>
          <j-permission-button
              type="primary"
              :loading="loading"
              @click="saveBtn"
              :hasPermission="[
                            'Northbound/DuerOS:add',
                            'Northbound/DuerOS:update',
                        ]"
          >
            {{ $t('Detail.index.670916-40') }}
          </j-permission-button>
        </a-space>
      </div>
    </div>
    <a-empty
        v-else
        style="height: calc(100vh - 300px); padding-top: 200px"
    ></a-empty>
  </div>
</template>

<script lang="ts" setup>
import Doc from './doc.vue';
import Command from './command/index.vue';
import {
  queryProductList,
  queryTypes,
  savePatch,
  detail,
  _undeploy,
  _deploy,
  _delete,
} from '../../../../api/dueros';
import _, {cloneDeep} from 'lodash-es';
import {onlyMessage} from '@jetlinks-web/utils'
import MSelect from '../../components/MSelect/index.vue';
import {_deploy as deploy} from '../../../../api/others';
import ConfirmModal from "../../components/ConfirmModal/index.vue";
import {useI18n} from 'vue-i18n'

const {t: $t} = useI18n()
const props = defineProps({
  data: {
    type: Object,
  },
});
const emit = defineEmits(['refreshList']);

const formRef = ref();
const noData = ref(true);
const modelRef = reactive({
  id: undefined,
  name: undefined,
  applianceType: undefined,
  productName: undefined,
  actionMappings: [
    {
      actionType: undefined,
      action: undefined,
      command: {
        messageType: undefined,
        message: {
          properties: undefined,
          functionId: undefined,
          inputs: [],
        },
      },
    },
  ],
  propertyMappings: [
    {
      source: undefined,
      target: undefined,
    },
  ],
  description: undefined,
});

const productList = ref<Record<string, any>[]>([]);
const typeList = ref<Record<string, any>[]>([]);
const command = ref([]);
const loading = ref<boolean>(false);
const actionActiveKey = ref<string[]>(['0']);
const propertyActiveKey = ref<string[]>(['0']);

const _error = ref<string>('');

const onPropertyCollChange = (_key: string[]) => {
  propertyActiveKey.value = _key;
};

const onActionCollChange = (_key: string[]) => {
  actionActiveKey.value = _key;
};

const onActionTypeChange = (_index: number) => {
  modelRef.actionMappings[_index].command = {
    messageType: undefined,
    message: {
      properties: undefined,
      functionId: undefined,
      inputs: [],
      value: undefined,
    },
  };
};

const addItem = () => {
  actionActiveKey.value.push(String(modelRef.actionMappings.length));
  modelRef.actionMappings.push({
    actionType: undefined,
    action: undefined,
    command: {
      messageType: undefined,
      message: {
        properties: undefined,
        functionId: undefined,
        inputs: [],
      },
    },
  });
};

const delItem = (index: number) => {
  modelRef.actionMappings.splice(index, 1);
  if (!modelRef.actionMappings.length) {
    addItem();
  }
};

const addPropertyItem = () => {
  propertyActiveKey.value.push(String(modelRef.propertyMappings.length));
  modelRef.propertyMappings.push({
    source: undefined,
    target: undefined,
  });
};

const delPropertyItem = (index: number) => {
  modelRef.propertyMappings.splice(index, 1);
  if (!modelRef.propertyMappings.length) {
    addPropertyItem();
  }
};

const productChange = (value: string) => {
  modelRef.propertyMappings = modelRef.propertyMappings?.map((item) => {
    return {source: item.source, target: undefined};
  });
  modelRef.actionMappings = modelRef.actionMappings?.map((item) => {
    return {
      ...item,
      command: {
        messageType: undefined,
        message: {
          properties: undefined,
          functionId: undefined,
          inputs: [],
          value: undefined,
        },
      },
    };
  });
  const item = productList.value.find((item) => item.id === value);
  if (item) {
    modelRef.productName = item.name;
  }
};

const typeChange = () => {
  modelRef.propertyMappings = modelRef.propertyMappings?.map((item) => {
    return {source: undefined, target: item.target};
  });
  modelRef.actionMappings = modelRef.actionMappings?.map((item) => {
    return {...item, action: undefined};
  });
};

const findApplianceType = computed(() => {
  if (!modelRef.applianceType) return;
  return typeList.value.find((item) => item.id === modelRef.applianceType);
});

const findProduct = computed(() => {
  if (!modelRef.id) return;
  const _product = productList.value?.find(
      (item: any) => item.id === modelRef.id,
  );
  return _product;
});

const findProductMetadata = computed(() => {
  if (!modelRef.id) return;
  return (
      findProduct.value?.metadata &&
      JSON.parse(findProduct.value?.metadata || '{}')
  );
});

// 查询产品列表
const getProduct = async (id?: string) => {
  const resp = await queryProductList(id);
  if (resp.status === 200) {
    productList.value = resp?.result as Record<string, any>[];
  }
};

const getTypes = async () => {
  const resp = await queryTypes();
  if (resp.status === 200) {
    typeList.value = resp?.result as Record<string, any>[];
  }
};

const getDuerOSProperties = (val: string) => {
  const arr = modelRef.propertyMappings?.map((item) => item?.source) || [];
  const checked = _.cloneDeep(arr);
  const _index = checked.findIndex((i) => i === val);
  // 去掉重复的
  checked.splice(_index, 1);
  const targetList = findApplianceType.value?.properties;
  const list = targetList?.filter(
      (i: { id: string }) => !checked?.includes(i?.id as any),
  );
  return list || [];
};

const getProductProperties = (val: string[]) => {
  const items =
      modelRef.propertyMappings?.map((item: any) => item?.target) || [];
  const checked = items.filter((i) => i);
  const _checked: any[] = [];
  checked?.map((_item) => {
    if (!val?.includes(_item)) {
      _checked.push(_item);
    }
  });
  const sourceList = findProductMetadata.value?.properties;
  const list = sourceList?.filter(
      (i: { id: string }) => !_checked?.includes(i.id),
  );
  return list || [];
};

const getTypesActions = (val: string) => {
  const items = modelRef.actionMappings?.map((item) => item?.action) || [];
  const checked = _.cloneDeep(items);
  const _index = checked.findIndex((i) => i === val);
  checked.splice(_index, 1);
  const actionsList = findApplianceType.value?.actions || [];
  const list = actionsList?.filter(
      (i: { id: string; name: string }) => !checked?.includes(i?.id as any),
  );
  return list || [];
};

const onActiveProduct = () => {
  if (modelRef.id) {
    const response = deploy(modelRef.id);
    response.then((resp) => {
      if (resp.status === 200) {
        onlyMessage($t('Detail.index.670916-41'));
        getProduct(modelRef.id);
        _error.value = '';
      }
    });
    return response;
  }
};

const _validator = (_rule: any, value: string): Promise<any> =>
    new Promise((resolve, reject) => {
      const _item = productList.value.find((item) => item.id === value);
      if (!modelRef.id) {
        return resolve('');
      } else if (!_item && value) {
        productChange(value);
        return reject($t('Detail.index.670916-42'));
      } else {
        if (!_item?.state) {
          _error.value = $t('Detail.index.670916-43', [_item.name]);
        } else {
          _error.value = '';
        }
        return resolve('');
      }
    });

const saveBtn = async () => {
  const tasks: any[] = [];
  for (let i = 0; i < command.value.length; i++) {
    const res = await (command.value[i] as any)?.saveBtn();
    if (!res || (res?.errorFields && res.errorFields.length)) {
      actionActiveKey.value.push(String(i));
      tasks.push(false);
    } else {
      tasks.push(res);
    }
  }
  formRef.value
      .validate()
      .then(async (data: any) => {
        if (tasks.every((item) => item) && data) {
          loading.value = true;
          data.propertyMappings = data.propertyMappings?.map(
              (it: any) => {
                return {
                  source: it.source,
                  target: Array.isArray(it?.target)
                      ? it?.target
                      : [it?.target],
                };
              },
          );
          const resp = await savePatch(data).finally(() => {
            loading.value = false;
          });
          if (resp.status === 200) {
            onlyMessage($t('Detail.index.670916-41'));
            if (props.data?.id) {
              emit('refreshList', true);
            } else {
              emit('refreshList');
            }
          }
        }
      })
      .catch((err: any) => {
        const _arr = err.errorFields?.map((item: any) => item.name);
        _arr?.map((item: string | any[]) => {
          if (item.length >= 3) {
            if (
                item[0] === 'propertyMappings' &&
                !propertyActiveKey.value?.includes(item[1])
            ) {
              propertyActiveKey.value.push(item[1]);
            }
            if (
                item[0] === 'actionMappings' &&
                !actionActiveKey.value.includes(item[1])
            ) {
              actionActiveKey.value.push(item[1]);
            }
          }
        });
      });
};

const actionDuerOS = async () => {
  let response = undefined;
  try {
        await formRef.value.validate();
    } catch (error) {
        if ( error.errorFields[0].name.includes('mappings') ) {
            formRef.value.scrollToField(error.errorFields[0].name);
        }
        return
    }
  if (props.data?.state?.value !== 'disabled') {
    response = _undeploy(props.data?.id);
  } else {
    response = _deploy(props.data?.id);
  }
  response.then((res) => {
    if (res && res.status === 200) {
      onlyMessage($t('Detail.index.670916-41'));
      emit('refreshList', true);
    } else {
      onlyMessage($t('Detail.index.670916-44'), 'error');
    }
  });
  return response;
};

const deleteData = () => {
  const response = _delete(props.data?.id);
  response.then((resp) => {
    if (resp.status === 200) {
      onlyMessage($t('Detail.index.670916-41'));
      emit('refreshList');
    } else {
      onlyMessage($t('Detail.index.670916-44'), 'error');
    }
  });
  return response;
};
watch(
    () => props.data,
    async () => {
      formRef.value?.resetFields();
      await getTypes();
      if (props.data?.id) {
        await getProduct(props.data?.id as string);
        const resp = await detail(props.data?.id as string);
        const _data: any = resp.result;
        const _obj = cloneDeep(_data);
        if (_data) {
          _obj.applianceType = _obj?.applianceType?.value;
        }
        Object.assign(modelRef, _obj);
        noData.value = false
      } else {
        if (props.data?.type === 'add') {
          await getProduct();
          modelRef.id = undefined;
          modelRef.name = undefined;
          modelRef.applianceType = undefined;
          modelRef.productName = undefined;
          modelRef.actionMappings = [
            {
              actionType: undefined,
              action: undefined,
              command: {
                messageType: undefined,
                message: {
                  properties: undefined,
                  functionId: undefined,
                  inputs: [],
                },
              },
            },
          ];
          modelRef.propertyMappings = [
            {
              source: undefined,
              target: undefined,
            },
          ];
          modelRef.description = undefined;
          noData.value = false
        } else if (props.data?.type === 'noData') {
          noData.value = true
        }
      }
    },
    {immediate: true, deep: true},
);
</script>

<style scoped lang="less">
.box {
  position: relative;
  height: 100%;
  margin: 20px;

  .left {
    overflow: hidden;

    .left-content {
      width: 66%;
      padding: 0 20px;
      height: calc(100vh - 300px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 5px; /* 滚动条宽度 */
        background-color: #edf5ff; /* 滚动条背景色 */
      }

      &::-webkit-scrollbar-thumb {
        background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
        border-radius: 4px; /* 滚动条拖动部分圆角 */
      }
    }
  }

  .right {
    width: 33%;
    position: absolute;
    right: 0;
    top: 40px;
    overflow-y: auto;
    height: 90%;

    &::-webkit-scrollbar {
      width: 5px; /* 滚动条宽度 */
      background-color: #edf5ff; /* 滚动条背景色 */
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
      border-radius: 4px; /* 滚动条拖动部分圆角 */
    }
  }

  .control {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
