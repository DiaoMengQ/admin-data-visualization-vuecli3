<template>
  <div>
    <!-- 年级 -->
    <el-col :xs="24" :sm="12" :lg="8" :xl="8">
      <el-form-item label-width="100px" label="年级:" class="postInfo-container-item">
        <el-select v-model="gradeId" clearable placeholder="请选择" @change="handleGradeSelected">
          <el-option
            v-for="grade in gradeList"
            :key="grade.gradeId"
            :label="grade['gradeName']"
            :value="grade.gradeId"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <!-- 班级 -->
    <el-col :xs="24" :sm="12" :lg="8" :xl="8">
      <el-form-item label-width="100px" label="班级:" class="postInfo-container-item">
        <el-select v-model="classId" clearable placeholder="请选择" @change="handleClassSelected">
          <el-option
            v-for="cla in classList"
            :key="cla.classId"
            :label="cla['className']"
            :value="cla.classId"
          />
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import { gradeList } from '@/utils/multiple'
import { getClassinGrade } from '@/api/qcpj'

export default {
  name: 'ClassPicker',
  props: {
    schoolId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      classId: '',
      classList: [],

      gradeId: '',
      gradeList: []
    }
  },
  watch: {
    schoolId: {
      immediate: true,
      handler() {
        this.gradeId = null
        this.classId = null
      }
    }
  },
  created() {
    this.gradeList = gradeList()
  },
  methods: {
    // 选择年级后请求班级列表
    handleGradeSelected() {
      this.$emit('selected-class-change', { schoolId: this.schoolId, gradeId: this.gradeId, classId: this.classId })
      getClassinGrade({ schoolId: this.schoolId, startGradeId: this.gradeId, endGradeId: this.gradeId }).then((result) => {
        this.classList = result.data.data
        // console.log('班级列表', this.classList)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 选择班级改变后
    handleClassSelected() {
      this.$emit('selected-class-change', { schoolId: this.schoolId, gradeId: this.gradeId, classId: this.classId })
    }
  }
}
</script>

<style>

</style>
