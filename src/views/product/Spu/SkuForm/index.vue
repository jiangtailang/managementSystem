<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spuInfo.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)"><el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input></el-form-item>
      <el-form-item label="重量(千克)"><el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input></el-form-item>
      <el-form-item label="规格描述"><el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input></el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column width="60px" type="selection" align="center"></el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认</el-button>
              <el-button type="success" size="mini" v-else plain>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancelSaveSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // spu信息
      spuInfo: {},
      // 平台属性列表
      attrInfoList: [],
      // 销售属性列表
      saleAttrList: [],
      // 图片列表
      spuImageList: [],
      // 添加sku的信息
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定收集
        price: 0,
        skuDesc: "",
        skuName: "",
        weight: "",
        // 第三类：需要自己写代码收集
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        // 图片列表
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId:0
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      // 选中的图片的信息
      selectImageList:[]
    };
  },
  methods: {
    // 获取sku基础信息数据
    async getSkuInfoData(spu, category1Id, category2Id) {
      this.spuInfo = spu;
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取平台属性
      let attrResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        this.spuInfo.category3Id
      );
      if (attrResult.code == 200) {
        this.attrInfoList = attrResult.data;
      }
      // 获取销售属性
      let saleAttrResult = await this.$API.spu.reqSpuSaleAttrList(this.spuInfo.id);
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
      // 获取图片列表
      let spuImageListResult = await this.$API.spu.reqSpuImageList(
        this.spuInfo.id
      );
      if (spuImageListResult.code == 200) {
        let list = spuImageListResult.data
        // 添加isDefault字段
        list.forEach(item => item.isDefault=0)
        this.spuImageList = list
      }
    },
    // 当图片前的复选框发生变化时会触发该事件
    handleSelectionChange(selection) {
      // 获取到用户选中图片的信息数据
      this.selectImageList=selection
    },
    // 设置为默认图片
    changeDefault(row) {
      // 排他操作
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg=row.imgUrl
    },
    // 保存添加的sku信息
    async saveSkuInfo() {
      // 整理参数
      const {attrInfoList,saleAttrList,selectImageList,skuInfo} = this
      // 平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId) {
          const [ attrId,valueId ] = item.attrIdAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 销售属性
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev,item) => {
        if(item.saleAttrIdAndValueId) {
          const [ saleAttrId,saleAttrValueId ] = item.saleAttrIdAndValueId.split(":")
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 图片列表
      skuInfo.skuImageList = selectImageList.map((item) => {
        return {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            isDefault: item.isDefault,
            spuImgId:item.id
        }
      })
      // 发请求保存添加的sku信息
      let result = await this.$API.spu.reqSaveSkuInfo(skuInfo)
      if(result.code==200) {
        this.$message({type:'success',message:'添加sku成功'})
        // 切换场景
        this.$emit('changeScenes',0)
        // 清除数据
        Object.assign(this._data,this.$options.data())
      }
    },
    // 点击取消保存的按钮
    cancelSaveSku() {
      this.$emit('changeScenes',0)
      Object.assign(this._data,this.$options.data())
    }
  },
};
</script>

<style>
</style>