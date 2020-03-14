<template>
  <div class="picker">
    <el-select v-model="schoolVal" placeholder="请选择书籍类型" class="select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>
<script>
import { getSchools } from '@/api/ydhy'
export default {
  name: 'SchoolPicker',
  model: {
    props: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      schools: [], // 班级列表
      schoolVal: '' // 当前选中的类型
    }
  },
  computed: {
    // 从获取的列表中生成el-select的填充项
    options() {
      if (!this.schools.length) {
        return []
      } else {
        return this.schools.map(i => {
          return {
            label: i.schoolName,
            value: i.schoolId
          }
        })
      }
    }
    // 生成年级的标记
    // marks() {
    //   const arr = []
    //   for (let i = 1; i <= 9; i++) {
    //     const temp = {}
    //     temp[i] = `${i}年级`
    //     arr.push(temp)
    //   }
    //   return arr
    // }
  },
  watch: {
    // 监听选中值的变化，告知父组件
    schoolVal(newVal) {
      console.log('newVal', newVal)
      this.$emit('update', newVal)
    }
  },
  created() {
    this.getschools()
  },
  methods: {
    // 获取班级列表
    getschools() {
      const self = this
      getSchools().then(res => {
        self.schools = res.data.data
        // 如果班级不为空就帮用户选第一个
        self.schools.length && (self.schoolVal = self.schools[0].schoolId)
      })
    }
  }
}
</script>
<style scoped>
.picker {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
}
.select{
  flex: 1;
}
.block{
  flex: 1;
  margin-right: 20px;
}
</style>
