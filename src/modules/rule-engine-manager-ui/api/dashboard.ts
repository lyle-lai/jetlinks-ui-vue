import { request } from '@jetlinks-web/core';
/**
 * 获取今日及当月告警数量
 */
export const dashboard = (data:Record<string,any[]>)=> request.post('/dashboard/_multi',data);

/**
 *
 */
export const getAlarm = (params:any) => request.post('/alarm/record/_query',params);

/**
 * 获取告警数量
 */
export const getAlarmConfigCount = (data:Record<string,any>) => request.post('/alarm/config/_count',data);

/**
 * 获取报警等级
 */
export const getAlarmLevel = () => request.get('/alarm/config/default/level');
