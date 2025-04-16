import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);
  const [averageSales, setAverageSales] = useState(0);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05",
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11"
    ];

    // 상가 데이터에서 선택한 동과 업종에 대한 월별 매출을 가져오기
    const 매장Data = months.map(month => {
      const store = 상가.find(item => item.행정동 === dong && item.업종이름 === cate);
      return store ? Number(store[month]) || 0 : 0; // 월별 매출
    });

    // 평균 매출 계산
    const totalSales = 매장Data.reduce((acc, curr) => acc + curr, 0);
    const avgSales = totalSales / 매장Data.length;

    // 평균 매출을 상태에 저장
    setAverageSales(avgSales.toFixed(2)); // 소수점 2자리까지 표시

    // ECharts 옵션
    const option = {
      title: { text: `${dong} - ${cate} 매장 매출` },
      tooltip: {
        trigger: 'axis'
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
        }
      ]
    };

    // 그래프 적용
    chart.setOption(option);

    return () => chart.dispose();
  }, [dong, cate]);

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', borderRadius: '8px' }} />
      <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        <p>{dong} - {cate} 매장의 평균 매출: {averageSales} 원</p>
      </div>
    </div>
  );
};

export default ChartComponent;
