import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 유동인구 from '../config/유동인구.json';

const ChartComponent = ({ dong }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 시간대 목록 (고정 순서)
    const timeZones = ['오전', '점심', '오후', '저녁', '밤'];

    // 해당 동의 데이터만 필터링
    const filtered = 유동인구.filter(item => item.행정동명 && item.행정동명.trim() === dong.trim());

    // 시간대별 거래건수 합산 (한 달 동안의 총합)
    const zoneSum = timeZones.map(zone => {
      // 해당 시간대에 맞는 데이터만 필터링
      const sum = filtered
        .filter(item => item.시간대 && item.시간대.trim() === zone)
        .reduce((acc, cur) => acc + (parseInt(cur.거래건수) || 0), 0);

      return sum; // 해당 시간대의 총합 반환
    });

    // ECharts 옵션
    const option = {
      title: { text: `${dong} 시간대별 유동 인구` },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: timeZones
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '유동 인구 수',
          type: 'line',
          data: zoneSum,
          smooth: true,
          lineStyle: {
            color: '#91cc75'
          },
          itemStyle: {
            color: '#91cc75'
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
