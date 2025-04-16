import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 가구 from '../config/가구.json';

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

// 숫자 포맷팅 함수
const formatNumber = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '만';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value;
};

const GenderPopulationChart = ({ dong }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택한 동과 관련 동을 포함한 전체 목록 만들기
    const relatedDongs = [dong, ...(동연결[dong] || [])];

    // 각 동별로 성별 거주 인구 데이터 가져오기
    const maleData = relatedDongs.map(d => {
      const target = 가구.find(item => item.동명 === d);
      return target ? target.남 || 0 : 0;
    });

    const femaleData = relatedDongs.map(d => {
      const target = 가구.find(item => item.동명 === d);
      return target ? target.여 || 0 : 0;
    });

    const option = {
      title: { 
        text: `성별 거주 인구 (${dong} 포함)`,
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          const index = params[0].dataIndex;
          const total = maleData[index] + femaleData[index];
          const malePercent = ((maleData[index] / total) * 100).toFixed(1);
          const femalePercent = ((femaleData[index] / total) * 100).toFixed(1);
          return `${relatedDongs[index]}<br/>
                  남성: ${formatNumber(maleData[index])}명 (${malePercent}%)<br/>
                  여성: ${formatNumber(femaleData[index])}명 (${femalePercent}%)<br/>
                  전체: ${formatNumber(total)}명`;
        }
      },
      legend: {
        data: ['남성', '여성'],
        top: '15%',
        left: 'center',
        textStyle: {
          fontSize: 10
        },
        itemWidth: 10,
        itemHeight: 10
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '25%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: relatedDongs,
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '인구수',
        scale: true,
        nameTextStyle: {
          fontWeight: 'bold'
        },
        axisLabel: {
          formatter: function(value) {
            return formatNumber(value) + '명';
          },
          fontWeight: 'bold'
        }
      },
      series: [
        {
          name: '남성',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: maleData,
          label: {
            show: true,
            position: 'inside',
            formatter: function(params) {
              const total = maleData[params.dataIndex] + femaleData[params.dataIndex];
              const percent = ((params.value / total) * 100).toFixed(1);
              return `${percent}%`;
            },
            fontSize: 10,
            color: '#fff'
          },
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '여성',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: femaleData,
          label: {
            show: true,
            position: 'inside',
            formatter: function(params) {
              const total = maleData[params.dataIndex] + femaleData[params.dataIndex];
              const percent = ((params.value / total) * 100).toFixed(1);
              return `${percent}%`;
            },
            fontSize: 10,
            color: '#fff'
          },
          itemStyle: {
            color: '#ee6666'
          }
        }
      ]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong]);

  return (
    <div
      ref={chartRef}
      style={{ width: '300px', height: '400px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    />
  );
};

export default GenderPopulationChart;
