import axios from 'axios'
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
  const [selectedRegions, setSelectedRegions] = useState([]); // { category, region } 객체 리스트
  const [list, setList] = useState([]); // 관심 항목 리스트
  const cardsRef = useRef(null);
  const userInfo = localStorage.getItem('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);
  const userId = parsedUserInfo.id;

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const handleWheel = (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        cards.scrollLeft += e.deltaY;
      } else {
        cards.scrollTop += e.deltaY;
      }
    };

    cards.addEventListener('wheel', handleWheel, { passive: false });
    return () => cards.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    axios.post('http://localhost:8088/controller/getMyPage', { id: userId })
      .then((res) => {
        const data = res.data;

        // 카테고리-지역 객체로 변환
        const formattedList = data.map(item => ({
          category: item.category,
          region: item.region
        }));

        setList(formattedList);
      })
      .catch((err) => {
        console.error('데이터 로딩 실패:', err);
      });
  }, [userId]);

  const handleRegionClick = (item) => {
    setSelectedRegions(prev => {
      const exists = prev.some(r => r.category === item.category && r.region === item.region);
      if (exists) {
        return prev.filter(r => !(r.category === item.category && r.region === item.region));
      } else {
        return [...prev, item];
      }
    });
  };


  return (
    <div className="container">
      <div className="top-navigation">
        <button className="Button2" onClick={() => navigate('/')}>홈</button>
      </div>

      <div className="sidebar">
        <h3>관심 목록 선택</h3>
        {list.map((item, index) => {
          const displayName = `${item.category} ${item.region}`;
          const isActive = selectedRegions.some(
            r => r.category === item.category && r.region === item.region
          );
          return (
            <button
              key={index}
              className={`region-button ${isActive ? 'active' : ''}`}
              onClick={() => handleRegionClick(item)}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      <div className="main">
        <div className="title">관심 지역 비교 리포트</div>
        {selectedRegions.length > 0 ? (
          <div className="cards" ref={cardsRef}>
            {selectedRegions.map((item, index) => {
              const { category, region } = item;
              const displayName = `${category} ${region}`;

              console.log(`그래프 렌더링 - category: ${category}, region: ${region}`);

              return (
                <div key={index} className="card">
                  <div className="chart-title">{displayName}</div>
                  <div className="chart-container">
                    <div id="chart" className="chart">
                      <ChartComponent dong={category} cate={region} />
                    </div>
                  </div>

                  <h4>매출 분석</h4>
                  <div className="graph-group">
                    <div className='graph'><LineCom1 dong={category} cate={region} /></div>
                    <div className='graph'><LineCom2 dong={category} cate={region} /></div>
                  </div>

                  <h4>배달 분석</h4>
                  <div className="graph-group">
                    <div className='graph'><LineCom3 dong={category} cate={region} /></div>
                    <div className='graph'><LineCom4 dong={category} cate={region} /></div>
                    <div className='graph'><DonutCom1 dong={category} cate={region} /></div>
                    <div className='graph'><LineCom5 dong={category} cate={region} /></div>
                  </div>

                  <h4>유동인구</h4>
                  <div className="graph-group">
                    <div className='graph'><LineCom6 dong={category} cate={region} /></div>
                    <div className='graph'><BarCom1 dong={category} cate={region} /></div>
                    <div className='graph'><BarCom2 dong={category} cate={region} /></div>
                    <div className='graph'><BarCom3 dong={category} cate={region} /></div>
                    <div className='graph2'><LineCom8 dong={category} cate={region} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-selection">관심 지역을 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
