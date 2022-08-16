import { ResPage, Master } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 我发起的团购
 */
// * 获取我发起的团购列表
export const myInitiatedGroup = (params: Master.ReqListParams) => {
	return http.get<ResPage<Master.List>>(PORT1 + `/groupPurchase/myInitiatedGroup`, params);
};
