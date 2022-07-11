<template>
  <div>
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:90px;height:90px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column label="操作" width="width" align="center">
        <template slot-scope="{row}">
          <el-button type="success" icon='el-icon-top' size="mini" v-if="!row.isSale" @click="onSale(row)"></el-button>
          <el-button type="info" icon='el-icon-bottom' size="mini" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon='el-icon-edit' size="mini" @click="$message('正在开发中，敬请期待...')"></el-button>
          <el-button type="info" icon='el-icon-info' size="mini" @click="showSkuInfo(row)"></el-button>
          <el-button type="danger" icon='el-icon-delete' size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center"
      :current-page="1"
      :page-sizes="[3, 5, 10]"
      :page-size="5"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="55"
      @size-change="handleSizeChange"
      @current-change="getSkuList">
    </el-pagination>
    <el-drawer :visible.sync="showDrawer" size='50%' :show-close='false' :before-close="handleClose">
      <el-row>
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <template>
            <el-tag type="success" style="margin-right:10px" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <div class="block">
            <el-carousel height="500px">
              <el-carousel-item v-for="skuImg in skuInfo.skuImageList" :key="skuImg.id">
                <img :src="skuImg.imgUrl" style="width:100%;height:100%">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      // 分页器当前第几页
      page:1,
      // 分页器每页展示多少条数据
      limit:5,
      // 分页器一共有多少条数据
      total:0,
      // skuList
      skuList:[],
      // 控制抽屉的显示与隐藏
      showDrawer:false,
      // 某一sku具体信息
      skuInfo:{}
    }
  },
  methods:{
    // 获取Skulist数据
    async getSkuList(current = 1) {
      this.page = current
      let result = await this.$API.sku.reqSkuList(this.page,this.limit)
      if(result.code==200) {
        this.skuList=result.data.records
        this.total=result.data.total
      }
    },
    // limit 改变时会触发
    handleSizeChange(pageSize) {
      this.limit=pageSize
      this.getSkuList()
    },
    // 上架
    async onSale(row) {
      let result = await this.$API.sku.reqOnsale(row.id)
      if(result.code == 200) {
        row.isSale = 1
        this.$message({type:'success',message:'上架成功'})
      }
    },
    // 下架
    async cancelSale(row) {
      let result =await this.$API.sku.reqCancelSale(row.id)
      if(result.code==200) {
        row.isSale=0
        this.$message({type:'success',message:'下架成功'})
      }
    },
    // 展示某一sku具体信息，显示抽屉
    async showSkuInfo(row) {
      this.showDrawer=true
      let result = await this.$API.sku.reqSkuById(row.id)
      if(result.code==200) {
        this.skuInfo=result.data
      }
    },
    // 抽屉关闭之前的回调
    handleClose(done) {
      done()
      // 置空skuInfo
      this.skuInfo={}
    }
  },
  mounted() {
    // 获取Skulist数据
    this.getSkuList()
  }
};
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
<style scoped>
.el-col-6 {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}
.el-col {
  padding: 10px 10px;
}
>>>.el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>