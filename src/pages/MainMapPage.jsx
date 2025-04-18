/* global naver */
import React, { useEffect, useRef, useState } from 'react';
import { addMarker, clearMarkers } from "../contexts/MarkerManager";
import { drawPolygon, drawPolyline, clearShapes, clearPolyline } from "../contexts/PolygonManager";
import { useSangGwonApi } from "../contexts/UseSangGwonApi";
import useGeoJson from "../contexts/GeoJsonLoader";
import { useLocation } from "../contexts/LocationContext";
import '../styles/test.css'

const MainPage = ({ region, cate }) => {
  const { setPolygonCoords } = useLocation();
  const mapRef = useRef(null);
  const clickListenerRef = useRef(null);
  const coordsRef = useRef([]);
  const markersRef = useRef([]); // 마커들을 저장할 ref
  const [paths, setPaths] = useState([]); // 폴리곤 또는 폴리라인 경로 저장
  const [isPolygonComplete, setIsPolygonComplete] = useState(false); // 폴리곤 완성 여부
  const prevMarkerCoordsRef = useRef([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // 현재 열린 정보창을 추적

  const cateCode = useSangGwonApi(cate, paths); // 카테고리 + 경로 기반 업종 데이터 호출
  const features = useGeoJson(region); // region에 해당하는 GeoJSON 데이터

  // 지도 초기화
  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(35.14440650, 126.86438799),
      zoom: 15,
    });
    mapRef.current = map;

    // 지도 클릭 이벤트 리스너 추가
    naver.maps.Event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close(); // 열린 정보창 닫기
        setActiveInfoWindow(null); // 열린 정보창 상태를 초기화
      }
    });
  }, []);

  // region 또는 GeoJSON 데이터 변경 시 지도 위 폴리곤 재생성
  useEffect(() => {
    if (!mapRef.current || !features) return;

    // 기존 도형 및 마커 제거
    clearShapes();
    coordsRef.current = [];
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // GeoJSON에 기반한 폴리곤 경로 생성 및 지도에 표시
    features.forEach((feature) => {
      const geometry = feature.geometry;
      const newPaths = geometry.coordinates[0].map(coord =>
        new naver.maps.LatLng(coord[1], coord[0]) // [lng, lat] → [lat, lng]
      );

      setPaths(newPaths);
      const coords = newPaths.map(latlng => [latlng.lng(), latlng.lat()]);
      setPolygonCoords(coords);
      drawPolygon(mapRef.current, newPaths);
    });

    // 기존 클릭 리스너 제거
    if (clickListenerRef.current) {
      naver.maps.Event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
      clearPolyline();
    }

    // "다각형 설정" 모드일 경우 클릭 이벤트 리스너 등록
    if (region === "다각형 설정") {
      clickListenerRef.current = naver.maps.Event.addListener(
        mapRef.current,
        'click',
        (e) => {
          // 기존 마커 제거
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];

          const coord = e.coord;
          setIsPolygonComplete(false);
          clearShapes(); // 기존 도형 제거

          // 클릭한 지점에 마커 추가
          const marker = addMarker(mapRef.current, coord);
          coordsRef.current.push(coord);

          // 폴리라인 표시
          drawPolyline(mapRef.current, coordsRef.current);
          setPaths([...coordsRef.current]);

          // 마커 클릭 시 폴리곤 완성
          naver.maps.Event.addListener(marker, 'click', () => {
            drawPolygon(mapRef.current, coordsRef.current); // 폴리곤 그리기
            clearPolyline();                                // 폴리라인 제거
            clearMarkers();                                 // 마커 제거
            setPaths([...coordsRef.current]);               // 좌표 유지
            coordsRef.current = [];
            setIsPolygonComplete(true);                     // 완료 상태 표시
          });
        }
      );
    }
  }, [region, features]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && activeInfoWindow) {
        activeInfoWindow.close(); // 열린 정보창 닫기
        setActiveInfoWindow(null); // 상태 초기화
      }
    };  // esc 키 이벤트 리스너 추가
    document.addEventListener('keydown', handleEscKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [activeInfoWindow]);

  useEffect(() => {
    if (!mapRef.current || !cateCode || cateCode.length === 0) return;
    if (region === "다각형 설정" && !isPolygonComplete) return;

    const newCoords = cateCode.map(item => `${item.lat},${item.lon}`).join('|');
    const prevCoords = prevMarkerCoordsRef.current.join('|');
    if (newCoords === prevCoords) return;

    prevMarkerCoordsRef.current = cateCode.map(item => `${item.lat},${item.lon}`);
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    cateCode.forEach((item) => {
      const { lat, lon, bizesNm, lnoAdr } = item; // item에서 필요한 데이터 추출
      console.log(item)
      if (lat && lon) {
        const position = new naver.maps.LatLng(lat, lon);
        const marker = new naver.maps.Marker({
          position,
          map: mapRef.current,
          title: bizesNm,
        });

        // contentString 정의를 forEach 내부로 이동
        const contentString = `
        <div id="infoWindow" class="iw_inner">
          <h3>${bizesNm}</h3>
          <p>${lnoAdr}</p>
        </div>
      `;

        const infoWindow = new naver.maps.InfoWindow({
          content: contentString,
          backgroundColor: 'transparent', // 바깥 배경을 투명하게
          borderColor: 'transparent',     // 테두리 색 없애기
          borderWidth: 0,                 // 테두리 두께 없애기
          anchorSize: new naver.maps.Size(0, 0), // 앵커 크기 없애기
          disableAnchor: true             // 앵커 그 자체를 비활성화
        });

        naver.maps.Event.addListener(marker, 'click', function () {
          // 이전에 열린 정보창을 닫기
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          // 새로 클릭된 마커의 정보창을 열기
          infoWindow.open(mapRef.current, marker);
          setActiveInfoWindow(infoWindow); // 현재 열린 정보창 추적
        });

        marker.__infoWindow = infoWindow; // 정보창을 저장하여 추후 닫을 수 있게 함
        markersRef.current.push(marker);
      }
    });
  }, [cateCode, region, isPolygonComplete, cate, activeInfoWindow]);

  return <div id="map" className="main" />;
};

export default MainPage;
