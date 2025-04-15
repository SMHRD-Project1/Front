import React from 'react';
import ReactECharts from 'echarts-for-react';
// 여러 선이 나오겠끔하는 그래프프
// 요일별 매출 그래프
// 바로 밑 괄호안 {seriesData, xAxisData}
const StackedLineChart = () => {
  const option = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
        // 나중에 들어갈 name들은
        // data:seriesData.map(item=>item.name)
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // 여기에 data: data.xAxis, << 이게 들어가서 월별인지, 요일별인지 db에 있는 값으로 바뀌어서 보여줄것임 
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
        //밑에 다 지우고
        //series: seriesData.map(item => ({
        //name :item.name, (db에서 받아온 데이터의 이름이 들어갈것)
        //type : 'line', << 그대로고
        //stack: 'Total', << 역시 그대로고
        //data: item.data  }))};
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };

  return (
    //  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;};
    <div>
      <h2>누적 선형 그래프 (Stacked Line Chart)</h2>
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
};

export default StackedLineChart