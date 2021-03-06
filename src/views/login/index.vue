<template>
  <div class="login-container">
    <!-- https://github.com/ZYSzys/vue-canvas-nest -->
    <vue-canvas-nest :config="{color:'0,112,255', count: 50}" style="z-index:1" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/multiple'
import vueCanvasNest from 'vue-canvas-nest'

export default {
  name: 'Login',
  components: { vueCanvasNest },
  data() {
    // 判断用户名是否有效
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名和密码'))
      } else {
        callback()
      }
    }
    // 判断用户输入的密码格式是否正确
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于 6 位数!'))
      } else {
        callback()
      }
    }
    return {
      // 登录框默认值
      loginForm: {
        username: 'superadmin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    /** 如果 `router` 发生改变，这个函数就会运行 */
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 密码隐藏和显示
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    // 登录判断 登录按键触发事件
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 做耗时操作时显示loading动画效果
          this.loading = true
          /**
           * 一个 store.dispatch 在不同模块中可以触发多个 action 函数。
           * 在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。
           */
          this.$store.dispatch('user/login', this.loginForm) // 触发命名为login的Action
            .then(() => {
              // 当前路由路径
              this.$router.push({ path: this.redirect || '/' }) // 登录成功之后重定向到主页
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('发生传输错误!') // 登录信息传输错误提示错误
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

/* input 背景 光标变色 */
$bg: #283443;
$light_gray: #fff;
$input_color:#1f243b;
$cursor: #1f243b;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $input_color;
      height: 47px;
      caret-color: $cursor;
      font-size: 1.2em;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fbfbfb;
$dark_gray: #889aa4;
$light_gray: #2f3c53;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
