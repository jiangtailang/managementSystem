<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name:'LineCharts',
    mounted() {
        let myCharts= echarts.init(this.$refs.charts)
        myCharts.setOption({
            xAxis:{
                // 均分
                type:'category',
                // 隐藏x轴
                show:false
            },
            yAxis:{
                show:false
            },
            series:[{
                // 折线图
                type:'line',
                data:[34,1,23,12,19,43,23,56,32,21,11,44,12,23],
                // 光滑曲线
                smooth:true,
                // 去掉拐点
                itemStyle:{
                    opacity:0
                },
                areaStyle:{
                    color:
                    // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                    {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#5d00804f' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                    }
                }
            }],
            // 布局
            grid:{
                right:0,
                left:0,
                top:0,
                bottom:0
            },
            tooltip:{}
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