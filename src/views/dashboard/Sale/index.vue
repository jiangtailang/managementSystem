<template>
    <el-card class="box-card">
        <!-- @tab-click="handleClick" -->
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="销售额" name="sales"></el-tab-pane>
            <el-tab-pane label="访问量" name="pageView"></el-tab-pane>
        </el-tabs>
        <div class="date_right">
            <span @click="getDate">今日</span>
            <span @click="getWeek">本周</span>
            <span @click="getMonth">本月</span>
            <span @click="getYear">本年</span>
            <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            v-model="date"
            value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>
        <el-row :gutter="10">
            <el-col :span="18">
                <div ref="salesCharts" class="salesCharts"></div>
            </el-col>
            <el-col :span="6">
                <h4>门店{{title}}排名</h4>
                <ul>
                    <li v-for="(rank,index) in rankList" :key="index">
                        <span :class="rank.no>3?'liLeft':'liLeft circle'">{{rank.no}}</span><span class="liTitle">{{rank.name}}</span><span class="liRight">{{rank.money}}</span>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    name:'Sale',
    data() {
        return {
            // 收集title
            activeName:'sales',
            // 收集日期
            date:[],
            // 图表
            myCharts:null,
            // 排名
            rankList:[]
        }
    },
    computed:{
        // tabs栏的标题
        title() {
            return this.activeName=='sales'?'销售额':'访问量'
        },
        // 获取mock数据
        ...mapState({mockData:state => state.home.mockData}),
    },
    methods:{
        // 今日
        getDate() {
            const today = dayjs().format('YYYY-MM-DD')
            this.date=[today,today]
        },
        // 本周
        getWeek() {
            let start = dayjs().day(1).format('YYYY-MM-DD')
            let end = dayjs().day(7).format('YYYY-MM-DD')
            this.date=[start,end]
        },
        // 本月
        getMonth() {
            let start = dayjs().startOf('month').format('YYYY-MM-DD')
            let end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date= [start,end]
        },
        // 本年
        getYear() {
            let start =dayjs().startOf('year').format('YYYY-MM-DD')
            let end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date= [start,end]
        }
    },
    mounted() {
        this.myCharts = echarts.init(this.$refs.salesCharts)
        this.myCharts.setOption({
            title:{
                text:'销售额趋势',
                textStyle:{
                    fontSize:'14px'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: this.mockData.orderFullYearAxis,
                axisTick: {
                    alignWithLabel: true
                }
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ],
            series: [
                {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: this.mockData.orderFullYear
                }
            ]
        })
        // 派发actions 获取mock数据
        this.$store.dispatch('getMockData')
        // 获取排名数据
        this.rankList = this.mockData.orderRank
    },
    // 监听属性
    watch:{
        title(value) {
            // 重新修改图标的配置数据
            // 图标配置数据可以再次修改，如果有新的数值就显示新的数值，如果没有，就显示以前的
            this.myCharts.setOption({
                title:{
                    text:value+'趋势'
                },
                xAxis: [
                    {
                    type: 'category',
                    data: value=="销售额"?this.mockData.orderFullYearAxis:this.mockData.userFullYearAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                    }
                ],
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: value=="销售额"?this.mockData.orderFullYear:this.mockData.userFullYear
                    }
                ]
            })
            // title变化，更新排名
            this.rankList=value=='销售额'?this.mockData.orderRank:this.mockData.userRank
        },
        // mounted时没有数据，是一个空对象，mockData变化（获取到数据）时，执行一次，这样挂载完毕也有数据
        mockData(value) {
            this.myCharts.setOption({
                title:{
                    text:'销售额趋势',
                    textStyle:{
                        fontSize:'14px'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                    type: 'category',
                    data: value.orderFullYearAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                    }
                ],
                yAxis: [
                    {
                    type: 'value'
                    }
                ],
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: value.orderFullYear
                    }
                ]
            })
            // 排名
            this.rankList=this.activeName=='sales'?value.orderRank:value.userRank
        },
    }
}
</script>

<style scoped>
.box-card {
    position: relative;
    margin: 10px 0;
}
.tabs {
    width: 100%;
}
>>>.el-tabs__item {
    font-size: 18px;
}
.date_right {
    position: absolute;
    top: 30px;
    right: 20px;
}
.date_right span {
    margin-right: 20px;
    font-size: 14px;
}
.salesCharts {
    padding-top: 30px;
    width: 100%;
    height: 400px;
}
h4 {
    font-weight: normal;
    font-size: 14px;
}
ul {
    position: relative;
    padding: 0;
    list-style: none;
    font-size: 14px;
}
ul li {
    margin: 31px 0;
}
ul .liLeft {
    position: absolute;
}
ul .liRight {
    float: right;
}
ul .circle {
    position: absolute;
    left: -6px;
    width: 20px;
    height: 20px;
    background-color: #000;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 20px;
}
ul .liTitle {
    margin-left: 40px;
}
</style>