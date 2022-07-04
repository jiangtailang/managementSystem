<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId='getCategoryId' :available='isShowTable'></CategorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled='!categoryId.category3Id' @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%" border :data='categoryId.category3Id?attrList:[]'>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column label="属性列表">
            <template slot-scope="{row}">
              <el-tag type="success" v-for="attr in row.attrValueList" :key="attr.id" style="margin:0 10px">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" label-width="80" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled='!attrInfo.attrName'>添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="attrInfo"
            label="属性值名称"
            width="width">
            <template slot-scope="{row,$index}">
              <el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini" :ref="$index" v-if="row.flag" @blur="blurAttrValue(row,$index)" @keyup.enter.native="row.flag=false"></el-input>
              <span v-else @click="updateAttrValue(row,$index)" style="display:block;heigth:5px">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <!-- popconfirm气泡确认框 -->
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确认删除${row.valueName}?`" @onConfirm='deleteAttrValue($index)'>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrValue" :disabled='attrInfo.attrValueList.length<1'>保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      // 商品的三级ID
      categoryId:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      // 平台属性列表
      attrList:[],
      // ‘查看模式与编辑模式’切换
      isShowTable:true,
      // 收集新增属性|修改属性信息
      attrInfo:{
        attrName: "",  //属性名
        attrValueList: [],  //属性值，因为属性值可以有多个，因此用数组，每一个属性值都是一个对象需要attrId、valueName
        categoryId: 0,  //三级分类的id
        categoryLevel: 3, //三级分类（服务器也需要区分几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({categoryId,level}) {
      // 区分、获取以及存储商品的三级ID
      if(level==1) {
        this.categoryId.category1Id=categoryId
      } else if (level==2) {
        this.categoryId.category2Id=categoryId
      } else {
        this.categoryId.category3Id=categoryId
        this.getAttrInfoList()
      }
    },
    // 发请求获取平台属性信息
    async getAttrInfoList() {
      // 解构出参数
      const {category1Id,category2Id,category3Id} = this.categoryId
      let result = await this.$API.attr.reqAttrInfoList(category1Id,category2Id,category3Id)
      if(result.code==200) {
        this.attrList=result.data
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId：是相应属性的id
      // 如果是添加属性并添加属性值，还没有相应的属性id，暂时给服务器undefined
      // 如果是在已有属性值的基础上新增属性值，就给已有属性的id
      // valueName：相应属性值的名称
      // flag：给每一个属性值添加一个标记flag，每一个属性值可以控制自己的模式切换
      // 由于是数组push，所以flag属性是响应式数据（数据变化视图跟着变化）
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id || undefined,
        valueName: "",
        flag:true
      })
      // 给新增的input自动聚焦
      this.$nextTick(() => {this.$refs[this.attrInfo.attrValueList.length-1].focus()})
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable=false
      // 清除数据，收集三级分类的id
      this.attrInfo={
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId.category3Id,
        categoryLevel: 3,
      }
    },
    // 编辑属性按钮
    editAttr(row) {
      // 切换到编辑属性视图
      this.isShowTable=false
      // 将选中的属性赋值给attrInfo
      // 由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决问题
      this.attrInfo=cloneDeep(row)
      // 给每一个属性值打上标记flag
      // 因为Vue无法监测到普通新增property，所以 item.flag=false 不会起作用，这样书写的属性不是响应式数据
      // 使用$set可以添加响应式属性
      this.attrInfo.attrValueList.forEach(item => this.$set(item,'flag',false))
    },
    // 失去焦点的事件，切换为查看模式，展示span
    blurAttrValue(row,index) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示
      if(row.valueName.trim()=='') {
        this.$message({type:'warning',message:'亲，属性值不能为空或者空格哦！'})
        this.attrInfo.attrValueList.splice(index,1)
        return
      }
      // 新增的属性值不能与已有的属性值重复  
      // some 只要有一个对，就返回true
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if(row!==item) {  //把row自身对应的index去除
          return row.valueName == item.valueName
        }
      })
      // 如果有重复，把当前row对应的index删除
      if (isRepeat) {
        this.$message({type:'warning',message:'亲，属性值不能重复哦！'})
        this.attrInfo.attrValueList.splice(index,1)
        return
      } 
      row.flag=false
    },
    // 点击span的回调，变为编辑模式，更新属性值
    updateAttrValue(row,index) {
      row.flag=true
      // $nextTick当节点渲染完毕了，执行一次
      this.$nextTick(() => {
        // 通过ref获取input节点，实现自动聚焦
        this.$refs[index].focus()
      })
    },
    // 删除属性按钮的回调
    async deleteAttr(row) {
      let result = await this.$API.attr.reqDeleteAttr(row.id)
      if(result.code==200) {
        this.$message({type:'success',message:'删除成功'})
        // 发请求获取最新平台属性信息
        this.getAttrInfoList()
      }
    },
    // 气泡确认框确认删除属性值按钮的回调
    deleteAttrValue(index) {
      // 当前删除属性值操作不需要发请求，等到下面保存的时候发请求
      this.attrInfo.attrValueList.splice(index,1)
      this.$message({type:'success',message:"删除成功"})
    },
    // 保存操作
    async saveAttrValue() {
      // 向服务器发请求之前，先清除flag标记
      this.attrInfo.attrValueList.forEach(item => delete item.flag)
      // 发请求保存平台属性的修改
      let result = await this.$API.attr.reqSaveAttrInfo(this.attrInfo)
      if(result.code==200) {
        this.$message({type:'success',message:'保存成功'})
        // 发请求获取最新平台属性信息数据
        this.getAttrInfoList()
        // 切换到展示平台属性视图
        this.isShowTable=true
      }
    }
  },
};
</script>

<style>
</style>