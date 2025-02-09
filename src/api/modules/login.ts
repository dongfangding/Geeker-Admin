import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import Menu from "@/assets/json/menu.json";
import qs from "qs";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(PORT1 + `/auth/login`, params); // 正常 post json 请求  ==>  application/json
	return http.post<Login.ResLogin>(PORT1 + `/auth/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.post<Login.ResLogin>(PORT1 + `/auth/login`, qs.stringify(params)); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	return http.post<Login.ResLogin>(PORT1 + `/auth/login`, params, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

// * 获取按钮权限
export const getAuthButtons = () => {
	// return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
	return {
		code: 200,
		data: {
			useHooks: {
				add: true,
				batchAdd: true,
				export: true,
				batchDelete: true,
				status: true,
				view: true,
				edit: true,
				reset: true,
				delete: true
			},
			useComponent: {
				add: true,
				batchAdd: true,
				export: true,
				batchDelete: true,
				status: true
			}
		},
		msg: "成功"
	};
};

// * 获取菜单列表
export const getMenuList = () => {
	// return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
	// 如果想让菜单变为本地数据，注释上一行代码，并引入本地 Menu.json 数据
	return Menu;
};
