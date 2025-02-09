<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="loginIdentity">
			<el-input v-model="loginForm.loginIdentity" placeholder="用户名：admin / user">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="credential">
			<el-input type="password" v-model="loginForm.credential" placeholder="密码123456" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="loginType">
			<el-select v-model="loginForm.loginType" placeholder="请选择登录方式" clearable>
				<el-option v-for="item in loginType" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
		<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
			登录
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/store";
import { MenuStore } from "@/store/modules/menu";
import { TabsStore } from "@/store/modules/tabs";
import { loginType } from "@/utils/serviceDict";
// import md5 from "js-md5";

const globalStore = GlobalStore();
const menuStore = MenuStore();
const tabStore = TabsStore();

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	loginIdentity: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	credential: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 登录表单数据
const loginForm = reactive<Login.ReqLoginForm>({
	loginIdentity: "",
	credential: "",
	loginType: "",
	uuid: ""
});

const loading = ref<boolean>(false);
const router = useRouter();
// login
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const requestLoginForm: Login.ReqLoginForm = {
				loginIdentity: loginForm.loginIdentity,
				credential: loginForm.credential,
				loginType: loginForm.loginType,
				uuid: loginForm.credential
				// credential: md5(loginForm.password)
			};
			const res = await loginApi(requestLoginForm);
			// * 存储 token
			globalStore.setToken(res.data!.token);
			// * 登录成功之后清除上个账号的 menulist 和 tabs 数据
			menuStore.setMenuList([]);
			tabStore.closeMultipleTab();

			ElMessage.success("登录成功！");
			router.push({ name: "home" });
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
