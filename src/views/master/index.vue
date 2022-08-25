<template>
	<el-dialog v-model="dialogVisible" title="从微信接龙导入" width="30%">
		<el-input
			v-model="wxText"
			autosize
			type="textarea"
			placeholder="将微信接龙文案完全复制粘贴到当前输入框中，注意换行，不要改变原格式"
		/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="confirmImport">Confirm</el-button>
			</span>
		</template>
	</el-dialog>
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
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">创建团购</el-button>
				<el-button type="primary" :icon="DocumentCopy" @click="dialogVisible = true">导入微信接龙文案</el-button>
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
			<!-- 表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">状态变更</el-button>
				<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">发布</el-button>
			</template>
		</ProTable>
		<GroupDrawer ref="drawerRef" />
		<ImportExcel ref="dialogRef" />
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import { Master } from "@/api/interface/index";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import GroupDrawer from "@/views/master/GroupDrawer.vue";
import { CirclePlus, Delete, EditPen, DocumentCopy, View, Refresh } from "@element-plus/icons-vue";
import { deleteUser, editUser, resetUserPassWord } from "@/api/modules/user";
import { myInitiatedGroup, createFromWxJieLong, customizeCreate } from "@/api/modules/master";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
let dialogVisible = ref(false);
const wxText = ref("");

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

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

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ prop: "name", label: "团购名称", width: 220 },
	{ prop: "statusName", label: "状态", width: 80 },
	{ prop: "ctime", label: "创建时间", width: 120 },
	{ prop: "mtime", label: "更新时间", width: 120 },
	{ prop: "operation", label: "操作", width: 320, fixed: "right" }
];

// 确认导入微信接龙文案
const confirmImport = async () => {
	await createFromWxJieLong({ text: ref(wxText).value });
	dialogVisible.value = false;
	proTable.value.refresh();
};

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

// 批量添加用户
interface DialogExpose {
	acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();

// 打开 drawer(新增、查看、编辑)
interface GroupDrawerProps {
	acceptParams: (params: any) => void;
}
const drawerRef = ref<GroupDrawerProps>();
const openDrawer = (title: string, rowData: Partial<Master.CustomizeCreateRequest> = { name: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? customizeCreate : title === "编辑" ? editUser : "",
		getTableList: proTable.value.refresh
	};
	drawerRef.value!.acceptParams(params);
};
</script>
<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
