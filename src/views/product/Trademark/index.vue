<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" size="mini" @click="addTrademark">添加</el-button>
    <!-- 
      表格组件
      data：表格组件将来需要展示的数据---array
      border：是给表格添加边框
      column属性
        label：显示标题
        width：对应列的宽度
        align：标题的对齐方式
        prop：对应列内容的字段名
      注意：elementUI当中的table组件，展示的数据是以一列一列进行展示数据的
     -->
    <el-table style="width: 100%" border :data="trademarkList">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 50px; heigth: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      当前第几页current-page
      分页器数据总条数total
      每一页展示条数page-size
      设置每一页展示多少条数据page-sizes
      按钮的数量pager-count 如果是9，那么连续页码是7
      @current-change currentPage 改变时会触发
      @size-change pageSize 改变时会触发
     -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes "
      :total="total"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      对话框
      visible.sync：控制对话框显示与隐藏用的
     -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 
        form表单 
        :model属性，这个属性的作用是，把表单的数据收集到某个对象(tmForm)的身上，将来表单验证，也需要这个属性
        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
       -->
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input autocomplete="off" style="width:80%" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 
            上传图片
            这里收集数据，不能使用v-model，因为不是表单元素
            action：设置图片上传的地址
            :on-success：可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以再上传图片之前，执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if(value.length<2 || value.length>10) {
        callback(new Error('品牌名称2-10位'))
      } else {
        callback()
      }
    };
    return {
      // 列表展示的数据
      trademarkList: [],
      // 代表分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 收集品牌信息：对象身上的属性，不能瞎写，需要看文档
      tmForm:{
        logoUrl:'',
        tmName:''
      },
      // 表单验证规则
      rules:{
        // require：必须要校验字段（与前面的*有关系） message：提示信息  trigger：用户行为设置（事件的设置：blur、change）
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌LOGO的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌LOGO' }
        ],
      }
    };
  },
  methods: {
    // 获取品牌列表的数据
    async getTrademarkList(currrentPage = 1) {
      this.page = currrentPage;
      // 解构出参数
      const { page, limit } = this;
      // 当你向服务器发请求的时候，这个函数需要带参数，因此需要在data当中初始化两个字段，代表给服务器传递参数
      let result = await this.$API.trademark.reqTrademarkList(page, limit);
      if (result.code == 200) {
        // 列表展示的数据
        this.trademarkList = result.data.records;
        this.page = result.data.current;
        // 展示数据总条数
        this.total = result.data.total;
      }
    },
    // 当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      // 整理参数并发请求
      this.limit = limit;
      this.getTrademarkList();
    },
    // 确认添加或修改品牌数据
    addOrUpdateTrademark() {
      // 当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段符合条件
        if (success) {
          // 隐藏对话框
          this.dialogFormVisible=false
          // 发请求
          let result = await this.$API.trademark.reqAddOrUpdateTrademark(this.tmForm)
          if(result.code==200) {
            // 弹出信息：添加品牌成功、修改品牌成功
            this.$message({
              message:this.tmForm.id?'修改品牌成功':'添加品牌成功',
              type:'success'
            })
            // 添加或者修改品牌成功之后，需要再次获取品牌列表进行展示
            // 如果添加品牌：停留在第一页，如果修改品牌：留在当前页面
            this.getTrademarkList(this.tmForm.id?this.page:1)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 点击添加品牌按钮
    addTrademark() {
      // 显示对话框
      this.dialogFormVisible=true
      this.tmForm= {
        logoUrl:'',
        tmName:''
      }
    },
    // 点击修改品牌信息按钮
    updateTrademark(row) {
      // row：当前用户选中这个品牌信息
      // 显示对话框
      this.dialogFormVisible=true
      // 将已有的品牌信息赋值给tmForm进行展示，将服务器返回的品牌信息，直接赋值给tmForm进行展示
      // tmForm存储的数据就是服务器返回的品牌信息
      // {...row} 浅拷贝row
      this.tmForm={...row}
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res：上传成功之后返回给前端的数据（包括图片在服务器上真实的地址）
      this.tmForm.logoUrl=res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 删除品牌的操作
    deleteTrademark(row) {
      // messagebox弹框
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当用户点击确定按钮的时候会触发
        // 向服务器发请求
        let result = await this.$API.trademark.reqDeleteTrademark(row.id)
        // 如果删除成功
        if(result.code==200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 再次获取品牌列表数据
          this.getTrademarkList(this.trademarkList.length>1?this.page:this.page-1)
        }
      }).catch(() => {
        // 当用户点击取消按钮的时候会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  // 组件挂载完毕发请求
  mounted() {
    // 获取列表数据方法
    this.getTrademarkList();
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>