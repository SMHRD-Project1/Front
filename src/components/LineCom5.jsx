import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';
import 배달 from '../config/배달.json';

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05",
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11"
    ];

    // 매장 데이터 가져오기
    const 매장Data = months.map(month => {
      const store = 상가.find(item => item.행정동 === dong && item.업종이름 === cate);
      return store ? Number(store[month]) || 0 : 0; // 월별 매출
    });

    // 배달 데이터 가져오기 (남자, 여자 매출 합산)
    const 배달Data = months.map(month => {
      // 남자 매출
      const deliveryMale = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === '남자');
      // 여자 매출
      const deliveryFemale = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === '여자');

      // 남자와 여자의 매출을 합산, 없으면 0으로 처리
      const maleSales = deliveryMale ? Number(deliveryMale[month]) || 0 : 0;
      const femaleSales = deliveryFemale ? Number(deliveryFemale[month]) || 0 : 0;

      return maleSales + femaleSales; // 합산된 매출
    });

    // ECharts 옵션
    const option = {
      title: { text: `${dong} - ${cate} 매장과 배달 매출 비교` },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['매장', '배달']
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '매장',
          type: 'line',
          data: 매장Data,
          smooth: true, // 부드러운 곡선
        },
        {
          name: '배달',
          type: 'line',
          data: 배달Data,
          smooth: true, // 부드러운 곡선
        }
      ]
    };

    // 그래프 적용
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
