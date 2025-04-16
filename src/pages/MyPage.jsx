import React, { useState, useEffect, useRef } from "react";
import "../styles/MyPage.css";
import { useNavigate } from 'react-router-dom';
import ChartComponent from '../components/ChartComponent';
import LineCom1 from '../components/LineCom1';
import LineCom2 from '../components/LineCom2';
import LineCom3 from '../components/LineCom3';
import LineCom4 from '../components/LineCom4';
import LineCom5 from '../components/LineCom5';
import LineCom6 from '../components/LineCom6';
import LineCom8 from '../components/LineCom8';
import DonutCom1 from '../components/DonutCom1';
import BarCom1 from '../components/BarCom1';
import BarCom2 from '../components/BarCom2';
import BarCom3 from '../components/BarCom3';

const MyPage = () => {
  const navigate = useNavigate();
  const [selectedRegions, setSelectedRegions] = useState([]);
  const cardsRef = useRef(null);

  const regions = [
    "관심지역 1",
    "관심지역 2",
    "관심지역 3",
    "관심지역 4",
    "관심지역 5",
  ];

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const handleWheel = (e) => {
      if (e.shiftKey) {
        // Shift 키를 누른 상태에서는 가로 스크롤
        e.preventDefault();
        cards.scrollLeft += e.deltaY;
      } else {
        // 기본적으로는 수직 스크롤
        cards.scrollTop += e.deltaY;
      }
    };

    cards.addEventListener('wheel', handleWheel, { passive: false });
    return () => cards.removeEventListener('wheel', handleWheel);
  }, []);

  // axios.get(
  //   'http://localhost:8088/controller/login',
  //   // get방식으로 데이터를 보낼때는 params 라는 키값으로 묶어서 보낼것
  //   {
  //     params: {
  //       id: id,
  //       name: name
  //     }
  //   }
  // )
  //   .then((res) => {
  //     console.log(res.data)
  //   })



  // 클랙했을떄 이미 있으면 제거 없으면 새로 창띄우는것
  const handleRegionClick = (region) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        return prev.filter(r => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };

  return (
    <div className="container">
      {/* 홈화면으로 돌아가는 버튼 */}
      <div className="top-navigation">
        <button className="Button2" onClick={() => navigate('/')}>홈</button>
      </div>

      {/* 사이드바 */}
      <div className="sidebar">
        <h3>관심 목록 선택</h3>
        {regions.map((region, index) => (
          <button
            key={index}
            className={`region-button ${selectedRegions.includes(region) ? 'active' : ''}`}
            onClick={() => handleRegionClick(region)}
          >
            {region}
          </button>
        ))}
      </div>

      {/* 메인 */}
      <div className="main">
        <div className="title">관심 지역 비교 리포트</div>
        {selectedRegions.length > 0 ? (
          <div className="cards">
            {selectedRegions.map((region, index) => (
              <div key={index} className="card">
                <div className="chart-title">{region}</div>
                <div className="chart-container">
                  <div id="chart" className="chart">
                    <ChartComponent dong={'행정동'} cate={'업종'} />
                  </div>
                </div>
                <div>
                  <h4>매출 분석</h4>
                  <div className="graph-group">
                    <div style={{ width: '300px', height: '200px' }}><LineCom1 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><LineCom2 dong={'행정동'} cate={'업종'} /></div>
                    {/* <div className='graph'>유사 업종 매출 추이 여러선 평균매출</div>
              <div className='graph'>유사 업종 수 //막대그래프</div> */}

                  </div>

                  <h4>배달 분석</h4>
                  <div className="graph-group">
                    <div style={{ width: '300px', height: '200px' }}><LineCom3 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><LineCom4 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><DonutCom1 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><LineCom5 dong={'행정동'} cate={'업종'} /></div>

                  </div>

                  <h4>유동인구</h4>
                  <div className="graph-group">
                    <div style={{ width: '300px', height: '200px' }}><LineCom6 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><BarCom1 dong={'행정동'} cate={'업종'} /></div>
                    <div style={{ width: '300px', height: '200px' }}><BarCom2 dong={'행정동'} cate={'업종'} /></div>
                    {/* <div className='graph' style={{ width: '300px', height: '200px' }}>성별 유동 인구 //다차원 차트</div> */}
                    <div style={{ width: '300px', height: '200px' }}><BarCom3 dong={'행정동'} cate={'업종'} /></div>
                    <div><LineCom8 dong={'행정동'} cate={'업종'} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-selection">
            관심 지역을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;