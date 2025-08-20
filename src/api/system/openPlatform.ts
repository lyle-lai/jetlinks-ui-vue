import { request } from '@jetlinks-web/core';

const baseUrl = '/open-platform/application';

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
export const remove = (id: string) => request.delete(`${baseUrl}/${id}`);

// 启用
export const enable = (id: string) => request.post(`${baseUrl}/${id}/_enable`);

// 禁用
export const disable = (id: string) => request.post(`${baseUrl}/${id}/_disable`);
