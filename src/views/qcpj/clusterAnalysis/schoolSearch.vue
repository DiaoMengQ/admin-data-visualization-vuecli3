<template>
  <div id="app">
    <el-tag>{{ schoolId }}</el-tag>

    <p>
      <!-- 学生年级 -->
      年级：
      <el-select
        id="Grade"
        v-model="stugrade"
        name="grade"
        clearable
        placeholder="请选择年级"
        style="width:150px"
        @change="GradeChange(stugrade)"
      >
        <el-option
          v-for="(item,istugrade) in 6"
          :key="istugrade"
          :value="item"
          :label="item+'年级'"
        />
      </el-select>

      <!-- 学生班级 -->
      班级：
      <el-select
        id="Class"
        v-model="stucla"
        name="class"
        clearable
        placeholder="请选择班级"
        style="width:150px"
        @change="ClassChange (stucla)"
      >
        <el-option
          v-for="(claId,istucla) in getGrade"
          :key="istucla"
          :value="claId.classId"
          :label="claId.className"
        />
      </el-select>

      <!-- 班级学生人数 -->
      班级学生：
      <el-select
        id="Student"
        v-model="stunum"
        name="student"
        clearable
        placeholder="请选择该班级的学生"
        style="width:180px"
        @change="StuChange(stunum)"
      >
        <el-option
          v-for="(stu,istu) in getClass"
          :key="istu"
          :value="stu.studentId"
          :label="stu.name"
        />
      </el-select></p>

  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import echarts from 'echarts'
import 'echarts/theme/macarons'
import { getClassinGrade, getStuinClass, getStuSemester } from '@/api/qcpj'

export default {
  data() {
    return {
      schoolId: -1
    }
  },
  computed: {
    // 将获取到该年级的所有班级放在computed中、做计算属性、当vuex的值发生改变会对应改变

  },
  watch: {
  },
  created() {
    const id = this.$route.params && this.$route.params.schoolId
    console.log(id)
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 30px;
}
</style>
