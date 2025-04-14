import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import 매출데이터 from './data/매출데이터.json';

const ExampleDonut = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    // 대분류 기준으로 매출 합산
    const categoryMap = {};
    매출데이터.forEach(item => {
      const category = item['검색업종'].split(' > ')[0]; // 대분류
      const totalSales = Object.entries(item)
        .filter(([key]) => key.includes('.'))
        .reduce((acc, [, value]) => acc + parseInt((value + '').replace(/,/g, '')), 0);

      categoryMap[category] = (categoryMap[category] || 0) + totalSales;
    });

    const total = Object.values(categoryMap).reduce((acc, val) => acc + val, 0);

    const entries = Object.entries(categoryMap).map(([name, value]) => {
      const percent = (value / total) * 100;
      return {
        name,
        value: parseFloat(percent.toFixed(1)), // 퍼센트
        rawValue: value,
      };
    });

    let etcValue = 0;
    const mainItems = [];

    entries.forEach((item) => {
      if (item.value >= 5) {
        mainItems.push(item);
      } else {
        etcValue += item.value;
      }
    });

    mainItems.sort((a, b) => b.value - a.value); // 내림차순

    if (etcValue > 0) {
      mainItems.push({
        name: '기타',
        value: parseFloat(etcValue.toFixed(1))
      });
    }

    setOption({
      title: {
        text: '금호동 대분류별 매출 비중',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 20,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      legend: {
        show: false
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{d}%',
            fontSize: 14
          },
          data: mainItems
        }
      ]
    });
  }, []);

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default ExampleDonut;
