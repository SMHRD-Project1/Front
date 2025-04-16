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
      ? categories.map(category => Math.round(Number(target[category]) / 365) || 0)
      : [0, 0, 0, 0]; // 데이터 없을 경우 0 처리

    // 시간대 목록 (고정 순서)
    const timeZones = ['오전', '점심', '오후', '저녁', '밤'];

    // 해당 동의 데이터만 필터링
    const filtered = 정류장.filter(item => item.주소 === dong);

    // 시간대별 거래건수 합산 (한 달 동안의 총합)
    const zoneSum = timeZones.map(zone => {
      // 해당 시간대에 맞는 데이터만 필터링
      const sum = filtered
        .filter(item => item.시간대 && item.시간대.trim() === zone)
        .reduce((acc, cur) => acc + (parseInt(cur.거래건수) || 0), 0);

      return Math.round(sum / 365); // 일평균으로 계산
    });

    // ECharts 옵션
    const option = {
      title: { 
        text: `${dong} 유형별 유동 인구`,
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
        data: categories
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} 명',
          fontWeight: 'bold'
        }
      },
      legend: {
        data: ['거래건수'],
        top: '15%'
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '30%',
        bottom: '5%',
        containLabel: true
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
      style={{ width: '300px', height: '200px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    />
  );
};

export default ChartComponent;
