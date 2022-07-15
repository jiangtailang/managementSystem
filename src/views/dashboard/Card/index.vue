<template>
  <div>
      <el-row :gutter="10">
          <el-col :span="6">
              <el-card>
                  <Detail title="总销售额" count="￥ 126560">
                      <template slot="charts">
                          <div class="chartsInfo">
                              <span>周同比&nbsp;&nbsp;56.67%<svg t="1657595146119" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5278" width="16" height="16"><path d="M723.25455957 590.56708997c18.04012654 18.87399937 5.28797393 51.17131722-20.21633121 51.17131724l-382.48322394 0c-25.50430513 0-38.25645774-32.29731787-20.21633121-51.17131724l81.27209205-85.01435051 109.9695199-115.05411031c11.16576039-11.67421947 29.26690202-11.67421947 40.43266242 0l109.96951995 115.05411031 81.27209204 85.01435051z" fill="#d81e06" p-id="5279"></path></svg>
                              </span>
                              <span>日同比&nbsp;&nbsp;19.16%<svg t="1657595350380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6047" width="16" height="16"><path d="M300.74544043 433.43291003c-18.04012654-18.87399937-5.28797393-51.17131722 20.21633121-51.17131724l382.48322394 0c25.50430513 0 38.25645774 32.29731787 20.21633121 51.17131724l-81.27209205 85.01435051-109.9695199 115.05411031c-11.16576039 11.67421947-29.26690202 11.67421947-40.43266242 0l-109.96951995-115.05411031-81.27209204-85.01435051z" fill="#1afa29" p-id="6048"></path></svg>
                              </span>
                          </div>
                      </template>
                      <template slot="footer">
                          日销售额 ￥ 12423
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="访问量" count="88460">
                      <template slot="charts">
                          <LineCharts></LineCharts>
                      </template>
                      <template slot="footer">
                          日访问量 1234
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="支付笔数" count="12306">
                      <template slot="charts">
                          <BarCharts></BarCharts>
                      </template>
                      <template slot="footer">
                          转化率 65%
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="运营活动效果" count="78%">
                      <template slot="charts">
                          <ProgressCharts></ProgressCharts>
                      </template>
                      <template slot="footer">
                          <div>
                              <span>周同比&nbsp;&nbsp;&nbsp;&nbsp;12%<svg t="1657595146119" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5278" width="16" height="16"><path d="M723.25455957 590.56708997c18.04012654 18.87399937 5.28797393 51.17131722-20.21633121 51.17131724l-382.48322394 0c-25.50430513 0-38.25645774-32.29731787-20.21633121-51.17131724l81.27209205-85.01435051 109.9695199-115.05411031c11.16576039-11.67421947 29.26690202-11.67421947 40.43266242 0l109.96951995 115.05411031 81.27209204 85.01435051z" fill="#d81e06" p-id="5279"></path></svg>
                              </span>
                              <span>日同比&nbsp;&nbsp;&nbsp;&nbsp;11%<svg t="1657595350380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6047" width="16" height="16"><path d="M300.74544043 433.43291003c-18.04012654-18.87399937-5.28797393-51.17131722 20.21633121-51.17131724l382.48322394 0c25.50430513 0 38.25645774 32.29731787 20.21633121 51.17131724l-81.27209205 85.01435051-109.9695199 115.05411031c-11.16576039 11.67421947-29.26690202 11.67421947-40.43266242 0l-109.96951995-115.05411031-81.27209204-85.01435051z" fill="#1afa29" p-id="6048"></path></svg>
                              </span>
                          </div>
                      </template>
                  </Detail>
              </el-card>
          </el-col>
      </el-row>
  </div>
  
</template>

<script>
import Detail from './Detail'
import LineCharts from './LineCharts'
import BarCharts from './BarCharts'
import ProgressCharts from './ProgressCharts'
export default {
    name:'Card',
    components:{
        Detail,
        LineCharts,
        BarCharts,
        ProgressCharts
    }
}
</script>

<style scoped>
span {
    margin-right: 10px;
}
.chartsInfo {
    padding-top: 30px;
}
</style>