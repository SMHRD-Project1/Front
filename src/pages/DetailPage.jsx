import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react';
import '../styles/DetailPage.css';
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

const DetailPage = ({ selectedRegion, selectedDong, selectedCategory, data }) => {
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
        </div>


        <div className="content-container">


          {selectedRegion && selectedDong ? (
            <>
              <h3>{selectedDong} 지역</h3>
              {selectedCategory && <p><strong>선택한 업종: </strong>{selectedCategory}</p>}

              {/* 상권 분석 정보 (그래프가 들어갈 공간) */}
              <div className="chart-container">
                <div id="chart" className="chart">
                  <ChartComponent />
                </div>
              </div>

              {/* 지역 관련 데이터 */}
              <div className="data-list">
                <h4>상권 분석</h4>
                <ul>
                  {data ? (
                    data.map((item, index) => (
                      <li key={index}>
                        <strong>{item.name}</strong> - {item.description}
                      </li>
                    ))
                  ) : (
                    <p>데이터가 없습니다.</p>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p>지역을 선택해주세요.</p>
          )}

          {/* 그래프 목록 */}
          <div className="graphs-container">
            <h4>매출 분석</h4>
            <div className="graph-group">
              <div className='graph'><LineCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><LineCom2 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'>유사 업종 매출 추이 여러선 평균매출</div>
              <div className='graph'>유사 업종 수 //막대그래프</div>

            </div>

            <h4>배달 분석</h4>
            <div className="graph-group">
              <div className='graph'><LineCom3 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><LineCom4 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><DonutCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><LineCom5 dong={selectedRegion} cate={selectedCategory} /></div>
            </div>

            <h4>유동인구</h4>
            <div className="graph-group">
              <div className='graph'><LineCom6 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><BarCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><BarCom2 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'>성별 유동 인구 //다차원 차트</div>
              <div className='graph'><BarCom3 dong={selectedRegion} cate={selectedCategory} /></div>
              <div className='graph'><LineCom8 dong={selectedRegion} cate={selectedCategory} /></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;