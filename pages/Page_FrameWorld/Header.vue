<script setup>
</script>

<template>
  <v-container fluid class="nav-main pa-0">
    <v-row align="center" no-gutters>
      <v-col cols="2">
        <div class='nav-logo'>
          <v-img src="../../assets/logo.png" alt="logo"></v-img>
        </div>
      </v-col>
      <v-col cols="6">
        <div class='nav-left'>
          <ul>
            <li class='nav-links navhome'>首页</li>
            <li class='nav-links film'>影视</li>
            <li class='nav-links other'>其它</li>
          </ul>
        </div>
      </v-col>
      <v-col cols="10">
        <div class='nav-center'>
          <v-text-field
              solo-inverted
              flat
              hide-details
              placeholder="请输入书影音名称"
              append-icon="magnify"
          ></v-text-field>
        </div>
      </v-col>
      <v-col cols="6">
        <div class='nav-right'>
          <div class="nav-login">
            <v-avatar class="avatar"></v-avatar>
          </div>
          <router-link to="/account/signin" class="login-button">登录</router-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-------------------- style -------------------->
<style scoped>
.nav-main{
  display: flex;
  justify-content: space-around;
  width:auto;
  height: 90px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
}

/********** nav-logo **********/
.nav-logo{
  margin-left: 50px;
  margin-top: 20px;
}
.nav-logo img{
  height: 55px;
}
.nav-logo img:hover{
  border-radius: 30px;
  box-shadow: 10px 10px 25px #f89898;
}

/********** nav-left **********/
.nav-left{
  align-items: center;
  display: flex;
  margin-left: 70px;
  margin-top: 15px;
}
.nav-left ul{
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.nav-links{
  font-size: 20px;
  cursor: pointer;
  font-family: var(--font-family);
  font-weight: bolder;
  flex-grow: 1;
}

/********** nav-center **********/
.nav-center{
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  margin-left: 150px;
}
.nav-searchbar{
  display: flex;
  align-items: center;
  padding: 5px 10px;
  width: 450px;
  height: 35px;
  border-radius: 8px;
  background: #f0f2f4;
}
.nav-searchbar input{
  padding: 0 10px;
  width: 430px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  color: #808080;
  background: #f0f2f4;
  font-size: 16px;
  outline: none;
}
.nav-searchbar:hover{
  background: white;
  color: #f5f6f7;
  outline: none;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
}
.nav-searchbar:hover input{
  background: white;
}

/********** nav-right **********/
.nav-right{
  align-items: center;
  justify-content: center;
  display: flex;
  overflow: visible;
  height: 90px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  line-height: 40px;
  background-color: #ccc;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.75, 0.9), margin-left 0.5s ease,margin-bottom 0.5s ease; /* 调整过渡时间 */
}

.nav-login{
  display: flex;
  cursor: pointer;
}

.login-button{
  margin-left: 50px;
  font-size: 18px;
  font-family: var(--font-family);
  font-weight: bolder;
  cursor: pointer;
}

</style>

