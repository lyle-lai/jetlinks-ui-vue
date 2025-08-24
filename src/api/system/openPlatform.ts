import { request } from '@jetlinks-web/core';

const baseUrl = '/open-platform/application';
const deviceAuthBaseUrl = '/open-platform/device-auth';

// 使用POST方式分页动态查询
export const query = (data: any) => request.post(`${baseUrl}/_query`, data);

// 根据ID查询
export const getById = (id: string) => request.get(`${baseUrl}/${id}`);

// 新增单个数据
export const add = (data: any) => request.post(baseUrl, data);

// 根据ID修改数据
export const update = (id: string, data: any) => request.put(`${baseUrl}/${id}`, data);

// 保存数据 (PATCH)
export const save = (data: any) => request.patch(baseUrl, data);

// 根据ID删除
export const remove = (id: string) => request.remove(`${baseUrl}/${id}`);

// 启用
export const enable = (id: string) => request.put(`${baseUrl}/${id}/_enable`);

// 禁用
export const disable = (id: string) => request.put(`${baseUrl}/${id}/_disable`);

// 获取应用的设备授权规则列表
export const getDeviceAuthRules = (platformAppId: string) => request.get(`${deviceAuthBaseUrl}/${platformAppId}`);

// 保存应用的设备授权规则列表（全量覆盖）
export const saveDeviceAuthRules = (platformAppId: string, data: any[]) => request.post(`${deviceAuthBaseUrl}/${platformAppId}`, data);

// 获取Swagger API资源列表
export const getSwaggerApiList = () => request.get(`/jetlinks/openapi/resources`);

const apiConfigBaseUrl = '/open-platform/api-config';

// 获取指定应用的所有API配置
export const getApiConfig = (platformAppId: string) => request.get(`${apiConfigBaseUrl}/${platformAppId}/all`);

// 批量保存或更新API配置
export const saveApiConfig = (platformAppId: string, data: any[]) => request.post(`${apiConfigBaseUrl}/${platformAppId}`, data);