<template>
    <div class="inputs">
        <a-form ref="formRef" :model="modelRef">
            <a-table
                rowKey="id"
                :columns="columns"
                :data-source="modelRef.dataSource"
                bordered
                :pagination="false"
            >
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'value'">
                        <a-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: record.required,
                                    message:
                                        record.type === 'enum' ||
                                        record.type === 'boolean'
                                            ? $t('command.EditTable.211798-0')
                                            : $t('command.EditTable.211798-1'),
                                },
                            ]"
                        >
                            <j-value-item
                                v-model:modelValue="record.value"
                                :itemType="record.type || record.valueType"
                                :options="
                                    record.type === 'enum'
                                        ? (
                                              record?.dataType?.elements || []
                                          ).map((item) => {
                                              return {
                                                  label: item.text,
                                                  value: item.value,
                                              };
                                          })
                                        : record.type === 'boolean' || record.valueType === 'boolean'
                                        ? [
                                              { label: $t('command.EditTable.211798-2'), value: true },
                                              { label: $t('command.EditTable.211798-3'), value: false },
                                          ]
                                        : undefined
                                "
                                @change="onChange"
                            />
                        </a-form-item>
                    </template>
                    <template v-else>
                        <a-form-item
                            :name="['dataSource', index, column.dataIndex]"
                        >
                            <a-input
                                readonly
                                :bordered="false"
                                v-model:value="record[column.dataIndex]"
                            />
                        </a-form-item>
                    </template>
                </template>
            </a-table>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type Emits = {
    (e: 'update:modelValue', data: Record<string, any>[]): void;
};
const _emit = defineEmits<Emits>();

const _props = defineProps({
    modelValue: {
        type: Array as PropType<Record<string, any>[]>,
        default: '',
    },
});
const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     with: '33%',
    // },
    {
        title: $t('command.EditTable.211798-4'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('command.EditTable.211798-5'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: $t('command.EditTable.211798-6'),
        dataIndex: 'value',
        with: '34%',
    },
];

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});
const formRef = ref();

watchEffect(() => {
    modelRef.dataSource = _props.modelValue || [];
});

const onChange = () => {
    _emit('update:modelValue', modelRef.dataSource);
};

const onSave = () =>
    new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(() => {
                resolve([...modelRef.dataSource]);
            })
            .catch(() => {
                reject(false);
            });
    });

defineExpose({ onSave });
</script>

<style lang="less" scoped>
</style>