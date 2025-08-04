<template>
    <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <a-row :gutter="24">
            <a-col :span="24" v-if="actionType === 'command'">
                <a-form-item
                    name="messageType"
                    :label="$t('command.index.328267-0')"
                    :rules="{
                        required: true,
                        message: $t('command.index.328267-1'),
                    }"
                >
                    <MSelect
                        v-model:value="modelRef.messageType"
                        :options="_options"
                        @change="onTypeChange"
                        type="messageType"
                    />
                </a-form-item>
            </a-col>
            <a-col
                class="inputs"
                :span="
                    modelRef.messageType === 'READ_PROPERTY' ||
                    actionType === 'latestData'
                        ? 24
                        : 12
                "
                v-if="
                    (actionType === 'command' &&
                        ['READ_PROPERTY', 'WRITE_PROPERTY'].includes(
                            modelRef.messageType,
                        )) ||
                    actionType === 'latestData'
                "
            >
                <a-form-item
                    :name="['message', 'properties']"
                    :label="$t('command.index.328267-2')"
                    :rules="{
                        required: true,
                        message: $t('command.index.328267-3'),
                    }"
                >
                    <a-select
                        :placeholder="$t('command.index.328267-3')"
                        v-model:value="modelRef.message.properties"
                        show-search
                        @change="(val) => onPropertyChange(val, false)"
                    >
                        <a-select-option
                            v-for="i in metadata?.properties || []"
                            :key="i.id"
                            :value="i.id"
                            :label="i.name"
                            >{{ i.name }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col
                :span="12"
                class="inputs"
                v-if="
                    modelRef.messageType === 'WRITE_PROPERTY' &&
                    actionType === 'command'
                "
            >
                <a-form-item
                    :name="['message', 'value']"
                    :label="$t('command.index.328267-4')"
                    :rules="{
                        required: true,
                        message: $t('command.index.328267-5'),
                    }"
                >
                    <ValueItem
                        style="width: 100%;"
                        v-model:modelValue="modelRef.message.value"
                        :itemType="
                            property.valueType?.type || property.type || 'int'
                        "
                        :placeholder="
                            property.valueType?.type === 'array'
                                ? $t('command.index.328267-6')
                                : ''
                        "
                        :options="
                            property.valueType?.type === 'enum'
                                ? (property?.valueType?.elements || []).map(
                                      (item) => {
                                          return {
                                              label: item?.text,
                                              value: item?.value,
                                          };
                                      },
                                  )
                                : property.valueType?.type === 'boolean'
                                ? [
                                      {
                                          label: property.valueType?.trueText,
                                          value: property.valueType?.trueValue,
                                      },
                                      {
                                          label: property.valueType?.falseText,
                                          value: property.valueType?.falseValue,
                                      },
                                  ]
                                : undefined
                        "
                    />
                </a-form-item>
            </a-col>
            <a-col
                :span="24"
                v-if="modelRef.messageType === 'INVOKE_FUNCTION'"
                class="inputs"
            >
                <a-form-item
                    :name="['message', 'functionId']"
                    :label="$t('command.index.328267-7')"
                    :rules="{
                        required: true,
                        message: $t('command.index.328267-8'),
                    }"
                >
                    <a-select
                        :placeholder="$t('command.index.328267-8')"
                        v-model:value="modelRef.message.functionId"
                        show-search
                        @change="(e) => funcChange(e)"
                    >
                        <a-select-option
                            v-for="i in metadata?.functions || []"
                            :key="i.id"
                            :value="i.id"
                            :label="i.name"
                            >{{ i.name }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col
                :span="24"
                v-if="
                    modelRef.messageType === 'INVOKE_FUNCTION' &&
                    modelRef.message?.functionId &&
                    modelRef.message?.inputs?.length
                "
                class="inputs"
            >
                <a-form-item
                    :name="['message', 'inputs']"
                    :label="$t('command.index.328267-9')"
                    :rules="{
                        required: true,
                        message: $t('command.index.328267-10'),
                    }"
                >
                    <EditTable
                        ref="editRef"
                        v-model="modelRef.message.inputs"
                    />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script lang="ts" setup>
import EditTable from './EditTable.vue';
import MSelect from '../../../components/MSelect/index.vue';
import { cloneDeep, omit } from 'lodash-es';
import { ValueItem } from '@jetlinks-web/components';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const formRef = ref();

const props = defineProps({
    actionType: {
        type: String,
        default: '',
    },
    modelValue: {
        type: Object,
        default: () => {},
    },
    metadata: {
        type: Object,
        default: () => {
            return {
                properties: [],
                functions: [],
            };
        },
    },
});

const emit = defineEmits(['update:modelValue']);

const editRef = ref();

const modelRef = reactive({
    messageType: 'READ_PROPERTY',
    message: {
        properties: undefined,
        functionId: undefined,
        inputs: [],
        value: undefined,
    },
});

const property = ref<any>({});

const onPropertyChange = (val: string, flag?: boolean) => {
    if (val) {
        const _item = props.metadata?.properties.find(
            (item: any) => item.id === val,
        );
        property.value = _item || {};
    }
    if (!flag) {
        modelRef.message.value = undefined;
    }
};

const _options = [
    {
        id: 'READ_PROPERTY',
        name: $t('command.index.328267-11'),
    },
    {
        id: 'WRITE_PROPERTY',
        name: $t('command.index.328267-12'),
    },
    {
        id: 'INVOKE_FUNCTION',
        name: $t('command.index.328267-13'),
    },
];
const onTypeChange = () => {
    // 需要记住之前的选择, 所以注释了该代码
    // modelRef.message = {
    //     properties: undefined,
    //     functionId: undefined,
    //     inputs: [],
    //     value: undefined,
    // };
};

const funcChange = (val: string, _inputs?: any[]) => {
    if (val) {
        const arr =
            props.metadata?.functions.find((item: any) => item.id === val)
                ?.inputs || [];
        const list = arr.map((item: any) => {
            const _item = _inputs?.find((i) => i.id === item.id);
            return {
                id: item.id,
                name: item.name,
                value: undefined,
                valueType: item?.valueType?.type,
                ..._item,
                required: item?.expands?.required,
            };
        });
        modelRef.message.inputs = list;
    }
};

const saveBtn = () =>
    new Promise((resolve) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                if (modelRef.message.inputs?.length) {
                    await editRef.value?.onSave().catch(() => {
                        resolve(false);
                    });
                }
                const data = cloneDeep(_data);
                if (
                    props.actionType === 'command' &&
                    modelRef.messageType === 'WRITE_PROPERTY'
                ) {
                    omit(data, ['message']);
                    data.message = {
                        properties: {
                            [_data.message.properties]: _data.message.value,
                        },
                    };
                }
                if (
                    (props.actionType === 'command' ||
                        props.actionType === 'latestData') &&
                    modelRef.messageType === 'READ_PROPERTY'
                ) {
                    omit(data, ['message']);
                    data.message = {
                        properties: [_data.message.properties],
                    };
                }
                emit('update:modelValue', data);
                resolve(data);
            })
            .catch((err: any) => {
                resolve(err);
            });
    });

watch(
    () => props.modelValue,
    (val) => {
        if (val) {
            const newVal = cloneDeep(val);
            if (val.message.properties && typeof val.message.properties === 'object') {
                if (
                    props.actionType === 'command' &&
                    val.messageType === 'WRITE_PROPERTY'
                ) {
                    newVal.message.properties = Object.keys(
                        val.message.properties,
                    )[0];
                    newVal.message.value = Object.values(
                        val.message.properties,
                    )[0];
                }
                if (
                    (props.actionType === 'command' ||
                        props.actionType === 'latestData') &&
                        val.messageType === 'READ_PROPERTY'
                ){
                    newVal.message.properties = val.message.properties[0]
                }
                onPropertyChange(newVal?.message?.properties, true);
            }
            Object.assign(modelRef, newVal);
            if (newVal?.message?.functionId) {
                funcChange(
                    newVal?.message?.functionId,
                    newVal?.message?.inputs,
                );
            }
        }
    },
    {
        immediate: true,
    },
);

defineExpose({ saveBtn });
</script>

<style lang="less" scoped>
.inputs {
    .ant-form-item:last-child {
        margin-bottom: 0;
    }
}
</style>