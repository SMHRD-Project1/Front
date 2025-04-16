import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';

const 동연결 = {
  서창동: ['치평동', '상무2동', '금호동', '풍암동'],
  금호동: ['상무2동', '풍암동', '화정동', '서창동'],
  풍암동: ['서창동', '금호동', '화정동'],
  상무2동: ['상무1동', '치평동', '서창동', '금호동', '화정동'],
  화정동: ['풍암동', '금호동', '상무1동', '상무2동', '유덕동', '광천동', '농성동'],
  농성동: ['양동', '광천동', '화정동'],
  양동: ['농성동'],
  광천동: ['농성동', '화정동', '유덕동', '동천동'],
  유덕동: ['동천동', '광천동', '화정동', '상무1동', '치평동'],
  상무1동: ['유덕동', '화정동', '상무2동', '치평동'],
  치평동: ['유덕동', '상무1동', '상무2동', '동천동'],
  동천동: ['광천동', '유덕동']
};

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택한 동과 관련 동을 포함한 전체 목록 만들기
    const relatedDongs = [dong, ...(동연결[dong] || [])];

    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05",
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11", "24.12"
    ];

    // 각 동별로 총 매출 구하기
    const series = relatedDongs.map(d => {
      // 해당 동의 데이터를 찾기
      const target = 상가.filter(item => item.행정동 === d && item.업종이름 === cate);

      // 각 월의 매출 합산
      const totalSales = months.map(month => {
        const monthlySales = target.reduce((acc, cur) => {
          return acc + (Number(cur[month]) || 0);
        }, 0);
        return monthlySales;
      });

      return {
        name: d,
        type: 'line',
        data: totalSales,
        smooth: true
      };
    });

    const option = {
      title: { text: `상가 월 매출 (${cate})` },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: relatedDongs
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong, cate]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    />
  );
};

export default ChartComponent;
