<template>
  <!-- 在导航菜单中添加 -->
  <a-menu-item v-if="isSinger" key="my-songs">
    <router-link to="/singer/songs">我的歌曲</router-link>
  </a-menu-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['isSinger'])
  }
}
</script> 