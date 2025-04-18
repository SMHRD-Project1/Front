import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';

const LineCom1 = ({ dong, cate }) => {
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
      return store ? Number(store[month]) || 0 : 0;
    });

    // 평균 매출 계산
    const totalSales = 매장Data.reduce((acc, curr) => acc + curr, 0);
    const avgSales = totalSales / 매장Data.length;
    setAverageSales(Math.floor(avgSales));

    // ECharts 옵션 (선 그래프)
    const option = {
      title: { 
        text: `${dong} - ${cate} 매장`,
        subtext: `평균매출: ${Math.floor(avgSales)} 만원`,
        left: 'center',
        top: '5%',
        subtextStyle: {
          fontSize: 17,
          color: '#666'
        }
      },
      tooltip: { trigger: 'axis' },
      grid: {
        left: '3%',
        right: '5%',
        top: '35%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: { type: 'category', data: months },
      yAxis: { 
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} 만원',
          fontWeight: 'bold'
        }
      },
      series: [
        {
          name: '매장',
          type: 'line',
          data: 매장Data,
          smooth: true,
          itemStyle: {
            color: '#73C0DE'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(115, 192, 222, 0.3)'
              }, {
                offset: 1,
                color: 'rgba(115, 192, 222, 0.1)'
              }]
            }
          }
        }
      ]
    };

    chart.setOption(option);
    return () => chart.dispose();
  }, [dong, cate]);

  return (
    <div>
      <div ref={chartRef} style={{ width: '300px', height: '200px', backgroundColor: '#f9f9f9', borderRadius: '8px' }} />
    </div>
  );
};

export default LineCom1;
