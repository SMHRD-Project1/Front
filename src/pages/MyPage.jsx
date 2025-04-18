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
  const [isOpen, setIsOpen] = useState(true); // 사이드바 상태 추가
  const userInfo = localStorage.getItem('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);
  const userId = parsedUserInfo.id;
  const [deleted, setDeleted] = useState(false)



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
  }, [userId, deleted]);

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    try {
      axios.post('http://localhost:8088/controller/deleteInterest', {
        id: userId,
        category: item.category,
        region: item.region
      });

      // 0417 남규 수정 서버 응답 성공 시 바로 상태 업데이트
      setList(prev => prev.filter(i => !(i.category === item.category && i.region === item.region)));
      setSelectedRegions(prev => prev.filter(r => !(r.category === item.category && r.region === item.region)));

    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

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

  // 사이드바 토글 함수 추가
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="container">
      <div className="top-navigation">
        <button className="Button2" onClick={() => navigate('/')}>홈</button>
      </div>

      {/* 사이드바 컨테이너 및 토글 버튼 추가 */}
      <div className={`sidebar-container ${isOpen ? '' : 'closed'}`}>
        <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
          <h3>관심 목록 선택</h3>
          {list.map((item, index) => {
            const displayName = `${item.category} ${item.region}`;
            const isActive = selectedRegions.some(
              r => r.category === item.category && r.region === item.region
            );
            return (
              // region-button-wrapper 제거하고 직접 button 렌더링
              <button
                key={index} // key는 최상위 요소에 적용
                className={`region-button ${isActive ? 'active' : ''}`}
                onClick={() => handleRegionClick(item)}
              >
                {displayName}
                <span className="delete-btn" onClick={(e) => handleDelete(item, e)}>×</span>
              </button>
            );
          })}
        </div>
        {/* 토글 버튼 추가 */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '목록닫기' : '목록보기'}
        </button>
      </div>

      {/* 메인 컨텐츠 영역 조정 */}
      <div className={`main ${isOpen ? '' : 'full-width'}`}>
        <div className="title">관심 지역 비교 리포트</div>
        {selectedRegions.length > 0 ? (
          <div className="cards" ref={cardsRef}>
            {selectedRegions.map((item, index) => {
              const { category, region } = item;
              const displayName = `${category} ${region}`;

              return (
                <div key={index} className="card">
                  <div className="chart-title">{displayName}</div>
                  <h4>월 평균 매출 분석</h4>
                  <div className="graph-group">
                    <div><ChartComponent dong={category} cate={region} /></div>
                  </div>
                  <h4>매장 매출 분석</h4>
                  <div className="graph-group">
                    <div><LineCom1 dong={category} cate={region} /></div>
                    <div><LineCom2 dong={category} cate={region} /></div>
                  </div>

                  <h4>배달 매출 분석</h4>
                  <div className="graph-group">
                    <div><LineCom3 dong={category} cate={region} /></div>
                    <div><LineCom4 dong={category} cate={region} /></div>
                    <div><DonutCom1 dong={category} cate={region} /></div>
                    <div><LineCom5 dong={category} cate={region} /></div>
                  </div>

                  <h4>유동인구</h4>
                  <div className="graph-group">
                    <div><LineCom6 dong={category} cate={region} /></div>
                    <div><BarCom1 dong={category} cate={region} /></div>
                    <div><BarCom2 dong={category} cate={region} /></div>
                    <div><BarCom3 dong={category} cate={region} /></div>
                    <div><LineCom8 dong={category} cate={region} /></div>
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
