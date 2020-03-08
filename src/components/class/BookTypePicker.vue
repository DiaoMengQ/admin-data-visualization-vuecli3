<template>
  <div class="picker">
    <el-select v-model="typeValue" placeholder="请选择书籍类型" class="select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>
<script>
import { getBookTypes } from '@/api/ydhy'
export default {
  name: 'BookTypePicker',
  model: {
    props: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bookTypes: [], // 班级列表
      typeValue: '' // 当前选中的类型
    }
  },
  computed: {
    // 从获取的列表中生成el-select的填充项
    options() {
      const map = {
        'cate': 'cate',
        'category_kexue': '科学',
        'category_lishi': '历史',
        'category_manhua': '漫画',
        'category_mingren': '名人',
        'category_mingzhu': '名著',
        'category_parents': '亲情',
        'category_shenhua': '神话',
        'category_shige': '诗歌',
        'category_shuxue': '数学',
        'category_teachers': '教育',
        'category_tonghua': '童话',
        'category_xiaoshuo': '小说'
      }
      if (!this.bookTypes.length) {
        return []
      } else {
        return this.bookTypes.map(i => {
          return {
            label: map[i],
            value: i
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
    typeValue(newVal) {
      this.$emit('update', newVal)
    }
  },
  created() {
    this.getBookTypes()
  },
  methods: {
    // 获取班级列表
    getBookTypes() {
      const self = this
      getBookTypes().then(res => {
        self.bookTypes = res.data.data
        // 如果班级不为空就帮用户选第一个
        self.bookTypes.length && (self.typeValue = self.bookTypes[0])
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
