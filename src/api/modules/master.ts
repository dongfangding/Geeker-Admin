import { ResPage, Master } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 我发起的团购
 */
export const myInitiatedGroup = (params: Master.MyInitiatedGroupPageRequest) => {
	return http.get<ResPage<Master.List>>(PORT1 + `/groupPurchase/myInitiatedGroup`, params);
};

/**
 * @name 从微信接龙导入团购
 */
export const createFromWxJieLong = (params: Master.CreateFromWxJieLongRequest) => {
	return http.post(PORT1 + `/groupPurchase/createFromWxJieLong`, params);
};

/**
 * @name 自定义创建团购
 */
export const customizeCreate = (params: Master.CustomizeCreateRequest) => {
	return http.post(PORT1 + `/groupPurchase/customizeCreate`, params);
};

/**
 * @name 修改团购信息
 */
export const modifyGroupInfo = (params: Master.ModifyGroupRequest) => {
	return http.post(PORT1 + `/groupPurchase/modifyGroupInfo`, params);
};

/**
 * @name 更改团购状态
 */
export const updateGroupStatus = (params: Master.UpdateGroupStatusRequest) => {
	return http.post(PORT1 + `/groupPurchase/updateGroupStatus`, params);
};
