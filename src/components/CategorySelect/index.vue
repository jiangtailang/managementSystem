<template>
  <div>
      <!-- inline：代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1List" :disabled='!available'>
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in cList1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2List" :disabled='!available'>
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in cList2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3List" :disabled='!available'>
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in cList3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'CategorySelect',
    props:['available'],
    data() {
        return {
            // 一级分类列表
            cList1:[],
            // 二级分类列表
            cList2:[],
            // 三级分类列表
            cList3:[],
            // 收集表单数据
            cForm:{
                category1Id:'',
                category2Id:'',
                category3Id:'',
            }
        }
    },
    methods:{
        // 获取一级分类列表
        async getCategory1List() {
            let result = await this.$API.attr.reqCategory1List()
            if(result.code==200) {
                this.cList1=result.data
            }
        },
        // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应的二级分类的数据）
        async handler1List() {
            // 先置空二级列表、三级列表、cForm中的category2Id、category3Id以及父组件中的category2Id、category3Id
            this.cList2=[]
            this.cList3=[]
            this.cForm.category2Id=''
            this.cForm.category3Id=''
            this.$parent.$parent.categoryId.category2Id=''
            this.$parent.$parent.categoryId.category3Id=''
            // 解构出一级分类的id
            const {category1Id} = this.cForm
            // 通过一级分类的id，发请求获取二级分类的数据
            let result = await this.$API.attr.reqCategory2List(category1Id)
            if(result.code==200) {
                this.cList2=result.data
            }
            // 触发自定义事件，将一级分类的id传给父组件
            this.$emit('getCategoryId',{categoryId:this.cForm.category1Id,level:1})
        },
        // 二级分类的select事件回调（当二级分类的option发生变化的时候获取相应的三级分类的数据）
        async handler2List() {
            // 先置空三级列表、cForm中的category3Id以及父组件中的category3Id
            this.cList3=[]
            this.cForm.category3Id=''
            this.$parent.$parent.categoryId.category3Id=''
            // 解构出参数
            const {category2Id} = this.cForm
            // 通过二级分类的id，发请求获取三级分类的数据
            let result = await this.$API.attr.reqCategory3List(category2Id)
            if(result.code==200) {
                this.cList3=result.data
            }
            // 触发自定义事件，将二级分类的id传给父组件
            this.$emit('getCategoryId',{categoryId:this.cForm.category2Id,level:2})
        },
        // 三级分类的select事件回调
        handler3List() {
            // 触发自定义事件，将三级分类的id传给父组件
            this.$emit('getCategoryId',{categoryId:this.cForm.category3Id,level:3})
        }
    },
    // 组件挂载完毕
    mounted() {
        // 向服务器发请求，获取相应的一级分类的数据
        this.getCategory1List()
    }
};
</script>

<style>
</style>