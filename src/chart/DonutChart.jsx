import React from 'react';
import ReactECharts from 'echarts-for-react';


// () 안에 {seriesData}< 넣고고
const DonutChart = () => {
    // 주석 풀어야지
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //   if (seriesData) {
    //     setData(seriesData); // 받아온 데이터를 상태에 저장
    //   }
    // }, [seriesData]);





  const option = {
    title: {
      text: 'Gender Ratio',
      subtext: 'Male vs Female',
      left: 'center',
      top: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'mijong Ratio',
        type: 'pie',
        radius: ['50%', '70%'], // 도넛 모양 만들기
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff', // 차트 구분선 색상
          borderWidth: 2
        },
        label: {
          normal: {
            show: true,
            position: 'outside'
          }
        },
        // data: data  << 받아온 데이터 처리할것것
        // 밑에꺼 지우고 위에 주석 풀면됨
        data: [
          { value: 60, name: 'Male' },   // 남성 비율
          { value: 40, name: 'Female' }   // 여성 비율
        ]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default DonutChart;