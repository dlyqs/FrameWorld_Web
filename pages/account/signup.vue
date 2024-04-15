<template>
  <div class="background-image">
    <div class="flex-container">
      <v-dialog v-model="dialog" persistent max-width="300">
        <v-card>
          <v-card-title class="text-h5">注册成功</v-card-title>
          <v-card-text>您已注册成功，请点击登录页面或等待自动跳转。</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="navigateToSignIn">登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card class="auth-card mt-15 auth-inner-card">
        <div class="text-center header-text">注册账号</div>
        <v-card-text>
          <v-form ref="signUpForm" class="info-field">
            <!-- Input fields -->
            <v-text-field
                v-model="formData.username"
                :rules="formRules.username"
                :error-messages="fieldErrors.username"
                label="用户名"
                variant="underlined"
                clearable
                hide-details
            ></v-text-field>
            <v-text-field
                v-model="formData.email"
                :rules="formRules.email"
                :error-messages="fieldErrors.email"
                label="邮箱"
                variant="underlined"
                clearable
                hide-details
            ></v-text-field>
            <v-text-field
                v-model="formData.password1"
                :rules="formRules.password1"
                :error-messages="fieldErrors.password1"
                label="密码"
                variant="underlined"
                hide-details
                clearable
            ></v-text-field>
            <v-text-field
                v-model="formData.password2"
                :rules="formRules.password2"
                :error-messages="fieldErrors.password2"
                label="确认密码"
                variant="underlined"
                hide-details
                clearable
            ></v-text-field>
            <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>
            <div class="mt-5 d-flex justify-space-between action-buttons">
              <v-btn class="btn_signin" @click="navigateTo('/account/signin')">返回登录</v-btn>
              <v-btn class="btn_signup" :loading="submitting" @click="submit">确认注册</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'vuetify-app'
})

const formData = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
  code:'',
})

const fieldErrors = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
  code:'',
})

const formRules = ref({
  username: [
    v => !!v ||'Please enter your username',
    v => v.length >= 3 ||'Username must be at least 3 characters'
  ],
  email: [
    v => !!v ||'Please enter your e-mail address',
    v => /.+@.+\..+/.test(v) ||'E-mail address must be valid'
  ],
  password1: [
    v => !!v ||'Please enter your password',
    v => v.length >= 5 ||'Password must be at least 5 characters'
  ],
  password2: [
    v => !!v ||'Please confirm your password',
    v => v.length >= 5 ||'Password must be at least 5 characters',
    v => v === formData.value.password1 ||'Confirm password must match password'
  ],
  code: [
    v => !!v ||'Please enter your code',
  ],
})

const submitting = ref(false)
const errorMsg = ref(null)
const signUpForm = ref(null)

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signUpForm.value.validate()
  if (valid) {
    submitting.value = true

    const { data, error } = await useFetch('/api/account/registration/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })

    console.log(error.value)

    if (error.value) {
      if (error.value.statusCode === 400) {
        for (const key in formData.value) {
          if (error.value.data[key]) {
            fieldErrors.value[key] =error.value.data[key][0]
          }
        }
        if (error.value.data.non_field_errors) {
          errorMsg.value =error.value.data.non_field_errors[0]
        }
      } else {
        if (error.value.data.detail) {
          errorMsg.value =error.value.data.detail
        } else {
          errorMsg.value = 'Something went wrong. Please try again.'
        }
      }
    } else {
      setUser(data.value.user)
      dialog.value = true
      setTimeout(() => {
        navigateToSignIn()
      }, 2000) // 2秒后自动跳转
    }

    submitting.value = false
  }
}

const handleFieldUpdate = (field) => {
  fieldErrors.value[field] = ''
}

const dialog = ref(false)
const router = useRouter()
const navigateToSignIn = () => {
  router.push({ path: '/account/signin', query: { username: formData.value.username, password: formData.value.password1 } })
}

</script>

<style scoped>
.background-image {
  background: url('/bg-2.png') no-repeat center top fixed;
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
  width: 50vh; /* 调整宽度以适应新布局 */
  margin-left: 15px; /* 为了视觉上的分隔 */
  height: auto;
}

.v-text-field {
  margin: 25px 30px; /* 增加上下及两侧的间距 */
}
.info-field{
  margin-top: -1rem;
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
  margin-top: 20px;
  margin-bottom: 20px;
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
