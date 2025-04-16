import React, { useEffect, useState } from 'react';
import '../styles/DetailPage.css'; 

const RealEstate = ({ isOpen }) => {
    const [detailPageWidth, setDetailPageWidth] = useState(400);

    useEffect(() => {
        // DetailPage의 너비 변화를 감지하는 observer 생성
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target.classList.contains('detail-page')) {
                    setDetailPageWidth(entry.target.offsetWidth);
                }
            }
        });

        // DetailPage 요소 관찰 시작
        const detailPage = document.querySelector('.detail-page');
        if (detailPage) {
            observer.observe(detailPage);
        }

        // 컴포넌트 언마운트 시 observer 해제
        return () => {
            if (detailPage) {
                observer.unobserve(detailPage);
            }
        };
    }, []);

    
    return (
        <div 
            className={`real-estate ${isOpen ? 'open' : ''}`}
            style={{
                '--detail-page-width': `${detailPageWidth}px`
            }}
        >
                <div className="real-estate-header">
                    <h2>﻿제목</h2>
                </div>
                <div className="real-estate-content">
                    <div className="real-estate-section">
                        <h3>매매 정보</h3>
                        <div className="data-list">
                            <ul>
                                <li>월세</li>
                                <li>계약/전용면적</li>
                                <li>소재지</li>
                                <li>매물특징</li>
                                <li>네이버 부동산 가기</li>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default RealEstate; 