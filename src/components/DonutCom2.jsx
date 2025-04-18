import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';
import 배달 from '../config/배달.json';
import 정류장 from '../config/정류장.json';

const DonutCom2 = ({ dong, selectedCategory }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택된 동의 데이터 가져오기
    const dongData = 상가.filter(item => item.행정동 === dong);
    
    // 1. 매출 데이터 계산 (ChartComponent.jsx 로직)
    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05",
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11"
    ];
    
    const 매장Data = months.map(month => {
      const store = 상가.find(item => item.행정동 === dong && item.업종이름 === selectedCategory);
      return store ? Number(store[month]) || 0 : 0;
    });

    const totalSales = 매장Data.reduce((acc, curr) => acc + curr, 0);
    const storeavgSales = totalSales / 매장Data.length;

    // 배달 매출 계산
    const target1 = 배달.find(item => item.행정동 === dong && item.업종이름 === selectedCategory && item.성별 === "여자");
    const target2 = 배달.find(item => item.행정동 === dong && item.업종이름 === selectedCategory && item.성별 === "남자");

    const calculateAverage = (data) => {
      if (!data) return 0;
      const salesData = months.map(month => Number(data[month]) || 0);
      const sum = salesData.reduce((acc, val) => acc + val, 0);
      return Math.round(sum / salesData.length);
    };

    const average1 = calculateAverage(target1);
    const average2 = calculateAverage(target2);
    const totalAverage = average1 + average2;
    const avgSales = storeavgSales + totalAverage;

    // 2. 유동인구 데이터 계산 (BarCom1.jsx 로직)
    const target = 정류장.find(item => item.주소 === dong);
    const sum = target ? Number(target['합계']) : 0;
    const avgFootTraffic = Math.round(sum / 365);

    // 3. 점포수 통계
    const storeCount = dongData.length;

    // 전체 데이터에서 각 지표의 값을 수집
    const allData = 상가.map(item => {
      const storeMonthly = months.map(month => Number(item[month]) || 0);
      const storeAvg = storeMonthly.reduce((acc, curr) => acc + curr, 0) / months.length;
      
      const deliveryWoman = 배달.find(d => d.행정동 === item.행정동 && d.업종이름 === item.업종이름 && d.성별 === "여자");
      const deliveryMan = 배달.find(d => d.행정동 === item.행정동 && d.업종이름 === item.업종이름 && d.성별 === "남자");
      
      const deliveryAvgW = deliveryWoman ? months.map(month => Number(deliveryWoman[month]) || 0).reduce((acc, curr) => acc + curr, 0) / months.length : 0;
      const deliveryAvgM = deliveryMan ? months.map(month => Number(deliveryMan[month]) || 0).reduce((acc, curr) => acc + curr, 0) / months.length : 0;
      const totalAvg = deliveryAvgW + deliveryAvgM;
      
      const location = 정류장.find(l => l.주소 === item.행정동);
      const footTraffic = location ? Math.round(Number(location['합계']) / 365) : 0;
      
      return {
        행정동: item.행정동,
        매출: storeAvg + totalAvg,
        유동인구: footTraffic,
        배달: totalAvg,
        점포수: 상가.filter(s => s.행정동 === item.행정동).length,
        배달비중: storeAvg + totalAvg > 0 ? (totalAvg / (storeAvg + totalAvg)) * 100 : 0
      };
    });

    // 백분위 계산 함수
    const calculatePercentileRank = (value, array, key) => {
      if (array.length === 0) return 0;
      const sortedValues = array.map(item => item[key]).sort((a, b) => a - b);
      const position = sortedValues.filter(v => v <= value).length;
      return Math.round((position / sortedValues.length) * 100);
    };

    // 현재 선택된 동의 데이터
    const currentData = {
      매출: avgSales,
      유동인구: avgFootTraffic,
      배달: totalAverage,
      점포수: storeCount,
      배달비중: avgSales > 0 ? (totalAverage / avgSales) * 100 : 0
    };

    // 백분위 기반 점수 계산
    const scores = {
      매출: calculatePercentileRank(currentData.매출, allData, '매출'),
      유동인구: calculatePercentileRank(currentData.유동인구, allData, '유동인구'),
      배달: calculatePercentileRank(currentData.배달, allData, '배달'),
      점포수: calculatePercentileRank(currentData.점포수, allData, '점포수'),
      배달비중: calculatePercentileRank(currentData.배달비중, allData, '배달비중')
    };

    const option = {
      title: {
        text: '종합 상권 점수',
        subtext: '(전체 상권 대비 백분위 점수)',
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          const indicators = {
            매출: `${avgSales.toFixed(0)}만원 (상위 ${scores[params.name]}%)`,
            유동인구: `${avgFootTraffic}명 (상위 ${scores[params.name]}%)`,
            배달: `${totalAverage.toFixed(0)}만원 (상위 ${scores[params.name]}%)`,
            점포수: `${storeCount}개 (상위 ${scores[params.name]}%)`,
            배달비중: `${(avgSales > 0 ? Math.round((totalAverage / avgSales) * 100) : 0)}% (상위 ${scores[params.name]}%)`
          };
          return `${params.name}<br/>${indicators[params.name]}`;
        }
      },
      legend: {
        data: ['상권 점수'],
        bottom: '5%'
      },
      radar: {
        shape: 'polygon',
        name: {
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        indicator: [
          { name: '매출', max: 100 },
          { name: '유동인구', max: 100 },
          { name: '배달', max: 100 },
          { name: '점포수', max: 100 },
          { name: '배달비중', max: 100 }
        ],
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#f5f5f5', '#e9e9e9']
          }
        }
      },
      series: [{
        name: '상권 점수',
        type: 'radar',
        data: [{
          value: [
            scores.매출,
            scores.유동인구,
            scores.배달,
            scores.점포수,
            scores.배달비중
          ],
          name: '상권 점수',
          itemStyle: {
            color: '#ff6b6b'
          },
          areaStyle: {
            color: 'rgba(255, 107, 107, 0.3)'
          }
        }]
      }]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong, selectedCategory]);

  return (
    <div ref={chartRef} style={{ 
      width: '300px', 
      height: '300px', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px',
      margin: '0 auto',  // 가운데 정렬을 위한 마진
      display: 'flex',   // Flexbox 사용
      justifyContent: 'center',  // 수평 가운데 정렬
      alignItems: 'center'       // 수직 가운데 정렬
    }} />
  );
};

export default DonutCom2;
