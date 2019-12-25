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
          <el-col id="admin-info" :xs="24" :sm="16">
            <!-- 不可编辑区域 -->
            <el-row>
              <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
                <el-form-item label-width="100px" label="管理员ID:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.userId"
                    readonly
                    class="data-cannot-be-change"
                    remote
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
                <el-form-item label-width="100px" label="账户名:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.username"
                    readonly
                    class="data-cannot-be-change"
                    remote
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="创建时间:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.createTime"
                    class="data-cannot-be-change"
                    readonly
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
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
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="创建者ID:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.parentId"
                    class="data-cannot-be-change"
                    readonly
                    type="text"
                    format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 可编辑区域 -->
            <el-row>
              <!-- row 中的组件必须包在 el-col 中，否则会导致 input 和 select 无法获取焦点 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="昵称:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.nickname"
                    style="width:200px"
                    type="text"
                    placeholder="请输入昵称"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="联系方式:" class="postInfo-container-item">
                  <el-input v-model="adminInfo.tel" style="width:200px" type="tel" placeholder="请输入联系方式"/>
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

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="100px" label="权限级别:" class="postInfo-container-item">
                  <el-select v-model="adminInfo.roleTypeLabel" placeholder="权限级别" @change="roleTypeChanged">
                    <el-option
                      v-for="role in roleTypeOptions"
                      :key="role.roleKey"
                      :label="role.roleLabel"
                      :value="role.roleLabel"
                    />
                  </el-select>
                  <!-- <el-input v-model="adminInfo.roleTypeLabel" placeholder="role" /> -->
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item :span="12" label-width="100px" label="账户状态:" class="postInfo-container-item">
                  <el-select v-model="adminInfo.statuLabel" placeholder="状态" @change="statuChanged">
                    <el-option
                      v-for="statu in statuOptions"
                      :key="statu.statuKey"
                      :label="statu.statuLabel"
                      :value="statu.statuLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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
  // display_time: null,

  nickname: '', // 昵称
  parentId: -1, // 所属管理员ID
  userId: -1, // ID
  username: '', // 账户名（登录名）
  roleType: '', // 角色类型代号
  roleTypeLabel: '', // 角色类型名称标签
  sex: 0, // 性别ID
  sexLabel: '', // 性别标签
  tel: 0, // 联系电话
  headImg: '', // 头像
  status: '', // 账户状态
  statuLabel: '', // 账户状态标签
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
      statuOptions: [
        {
          statuKey: 'blocked',
          statuLabel: '已冻结'
        },
        {
          statuKey: '',
          statuLabel: '正常使用'
        }
      ],
      genderOptions: [
        {
          genderKey: 1,
          genderLabel: '男'
        },
        {
          genderKey: 0,
          genderLabel: '女'
        }
      ],
      roleTypeOptions: [
        {
          roleKey: 'CITY_ADMIN',
          roleLabel: '市级管理员'
        },
        {
          roleKey: 'SCHOOL_ADMIN',
          roleLabel: '校级管理员'
        }
      ],
      adminInfo: Object.assign({}, defaultForm),
      loading: false,
      rules: {},
      tempRoute: {}
    }
  },
  computed: {
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
    // 选中性别改变后设定信息
    genderChanged(val) {
      // 必须用 this.$forceUpdate() 重新 render！否则select所选值在界面上不改变
      this.$forceUpdate()
      // console.log(this.adminInfo.sexLabel)
      switch (this.adminInfo.sexLabel) {
        case '男':
          this.adminInfo.sex = 1
          break
        case '女':
          this.adminInfo.sex = 0
          break
        default:
          break
      }
      // console.log(this.adminInfo)
    },

    // 选中账户状态改变后设定信息
    statuChanged(val) {
      this.$forceUpdate()
      switch (this.adminInfo.statuLabel) {
        case 'blocked':
          this.adminInfo.statu = '已冻结'
          break
        case '':
          this.adminInfo.statuLabel = '正常使用'
          break
        default:
          break
      }
      console.log(this.adminInfo.status)
      console.log(this.adminInfo.statuLabel)
    },

    // 选中账户角色类型改变后设定信息
    roleTypeChanged(val) {
      this.$forceUpdate()
      switch (this.adminInfo.roleTypeLabel) {
        case 'CITY_ADMIN':
          this.adminInfo.roleType = '市级管理员'
          break
        case 'SCHOOL_ADMIN':
          this.adminInfo.roleTypeLabel = '校级管理员'
          break
        default:
          break
      }
      console.log(this.adminInfo.roleType)
      console.log(this.adminInfo.roleTypeLabel)
    },

    // 获取管理员信息数据
    fetchData(id) {
      console.log(id)
      getUserInfo({ userId: id })
        .then(response => {
          this.adminInfo = response.data.data
          // // `${XXX.xx}` 与 XXX['xx'] 用法相同
          // console.log(`${this.adminInfo.userId}`)

          switch (this.adminInfo.sex) {
            case 1:
              this.adminInfo.sexLabel = '男'
              break
            case 0:
              this.adminInfo.sexLabel = '女'
              break
            default:
              break
          }

          switch (this.adminInfo.status) {
            case 'blocked':
              this.adminInfo.statuLabel = '已冻结'
              break
            case '':
              this.adminInfo.statuLabel = '正常使用'
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
          this.adminInfo.statu = 'published'
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
</style>
