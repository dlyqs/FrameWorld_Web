<template>
  <!-- 侧边栏开关 -->
  <div class="sidebar-toggle" @click="toggleDrawer" @mouseover="hover = true" @mouseleave="hover = false" :style="toggleButtonStyle">
    <div class="icon-container">
      <svg class="icon fade" width="32" height="32" viewBox="0 0 1024 1024" fill="#666666">
        <path :d="drawerArrow"></path>
      </svg>
    </div>
  </div>

  <!-- 侧边栏主体 -->
  <v-navigation-drawer v-model="drawer" :permanent="drawerPermanent" width="250" class="main-drawer">
    <!-- 用户信息 -->
    <div class="user-card elevation-0">
      <v-card class="user-card-content elevation-0" id="menu-activator">
        <v-row>
          <v-col cols="3">
            <v-avatar size="38px" class="avatar">
              <img src="/headpic.jpg" alt="User's avatar">
            </v-avatar>
          </v-col>
          <v-col cols="8">
            <div class="text-name">{{ user.username }}</div>
            <div class="text-caption">{{ user.email }}</div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- 用户管理 -->
    <v-menu activator="#menu-activator" offset-y absolute nudge-top="10" min-width="inherit" transition="slide-y-transition">
      <v-list class="user-list">
        <v-list-item @click="signOut" class="user-list-item">
          <v-list-item-icon>
            <v-icon>logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="list-item-content">退出</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-menu>
    <v-divider></v-divider>

    <!-- 历史对话 -->
    <div class="px-1">
      <!-- 加载状态 -->
      <v-list>
        <v-list-item v-show="loadingConversations">
          <v-list-item-title class="d-flex justify-center">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- 对话列表 -->
      <v-list>
        <template v-for="(conversation, cIdx) in conversations" :key="conversation.id">
          <!-- 编辑名称的输入框 -->
          <v-list-item active-color="primary" rounded="xl" v-if="editingConversation && editingConversation.id === conversation.id">
            <v-text-field v-model="editingConversation.topic" :loading="editingConversation.updating" variant="underlined" append-icon="done"
                hide-details density="compact" autofocus @keyup.enter="updateConversation(cIdx)" @click:append="updateConversation(cIdx)">
            </v-text-field>
          </v-list-item>
          <!-- 对话信息及编辑删除按钮 -->
          <v-hover v-if="!editingConversation || editingConversation.id !== conversation.id" v-slot="{ isHovering, props }">
            <v-list-item :to="`/${conversation.id}`" v-bind="props" class="conversation_list">
              <v-list-item-title>{{ (conversation.topic && conversation.topic !== '') ? conversation.topic : '未命名对话' }}</v-list-item-title>
              <template v-slot:append>
                <div v-show="isHovering && conversation.id">
                  <v-btn class="btn_edit" icon="edit" size="small" variant="text" @click.prevent="editConversation(cIdx)"></v-btn>
                  <v-btn class="btn_delete" icon="delete" size="small" variant="text" :loading="deletingConversationIndex === cIdx" @click.prevent="deleteConversation(cIdx)"></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-hover>
        </template>
      </v-list>
    </div>

    <!-- 设置 -->
    <template v-slot:append>
      <v-expansion-panels style="flex-direction: column" >
        <v-expansion-panel rounded="rounded-pill" style="background-color: rgba(0, 0, 0, 0); border-radius: 0;">
          <v-expansion-panel-title expand-icon="expand_less" collapse-icon="expand_more" class="setting_title">
            <v-icon icon="settings" class="mr-4"></v-icon> {{ "设置" }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="px-1">
              <v-list density="compact">
                <v-dialog v-model="clearConfirmDialog" persistent>
                  <template v-slot:activator="{ props }">
                    <v-list-item class="setting_list_item" v-bind="props" prepend-icon="delete_forever">删除对话记录</v-list-item>
                  </template>
                  <v-card class="delete_dialog">
                    <v-card-title class="text-warn">确定删除全部对话？</v-card-title>
                    <v-card-text>将永久删除，请谨慎决定！</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green-darken-1" variant="text" @click="clearConfirmDialog = false" class="text-none">取消</v-btn>
                      <v-btn color="red-darken-1" variant="text" @click="clearConversations" class="text-none" :loading="deletingConversations">确认</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useDrawer } from "../composables/states";
import { useDisplay } from 'vuetify'

/*————————————————————————侧边栏开关与显示————————————————————————*/
const drawer = useDrawer()
const hover = ref(false);
// 确定设备类型
const { mdAndUp } = useDisplay()
// 根据设备类型决定侧边栏是否为永久显示
const drawerPermanent = computed(() => mdAndUp.value)
// 根据drawer和hover状态，计算图标路径
const drawerArrow = computed(() => {
  if (drawer.value && hover.value) return "M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z";
  else if (!drawer.value) return "M613.504 512L274.752 173.248l90.496-90.496L794.496 512l-429.248 429.248-90.496-90.496z";
  else return "M355.53333337 144.6c0 3.8-0.4 7.5-0.9 11.2l0.9 0 0 714-0.9 0c0.5 3.7 0.9 7.4 0.9 11.2 0 43.1-35 78.1-78.1 78.1S199.33333337 924.1 199.33333337 881c0-3.8 0.4-7.5 0.9-11.2L199.33333337 869.8l0-714 0.9 0c-0.5-3.7-0.9-7.4-0.9-11.2 0-43.1 35-78.1 78.1-78.1S355.53333337 101.5 355.53333337 144.6z";
});
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleButtonStyle = computed(() => ({
  left: drawer.value ? 'var(--sidebar-width, 250px)' : '0px',
  top: '50%',
  transform: 'translateY(-50%)',
  position: 'fixed',
  cursor: 'pointer',
  zIndex: 100
}));

/*————————————————————————用户管理操作————————————————————————*/
const user = useUser()
const menu = ref(false)

// 用户登出
const signOut = async () => {
  const { error } = await useFetch('/api/account/logout/', {
    method: 'POST'
  })
  if (!error.value) {
    await logout()
    menu.value = false // Close the menu after logging out
  }
}

/*————————————————————————对话记录操作————————————————————————*/
const conversations = useConversations()
const editingConversation = ref(false)
const deletingConversationIndex = ref(null)
const clearConfirmDialog = ref(false)
const deletingConversations = ref(false)
const loadingConversations = ref(false)

// 编辑对话
const editConversation = (index) => {
  editingConversation.value = conversations.value[index]
}

// 更新对话,目前用于更改对话名称
const updateConversation = async (index) => {
  editingConversation.value.updating = true
  const { error } = await useAuthFetch(`/api/chat/conversations/${editingConversation.value.id}/`, {
    method: 'PUT',
    body: JSON.stringify({ topic: editingConversation.value.topic })
  })
  if (!error.value) {
    editingConversation.value.updating = false
    conversations.value[index] = { ...editingConversation.value }
  }
  editingConversation.value = false
}

// 删除对话
const deleteConversation = async (index) => {
  deletingConversationIndex.value = index
  const { error } = await useAuthFetch(`/api/chat/conversations/${conversations.value[index].id}/`, {
    method: 'DELETE'
  })
  if (!error.value) {
    conversations.value.splice(index, 1)
  }
  deletingConversationIndex.value = null
}

// 加载对话
const loadConversations = async () => {
  loadingConversations.value = true
  conversations.value = await getConversations()
  loadingConversations.value = false
}

// 页面加载完成时加载对话
onNuxtReady(() => {
  loadConversations()
})
</script>

<style scoped>
.main-drawer{
  background-color: rgba(0, 0, 0, .02) ;
  border: none;
}
.user-card{
  margin-top: 0.8rem;
  padding: 0 1rem; /* 增加 padding 来增加高度 */
  position: relative; /* 为了使 .user-card-content 在中间 */
}
.user-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem; /* 增加 padding 来增加高度 */
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
  background-color: rgba(0, 0, 0, 0) ;
}
.user-card-content:hover, .v-menu__content--active .user-card-content {
  background-color: rgba(0, 0, 0, .05) !important;
}
.text-name {
  font-family: 'smiley-sans', sans-serif;
  font-weight: bold;
}
.text-caption {
  font-family: 'calibri', sans-serif;
  font-size: 0.8rem;
}
.text-warn{
  color: red;
  padding: 0.8rem 0 0 1.5rem;
}
.user-list{
  margin-top: 0.5rem;
}
.user-list-item {
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex
}
.list-item-content{
  margin-left: 1rem;
}
.user-list-item:hover {
  background-color: rgba(0,0,0,0.04);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.avatar{
  margin-left: 4px;
  margin-top: 2px;
}
.avatar img {
  width: 100%;
  height: auto;
}
.avatar:hover {
  transform: scale(1.2);
  border: 2px solid transparent;
  background-image: linear-gradient(white, white), radial-gradient(circle at top left, #ffcad4, #f4acb7);
  background-origin: border-box;
  background-clip: content-box, border-box;
  transition: 0.4s;
}
.v-divider {
  margin-top: 0.8rem; /* 增加上下间距并设置左右边距 */
  margin-left: 12px;
  margin-right: 12px;
  height: 10px;
  background-color: rgba(0,0,0,0.12); /* 分割线颜色，根据需要调整 */
}
.conversation_list{
  border-radius: 6px;
  margin-left: 10px;
  margin-right: 10px;
}
.btn_edit, .btn_delete {
  color: #495057 !important; /* 设置按钮颜色 */
  border-radius: 4px !important; /* 设置按钮圆角 */
  margin-right: 8px; /* 设置按钮右边的间距 */
  font-size: 10px;
  height: 30px;
  width: 30px; /* 或者使用auto来自动调整宽度 */
}
.btn_edit:hover, .btn_delete:hover {
  background-color: rgba(0,0,0,0.04);
  transition: border 0.4s ease-in-out; /* 添加动效，平滑过渡边框的显示 */
}
.setting_list_item {
  border-radius: 4px;
  margin-right: 0.3rem;

}
.icon-container {
  position: relative;
  width: 32px; /* 根据实际图标大小调整 */
  height: 32px; /* 根据实际图标大小调整 */
}
.fade {
  opacity: 1 !important;
}
.delete_dialog{
  max-width: 250px;
  margin-top: 25rem;
}
</style>