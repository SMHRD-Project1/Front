import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 배달 from '../config/배달.json';

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

    // 각 동별로 총 매출 (성별 합산) 구하기
    const series = relatedDongs.map(d => {
      const target1 = 배달.find(item => item.행정동 === d && item.업종이름 === cate && item.성별 === "여자");
      const target2 = 배달.find(item => item.행정동 === d && item.업종이름 === cate && item.성별 === "남자");

      const sales1 = target1 ? months.map(month => Number(target1[month]) || 0) : Array(13).fill(0);
      const sales2 = target2 ? months.map(month => Number(target2[month]) || 0) : Array(13).fill(0);

      const totalSales = sales1.map((v, i) => v + sales2[i]);

      return {
        name: d,
        type: 'line',
        data: totalSales,
        smooth: true
      };
    });

    const option = {
      title: { 
        text: `인근 동 ${cate} 배달 매출`,
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 18
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: relatedDongs,
        top: '22%',
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
      series
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
