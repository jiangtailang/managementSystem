<template>
  <el-card>
      <div slot="header">
            <span>销售额类别占比</span>
            <el-radio-group v-model="radioValue" size="mini">
                <el-radio-button label="全部渠道" disabled></el-radio-button>
                <el-radio-button label="线上"></el-radio-button>
                <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
      </div>
      <div class="charts" ref="charts"></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
    name:'Category',
    data() {
        return {
            radioValue:'线上',
            myCharts:null,
        }
    },
    computed:{
        ...mapState({saleRank: state => state.home.mockData.saleRank})
    },
    watch:{
        radioValue(value) {
            this.myCharts.setOption({
                title:{
                    text:'',
                    subtext:undefined
                },
                dataset:{
                    source:value=="线上"?this.saleRank.online:this.saleRank.shop
                }
            })
        },
        saleRank() {
            this.myCharts.setOption({
                title:{
                    text:'',
                    subtext:undefined,
                    subtextStyle:{
                        fontSize:'18px'
                    },
                    top:'center',
                    left:'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: true
                    },
                    }
                ],
                dataset:{
                    source: this.saleRank.online
                }
            })
        }
    },
    mounted() {
        this.myCharts = echarts.init(this.$refs.charts)
        this.myCharts.setOption({
            title:{
                text:'',
                subtext:undefined,
                subtextStyle:{
                    fontSize:'18px'
                },
                top:'center',
                left:'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside'
                },
                labelLine: {
                    show: true
                },
                }
            ],
            dataset:{
                source: []
            }
        })
        // 绑定事件
        this.myCharts.on('mouseover', (params)=> {
            this.myCharts.setOption({
                title:{
                    text:params.data[0],
                    subtext:params.data[1]
                }
            })
        });
    }
}
</script>

<style scoped>
.el-radio-group {
    float: right;
}
.charts {
    width: 100%;
    height: 400px;
}
</style>