<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>线上热门搜索</span>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="box-main">
            <el-row :gutter="10">
                <el-col :span="12">
                    <LineCharts>
                        <template slot="title">
                            <span>搜索用户数</span>
                        </template>
                        <template slot="data">
                            <span class="big">12332</span>
                            <span class="middle">17.1</span>
                            <i class="el-icon-caret-top"></i>
                        </template>
                    </LineCharts>
                </el-col>
                <el-col :span="12">
                    <LineCharts>
                        <template slot="title">
                            <span>人均搜索次数</span>
                        </template>
                        <template slot="data">
                            <span class="big">2.7</span>
                            <span class="middle">26.2</span>
                            <i class="el-icon-caret-bottom"></i>
                        </template>
                    </LineCharts>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" style="width: 100%" border height="180px" :default-sort="{ prop: 'user', order: 'descending' }">
        <el-table-column type="index" label="排名" width="80"></el-table-column>
        <el-table-column prop="word" label="搜索关键字" ></el-table-column>
        <el-table-column prop="user" label="用户数" sortable></el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                layout="->,prev, pager, next"
                :page-count="5">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import LineCharts from './LineCharts'
import { mapState } from 'vuex'
export default {
    name:'Search',
    components:{
        LineCharts
    },
    computed: {
        ...mapState({
            tableData:state => state.home.mockData.searchWord
        })
    },
    mounted() {

    }
}
</script>

<style scoped>
.el-dropdown {
    float: right;
}
.el-table {
    margin-top: 20px;
    font-size: 13px;
}
</style>