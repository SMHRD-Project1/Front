import React, { useState } from "react";
import "../styles/MyPage.css";
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const [selectedRegions, setSelectedRegions] = useState([]);

  const regions = [
    "관심지역 1",
    "관심지역 2",
    "관심지역 3",
    "관심지역 4",
    "관심지역 5",
  ];

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
        <h3>관심 지역 선택</h3>
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
                <div className="chart-container" id={`line-chart-${index}`}>
                  [라인차트]
                </div>
                <div className="chart-container" id={`pie-chart-${index}`}>
                  [도넛차트]
                </div>
                <div className="chart-container" id={`bar-chart-${index}`}>
                  [바차트]
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-selection">
            왼쪽 사이드바에서 관심 지역을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;