<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name:'BarCharts',
    mounted() {
        let myCharts= echarts.init(this.$refs.charts)
        myCharts.setOption({
            xAxis:{
                type:'category',
                show:false
            },
            yAxis:{
                show:false
            },
            series:[{
                type:'bar',
                data:[34,3,23,12,19,43,23,56,32,21,11,44,12,23],
            }],
            tooltip:{},
            grid:{
                right:0,
                left:0,
                top:0,
                bottom:0
            }
        })
    }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>