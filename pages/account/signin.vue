<template>
  <div class="background-image">
    <div class="flex-container">
      <v-card class="auth-card mt-15 auth-inner-card" style="height: 50vh; width: 50vh">
        <div class="text-center header-text">登录</div>
        <v-card-text>
          <v-form class="info-field" ref="signInForm">
            <v-text-field
                v-model="formData.username"
                :rules="formRules.username"
                label="用户名"
                variant="underlined"
                clearable
                hide-details
            ></v-text-field>
            <v-text-field
                v-model="formData.password"
                :rules="formRules.password"
                label="密码"
                variant="underlined"
                @keyup.enter="submit"
                clearable
                hide-details
                :type="passwordInputType"
                :append-inner-icon="passwordInputType === 'password' ? 'visibility' : 'visibility_off'"
                @click:append-inner="togglePasswordVisibility"
            ></v-text-field>
          </v-form>
          <div v-if="errorMsg">{{ errorMsg }}</div>
          <div class="mt-5 d-flex justify-space-between action-buttons">
            <v-btn class="btn_signup" @click="navigateTo('/account/signup')">注册</v-btn>
            <v-btn class="btn_signin" :loading="submitting" @click="submit">登录</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter();
definePageMeta({
  layout: 'vuetify-app'
})
const formData = ref({
  username: '',
  password: ''
})
const formRules = ref({
  username: [v => !!v || '用户名是必填项'],
  password: [v => !!v || '密码是必填项']
})
const errorMsg = ref(null)
const signInForm = ref(null)
const submitting = ref(false)
const passwordInputType = ref('password')

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signInForm.value.validate()
  if (valid) {
    submitting.value = true
    const { data, error } = await useFetch('/api/account/login/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })
    submitting.value = false
    if (error.value) {
      if (error.value.statusCode === 400) {
        if (error.value.data.non_field_errors) {
          errorMsg.value = error.value.data.non_field_errors[0]
        }
      } else {
        errorMsg.value = '登录失败，请检查您的用户名和密码'
      }
    } else {
      setUser(data.value.user)
      setUserStorage(data.value.user)
      router.replace({ path: '/' });
    }
  }
}
onMounted(() => {
  if (route.query.username && route.query.password) {
    formData.username = route.query.username
    formData.password = route.query.password
  }
})

const togglePasswordVisibility = () => {
  passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password';
}

</script>

<style scoped>
.background-image {
  background: url('/bg-1.png') no-repeat center top fixed;
  background-size: cover;
  height: 100vh;
  width: 100vw;
}

.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.auth-card, .auth-inner-card {
  width: 45vh; /* 调整宽度以适应新布局 */
  margin-left: 15px; /* 为了视觉上的分隔 */
}

.v-text-field {
  margin: 20px 25px; /* 增加上下及两侧的间距 */
}
.info-field{
  margin-top: -2rem;
  padding: 0.5rem;
}
.auth-card {
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: box-shadow 0.1s ease-in-out;
  overflow: hidden;
  z-index: 100;
  margin-left: 48rem;
  margin-bottom: 10rem;
  height: auto;
}
.auth-inner-card {
  height: auto;
  transition: all 0.1s ease-in-out;
}
.auth-inner-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.header-text {
  font-family: 'smiley-sans', sans-serif;
  font-weight: 500;
  font-size: 2.5rem;
  margin-top: 30px;
}

.action-buttons > .v-btn {
  margin-bottom: 10px;
}

.btn_signin {
  border: 1.5px solid #f89898; 
  background-color: white !important; 
  color: #f89898 !important; 
  box-shadow: 2px 2px 0px #f89898; 
  transition: all 0.3s ease; 
  margin: 0 auto; 
  font-size: 1.1rem;  
  font-weight: bold;
}

.btn_signin:hover {
  background-color: #f89898 !important; 
  color: snow !important; 
  box-shadow: none ; 
}
.btn_signup {
  border: 1.5px solid #89c2d9;
  background-color: white !important; 
  color: #89c2d9 !important;
  box-shadow: 2px 2px 0px #89c2d9;
  transition: all 0.3s ease; 
  margin: 0 auto; 
  font-size: 1.1rem;  
  font-weight: bold;
}

.btn_signup:hover {
  background-color: #89c2d9 !important;
  color: white !important;
  box-shadow: none ; 
}
</style>