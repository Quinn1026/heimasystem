<template>
  <div class="chart">
    <el-card shadow="always">
      <ul class="chartList">
        <li>
          <div class="chartItem color1">{{chartData.increment_users}}</div>
          <span>今日新增用户</span>
        </li>
        <li>
          <div class="chartItem color1">{{chartData.total_users}}</div>
          <span>总用户量</span>
        </li>
        <li>
          <div class="chartItem color2">{{chartData.increment_questions}}</div>
          <span>新增试题</span>
        </li>
        <li>
          <div class="chartItem color2">{{chartData.total_questions}}</div>
          <span>总试题量</span>
        </li>
        <li>
          <div class="chartItem color3">{{chartData.total_done_questions}}</div>
          <span>总刷题量</span>
        </li>
        <li>
          <div class="chartItem color3">{{chartData.personal_questions}}</div>
          <span>人均刷题数量</span>
        </li>
      </ul>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <div ref="mainChart" style="height:570px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echat插件
import echarts from "echarts";
export default {
  data() {
    return {
      chartData: {},
      statistics: []
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getChart();
  },
  methods: {
    async getData() {
      // post请求没有缓存
      const res = await this.$axios.post("/data/title");
      if (res.data.code == 200) {
        this.chartData = res.data.data;
      }
    },
    async getChart() {
      const res = await this.$axios.post("/data/statistics");
      if (res.data.code == 200) {
        this.statistics = res.data.data;
        this.initChart();
      }
    },
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.mainChart);
      let legendData = this.statistics.map(item => item.name);

      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 100,
          data: legendData
        },
        series: [
          {
            name: "企业题目数据统计",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.statistics
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="less">
.chart {
  .chartList {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    .chartItem {
      width: 99px;
      height: 99px;
      line-height: 99px;
      font-size: 25px;
      border-radius: 50%;
    }
    .color1 {
      border: 2px solid #0086fa;
    }
    .color2 {
      border: 2px solid #f76137;
    }
    .color3 {
      border: 2px solid #55cd78;
    }
  }
}
</style>