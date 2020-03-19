<template>
  <el-row type="flex" justify="center" style="height:400px">
    <el-col :span="17" class="cropper-content">
      <div class="cropper">
        <!-- 参考文档: https://github.com/xyxiao001/vue-cropper -->
        <vueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="false"
          :fixed="true"
          :fixed-number="[1,1]"
          :full="option.full"
          :center-box="true"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :fixed-box="option.fixedBox"
          :enlarge="option.enlarge"
          @realTime="realTime"
        />
      </div>
    </el-col>

    <el-col :span="24" class="bottom-button">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="http://bdps.oss-cn-shenzhen.aliyuncs.com"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :on-exceed="imgOnExceed"
        :file-list="fileList"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
        :show-file-list="false"
      >
        <el-button slot="trigger" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传图片</el-button>
      </el-upload>
    </el-col>

  </el-row>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { createUploadHeadImgOss } from '@/api/user'
import axios from 'axios'

export default {
  name: 'AvatarUpload',
  components: {
    vueCropper: VueCropper
  },
  data() {
    return {
      fileList: [],

      headImg: '',
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: false,
        autoCrop: true,
        fixedBox: false, // 是否固定截图框大小 不允许改变
        enlarge: 1 // 图片根据截图框输出比例倍数
      },
      fileName: '', // 本机文件地址
      downImg: '#',
      uploadImgRelaPath: '' // 上传后的图片的地址（不带服务器域名）
    }
  },
  methods: {
    // 提交上传
    submitUpload() {
      // 创建axios实例
      const service = axios.create({
        baseURL: process.env.VUE_APP_BASE_API,
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
        transformRequest: [function(data) {
          let res4format = ''
          for (const it in data) {
            res4format += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          res4format = res4format.substring(0, res4format.lastIndexOf('&'))
          return res4format
        }],
        timeout: 4 * 1000 // 请求超时
      })

      service.interceptors.response.use(response => {
        const res = response.data
        console.log('返回的数据： ', res)
        return response
      }, error => {
        return Promise.reject(error)
      })
      // const data = { username: 'superadmin', password: 'e10adc3949ba59abbe56e057f20f883e' }
      // const res = service({
      //   url: '/user/login',
      //   method: 'post',
      //   data
      // })
      // console.log(res)

      const avatorUploadInfo = new FormData()
      createUploadHeadImgOss().then((result) => {
        const data = result.data.data
        // console.log(data)
        avatorUploadInfo.append('key', data.key)
        avatorUploadInfo.append('callback', data.callback)
        avatorUploadInfo.append('ossaccessKeyId', data.ossaccessKeyId)
        avatorUploadInfo.append('policy', data.policy)
        avatorUploadInfo.append('signature', data.signature)
        for (const key in data.myvars) {
          avatorUploadInfo.append(key, data.myvars[key])
        }
        // console.log(avatorUploadInfo.get('ossaccessKeyId')) // 测试是否存放完成

        // 获取截图的 base64 数据
        this.$refs.cropper.getCropData(data => {
          console.log('字节长度', Buffer.byteLength(data, 'base64') / 1024 + 'kb')

          const imgBuffer = Buffer.from(data, 'base64')
          //   console.log(imgBuffer)
          avatorUploadInfo.append('file', imgBuffer)

          const res = service({
            url: 'http://bdps.dwllm.top',
            method: 'post',
            avatorUploadInfo
          })
          console.log(res)

          // if (res === 'success') {
          //   this.$message({
          //     type: 'success',
          //     message: '上传成功'
          //   })
          // }
        })
      }).catch((err) => {
        console.log(err)
      })
    },

    // 将用户选择的图片放入裁剪区
    getSelectdImg(file) {
      console.log('本地图片', file)
      this.fileName = file.name
      const reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
        event.target.value = '' // 避免每次选择同样的文件时，input @change 方法不执行问题
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    // 文件数超出限制时
    imgOnExceed(files, fileList) {
      // console.log('超出限制', files[0])
      this.fileList = [files[0]]
      this.getSelectdImg(files[0])
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      // console.log('状态改变', file)
      this.fileList = fileList.slice(-3)
      this.getSelectdImg(file.raw)
    },
    // 文件列表移除文件时
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 点击文件列表中已上传的文件时
    handlePreview(file) {
      console.log('已上传的文件', file)
    },

    // 实时预览函数
    realTime(data) {
    //   console.log('实时预览',data)
      this.previews = data
    },
    // 下载图片
    down() {
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      this.$refs.cropper.getCropBlob(data => {
        this.downImg = window.URL.createObjectURL(data)
        aLink.href = window.URL.createObjectURL(data)
        aLink.click()
      })
    }

  }
}
</script>

<style lang="scss">
// 底部按钮建
.bottom-button {
  position: absolute;
  bottom: 0;
//   width: 80%;
  height: 4rem;
  .upload-demo{
    text-align: center
  }
}
//改变背景色
.cropper-box {
  background: #333 !important;
}
//使截图框变为圆角
.cropper-crop-box {
  overflow: hidden;
  border-radius: 2% !important;
}
//截图相关样式
.cropper-content {
  .cropper {
    width: 70%;
    height: 70%;
    position: absolute;
  }
}
</style>
