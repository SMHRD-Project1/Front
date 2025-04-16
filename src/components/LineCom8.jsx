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

const GenderPopulationChart = ({ dong }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 선택한 동과 관련 동을 포함한 전체 목록 만들기
    const relatedDongs = [dong, ...(동연결[dong] || [])];

    // 각 동별로 성별 거주 인구 데이터 가져오기
    const series = relatedDongs.map(d => {
      // 해당 동의 데이터를 찾기
      const target = 가구.filter(item => item.동명 === d);

      const 남Data = target.length > 0 ? [target[0].남] : [0];
      const 여Data = target.length > 0 ? [target[0].여] : [0];
      const 총Data = target.length > 0 ? [target[0].계] : [0];

      return [
        {
          name: `${d} - 남`,
          type: 'bar',
          data: 남Data,
          color: '#5470c6'
        },
        {
          name: `${d} - 여`,
          type: 'bar',
          data: 여Data,
          color: '#ee6666'
        },
        {
          name: `${d} - 전체`,
          type: 'bar',
          data: 총Data,
          color: '#91cc75'
        }
      ];
    }).flat();

    const option = {
      title: { text: `성별 거주 인구 (${dong} 포함)` },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: relatedDongs.map(d => `${d} - 남`).concat(relatedDongs.map(d => `${d} - 여`)).concat(relatedDongs.map(d => `${d} - 전체`))
      },
      xAxis: {
        type: 'category',
        data: ['성별']
      },
      yAxis: {
        type: 'value'
      },
      series
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [dong]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    />
  );
};

export default GenderPopulationChart;
