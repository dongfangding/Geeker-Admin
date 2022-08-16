<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			:columns="columns"
			:requestApi="myInitiatedGroup"
			:initParam="initParam"
			:dataCallback="dataCallback"
		>
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-if="BUTTONS.add">新增用户</el-button>
				<el-button type="primary" :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">批量添加用户</el-button>
				<el-button type="primary" :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">导出用户数据</el-button>
				<el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="batchDelete(scope.ids)"
					v-if="BUTTONS.batchDelete"
				>
					批量删除用户
				</el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<!-- 用户状态 slot -->
			<template #status="scope">
				<!-- 如果插槽的值为 el-switch，第一次加载会默认触发 switch 的 @change 方法，所有在外层包一个盒子，点击触发盒子 click 方法（暂时只能这样解决） -->
				<div @click="changeStatus(scope.row)" v-if="BUTTONS.status">
					<el-switch
						:value="scope.row.status"
						:active-text="scope.row.status === 1 ? '启用' : '禁用'"
						:active-value="1"
						:inactive-value="0"
					/>
				</div>
				<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" v-else>
					{{ scope.row.status === 1 ? "启用" : "禁用" }}
				</el-tag>
			</template>
			<!-- 表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">状态变更</el-button>
				<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">发布</el-button>
			</template>
		</ProTable>
		<UserDrawer ref="drawerRef" />
		<ImportExcel ref="dialogRef" />
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import {
	deleteUser,
	editUser,
	addUser,
	changeUserStatus,
	resetUserPassWord,
	exportUserInfo,
	BatchAddUser
} from "@/api/modules/user";
import { myInitiatedGroup } from "@/api/modules/master";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
	type: 1
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
	return {
		datalist: data.content,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

// 页面按钮权限
const { BUTTONS } = useAuthButtons();

// 自定义渲染头部(使用tsx语法)
const renderTime = (scope: any) => {
	alert(scope.row.label);
};

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ prop: "name", label: "团购名称", width: 130 },
	{ prop: "statusName", label: "状态", width: 80 },
	{ prop: "ctime", label: "创建时间", width: 120, renderHeader: renderTime },
	{ prop: "mtime", label: "更新时间", width: 120 },
	{ prop: "operation", label: "操作", width: 320, fixed: "right" }
];

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
	proTable.value.refresh();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
	await useHandleData(deleteUser, { id }, "删除所选用户信息");
	proTable.value.refresh();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
	proTable.value.refresh();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
	await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
	proTable.value.refresh();
};

// 导出用户列表
const downloadFile = async () => {
	useDownload(exportUserInfo, "用户列表", proTable.value.searchParam);
};

// 批量添加用户
interface DialogExpose {
	acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();
const batchAdd = () => {
	let params = {
		title: "用户",
		tempApi: exportUserInfo,
		importApi: BatchAddUser,
		getTableList: proTable.value.refresh
	};
	dialogRef.value!.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<User.ResUserList> = { avatar: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addUser : title === "编辑" ? editUser : "",
		getTableList: proTable.value.refresh
	};
	drawerRef.value!.acceptParams(params);
};
</script>
