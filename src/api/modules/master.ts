import { ResPage, Master } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 我发起的团购
 */
// * 获取我发起的团购列表
export const myInitiatedGroup = (params: Master.MyInitiatedGroupPageRequest) => {
	return http.get<ResPage<Master.List>>(PORT1 + `/groupPurchase/myInitiatedGroup`, params);
};

/**
 * @name 从微信接龙导入团购
 */
// * 获取我发起的团购列表
export const createFromWxJieLong = (params: Master.CreateFromWxJieLongRequest) => {
	return http.post(PORT1 + `/groupPurchase/createFromWxJieLong`, params);
};
