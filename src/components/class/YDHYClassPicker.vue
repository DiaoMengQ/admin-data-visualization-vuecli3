<template>
  <div class="picker">
    <div class="block">
      <span class="demonstration">年级范围</span>
      <el-slider v-model="grades" range show-stops :max="9" :step="1" @change="getClassList" />
    </div>
    <el-select v-model="classValue" placeholder="请选择班级" class="select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>
<script>
import { getYDHYClassInfo } from '@/api/ydhy'
export default {
  name: 'ClassPicker',
  model: {
    props: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: String,
      required: true
    },
    schoolId: {
      type: [String, Number],
      required: false,
      default: 4404001
    }
  },
  data() {
    return {
      grades: [1, 9], // 年级范围
      classes: [], // 班级列表
      classValue: '' // 当前选中的班级的id
    }
  },
  computed: {
    // 从获取的列表中生成el-select的填充项
    options() {
      if (!this.classes.length) {
        return []
      }
      return this.classes.map(_class => {
        return {
          label: `${_class.className}`,
          value: _class.classId
        }
      })
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
    classValue(newVal) {
      this.$emit('update', newVal)
    },
    schoolId() {
      this.getClassList()
    }
  },
  created() {
    this.getClassList()
  },
  methods: {
    // 获取班级列表
    getClassList() {
      const self = this
      getYDHYClassInfo({
        schoolId: this.schoolId,
        startGradeId: this.grades[0],
        endGradeId: this.grades[1]
      }).then(res => {
        self.classes = res.data.data
        // 如果班级不为空就帮用户选第一个
        self.classes.length && (self.classValue = self.classes[0].classId)
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
