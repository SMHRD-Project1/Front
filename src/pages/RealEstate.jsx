import React, { useEffect, useState } from 'react';
import '../styles/DetailPage.css';
import 부동산 from '../config/부동산.json';
import { useLocation } from '../contexts/LocationContext'; // ✅ context import

// ✅ Point in polygon 체크 함수
const isPointInsidePolygon = (point, polygon) => {
    let [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect =
            (yi > y) !== (yj > y) &&
            x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
};

const RealEstate = ({ isOpen }) => {
    const [filteredData, setFilteredData] = useState([]);

    const { polygonCoords } = useLocation(); // ✅ context에서 path 받아오기

    useEffect(() => {
        console.log('useLocation 데이터:', { polygonCoords });
    }, [polygonCoords]);

    useEffect(() => {
        console.log('필터링 결과:', filteredData);
    }, [filteredData]);

    // ✅ 좌표 필터링
    useEffect(() => {
        if (polygonCoords.length === 0) {
            setFilteredData([]);
            return;
        }

        const result = 부동산.filter((item) => {
            const lat = parseFloat(item.위도); // 위도
            const lng = parseFloat(item.경도); // 경도
            const isInside = isPointInsidePolygon([lng, lat], polygonCoords);

            console.log(`[${item.제목}] lat: ${lat}, lon: ${lng}, 포함 여부: ${isInside}`);

            return isInside;
        });

        setFilteredData(result);
    }, [polygonCoords]);

    return (
        <div
            className={`real-estate ${isOpen ? 'open' : ''}`}
            // style={{ '--detail-page-width': `${detailPageWidth}px` }}
        >
            <div className="real-estate-header">
                <h2>매매 정보</h2>
            </div>

            <div className="real-estate-content">
                <div className="real-estate-section">
                    {/* <h3>매매 정보</h3> */}
                    <div className="data-list">
                        <ul>
                            {filteredData.length === 0 ? (
                                <li>선택된 지역 내 부동산 정보가 없습니다.</li>
                            ) : (
                                filteredData.map((item, index) => (
                                    <li key={index}>
                                        <div>제목: {item.제목}</div>
                                        <div>월세: {item.월세}</div>
                                        <div>면적: {item["계약/전용면적"]}</div>
                                        <div>소재지: {item.소재지}</div>
                                        <div>추천업종: {item.추천업종}</div>
                                        <a
                                            href={`https://new.land.naver.com/offices?ms=${item.위도},${item.경도},15&a=SG:SMS:GJCG:APTHGJ:GM:TJ&e=RETAIL&articleNo=${item.매물번호}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            네이버 부동산 가기
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstate;
