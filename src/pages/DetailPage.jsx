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
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);  // 추가: 중복 저장 체크 상태

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

  //0417 남규 관심 정보 중복 저장 안되게
  useEffect(() => {
    const checkIfAlreadySaved = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return;

        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.id;

        // 필수 값이 없으면 체크하지 않음
        if (selectedCategory === "업종" || !selectedDong) return;

        const response = await axios.post('http://localhost:8088/controller/getMyPage', { id: userId });
        const userInterests = response.data;

        // 현재 선택된 항목이 이미 저장되어 있는지 확인
        const isDuplicate = userInterests.some(
          item => item.category === selectedCategory && item.region === selectedDong
        );

        setIsAlreadySaved(isDuplicate);
      } catch (error) {
        console.error('중복 체크 중 오류 발생:', error);
      }
    };

    checkIfAlreadySaved();
  }, [selectedCategory, selectedDong]);  // 선택된 값이 변경될 때마다 체크

  useEffect(() => {
    if (isOpen && detailPageRef.current) {
      detailPageRef.current.scrollTop = 0;
      console.log("in")

    }
  }, [isOpen]);
  
  const handleInterestSave = async () => {
    try {
      // 로그인 정보 가져오기
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        alert(`
          로그인이 필요한 서비스입니다.`);
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

      //0417 남규 관심 정보 중복 저장 안되게
      if (isAlreadySaved) {
        alert("이미 관심 목록에 추가된 항목입니다.");
        return;
      }

      // polygonCoords가 있으면 해당 정보를 map으로 변환
      const polygon = polygonCoords.map(([lng, lat]) => ({ longitude: lng, latitude: lat }));

      // POST 요청 보내기
      const response = await axios.post(
        'http://localhost:8088/controller/saveMyPage',
        {
          id: userId,
          polygon: polygon,
          region: selectedDong,
          category: selectedCategory
        }
      );

      // 서버 응답 처리
      if (response.data === true) {
        // alert('관심 정보가 성공적으로 저장되었습니다.');
        setIsAlreadySaved(true);  // 저장 성공 시 상태 업데이트
      } else {
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }

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
            disabled={isAlreadySaved}  // 이미 저장된 경우 버튼 비활성화
            style={{ 
              backgroundColor: isAlreadySaved ? '#cccccc' : '#007bff',
              cursor: isAlreadySaved ? 'not-allowed' : 'pointer'
            }}
          >
            {isAlreadySaved ? '저장됨' : '관심 저장'}
          </button>
        </div>


        <div className="content-container" ref={detailPageRef}>
          <div className="graphs-container">

            <h4> 월 평균 매출</h4>
            <div className="graph-group">
              <div style={{ width: '300px', height: '200px', paddingLeft: '20px' }}><ChartComponent dong={selectedRegion} cate={selectedCategory} /></div>
            </div>

            <h4>매장 매출 분석</h4>
            <div className="graph-group">
              <div style={{ width: '300px', height: '200px' }}><LineCom1 dong={selectedRegion} cate={selectedCategory} /></div>
              <div style={{ width: '300px', height: '200px' }}><LineCom2 dong={selectedRegion} cate={selectedCategory} /></div>
              {/* <div className='graph'>유사 업종 매출 추이 여러선 평균매출</div>
              <div className='graph'>유사 업종 수 //막대그래프</div> */}
            </div>

            <h4>배달 매출 분석</h4>
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