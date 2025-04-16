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
    const salesData1 = target1 ? months.map(month => Number(target1[month])) : [];
    const salesData2 = target2 ? months.map(month => Number(target2[month])) : [];

    // ECharts 옵션
    const option = {
      title: { text: '상가 월 매출' },
      tooltip: {},
      xAxis: { data: months },
      yAxis: {},
      series: [
        {
          name: '여자',
          type: 'line',  // 라인 차트
          data: salesData1,
          smooth: true,  // 곡선 형태로 표시
        },
        {
          name: '남자',
          type: 'line',  // 라인 차트
          data: salesData2,
          smooth: true,  // 곡선 형태로 표시
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
      style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', borderRadius: '8px' }} 
    />
  );
};

export default ChartComponent;
