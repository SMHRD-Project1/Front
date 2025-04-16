import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 유동인구 from '../config/유동인구.json';

const ChartComponent = ({ dong }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 요일 목록 (고정 순서)
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    // 해당 동의 데이터만 필터링
    const filtered = 유동인구.filter(item => item.행정동명 && item.행정동명.trim() === dong.trim());

    // 요일별 거래건수 합산 (한 달 동안의 총합)
    const daySum = daysOfWeek.map(day => {
      // 해당 요일에 맞는 데이터만 필터링
      const sum = filtered
        .filter(item => item.요일 && item.요일.trim() === day)
        .reduce((acc, cur) => acc + (parseInt(cur.거래건수) || 0), 0);

      return sum; // 해당 요일의 총합 반환
    });

    // ECharts 옵션
    const option = {
      title: { text: `${dong} 요일별 유동 인구` },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: daysOfWeek
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '유동 인구 수',
          type: 'bar',  // 막대 그래프
          data: daySum,
          itemStyle: {
            color: '#ff6f61'
          }
        }
      ]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '300px', backgroundColor: '#f8f8f8', borderRadius: '10px' }}
    />
  );
};

export default ChartComponent;
