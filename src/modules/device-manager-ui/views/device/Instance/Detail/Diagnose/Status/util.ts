import { diagnose } from '../../../../../../assets'
import { VNode } from 'vue';
import i18n from '@/locales';

export type ListProps = {
    key: string;
    name: string;
    desc?: string;
    status: 'loading' | 'error' | 'success' | 'warning';
    text?: string;
    info?: VNode | null;
};

export const TextColorMap = new Map();
TextColorMap.set('loading', 'black');
TextColorMap.set('error', 'red');
TextColorMap.set('success', 'green');
TextColorMap.set('warning', '#FAB247');

export const StatusMap = new Map();
StatusMap.set('error', diagnose.StatusError);
StatusMap.set('success', diagnose.StatusSuccess);
StatusMap.set('warning', diagnose.StatusWarning);
StatusMap.set('loading', diagnose.StatusLoading);

export const networkInitList: ListProps[] = [
    // {
    //   key: 'access',
    //   name: '设备接入配置',
    //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    {
        key: 'network',
        name: i18n.global.t('Status.index.565893-0'),
        desc: i18n.global.t('Status.index.565893-1'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'gateway',
        name: i18n.global.t('Status.index.565893-14'),
        desc: i18n.global.t('Status.index.565893-13'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'product',
        name: i18n.global.t('Status.index.565893-30'),
        desc: i18n.global.t('Status.index.565893-31'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'device',
        name: i18n.global.t('Status.index.565893-34'),
        desc: i18n.global.t('Status.index.565893-35'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
];

export const childInitList: ListProps[] = [
    // {
    //   key: 'access',
    //   name: '设备接入配置',
    //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    // {
    //   key: 'network',
    //   name: '网络组件',
    //   desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    {
        key: 'gateway',
        name: i18n.global.t('Status.index.565893-14'),
        desc: i18n.global.t('Status.index.565893-13'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'parent-device',
        name: i18n.global.t('Status.index.565893-23'),
        desc: i18n.global.t('Status.index.565893-24'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'product',
        name: i18n.global.t('Status.index.565893-30'),
        desc: i18n.global.t('Status.index.565893-31'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'device',
        name: i18n.global.t('Status.index.565893-34'),
        desc: i18n.global.t('Status.index.565893-35'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
];

export const cloudInitList: ListProps[] = [
    // {
    //   key: 'access',
    //   name: '设备接入配置',
    //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    {
        key: 'gateway',
        name: i18n.global.t('Status.index.565893-14'),
        desc: i18n.global.t('Status.index.565893-13'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'product',
        name: i18n.global.t('Status.index.565893-30'),
        desc: i18n.global.t('Status.index.565893-31'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'device',
        name: i18n.global.t('Status.index.565893-34'),
        desc: i18n.global.t('Status.index.565893-35'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
];

export const channelInitList: ListProps[] = [
    // {
    //   key: 'access',
    //   name: '设备接入配置',
    //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    {
        key: 'gateway',
        name: i18n.global.t('Status.index.565893-14'),
        desc: i18n.global.t('Status.index.565893-13'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'product',
        name: i18n.global.t('Status.index.565893-30'),
        desc: i18n.global.t('Status.index.565893-31'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'device',
        name: i18n.global.t('Status.index.565893-34'),
        desc: i18n.global.t('Status.index.565893-35'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
];

export const mediaInitList: ListProps[] = [
    // {
    //   key: 'access',
    //   name: '设备接入配置',
    //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
    //   status: 'loading',
    //   text: '正在诊断中...',
    //   info: null,
    // },
    {
        key: 'gateway',
        name: i18n.global.t('Status.index.565893-14'),
        desc: i18n.global.t('Status.index.565893-13'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'product',
        name: i18n.global.t('Status.index.565893-30'),
        desc: i18n.global.t('Status.index.565893-31'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
    {
        key: 'device',
        name: i18n.global.t('Status.index.565893-34'),
        desc: i18n.global.t('Status.index.565893-35'),
        status: 'loading',
        text: i18n.global.t('Status.index.565893-41'),
        info: null,
    },
];

export const modifyArrayList = (oldList: ListProps[], item: ListProps, index?: number) => {
    let newList: ListProps[] = [];
    if (index !== 0 && !index) {
        // 添加
        for (let i = 0; i < oldList.length; i++) {
            const dt = oldList[i];
            if (item.key === dt.key) {
                newList.push(item);
            } else {
                newList.push(dt);
            }
        }
    } else {
        // 修改
        oldList.splice(index, 0, item);
        newList = [...oldList];
    }
    return newList;
};

export const isExit = (arr1: any[], arr2: any[]) => {
    return arr1.find((item) => arr2.includes(item));
};

export const gatewayList = [
    'websocket-server',
    'http-server-gateway',
    'udp-device-gateway',
    'coap-server-gateway',
    'mqtt-client-gateway',
    'tcp-server-gateway',
];

export const urlMap = new Map();
urlMap.set('mqtt-client-gateway', 'topic');
urlMap.set('http-server-gateway', 'url');
urlMap.set('websocket-server', 'url');
urlMap.set('coap-server-gateway', 'url');
urlMap.set('udp-device-gateway', 'url');
urlMap.set('tcp-server-gateway', 'url');

