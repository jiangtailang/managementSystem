<template>
  <div>
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :available="scene==0"
      ></CategorySelect>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show='scene==0'>
        <el-button type="primary" icon="el-icon-plus" :disabled='!categoryId.category3Id' @click="addSpuInfo">添加SPU</el-button>
        <el-table style="width: 100%" :data="categoryId.category3Id?spuList:[]" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSkuInfo(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpuInfo(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="showSkuList(row)"></HintButton>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm='confirmDeleteSpu(row)'>
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSpuList">
        </el-pagination>
      </div>
      <SpuForm v-show='scene==1' ref="spuForm" @changeScene='changeScene'></SpuForm>
      <SkuForm v-show='scene==2' ref="skuForm" @changeScenes='changeScenes'></SkuForm>
    </el-card>
    <el-dialog :title="`${spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="beforeCloseDialog">
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column align="center" prop="skuName" label="名称" > </el-table-column>
        <el-table-column align="center" prop="price" label="价格" > </el-table-column>
        <el-table-column align="center" prop="weight" label="重量" > </el-table-column>
        <el-table-column align="center" label="默认图片" >
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  components:{SpuForm,SkuForm},
  data() {
    return {
      // 三级联动是否可用
      isShow: true,
      // 三级ID
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      // 分页器当前页码
      page: 1,
      // 每一页展示多少条数据
      limit: 3,
      // Spu总共多少条数据
      total: 0,
      // spu列表数据
      spuList: [],
      //场景模式切换 0展示SPU列表结构，1添加SPU|修改SPU，2展示添加SKU结构
      scene:0,
      // 控制skuList显示与隐藏
      dialogTableVisible: false,
      // 某一要展示sku列表的spu名称
      spuName:0,
      // 某一spu的sku列表
      skuList:[],
      // 加载
      loading:false
    };
  },
  methods: {
    // 三级联动的自定义事件回调，获取三级ID并发请求获取Spu数据
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.categoryId.category1Id = categoryId;
      } else if (level == 2) {
        this.categoryId.category2Id = categoryId;
      } else {
        this.categoryId.category3Id = categoryId;
        // 发请求获取Spu数据
        this.getSpuList();
        // 场景切换为 展示SPU列表结构 模式
        this.scene==0
      }
    },
    // 获取Spu列表数据
    async getSpuList(currentPage = 1) {
      // 更新当前页码，默认为1
      this.page=currentPage
      // 发请求获取spu数据
      let result = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.categoryId.category3Id
      );
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 切换每页展示数据条数
    handleSizeChange(limit) {
      // 修改参数
      this.limit=limit
      // 发请求
      this.getSpuList()
    },
    // 修改某一Spu信息
    updateSpuInfo(row) {
      // 将场景变为 添加SPU|修改SPU 模式
      this.scene=1
      // 通过$refs获取子组件发请求
      this.$refs.spuForm.initSpuData(row)
    },
    // 自定义事件回调（SpuForm）切换场景
    changeScene({scene,flag}) {
      this.scene=scene
      this.getSpuList(flag=='edit'?this.page:1)
    },
    // 添加一个spu
    addSpuInfo() {
      this.scene=1
      this.$refs.spuForm.getTrademarkAndSale(this.categoryId.category3Id)
    },
    // 确认删除spu
    async confirmDeleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200) {
        this.$message({type:'success',message:'删除成功'})
        // 代表展示spu个数大于1时，停留在当前页，小于1时，留在上一页
        this.getSpuList(this.spuList.length>1?this.page:this.page-1)
      }
    },
    // 为spu添加一个sku实例
    addSkuInfo(row) {
      this.scene=2
      this.$refs.skuForm.getSkuInfoData(row,this.categoryId.category1Id,this.categoryId.category2Id)
    },
    // 自定义事件回调（SkuForm）切换场景
    changeScenes(scene) {
      this.scene=scene
    },
    // 展示某一spu的skuList 
    async showSkuList(row) {
      // 对话框可见
      this.dialogTableVisible=true
      // 保存spuName字段
      this.spuName=row.spuName
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code==200) {
        // loading隐藏
        this.loading=false
        this.skuList=result.data
      }
    },
    // 关闭skuList之前调用
    beforeCloseDialog(done) {
      // loading属性再次变为真
      this.loading=true
      // 清除sku列表的数据
      this.skuList=[]
      // 关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>