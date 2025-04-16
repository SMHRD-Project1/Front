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

      return Math.round(sum / 31); // 일평균으로 계산
    });

    // ECharts 옵션
    const option = {
      title: { 
        text: `${dong} 연령대별 유동 인구`,
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
      xAxis: {
        type: 'category',
        data: daysOfWeek,
        axisLabel: {
          fontSize: 10,
          interval: 0
        }
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
          name: '유동 인구 수',
          type: 'bar',  // 막대 그래프
          data: daySum,
          itemStyle: {
            color: '#ff6f61'
          }
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '30%',
        bottom: '5%',
        containLabel: true
      }
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong]);

  return (
    <div
      ref={chartRef}
      style={{ width: '300px', height: '200px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    />
  );
};

export default ChartComponent;
