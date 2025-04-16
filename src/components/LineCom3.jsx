import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 배달 from '../config/배달.json';

const LineCom3 = ({ dong, cate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
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

    // 평균 매출 계산
    const calculateAverage = (data) => {
      if (data.length === 0) return 0;
      const sum = data.reduce((acc, val) => acc + val, 0);
      return Math.round(sum / data.length);
    };

    const average1 = calculateAverage(salesData1);
    const average2 = calculateAverage(salesData2);
    const totalAverage = average1 + average2;  // 남녀 평균의 합으로 수정

    // ECharts 옵션
    const option = {
      title: { 
        text: '배달 월 평균 매출',
        left: 'center',
        top: '2%',
        textStyle: {
          fontSize: 18
        },
        subtext: `${totalAverage}만원`,
        subtextStyle: {
          fontSize: 17,
          rich: {
            bold: {
              fontWeight: 'bold',
              color: '#000'
            }
          }
        }
      },
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['여자', '남자'],
        top: '27%',
        textStyle: {
          fontSize: 10
        },
        itemWidth: 10,
        itemHeight: 10
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '40%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: { 
        type: 'category',
        data: months 
      },
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
          name: '여자',
          type: 'line',
          areaStyle: {
            opacity: 0.8,
            color: '#FF9999'  // 연한 분홍색
          },
          itemStyle: {
            color: '#FF9999'
          },
          stack: 'Total',
          data: salesData1,
          smooth: true,
        },
        {
          name: '남자',
          type: 'line',
          areaStyle: {
            opacity: 0.8,
            color: '#99CCFF'  // 연한 파란색
          },
          itemStyle: {
            color: '#99CCFF'
          },
          stack: 'Total',
          data: salesData2,
          smooth: true,
        }
      ]
    };

    // 차트 설정 적용
    chart.setOption(option);

    // 창 크기 변경 시 차트 크기 조정
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [dong, cate]);  // 동과 업종에 따른 데이터 업데이트

  return (
    <div>
      <div 
        ref={chartRef} 
        style={{ 
          width: '300px', 
          height: '200px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} 
      />
    </div>
  );
};

export default LineCom3;
