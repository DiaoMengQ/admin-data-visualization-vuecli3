<!--
* 七彩评价页管理项模板
-->
<template>
  <div class="app-container">

    <el-form
      ref="taskInfo"
      label-position="left"
      :model="taskInfo"
      :rules="rules"
      class="form-container"
    >
      <div class="createPost-main-container">
        <!-- row 内元素横向排列 -->
        <el-row>
          <!-- 用户信息操作区域 -->
          <el-col :xs="24" :sm="16">
            <el-row>
              <!-- row 中的组件必须包在 el-col 中，否则会导致 input 和 select 无法获取焦点 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="聚类样本数(k):" class="postInfo-container-item">
                  <el-input
                    v-model="taskInfo.k"
                    style="width:200px"
                    type="text"
                    placeholder="请输入聚类样本数"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="联系方式:" class="postInfo-container-item">
                  <el-input v-model="adminInfo.tel" style="width:200px" type="tel" placeholder="请输入联系方式" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="性别:" class="postInfo-container-item">
                  <!-- el-option 中的 value 会与 el-select 中的 v-model 进行绑定 -->
                  <el-select v-model="adminInfo.sexLabel" placeholder="性别" @change="genderChanged">
                    <el-option
                      v-for="gender in genderOptions"
                      :key="gender.genderKey"
                      :label="gender.genderLabel"
                      :value="gender.genderLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button v-loading="loading" type="primary" @click="UpdateAdminInfo">保存</el-button>
          <el-button v-loading="loading" type="primary" plain>取消</el-button>
        </el-row>
      </div>
    </el-form>
  </div>

</template>

<script>
export default {
  data() {
    return {
      taskInfo: {
        k: -1,
        classId: -1,
        week: 0,
        teaskName: '',
        subject: []
      }
    }
  }
}
</script>

      <style>

      </style>
