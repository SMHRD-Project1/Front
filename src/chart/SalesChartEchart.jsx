import ECharts from "echarts-for-react";
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import 매출데이터 from '../data/매출데이터.json';

const SalesChartEchart = ({ 업종이름 }) => {
  const [option, setOption] = useState({});
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const selected = 매출데이터.find(item => item['업종이름'] === 업종이름);

    if (selected) {
      const months = Object.keys(selected).filter(key => key.includes('.'));
      const values = months.map(month => parseInt((selected[month] + '').replace(/,/g, '')));

      const total = values.reduce((sum, val) => sum + val, 0);
      const avg = Math.round(total / values.length); // ✅ 월 평균 계산
      setAverage(avg);

      setOption({
        title: {
          text: `금호동 ${업종이름} 월별 매출 추이`,
          left: 'center',
          textStyle: {
            fontSize: 30
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['매출(막대)', '매출(꺾은선)'],
          top: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value',
          name: '매출(원)'
        },
        series: [
          {
            name: '매출(막대)',
            type: 'bar',
            data: values,
            itemStyle: {
              color: '#91cc75'
            }
          },
          {
            name: '매출(꺾은선)',
            type: 'line',
            data: values,
            smooth: false,
            lineStyle: {
              color: '#5470c6',
              width: 3
            }
          }
        ]
      });
    }
  }, [업종이름]);

  return (
    <div>
      <ReactECharts option={option} style={{ height: '450px', width: '100%' }} />;
      <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', fontSize: '70px' }}>
        📊 월 평균 매출: {average.toLocaleString()}만원
      </div>
    </div>
  );
};

export default SalesChartEchart;