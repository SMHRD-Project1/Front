import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react';
import '../styles/DetailPage.css';
import ChartComponent from '../components/ChartComponent';
import { useLocation } from '../contexts/LocationContext';

import LineCom1 from '../components/LineCom1';
import LineCom2 from '../components/LineCom2';
import LineCom3 from '../components/LineCom3';
import LineCom4 from '../components/LineCom4';
import LineCom5 from '../components/LineCom5';
import LineCom6 from '../components/LineCom6';
import LineCom8 from '../components/LineCom8';

import DonutCom1 from '../components/DonutCom1';
import DonutCom2 from '../components/DonutCom2';

import BarCom1 from '../components/BarCom1';
import BarCom2 from '../components/BarCom2';
import BarCom3 from '../components/BarCom3';

const DetailPage = ({ selectedRegion, selectedDong, selectedCategory }) => {
  const { polygonCoords } = useLocation(); // ✅ context에서 path 받아오기
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(400);
  const detailPageRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const isResizingRef = useRef(false);

  const togglePage = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.target === resizeHandleRef.current) {
        isResizingRef.current = true;
      }
    };

    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return;

      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < window.innerWidth - 100) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleInterestSave = async () => {
    try {
      // 로그인 정보 가져오기
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      // 사용자 정보 파싱
      const parsedUserInfo = JSON.parse(userInfo);
      const userId = parsedUserInfo.id;

      // 선택된 카테고리나 지역이 없으면 알림
      if (selectedCategory === "업종" || (!selectedDong)) {
        alert("업종과 지역(행정구역 또는 다각형 영역)을 선택해주세요.");
        return;
      }

      // polygonCoords가 있으면 해당 정보를 map으로 변환
      const polygon = polygonCoords.map(([lng, lat]) => ({ longitude: lng, latitude: lat }));


      // POST 요청 보내기
      axios.post(
        'http://localhost:8088/controller/saveMyPage',
        {
          id: userId,
          polygon: polygon,
          region: selectedDong,
          category: selectedCategory
        }
      )
        .then((res) => {
          console.log(res)
          // 서버 응답 처리
          if (res.data === true) {
            alert('관심 정보가 성공적으로 저장되었습니다.');
          } else {
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
          }
        })


    } catch (error) {
      console.error('관심 정보 저장 중 오류 발생:', error);
      alert(`관심 정보 저장에 실패했습니다.\n오류 내용: ${error.message}`);
    }
  };

  return (
    <>
      <button
        className={`detail-page-toggle ${isOpen ? 'active' : ''}`}
        onClick={togglePage}
      >
        상세페이지
      </button>
      <div
        ref={detailPageRef}
        className={`detail-page ${isOpen ? 'open' : ''}`}
        style={{ width: `${width}px` }}
      >
        <div
          ref={resizeHandleRef}
          className="resize-handle"
        />

        <div className="real-estate-header">
          <h2>상세 정보</h2>
          <button
            className="interest-button"
            onClick={handleInterestSave}
          >
            관심 저장
          </button>
        </div>


        <div className="content-container">
          {selectedRegion && selectedDong ? (
            <>
              <h3>{selectedDong}</h3>
              {/* {selectedCategory && <p>{selectedCategory}</p>} */}
              {/* 상권 분석 정보 (그래프가 들어갈 공간) */}
              <div className="chart-container">
                <ChartComponent dong={selectedRegion} cate={selectedCategory} />
              </div>

              {/* 지역 관련 데이터 */}
              <h4>상권 분석</h4>
              <div className="data-list">
                <DonutCom2 dong={selectedRegion} selectedCategory={selectedCategory} />
              </div>
            </>
          ) : (
            <p>지역을 선택해주세요.</p>
          )}

          {/* 그래프 목록 */}
          <div className="graphs-container">
            <h4>매출 분석</h4>
            <div className="graph-group">
              <div style={{ width: '300px', height: '200px' }}><LineCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><LineCom2 dong={selectedRegion} cate={selectedCategory} /></div>
              {/* <div className='graph'>유사 업종 매출 추이 여러선 평균매출</div>
              <div className='graph'>유사 업종 수 //막대그래프</div> */}
            </div>

            <h4>배달 분석</h4>
            <div className="graph-group">
              <div style={{ width: '300px', height: '200px' }}><LineCom3 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><LineCom4 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><DonutCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><LineCom5 dong={selectedRegion} cate={selectedCategory} /></div>
            </div>

            <h4>유동인구</h4>
            <div className="graph-group">
              <div style={{ width: '300px', height: '200px' }}><LineCom6 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><BarCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><BarCom2 dong={selectedRegion} cate={selectedCategory} /></div>
              {/* <div className='graph' style={{ width: '300px', height: '200px' }}>성별 유동 인구 //다차원 차트</div> */}
              <div style={{ width: '300px', height: '200px' }}><BarCom3 dong={selectedRegion} cate={selectedCategory} /></div>
              <div><LineCom8 dong={selectedRegion} cate={selectedCategory} /></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;