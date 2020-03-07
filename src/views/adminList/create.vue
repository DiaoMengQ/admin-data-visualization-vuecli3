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
            <el-col :xs="24" :lg="24" :xl="24">
              <el-form-item prop="roleType" label-width="170px" label="权限级别:" class="postInfo-container-item">
                <el-select v-model="adminInfo.roleType" placeholder="请选择权限级别" @change="roleTypeChanged">
                  <el-option
                    v-for="role in roleTypeOptions"
                    :key="role.roleKey"
                    :label="role.roleLabel"
                    :value="role.roleKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col v-if="ifShowProvinceList" :xs="24" :lg="12" :xl="8">
              <el-form-item prop="provinceId" label-width="170px" label="省份:" class="postInfo-container-item">
                <el-select v-model="provinceId" placeholder="请选择省份">
                  <el-option
                    v-for="province in provinceList"
                    :key="province.provinceId"
                    :label="province.provinceName"
                    :value="province.provinceId"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 城市选择器 -->
            <el-col v-if="ifShowCityList" :xs="24" :lg="12" :xl="8">
              <el-form-item prop="areaCode" label-width="170px" label="市:" class="postInfo-container-item">
                <el-select v-model="areaCode" placeholder="请选择">
                  <el-option
                    v-for="city in cityList"
                    :key="city.areaCode"
                    :label="city['cityName']"
                    :value="city.areaCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 城市多选项 -->
            <el-col v-if="ifShowCityTransfer" :xs="24">
              <el-transfer
                v-model="areaSelectedList"
                :data="cityList"
                :props="{
                  key: 'areaCode',
                  label: 'cityName'
                }"
                :titles="['可选城市', '已选城市']"
              />
            </el-col>

            <!-- 学校列表 -->
            <el-col :xs="20" :lg="20" :xl="20">
              <!-- 学校列表 -->
              <el-table
                v-if="ifShowSchoolList"
                v-loading="listLoading"
                max-height="350"
                :data="schoolList"
                border
                fit
                highlight-current-row
                @selection-change="handleSchChange"
              >
                <el-table-column
                  type="selection"
                  width="35px"
                />

                <el-table-column min-width="300px" label="学校列表">
                  <template slot-scope="scope">
                    <span>{{ scope.row['schoolName'] }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="学校ID" width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row['schoolId'] }}</span>
                  </template>
                </el-table-column>

              </el-table>

            </el-col>

            <!-- 账户名 -->
            <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
              <el-form-item prop="username" label-width="170px" label="账户名（用于登录）:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.username"
                  remote
                  placeholder="请输入账户名"
                  style="max-width:200px"
                />
              </el-form-item>
            </el-col>

            <!-- 昵称 -->
            <!-- row 中的组件必须包在 el-col 中，否则会导致 input 和 select 无法获取焦点 -->
            <el-col :xs="24" :lg="12" :xl="8">
              <el-form-item label-width="170px" label="昵称:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.nickname"
                  type="text"
                  placeholder="请输入昵称"
                  style="max-width:200px"
                />
              </el-form-item>
            </el-col>

            <!-- 密码 -->
            <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
              <el-form-item prop="password" label-width="170px" label="密码:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.password"
                  show-password
                  remote
                  placeholder="请输入账户密码"
                  style="max-width:200px"
                />
              </el-form-item>
            </el-col>
            <!-- 确认密码 -->
            <el-col :xs="24" :lg="12" :xl="8" class="postInfo-container">
              <el-form-item prop="passwordConfirm" label-width="170px" label="确认密码:" class="postInfo-container-item">
                <el-input
                  v-model="adminInfo.passwordConfirm"
                  show-password
                  remote
                  placeholder="请再次确认密码"
                  style="max-width:200px"
                />
              </el-form-item>
            </el-col>

            <!-- 性别 -->
            <el-col :xs="24" :lg="12" :xl="8">
              <el-form-item label-width="170px" label="性别:" class="postInfo-container-item">
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

            <!-- 联系方式 -->
            <el-col :xs="24" :lg="12" :xl="8">
              <el-form-item label-width="170px" label="联系方式:" class="postInfo-container-item">
                <el-input v-model="adminInfo.tel" style="max-width:200px" type="tel" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>

            <!-- 邮箱 -->
            <el-col :xs="24" :lg="12" :xl="8">
              <el-form-item label-width="170px" label="邮箱:" class="postInfo-container-item">
                <el-input v-model="adminInfo.tel" style="max-width:200px" type="email" placeholder="请输入邮箱地址" />
              </el-form-item>
            </el-col>

          </el-col>

          <!-- 用户头像 -->
          <el-col id="admin-avatar" :xs="24" :sm="6">
            <div class="avatar-img">
              <!-- 若头像不显示,请使用 npm i element-ui -S 重新安装 -->
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
          <el-button v-loading="loading" type="primary" @click="UpdateAdminInfo('adminInfo')">保存</el-button>
          <router-link :to="'/administration/adminList'">
            <el-button v-loading="loading" type="primary" plain>取消</el-button>
          </router-link>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addAuth, addUser } from '@/api/user'
import { getAreaInfo, getAllSchoolInfo } from '@/api/system'
import { validatePassword } from '@/utils/validate'
import { MessageBox, Message } from 'element-ui'

// 此处仅作为结构展示
// 因为在把对象赋值到 adminInfo 时，会覆盖此处初始化的属性
const defaultForm = {
  nickname: null, // 昵称
  username: null, // 账户名（登录名）
  roleType: null, // 角色类型代号
  roleTypeLabel: null, // 角色类型名称标签
  sex: null, // 性别ID
  sexLabel: null, // 性别标签
  tel: null, // 联系电话
  email: null, // 邮箱
  avatar: null // 头像
}

export default {
  data() {
    // 密码校验
    const validatePwd = (rule, value, callback) => {
      if (this.adminInfo.passwordConfirm) {
        if (!value) {
          callback(new Error('请确认您的密码'))
        } else if (!(value === this.adminInfo.passwordConfirm)) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (!validatePassword(value)) {
          callback(new Error('密码长度须大于 6 个字符，且不能含空格'))
        } else {
          callback()
        }
      }
    }
    // 确认密码校验
    const validatePwdConfirm = (rule, value, callback) => {
      if (this.adminInfo.password) {
        if (!value) {
          callback(new Error('请确认您的密码'))
        } else if (!(value === this.adminInfo.password)) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (!validatePassword(value)) {
          callback(new Error('密码长度须大于 6 个字符，且不能含空格'))
        } else {
          callback()
        }
      }
    }
    return {
      // 性别选项
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
      roleTypeOptions: [], // 账户类型选项
      adminInfo: Object.assign({}, defaultForm),
      loading: false,
      // 表单校验规则
      rules: {
        username: [{ required: true, message: '账户名不能为空', trigger: 'blur' },
          { min: 4, message: '账户名须大于 4 个字符', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择账户类型', trigger: 'blur' }],
        password: [{ required: true, trigger: ['blur', 'change'], validator: validatePwd }],
        passwordConfirm: [{ required: true, trigger: ['blur', 'change'], validator: validatePwdConfirm }]
      },

      ifShowProvinceList: false, // 是否显示省份列表,默认不显示
      ifShowCityList: false, // 是否显示城市列表,默认不显示
      ifShowCityTransfer: false, // 是否显示城市穿梭框,默认不显示
      ifShowSchoolList: false, // 是否显示学校列表,默认不显示
      listLoading: false, // 是否正在加载学校列表

      provinceId: '',
      provinceList: [
        { provinceId: 44, provinceName: '广东' },
        { provinceId: 45, provinceName: '广西' },
        { provinceId: 46, provinceName: '海南' },
        { provinceId: 50, provinceName: '重庆' },
        { provinceId: 51, provinceName: '四川' },
        { provinceId: 52, provinceName: '贵州' },
        { provinceId: 53, provinceName: '云南' },
        { provinceId: 54, provinceName: '西藏' },
        { provinceId: 61, provinceName: '陕西' },
        { provinceId: 62, provinceName: '甘肃' },
        { provinceId: 63, provinceName: '青海' },
        { provinceId: 64, provinceName: '宁夏' },
        { provinceId: 65, provinceName: '新疆' },
        { provinceId: 11, provinceName: '北京' },
        { provinceId: 12, provinceName: '天津' },
        { provinceId: 13, provinceName: '河北' },
        { provinceId: 14, provinceName: '山西' },
        { provinceId: 15, provinceName: '内蒙古' },
        { provinceId: 21, provinceName: '辽宁' },
        { provinceId: 22, provinceName: '吉林' },
        { provinceId: 23, provinceName: '黑龙江' },
        { provinceId: 31, provinceName: '上海' },
        { provinceId: 32, provinceName: '江苏' },
        { provinceId: 33, provinceName: '浙江' },
        { provinceId: 34, provinceName: '安徽' },
        { provinceId: 35, provinceName: '福建' },
        { provinceId: 36, provinceName: '江西' },
        { provinceId: 37, provinceName: '山东' },
        { provinceId: 41, provinceName: '河南' },
        { provinceId: 42, provinceName: '湖北' },
        { provinceId: 43, provinceName: '湖南' }
      ],
      areaCode: null,
      areaSelectedList: [],
      cityList: [],
      schoolId: undefined,
      schoolList: [],
      schSelectedList: []
    }
  },
  computed: {
  },
  watch: {
    // 省份变化
    provinceId: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SCHOOL_ADMIN':
            MessageBox.confirm('抱歉,您没有创建新账户的权限', '失败', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.$router.push('/home')
            }).catch(() => {
              this.$router.push('/home')
            })
            break
          default:
            if (this.provinceId && this.provinceId !== old) {
              this.schoolList = []
              this.ifShowSchoolList = false // 隐藏学校列表
              this.areaCode = null
              this.areaSelectedList = []

              switch (this.adminInfo.roleType) {
                case 'SCHOOL_ADMIN':
                  this.ifShowCityTransfer = false
                  this.ifShowCityList = true
                  break
                case 'CITY_ADMIN':
                  this.ifShowCityTransfer = true
                  this.ifShowCityList = false
                  break
                default:
                  break
              }
              getAreaInfo({ province_id: this.provinceId }).then(response => {
                this.cityList = response.data['data']
              })
            }

            break
        }
      }
    },
    // 所选市改变
    areaCode: {
      immediate: true,
      handler(val, old) {
        // 判断自身的角色类型
        switch (this.$store.state.user['roleType']) {
          case 'SUPER_ADMIN':
            // 判断所创建的角色类型
            switch (this.adminInfo.roleType) {
              // 创建校级管理员
              case 'SCHOOL_ADMIN':
                if (this.areaCode && this.areaCode !== old) {
                  this.ifShowSchoolList = true
                  this.listLoading = true
                  getAllSchoolInfo({ areaCode: this.areaCode }).then(response => {
                    this.schoolList = response.data.data
                    this.listLoading = false
                  }).catch(error => {
                    console.log('学校列表请求错误 ' + error)
                  })
                }
                break
              // 创建市级管理员
              case 'CITY_ADMIN':
                console.log(this.areaCode)
                break
              default:
                break
            }
            break
          case 'CITY_ADMIN':
            if (this.areaCode && this.areaCode !== old) {
              this.ifShowSchoolList = true
              this.listLoading = true
              getAllSchoolInfo({ areaCode: this.areaCode }).then(response => {
                this.schoolList = response.data.data
                this.listLoading = false
              }).catch(error => {
                console.log('学校列表请求错误 ' + error)
              })
            }
            break
          default:
            console.log('跳出')
            break
        }
      }
    }
  },
  mounted() {
    switch (this.$store.state.user['roleType']) {
      case 'SUPER_ADMIN':
        this.roleTypeOptions = [
          {
            roleKey: 'CITY_ADMIN',
            roleLabel: '市级管理员'
          },
          {
            roleKey: 'SCHOOL_ADMIN',
            roleLabel: '校级管理员'
          }]
        break
      case 'CITY_ADMIN':
        this.roleTypeOptions = [
          {
            roleKey: 'SCHOOL_ADMIN',
            roleLabel: '校级管理员'
          }]
        break
      case 'SCHOOL_ADMIN':
        break
      default:
        break
    }
  },
  created() {
  },
  methods: {
    handleSchChange(val) {
      this.schSelectedList = val
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

    // 选中账户角色类型改变后设定信息
    roleTypeChanged(val) {
      this.$forceUpdate()
      this.adminInfo.roleType = val
      this.ifShowCityTransfer = false
      this.ifShowCityList = false
      switch (val) {
        case 'CITY_ADMIN':
          this.adminInfo.roleTypeLabel = '市级管理员'
          this.ifShowProvinceList = true
          // 此处重新设置省份为空,无法进行表单验证,否则会导致一直失败
          // 可是我不知道为什么_(:з」∠)_
          // 按理来说改变省份选择并不会触发进入此方法..
          this.provinceId = null
          this.ifShowSchoolList = false
          break
        case 'SCHOOL_ADMIN':
          this.adminInfo.roleTypeLabel = '校级管理员'
          this.ifShowProvinceList = true
          this.provinceId = null
          this.ifShowSchoolList = false
          break
        default:
          break
      }
    },

    // 提交用户信息
    UpdateAdminInfo(adminInfo) {
      this.$refs[adminInfo].validate(valid => {
        if (valid) {
          this.loading = true
          const schools2upload = []
          let citys2upload = []
          const adminInfo2upload = {
            username: this.adminInfo.username,
            password: this.adminInfo.password,
            roleType: this.adminInfo.roleType
          }
          if (this.adminInfo.nickname !== null && this.adminInfo.nickname !== '') {
            adminInfo2upload.nickname = this.adminInfo.nickname
          }
          if (this.adminInfo.tel !== null && this.adminInfo.tel !== '') {
            adminInfo2upload.tel = this.adminInfo.tel
          }
          if (this.adminInfo.sex !== null && this.adminInfo.sex !== '') {
            adminInfo2upload.sex = this.adminInfo.sex
          }
          if (this.adminInfo.email !== null && this.adminInfo.email !== '') {
            adminInfo2upload.email = this.adminInfo.email
          }
          console.log('待提交用户信息', adminInfo2upload)

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
                addUser({ user: JSON.stringify(adminInfo2upload) }).then(response => {
                  const data = response.data.data
                  const userId = data.userId
                  console.log('创建账户成功后返回信息', data)
                  console.log(userId)

                  addAuth({ manaRange: sch2upload, userId: userId }).then((result) => {
                    MessageBox.confirm('创建账户完成', '完成', {
                      confirmButtonText: '确定',
                      type: 'success '
                    }).then(() => {
                      this.$router.push('/administration/adminList')
                    })
                  }).catch((err) => {
                    MessageBox.confirm('已创建用户,授权失败,请稍后在账户列表重试', '失败', {
                      confirmButtonText: '确定',
                      type: 'error'
                    }).then(() => {
                      console.log(err)
                      this.loading = false
                      this.$router.push('/administration/adminList')
                    })
                  })
                }).catch(error => {
                  this.loading = false
                  console.log('添加用户失败', error)
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

                addUser({ user: JSON.stringify(adminInfo2upload) }).then(response => {
                  const data = response.data.data
                  const userId = data.userId
                  console.log('创建账户成功后返回信息', data)
                  console.log(userId)

                  addAuth({ manaRange: citys2upload, userId: userId }).then((result) => {
                    MessageBox.confirm('创建账户完成', '完成', {
                      confirmButtonText: '确定',
                      type: 'success '
                    }).then(() => {
                      this.$router.push('/administration/adminList')
                    })
                  }).catch((err) => {
                    MessageBox.confirm('已创建用户,授权失败,请稍后在账户列表重试', '失败', {
                      confirmButtonText: '确定',
                      type: 'error'
                    }).then(() => {
                      console.log(err)
                      this.loading = false
                      this.$router.push('/administration/adminList')
                    })
                  })
                }).catch(error => {
                  this.loading = false
                  console.log('添加用户失败', error)
                })
              }
              break
          }

          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.el-table{
  margin: 10px 0 2em 10px
}

.el-button{
  margin: 0 5px
}
#admin-avatar {
  margin: 3em 0 2em 5em;
  .el-button{
    margin: 0
  }
}

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
  }
}
</style>
