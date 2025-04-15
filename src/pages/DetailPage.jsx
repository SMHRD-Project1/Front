import React, { useState, useRef, useEffect } from 'react';
import '../styles/DetailPage.css'; // 스타일을 외부 CSS 파일로 관리
import ChartComponent from '../components/ChartComponent';

const DetailPage = ({ selectedRegion, selectedDong, selectedCategory, data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(400);
  const detailPageRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const isResizingRef = useRef(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
      <div 
        ref={detailPageRef}
        className={`detail-page ${isCollapsed ? 'collapsed' : ''}`}
        style={{ width: isCollapsed ? '20px' : `${width}px` }}
      >
        {!isCollapsed && (
          <>
            <div 
              ref={resizeHandleRef}
              className="resize-handle"
            />
            <div className="content-container">
              <h2>상세 정보</h2>
              {selectedRegion && selectedDong ? (
                <>
                  <h3>{selectedDong} 지역</h3>
                  <p><strong>선택한 지역: </strong>{selectedRegion} - {selectedDong}</p>
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
                <div className='graph'>월 매출 추이 글씨로 띄워두기</div>
                <div className='graph'>인접동 평균매출 여러선 평균매출</div>
                <div className='graph'>유사 업종 매출 추이 여러선 평균매출</div>
                <div className='graph'>유사 업종 수 막대그래프</div>
                <h4>배달분석</h4>
                <div className='graph'>월별 배달 매출 추이 차트</div>
                <div className='graph'>인접 동 배달 매출 여러선 차트 그래프</div>
                <div className='graph'>남/녀 배달 비율 도넛</div>
                <div className='graph'>매장/배달 비율 도넛</div>
                <h4>유동인구</h4>
                <div className='graph'>시간대별 유동 인구 변화 차트</div>
                <div className='graph'>연령대별 유동 인구 차트</div>
                <div className='graph'>요일별 유동 인구 차트</div>
                <div className='graph'>성별 유동 인구 차트</div>
                <div className='graph'>성별 거주 인구 차트</div>
                <div className='graph'>인접 동 거주 인구 차트</div>
              </div>
            </div>
          </>
        )}
      </div>
      <button 
        className={`close-button ${isCollapsed ? 'closed' : 'opened'}`}
        onClick={toggleCollapse}
        style={!isCollapsed ? { right: `calc(100% - ${width}px)` } : {}}
      >
        {'<'}
      </button>
    </>
  );
};

export default DetailPage;