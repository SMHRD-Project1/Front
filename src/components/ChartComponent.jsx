import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // ECharts 인스턴스 생성
    const chart = echarts.init(chartRef.current);

    // 차트 옵션 설정
    const option = {
      title: {
        text: '상권 분석'
      },
      tooltip: {},
      xAxis: {
        data: ['식당', '카페', '편의점', '마트', '의류', '화장품']
      },
      yAxis: {},
      series: [{
        name: '점포 수',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // 차트 설정 적용
    chart.setOption(option);

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '200px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
      }} 
    />
  );
};

export default ChartComponent; 