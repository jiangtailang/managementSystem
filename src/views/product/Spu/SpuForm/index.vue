<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success='handleSuccess'
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="selectSaleIdAndName" :placeholder="`还有${unSelectSaleList.length}个未选择`">
          <el-option
            :label="unSelectSaleAttr.name"
            :value="`${unSelectSaleAttr.id}:${unSelectSaleAttr.name}`"
            v-for="unSelectSaleAttr in unSelectSaleList"
            :key="unSelectSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled='!selectSaleIdAndName' @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" ></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width" ></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
                <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
                >
                {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="row.inputVisible=false"
                @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
                >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spuInfo.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSpuInfo">保存</el-button>
        <el-button @click="cancelSave">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 照片墙
      dialogImageUrl: "",
      dialogVisible: false,
      // 某一spu信息
      // spuInfo初始化的时候是一个空的对象，在修改spu的时候，会向服务器发请求，返回spu信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器  
      // 添加spu，如果是添加spu的时候并没有向服务器发请求，数据收集到spuInfo，收集数据的时候有哪些字段看文档  
      spuInfo: {
        // 三级分类的id
        category3Id: 0,
        // spu描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌id
        tmId: "",
        // spu图片信息
        spuImageList: [
          // {
          // id: 0,
          // imgName: "",
          // imgUrl: "",
          // spuId: 0,
          // },
        ],
        // 平台属性与属性值收集
        spuSaleAttrList: [
          // {
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: "",
          // spuId: 0,
          // spuSaleAttrValueList: [
          //     {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     isChecked: "",
          //     saleAttrName: "",
          //     saleAttrValueName: "",
          //     spuId: 0,
          //     },
          // ],
          // },
        ],
      },
      // 品牌的数据
      trademarkList: [],
      // SPU图片列表
      spuImageList: [],
      // 平台中全部的销售属性（3个）
      saleAttrList: [],
      //  选择的销售属性id和name
      selectSaleIdAndName:'',
    };
  },
  methods: {
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
        // 收集照片墙图片的数据
        // 对于已有的图片【照片墙中显示的图片有name、url字段】，因为照片墙显示数据务必要有这两个属性
        // 对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器之前，需要处理
      this.spuImageList=fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
        // 将图片地址赋值给dialogImageUrl
      this.dialogImageUrl = file.url;
      //   对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
        // 收集图片的信息
      this.spuImageList=fileList
    },
    // 发请求获取某一Spu的信息，品牌数据，图片，全部销售属性
    async initSpuData(spu) {
      // 获取某一个SPU信息
      let spuInfoResult = await this.$API.spu.reqSpuInfo(spu.id);
      if (spuInfoResult.code == 200) {
        this.spuInfo = spuInfoResult.data;
      }
      // 品牌的数据
      let TrademarkResult = await this.$API.spu.reqTrademarkList();
      if (TrademarkResult.code == 200) {
        this.trademarkList = TrademarkResult.data;
      }
      // 获取SPU图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        const fileList = spuImageResult.data;
        fileList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImageList = fileList;
      }
      // 获取平台中全部的销售属性（3个）
      let saleAttrResult = await this.$API.spu.reqSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    // 添加销售属性
    addSaleAttr() {
      // selectSaleIdAndName已经收集需要添加的销售属性的id和name
      // 把收集到的销售属性进行分割
      let [saleAttrId,saleAttrName] = this.selectSaleIdAndName.split(':')
      // push添加新的销售属性
      this.spuInfo.spuSaleAttrList.push({
          baseSaleAttrId:saleAttrId,
          saleAttrName:saleAttrName,
          spuSaleAttrValueList:[]
      })
      this.selectSaleIdAndName=''
    },
    // 添加属性值按钮，编辑属性值模式，显示input输入框
    showInput(row) {
        // inputVisible控制属性值的查看与编辑模式，切换input与button
        // row.inputVisible = true; 数据与视图不能同步，不是响应式数据
        this.$set(row,'inputVisible',true)
        // 收集input输入框中的数据
        this.$set(row,'inputValue','')
        this.$nextTick(_ => {
          this.$refs.saveTagInput.focus();
        });
    },
    // input失去焦点
    handleInputConfirm(row) {
      // 新增的销售属性值不能为空
      if(row.inputValue.trim()=='') {
        this.$message({type:'warning',message:'属性值不能为空！'})
        return
      }
      // 新增的销售属性值不能重复
      let isRepeat = row.spuSaleAttrValueList.some((item) => {return item.saleAttrValueName == row.inputValue})
      if(isRepeat) {
        this.$message({type:'warning',message:'属性值不能重复！'})
        return
      }
      row.inputVisible=false
      const {baseSaleAttrId,saleAttrName} = row
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrName,
        saleAttrValueName:row.inputValue
      })
    },
    // 保存spu信息并发请求
    async saveSpuInfo() {
      // 整理参数，整理照片墙的数据
      // 携带参数：对于图片，需要携带imgName和imgUrl字段
      this.spuInfo.spuImageList=this.spuImageList.map((item) => {
        return {
          imgName:item.name,
          imgUrl:(item.response && item.response.data) || item.url
        }
      })
      // 发请求保存数据
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
      if(result.code==200) {
        this.$message({type:'success',message:'保存成功'})
        this.$emit('changeScene',{scene:0,flag:this.spuInfo.id?'edit':'add'})
      }
      // 置空数据
      Object.assign(this._data,this.$options.data())
    },
    // 获取category3Id,品牌数据,全部销售属性
    async getTrademarkAndSale(category3Id) {
      this.spuInfo.category3Id=category3Id
      // 品牌的数据
      let TrademarkResult = await this.$API.spu.reqTrademarkList();
      if (TrademarkResult.code == 200) {
        this.trademarkList = TrademarkResult.data;
      }
      // 获取平台中全部的销售属性（3个）
      let saleAttrResult = await this.$API.spu.reqSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    // 取消保存
    cancelSave() {
      // 切换场景
      this.$emit('changeScene',{scene:0,flag:''})
      // 置空数据
      // Object.assign是es6中新增的方法可以合并对象
      // 组件实例this._data可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    // 未选择的销售属性
    unSelectSaleList() {
        // 整个平台的销售属性一共三个：尺寸、颜色、版本-----------saleAttrList
        // 当前spu拥有的属于自己的销售属性spuInfo.spuSaleAttrList
        // 数组的过滤方法filter，可以从已有的数组当中过滤出用户需要的元素，并返回一个新的数据
        let result = this.saleAttrList.filter((item) => {
            // every方法，会返回一个布尔值【true、false】，全为真才返回true
            return this.spuInfo.spuSaleAttrList.every((item1) => {
                return item1.saleAttrName!==item.name
            })
        })
        return result
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>