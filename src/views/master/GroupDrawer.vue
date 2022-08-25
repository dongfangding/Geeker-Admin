<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title}团购`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="名称" prop="name">
				<el-input v-model="drawerData.rowData!.name" placeholder="请填写团购名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="微信二维码" prop="wxIdCardUrl">
				<UploadImg
					v-model:imageUrl="drawerData.rowData!.wxIdCardUrl"
					:disabled="drawerData.isView"
					:upload-style="{ width: '120px', height: '120px' }"
					@check-validate="checkValidate('avatar')"
				>
					<template #tip> 头像大小不能超过 4M </template>
				</UploadImg>
			</el-form-item>
			<!-- <el-form-item label="性别" prop="gender">
				<el-select v-model="drawerData.rowData!.gender" placeholder="请选择性别" clearable>
					<el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item> -->
			<el-form-item label="商品信息" prop="goodName">
				<el-input v-model="drawerData.rowData!.goodName" placeholder="请填写商品信息" clearable></el-input>
			</el-form-item>
			<el-form-item label="商品描述" prop="goodDescription">
				<el-input v-model="drawerData.rowData!.goodDescription" placeholder="请填写邮箱" clearable></el-input>
			</el-form-item>
			<el-form-item label="团购内容" prop="content">
				<el-input v-model="drawerData.rowData!.content" placeholder="请填写团购内容" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { Master } from "@/api/interface/index";
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";

const rules = reactive({
	avatar: [{ required: true, message: "请上传用户头像", trigger: "change" }],
	username: [{ required: true, message: "请填写用户姓名", trigger: "change" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	idCard: [{ required: true, message: "请填写身份证号", trigger: "change" }],
	email: [{ required: true, message: "请填写邮箱", trigger: "change" }],
	address: [{ required: true, message: "请填写居住地址", trigger: "change" }]
});

interface GroupDrawerProps {
	title: string;
	isView: boolean;
	rowData?: Master.CustomizeCreateRequest;
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerData = ref<GroupDrawerProps>({
	isView: false,
	title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: GroupDrawerProps): void => {
	drawerData.value = params;
	drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
// 提交数据（新增/编辑）
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerData.value.apiUrl!(drawerData.value.rowData);
			ElMessage.success({ message: `${drawerData.value.title}用户成功！` });
			drawerData.value.getTableList!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

// 公共校验方法（图片上传成功触发重新校验）
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};

defineExpose({
	acceptParams
});
</script>
