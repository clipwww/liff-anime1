<template>
  <div>
    <div class="nav-icon">
      <el-button type="primary" icon="el-icon-s-unfold" size="mini" @click="isDrawerOpen = true"></el-button>
    </div>
    <div class="admin-container">
      <router-view></router-view>
    </div>
    <el-drawer :visible.sync="isDrawerOpen" title="後台" direction="ltr" size="240px">
      <el-menu
        :router="true"
        :default-active="activeIndex"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/admin" @click="isDrawerOpen = false">
          <i class="el-icon-s-home"></i>
          <span slot="title">首頁</span>
        </el-menu-item>
        <el-menu-item index="/admin/user" @click="isDrawerOpen = false">
          <i class="el-icon-user-solid"></i>
          <span slot="title">使用者</span>
        </el-menu-item>
        <el-menu-item index="/admin/bangumi" @click="isDrawerOpen = false">
          <i class="el-icon-files"></i>
          <span slot="title">暫存資料</span>
        </el-menu-item>
        <el-menu-item index="/">
          <i class="el-icon-back"></i>
          <span slot="title">返回前台</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawerOpen: false,
    };
  },
  computed: {
    activeIndex() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-icon {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 99;
  &::v-deep {
    .el-button {
      padding: 3px 7px;
    }
    i {
      font-size: 1.3rem;
    }
  }
}

.admin-container {
  padding: 50px 10px 10px;
}

::v-deep {
  .el-menu {
    border: none;
    height: 100%;
    width: 100%;
  }
}
</style>