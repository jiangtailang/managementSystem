<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name:'ProgressCharts',
    mounted() {
        let myCharts= echarts.init(this.$refs.charts)
        myCharts.setOption({
            xAxis:{
                // 隐藏x轴
                show:false,
                min:0,
                max:100
            },
            yAxis:{
                // 均分
                type:'category',
                show:false
            },
            series:[{
                // 柱状图
                type:'bar',
                data:[78],
                barWidth:10,
                itemStyle:{
                    color:'yellowgreen'
                },
                // 背景颜色设置
                showBackground:true,
                backgroundStyle:{
                    color:'#eee'
                },
                // 文本
                label:{
                    show:true,
                    formatter:'|',
                    position:'right'
                }
            }],
            // 布局
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