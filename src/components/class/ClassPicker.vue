<template>
  <div>
    <el-col :xs="24" :lg="12" :xl="8">
      <el-form-item label-width="100px" label="年级:" class="postInfo-container-item">

        <el-select v-model="gradeId" clearable placeholder="请选择" @change="getClassList">
          <el-option
            v-for="grade in gradeList"
            :key="grade.gradeId"
            :label="grade['gradeName']"
            :value="grade.gradeId"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :xs="24" :lg="12" :xl="8">
      <el-form-item label-width="100px" label="班级:" class="postInfo-container-item">
        <el-select v-model="classValue" placeholder="请选择班级" class="select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
import { getClassinGrade } from '@/api/qcpj'
import { gradeList } from '@/utils/multiple'
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
      type: Number,
      required: true
    }
  },
  data() {
    return {
      gradeId: 1,
      gradeList: [],
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
    this.gradeList = gradeList()
    this.schoolId && this.getClassList()
  },
  methods: {
    // 获取班级列表
    getClassList() {
      console.log('getClass')
      const self = this
      getClassinGrade({
        schoolId: this.schoolId,
        startGradeId: this.gradeId,
        endGradeId: this.gradeId
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
}
</style>
