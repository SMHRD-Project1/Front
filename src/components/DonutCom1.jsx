import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 배달 from '../config/배달.json';

const ChartComponent = ({ dong, cate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 각 성별 데이터를 찾기
    const target1 = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === "여자");
    const target2 = 배달.find(item => item.행정동 === dong && item.업종이름 === cate && item.성별 === "남자");

    // 월별 데이터
    const months = [
      "23.12", "24.01", "24.02", "24.03", "24.04", "24.05", 
      "24.06", "24.07", "24.08", "24.09", "24.10", "24.11", "24.12"
    ];

    // 성별 별 매출 데이터 추출
    const salesData1 = target1 ? months.map(month => Number(target1[month]) || 0) : new Array(months.length).fill(0);
    const salesData2 = target2 ? months.map(month => Number(target2[month]) || 0) : new Array(months.length).fill(0);

    // 총 매출 계산
    const totalSales1 = salesData1.reduce((acc, val) => acc + val, 0);
    const totalSales2 = salesData2.reduce((acc, val) => acc + val, 0);
    const total = totalSales1 + totalSales2;

    // 비율 계산
    const femaleRatio = total ? (totalSales1 / total) * 100 : 0;
    const maleRatio = total ? (totalSales2 / total) * 100 : 0;

    // ECharts 옵션
    const option = {
      
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'  // 퍼센트로 포맷
      },
      legend: {
        top: '80%',
        left: 'center'
      },
      title: {
        text: '남/녀 배달 비율' ,
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        },
        subtextStyle: {
          fontSize: 16,
          color: '#666'
        }
      },
      series: [
        {
          name: '배달 비율',
          type: 'pie',
          radius: ['40%', '110%'],  // 도넛 차트의 크기를 키움
          center: ['50%', '80%'],
          startAngle: 180,
          endAngle: 360,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}: {d}%',
            color: '#fff',
            fontSize: 12  // 라벨 글자 크기 조정
          },
          data: [
            { value: femaleRatio, name: '여자', itemStyle: { color: '#FF7F50' } },
            { value: maleRatio, name: '남자', itemStyle: { color: '#87CEFA' } }
          ]
        }
      ]
    };

    // 차트 설정 적용
    chart.setOption(option);

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return () => chart.dispose();
  }, [dong, cate]);  // 동과 업종에 따른 데이터 업데이트

  return (
    <div 
      ref={chartRef} 
      style={{ width: '300px', height: '200px', backgroundColor: '#f9f9f9', borderRadius: '8px' }} 
    />
  );
};

export default ChartComponent;
