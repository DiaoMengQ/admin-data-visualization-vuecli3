<template>
  <div class="createPost-container">
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
                <el-form-item label-width="100px" label="权限级别:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.roleTypeLabel"
                    readonly
                    class="data-cannot-be-change"
                    remote
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" class="postInfo-container">
                <el-form-item label-width="100px" label="权限范围:" class="postInfo-container-item">
                  <el-input
                    v-if="ifShowAuthRange"
                    v-model="authRange"
                    :autosize="{ minRows: 1, maxRows: 6}"
                    readonly
                    class="data-cannot-be-change"
                    remote
                  />
                  <el-button v-if="ifShowAddAuth" type="primary" plain @click="addAuth">授予权限范围</el-button>
                </el-form-item>
              </el-col>
              <el-col v-if="ifDataIsReady" style="margin:10px 0" :xs="24" class="postInfo-container" type="flex" justify="end">
                <!-- 授权页 -->
                <!-- 父子组件传值，adminInfo 数据是异步请求，有可能数据渲染时报错 -->
                <!-- 故使用 v-if 控制组件的显示和传值 -->
                <grant-auth :admin-info="adminInfo" @selected-list="getSelectedList" />
                <el-button type="primary" @click="updateAuthInfo">提交授权</el-button>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
                <el-form-item label-width="100px" label="账户状态:" class="postInfo-container-item">
                  <el-input
                    v-model="adminInfo.statuLabel"
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

          <!-- 用户头像操作区域 -->
          <el-col id="admin-avatar" :xs="24" :sm="6">
            <div class="avatar-img">
              <!-- 若头像不显示,请使用 npm i element-ui 重新安装 -->
              <el-avatar
                shape="square"
                :size="100"
                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png?imageView2/1/w/80/h/80"
              >
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
              </el-avatar>
            </div>
            <el-button v-loading="loading" size="medium" type="primary">上传头像</el-button>
          </el-col>
        </el-row>

        <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button v-loading="loading" type="primary" @click="UpdateAdminInfo">保存</el-button>
          <router-link :to="'/administration/adminList'">
            <el-button v-loading="loading" type="primary" plain>取消</el-button>
          </router-link>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addAuth } from '@/api/user'
import { getUserInfo, updateAdminInfo, getUserManaRange } from '@/api/user'
import GrantAuth from '@/components/Grantauthorization'
import { Message, MessageBox } from 'element-ui'

// 此处仅作为结构展示
// 因为在把对象赋值到 adminInfo 时，会覆盖此处初始化的属性
const defaultForm = {
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
  name: 'AdminDetail',
  components: { GrantAuth },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      authRange: '',
      ifShowAuthRange: false, // 是否显示权限范围
      ifDataIsReady: false, // 网络请求(异步)是否已完成
      ifShowAddAuth: false, // 是否显示授权按钮
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
  created() {
    if (this.isEdit) {
      // 接收传入的ID
      const id = this.$route.params && this.$route.params.id
      // console.log(id)
      this.fetchData(id)
      this.getUserManaRange(id)
    }

    // 在这里复制this.$route
    // 当进入此页并快速切换标记，可能使在执行setTagsViewTitle函数时，this.$route不再指向当前页
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    // 获取子组件传来的数据(data)
    getSelectedList(data) {
      switch (this.adminInfo.roleType) {
        case 'SCHOOL_ADMIN':
          this.schSelectedList = data
          break
        case 'CITY_ADMIN':
          this.areaSelectedList = data
          break
        default:
          break
      }
      console.log(data)
    },
    // 用户授权
    addAuth() {
      this.ifDataIsReady = true
    },
    // 获取所查看用户的权限范围
    getUserManaRange(userId) {
      getUserManaRange({ userId: userId }).then((result) => {
        const data = result.data.data
        // 判断是否已有权限范围
        if (data.length === 0) {
          this.ifShowAddAuth = true
          this.ifShowAuthRange = false
        } else {
          this.ifShowAddAuth = false

          switch (this.adminInfo.roleType) {
            case 'SCHOOL_ADMIN':
              for (let i = 0; i < data.length; i++) {
                this.authRange += data[i].schoolName + ' '
              }
              this.ifShowAuthRange = true
              break
            case 'CITY_ADMIN':
              for (let i = 0; i < data.length; i++) {
                this.authRange += data[i].cityName + ' '
              }
              this.ifShowAuthRange = true
              break
          }
        }
        console.log(result.data.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 选中性别改变后设定信息
    genderChanged(val) {
      // 必须用 this.$forceUpdate() 重新 render！否则select所选值在界面上不改变
      this.$forceUpdate()
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
    },

    // 选中账户状态改变后设定信息
    statuChanged(val) {
      this.$forceUpdate()
      if (this.adminInfo.statu === 'blocked') {
        this.adminInfo.statuLabel = '已冻结'
      } else {
        this.adminInfo.statuLabel = '正常使用'
      }
    },

    // 获取管理员信息数据
    fetchData(id) {
      getUserInfo({ userId: id })
        .then(response => {
          this.adminInfo = response.data.data
          // // `${XXX.xx}` 与 XXX['xx'] 用法相同
          // console.log(this.adminInfo)

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

          if (this.adminInfo.statu === 'blocked') {
            this.adminInfo.statuLabel = '已冻结'
          } else {
            this.adminInfo.statuLabel = '正常使用'
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
    // 更新权限信息
    updateAuthInfo() {
      const schools2upload = []
      let citys2upload = []
      switch (this.adminInfo.roleType) {
        case 'SCHOOL_ADMIN':
          if (this.schSelectedList.length === 0) {
            Message({
              message: '请选择所授权学校',
              type: 'error',
              duration: 3 * 1000
            })
            this.loading = false
          } else {
            // 提取学校列表里的学校ID
            for (let i = 0; i < this.schSelectedList.length; i++) {
              schools2upload.push(this.schSelectedList[i].schoolId)
            }
            const sch2upload = '[' + schools2upload + ']'

            addAuth({ manaRange: sch2upload, userId: this.adminInfo.userId }).then((result) => {
              MessageBox.confirm('授权成功', '完成', {
                confirmButtonText: '确定',
                type: 'success '
              }).then(() => {
                this.$router.push('/administration/adminList')
              }).catch(() => {
                this.$router.push('/administration/adminList')
              })
            }).catch((err) => {
              MessageBox.confirm('授权失败,请重试', '失败', {
                confirmButtonText: '确定',
                type: 'error'
              })
              console.log(err)
            })
          }
          break
        case 'CITY_ADMIN':
          console.log(this.areaSelectedList)
          if (this.areaSelectedList.length === 0) {
            Message({
              message: '请选择所授权城市',
              type: 'error',
              duration: 3 * 1000
            })
          } else {
            citys2upload = '[' + this.areaSelectedList + ']'

            addAuth({ manaRange: citys2upload, userId: this.adminInfo.userId }).then((result) => {
              MessageBox.confirm('授权成功', '完成', {
                confirmButtonText: '确定',
                type: 'success '
              }).then(() => {
                this.$router.push('/administration/adminList')
              }).catch(() => {
                this.$router.push('/administration/adminList')
              })
            }).catch((err) => {
              MessageBox.confirm('授权失败,请重试', '失败', {
                confirmButtonText: '确定',
                type: 'error'
              })
              console.log(err)
            })
          }
          break
      }
    },
    // 上传更改后的用户信息
    UpdateAdminInfo() {
      // 判断账户是否冻结
      if (this.adminInfo.status === 'blocked') {
        Message({
          message: '该账户已冻结, 无法修改信息!',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        this.$refs.adminInfo.validate(valid => {
          if (valid) {
            this.loading = true
            const adminInfo2update = {
              userId: this.adminInfo.userId,
              nickname: this.adminInfo.nickname,
              tel: this.adminInfo.tel,
              sex: this.adminInfo.sex
            }

            updateAdminInfo(adminInfo2update).then(response => {
              const data = response['data']
              console.log(data)
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }).catch(error => {
              console.log('信息上传失败', error)
            })

            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.el-button{
  margin: 0 5px
}
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
