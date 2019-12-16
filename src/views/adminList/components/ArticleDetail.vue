<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      label-position="left"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <div class="createPost-main-container">
        <!-- 单行 -->
        <el-row>
          <div class="postInfo-container">
            <el-form-item
              label-width="120px"
              label="管理员姓名:"
              class="postInfo-container-item"
            >
              <el-input
                v-model="postForm.author"
                default-first-option
                remote
                placeholder="Search user"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-row>

        <el-row>
          <el-form-item
            label-width="120px"
            label="创建时间:"
            class="postInfo-container-item"
          >
            <el-date-picker
              v-model="displayTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="Select date and time"
            />
          </el-form-item>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px;"
          label-width="100px"
          label="概要:"
        >
          <el-input
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}个字符</span
          >
        </el-form-item>

        <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button v-loading="loading" type="primary">
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
const defaultForm = {
  userId: '', // 管理员ID
  userName: '', // 管理员姓名
  userPhone: '', // 管理员联系电话
  content_short: '', // 附加信息
  image_uri: '', // 管理员头像
  display_time: null // 创建时间
}

import { getUserInfo } from '@/api/user'

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
      postForm: Object.assign({}, defaultForm),
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
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
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
        // this.postForm = response.data
        this.postForm = {}

        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

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
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
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

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
  }

  .word-counter {
    color: #aaa;
    position: absolute;
    right: 10px;
    top: 0px;
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
