import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 가구 from '../config/가구.json';

const GenderPopulationChart = ({ dong }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 해당 동 데이터 가져오기 (공백 제거 후 비교)
    const data = 가구.find(item => item.동명.trim() === dong.trim());

    if (!data) return;

    const option = {
      title: { 
        text: `${dong} 성별 거주 인구`,
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['남', '여', '전체'],
        top: '18%',
        left: 'center',
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '35%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['인구']
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} 명',
          fontWeight: 'bold'
        }
      },
      series: [
        {
          name: '남',
          type: 'bar',  // bar 차트로 변경
          data: [data.남],
          itemStyle: { color: '#5470c6' }
        },
        {
          name: '여',
          type: 'bar',  // bar 차트로 변경
          data: [data.여],
          itemStyle: { color: '#ee6666' }
        },
        {
          name: '전체',
          type: 'bar',  // bar 차트로 변경
          data: [data.계],
          itemStyle: { color: '#fac858' }
        }
      ]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong]);

  return <div ref={chartRef} style={{ width: '300px', height: '200px', backgroundColor: '#f9f9f9', borderRadius: '8px' }} />;
};

export default GenderPopulationChart;
