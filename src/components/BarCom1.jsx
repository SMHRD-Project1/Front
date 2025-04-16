import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 정류장 from '../config/정류장.json';

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택된 동과 업종에 해당하는 데이터 찾기
    const target = 정류장.find(item => item.주소 === dong);

    // 각 연령대별 데이터 추출
    const categories = ['어린이', '청소년', '일반', '합계'];
    const values = target
      ? categories.map(category => Number(target[category]) || 0)
      : [0, 0, 0, 0]; // 데이터 없을 경우 0 처리

    // ECharts 옵션
    const option = {
      title: { text: `유형별 유동 인구 (${dong})` },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: categories
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '인구 수',
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#5470C6'
          }
        }
      ]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong, cate]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '250px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
    />
  );
};

export default ChartComponent;
