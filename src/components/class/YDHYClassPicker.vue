<template>
  <div>
    <el-form>
      <el-row>
        <!-- 年级 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="年级:" class="postInfo-container-item">
            <el-select v-model="gradeId" placeholder="请选择" @change="getClassList">
              <el-option
                v-for="gra in grades"
                :key="gra.gradeId"
                :label="gra.gradeName"
                :value="gra.gradeId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="班级:" class="postInfo-container-item">
            <el-select v-model="classValue" placeholder="请选择班级" class="select">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
<script>
import { getYDHYClassInfo } from '@/api/ydhy'
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
      type: [String, Number],
      required: false,
      default: null
    }
  },
  data() {
    return {
      gradeId: null,
      grades: [], // 年级范围
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
    schoolId() {
      this.gradeId = null
      this.classValue = null
    },
    // 监听选中值的变化，告知父组件
    classValue(newVal) {
      if (newVal) { this.$emit('update', newVal) }
    },
    gradeId() {
      if (this.gradeId && this.schoolId) { this.getClassList() }
    }
  },
  created() {
    this.grades = gradeList()
  },
  methods: {
    // 获取班级列表
    getClassList() {
      const self = this
      const para = {
        schoolId: this.schoolId,
        startGradeId: this.gradeId,
        endGradeId: this.gradeId
      }
      // console.log('参数', para)
      getYDHYClassInfo(para).then(res => {
        // console.log('班级数据', res.data.data)
        self.classes = res.data.data
        // 如果班级不为空就帮用户选第一个
        self.classes.length && (self.classValue = self.classes[0].classId)
      })
    }
  }
}
</script>
<style scoped>
</style>
