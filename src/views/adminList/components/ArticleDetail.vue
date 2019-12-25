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
        <!-- row 内元素横向排列 -->
        <el-row>
          <!-- 用户信息操作区域 -->
          <!-- 注意！el-col 中的组件无法获取鼠标的焦点 -->
          <el-col id="admin-info" :xs="24" :sm="16">
            <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
              <el-form-item label-width="100px" label="管理员ID:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.userId"
                  readonly
                  class="data-cannot-be-change"
                  remote
                  placeholder="name"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
              <el-form-item label-width="100px" label="管理员姓名:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.username"
                  readonly
                  class="data-cannot-be-change"
                  remote
                  placeholder="name"
                />
              </el-form-item>
            </el-col>
            <el-row>
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="创建时间:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.createTime"
                    class="data-cannot-be-change"
                    readonly
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="time"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="更新时间:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.updateTime"
                    class="data-cannot-be-change"
                    readonly
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="time"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label-width="100px" label="性别:" class="postInfo-container-item">
              <!-- el-option 中的 value 会与 el-select 中的 v-model 进行绑定 -->
              <el-select
                v-model="adminInfo.sexItem"
                filterable
                placeholder="性别"
                @change="getGender"
              >
                <el-option
                  v-for="gender in genderOptions"
                  :key="gender.key"
                  :label="gender.label"
                  :value="gender"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :span="12"
              label-width="100px"
              label="权限级别:"
              class="postInfo-container-item"
            >
              <el-select v-model="adminInfo.roleTypeLabel" placeholder="权限级别">
                <el-option
                  v-for="(item,itemkey) in roleTypeOptions"
                  :key="itemkey"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-input v-model="adminInfo.roleTypeLabel" placeholder="role" /> -->
            </el-form-item>

            <el-form-item
              :span="12"
              label-width="100px"
              label="账户状态:"
              class="postInfo-container-item"
            >
              <el-select v-model="adminInfo.statusLabel" placeholder="状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 用户头像操作区域 -->
          <el-col id="admin-avatar" :xs="24" :sm="6">
            <div class="avatar-img">
              <!-- <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png?imageView2/1/w/80/h/80"> -->
              <el-avatar
                shape="square"
                :size="100"
                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png?imageView2/1/w/80/h/80"
              />
            </div>
            <el-button v-loading="loading" size="medium" type="primary">选择头像</el-button>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="描述:">
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
          <!-- <el-button v-loading="loading" type="primary" @click="Changed2Save">保存</el-button> -->
          <el-button v-loading="loading" type="primary">保存</el-button>
          <el-button v-loading="loading" type="primary" plain>取消</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'

// 此处仅作为结构展示
// 因为在把对象赋值到 adminInfo 时，会覆盖此处初始化的属性
const defaultForm = {
  content_short: '', // 附加信息
  // image_uri: '',
  // display_time: null,

  nickname: '', // 昵称
  parentId: -1, // 所属管理员ID
  userId: -1, // ID
  username: '', // 账户名（登录名）
  roleType: '', // 角色类型代号
  roleTypeLabel: '', // 角色类型名称标签
  sexItem: {
    sex: 0, // 性别ID
    sexLabel: '' // 性别标签
  },
  tel: 0, // 联系电话
  headImg: '', // 头像
  status: '', // 账户状态
  statusLabel: '', // 账户状态标签
  createTime: '', // 创建时间
  updateId: '' // 最后一次资料更新时间
}

export default {
  name: 'ArticleDetail',
  // components: {},
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
      statusOptions: [
        {
          value: 'blocked',
          label: '已冻结'
        },
        {
          value: '',
          label: '正常使用'
        }
      ],
      genderOptions: [
        {
          key: 1,
          label: '男'
        },
        {
          key: 0,
          label: '女'
        }
      ],
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
        content_short: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    // // 用户信息
    sexItem() {
      return this.adminInfo.sexItem
    },
    // 当前时间
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.adminInfo.display_time)
      },
      set(val) {
        this.adminInfo.display_time = new Date(val)
      }
    }
  },
  watch: {
    sexItem(newValue,oldValue) {
      console.log(
        '旧： ' + JSON.stringify(oldValue),
        '\n新： ' +JSON.stringify(newValue) 
      )
    },
    deep:true
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
    // 获取选中的性别
    getGender(val) {
      console.log(val)
      // this.adminInfo.sexLabel = val
      // console.log(this.adminInfo.sexLabel)
      // switch (val) {
      //   case 1:
      //     this.adminInfo.sex = 1
      //     break
      //   case 0:
      //     this.adminInfo.sex = 0
      //     break
      //   default:
      //     break
      // }
    },

    // 获取管理员信息数据
    fetchData(id) {
      console.log(id)
      getUserInfo({ userId: id })
        .then(response => {
          this.adminInfo = response.data.data

          this.adminInfo.sexItem = { sex: response.data.data['sex'], sexLabel: '' }
          // console.log(JSON.stringify(this.adminInfo.sexItem))
          // console.log('性别ID\t'+JSON.stringify(this.adminInfo.sexItem['sex']))

          this.adminInfo.content_short = JSON.stringify(this.adminInfo) // just for test
          // `${XXX.xx}` 与 XXX['xx'] 用法相同
          // console.log(`${this.adminInfo.userId}`)

          // switch (this.adminInfo.sexItem['sex']) {
          //   case 1:
          //     this.adminInfo.sexLabel = '男'
          //     break
          //   case 0:
          //     this.adminInfo.sexLabel = '女'
          //     break
          //   default:
          //     break
          // }

          switch (this.adminInfo.status) {
            case 'blocked':
              this.adminInfo.statusLabel = '已冻结'
              break
            default:
              '正常使用'
              break
          }

          switch (this.adminInfo.roleType) {
            case 'CITY_ADMIN':
              this.adminInfo.roleTypeLabel = '市级管理员'
              break
            case 'SCHOOL_ADMIN':
              this.adminInfo.roleTypeLabel = '校级管理员'
              break
            default:
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
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

#admin-avatar {
  // text-align: center;
  margin: 0 0 0 5em;
}

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
