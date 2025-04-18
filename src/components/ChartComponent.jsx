import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';
import 배달 from '../config/배달.json';

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);
  const [averageSales, setAverageSales] = useState(0);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);


    // 각 성별 데이터를 찾기
    const target1 = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === "여자");
    const target2 = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === "남자");


    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05",
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11"
    ];

    // 상가 데이터에서 선택한 동과 업종에 대한 월별 매출을 가져오기
    const 매장Data = months.map(month => {
      const store = 상가.find(item => item.행정동 === dong && item.업종이름 === cate);
      return store ? Number(store[month]) || 0 : 0;
    });

    // 평균 매장 매출 계산

    const totalSales = 매장Data.reduce((acc, curr) => acc + curr, 0);
    const storeavgSales = totalSales / 매장Data.length;


    // 성별 배달 매출 데이터 추출
    const salesData1 = target1 ? months.map(month => Number(target1[month])) : [];
    const salesData2 = target2 ? months.map(month => Number(target2[month])) : [];

    // 평균 배달 매출 계산
    const calculateAverage = (data) => {
      if (data.length === 0) return 0;
      const sum = data.reduce((acc, val) => acc + val, 0);
      return Math.round(sum / data.length);
    };

    const average1 = calculateAverage(salesData1);
    const average2 = calculateAverage(salesData2);
    const totalAverage = average1 + average2;  // 남녀 평균의 합으로 수정

    const avgSales = storeavgSales + totalAverage;

    setAverageSales(Math.floor(avgSales));


    // ECharts 옵션 (막대 그래프)
    const option = {
      title: {
        text: `${dong} - ${cate}`,
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
          type: 'bar',
          data: 매장Data,
          itemStyle: {
            color: '#73C0DE',
            borderRadius: [4, 4, 0, 0]
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

export default ChartComponent;
