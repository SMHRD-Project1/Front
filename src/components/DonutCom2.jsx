import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 상가 from '../config/상가.json';

const DonutCom2 = ({ dong, selectedCategory }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택된 동의 모든 업종 데이터 가져오기
    const dongData = 상가.filter(item => item.행정동 === dong);

    // 업종별로 그룹화하고 개수 세기
    const categoryCount = {};
    dongData.forEach(item => {
      const category = item.업종이름;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // 업종별 개수를 배열로 변환하고 정렬
    let sortedCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 상위 5개만 선택
    const top5 = sortedCategories.slice(0, 5);

    // 전체 합계 계산
    const total = top5.reduce((acc, curr) => acc + curr.count, 0);

    // 데이터 포맷팅
    const pieData = top5.map(item => ({
      name: `${item.name} (${item.count}개)`,
      value: item.count,
      itemStyle: {
        color: item.name === selectedCategory ? '#ff6b6b' : undefined
      }
    }));

    const option = {
      title: {
        text: '상위 5개 업종 분포',
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const percent = ((params.value / total) * 100).toFixed(1);
          return `${params.name}: ${percent}%`;
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10
        },
        formatter: (name) => {
          const originalName = name.split(' (')[0]; // "음식점 (34개)" → "음식점"
          const item = pieData.find(d => d.name.startsWith(originalName));
          if (!item) return name; // 혹시 몰라 예외 처리
          const percent = ((item.value / total) * 100).toFixed(1);
          return `${name} ${percent}%`;
        }
      },
      series: [
        {
          name: '업종 분포',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#fff'
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          data: pieData
        }
      ]
    };

    chart.setOption(option);

    // 콘솔에 전체 업종 데이터 출력
    // console.log('전체 업종 데이터:', sortedCategories);

    return () => chart.dispose();
  }, [dong, selectedCategory]);

  return (
    <div ref={chartRef} style={{ width: '300px', height: '200px', backgroundColor: '#ffffff', borderRadius: '8px' }} />
  );
};

export default DonutCom2;
