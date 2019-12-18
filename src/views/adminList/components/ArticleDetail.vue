<template>
  <div class="createPost-container">
    <!-- <input class="input-info" value="111"> -->

    <el-form
      ref="adminInfo"
      label-position="left"
      :model="adminInfo"
      :rules="rules"
      class="form-container"
    >
      <div class="createPost-main-container">
        <!-- row 单行 -->
        <el-row :gutter="20">
          <el-col :span="12" class="postInfo-container">
            <el-form-item
              label-width="120px"
              label="管理员姓名:"
              class="postInfo-container-item"
            >
              <el-input
                v-model="adminInfo.username"
                readonly
                class="data-cannot-be-change"
                remote
                placeholder="name"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-select v-model="adminInfo.roleType" placeholder="权限级别">
              <el-option
                v-for="item in roleTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-form-item
              label-width="120px"
              label="权限级别:"
              class="postInfo-container-item"
            >
              <el-input
                v-model="adminInfo.roleType"
                placeholder="role"
              /> </el-form-item></el-col>
        </el-row>

        <el-form-item
          label-width="120px"
          label="创建时间:"
          class="postInfo-container-item"
        >
          <el-input
            v-model="adminInfo.createTime"
            class="data-cannot-be-change"
            readonly
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="time"
          />
        </el-form-item>

        <el-row />

        <el-form-item
          style="margin-bottom: 40px;"
          label-width="100px"
          label="描述:"
        >
          <el-input
            v-model="adminInfo.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
        </el-form-item>

        <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button v-loading="loading" type="primary" @click="info - changed">
            保存
          </el-button>
          <el-button v-loading="loading" type="primary" plain>
            取消
          </el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'

const defaultForm = {
  // content_short: '', // 附加信息
  // image_uri: '',
  // display_time: null,

  nickname: '', // 昵称
  parentId: -1, // 所属管理员ID
  userId: -1, // ID
  username: '', // 账户名（登录名）
  roleType: '', // 角色类型代号
  roleTypeLabel: '', // 角色类型名称标签
  sex: 0, // 性别
  tel: 0, // 联系电话
  headImg: '', // 头像
  status: '', // 账户状态
  createTime: '', // 创建时间
  updateId: '' // 最后一次资料更新时间
}

export default {
  name: 'ArticleDetail',
  // components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      roleTypeOptions: [
        {
          value: 'CITY_ADMIN',
          label: '市级管理员'
        },
        {
          value: 'SCHOOL_ADMIN',
          label: '校级管理员'
        }
      ],
      adminInfo: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content_short: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    // 当前时间
    // displayTime: {
    //   // set and get is useful when the data
    //   // returned by the back end api is different from the front end
    //   // back end return => "2013-06-25 06:59:25"
    //   // front end need timestamp => 1372114765000
    //   get() {
    //     return +new Date(this.adminInfo.display_time)
    //   },
    //   set(val) {
    //     this.adminInfo.display_time = new Date(val)
    //   }
    // }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // 为什么要在这里复制this.$route
    // 因为如果您进入此页并快速切换标记，可能是在执行setTagsViewTitle函数时，this.$route不再指向当前页
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      console.log(id)
      getUserInfo({ userId: id }).then(response => {
        console.log(response.data)
        this.adminInfo = response.data.data
        // `${XXX.xx}` 与 XXX['xx'] 用法相同
        // console.log(`${this.adminInfo.userId}`)

        // this.adminInfo.title += `   Article Id:${this.adminInfo.id}`
        this.adminInfo.content_short = JSON.stringify(this.adminInfo)

        // // set tagsview title
        // this.setTagsViewTitle()

        // // set page title
        // this.setPageTitle()
        // }).catch(err => {
        //   console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.adminInfo.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.adminInfo.id}`
    },
    submitForm() {
      console.log(this.adminInfo)
      this.$refs.adminInfo.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.adminInfo.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

/*  因子组件中使用了 Element UI 的标签，vue-loader无法识别 el-input标签
    通过查看浏览器中页面渲染后的源代码，得知 Element UI 中的
    <el-input class='class-key'></el-input> 标签渲染为
    <div class='class-key'> <input /> </div> 的嵌套形式，
    故此处使用 .class-key > * 的方式进行元素的筛选 */
/* 解决所引用组件，样式无法覆盖问题 */
/*  使用 /deep/ 或 >>> 来修改所引用的组件中的样式
    不需去掉子组件中 scoped ，造成全局样式的改变
    参考来源：https://zhuanlan.zhihu.com/p/29266022 */
.createPost-container >>> .data-cannot-be-change > * {
  border: 0 none;
}

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
