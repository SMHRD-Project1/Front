/* global naver */

import '../styles/main.css';
import axios from 'axios';
import React, { useImperativeHandle, forwardRef, useEffect, useRef, useState } from 'react';
import { useLocation } from '../contexts/LocationContext'; // 추가

const MainPage = forwardRef(({ 업종코드 }, ref) => {
  const { setPolygonCoords } = useLocation(); // 추가
  let result = '';
  const polygonRef = useRef(null);
  const polylineRef = useRef(null);
  const mapRef = useRef(null);
  const btnFlagRef = useRef(false);
  const markerRef = useRef([]);
  const polymap = useRef(false);
  const dongPositionsRef = useRef([]);

  const [markerPosition, setMarkerPosition] = useState();
  const [dong, setDong] = useState([]);
  const [polymap_, setPolymap_] = useState(false);
  const [btnFlag, setBtnFlag] = useState(false);
  const [markerList, setMarkerList] = useState([]);

  //  초기화
  const clearAll = () => {
    markerRef.current.forEach((marker) => marker.setMap(null));
    markerRef.current = [];
    setMarkerList([]);

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
  };

  //  마커 찍기
  const markerSet = (data) => {
    const marker = new naver.maps.Marker({
      position: data,
      map: mapRef.current,
    });

    markerRef.current.push(marker);
  };

  //  폴리곤 그리기
  const drowPolygon = (path) => {
    polygonRef.current = new naver.maps.Polygon({
      map: mapRef.current,
      paths: [path],
      fillColor: '#ffff33',
      fillOpacity: 0.3,
      strokeColor: '#ffff33',
      strokeOpacity: 0.6,
      strokeWeight: 3,
    });

    // ✅ Context에 좌표 저장
    const coords = path.map(latlng => [latlng.lng(), latlng.lat()]);
    setPolygonCoords(coords);
  

    // 폴리곤이 그려진 후 API 호출을 위한 좌표 설정
    const coordinates = path.map(coord => {
      if (coord.x && coord.y) {
        return `${coord.x}%20${coord.y}`;
      } else if (coord.lat && coord.lng) {
        return `${coord.lng}%20${coord.lat}`;
      } else {
        return `${coord[0]}%20${coord[1]}`;
      }
    }).join(',');


    // 업종코드가 있는 경우 API 호출
    if (업종코드) {

      const api = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInPolygon?serviceKey=${process.env.REACT_APP_SANGGWON_API_KEY}&pageNo=1&numOfRows=1000&key=POLYGON%20((${coordinates}))&indsSclsCd=${업종코드}&type=json`;


      axios
        .get(api)
        .then((res) => {

          if (res.data && res.data.body && res.data.body.items) {

            // 기존 마커 제거
            markerRef.current.forEach((marker) => marker.setMap(null));
            markerRef.current = [];

            // 새 마커 추가
            res.data.body.items.forEach((item) => {
              const position = new naver.maps.LatLng(item.lat, item.lon);
              markerSet(position);
            });
          }
        })
        .catch((err) => {
          console.error("❌ [MainPage] API 호출 오류:", err);
        });
    }
  };

  //  지도 로딩
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(35.1525164, 126.8895063),
      zoom: 14,
    };
    const map = new naver.maps.Map('map', mapOptions);
    mapRef.current = map;

    // 새로고침 후 로컬스토리지에 저장된 데이터가 있으면 그 데이터를 불러오기
    const storedMarkerPosition = localStorage.getItem('markerPosition');
    if (storedMarkerPosition) {
      const parsedData = JSON.parse(storedMarkerPosition);
      const pins = parsedData.body.items.map(
        (position) => new naver.maps.LatLng(position.lat, position.lon)
      );

      pins.forEach((pin) => {
        markerSet(pin);
      });
    }
  }, []);

  //  마커 T/F
  const makerEvent = () => {
    btnFlagRef.current = !btnFlagRef.current;
    setBtnFlag(btnFlagRef.current);
  }
  //  마커
  useEffect(() => {
    if (!mapRef.current) return;

    const listener = naver.maps.Event.addListener(mapRef.current, 'click', function (e) {
      if (btnFlagRef.current) {
        if (polygonRef.current) {
          clearAll();
        }
        markerSet(e.coord);
        setMarkerList((prev) => [...prev, { x: e.coord.x, y: e.coord.y }]);
      }
    });

    if (!btnFlag) {
      clearAll();
    }

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [btnFlag]);

  //  폴리
  useEffect(() => {
    const path = markerList.map(({ x, y }) => new naver.maps.LatLng(y, x));

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    polylineRef.current = new naver.maps.Polyline({
      map: mapRef.current,
      path: path,
      strokeColor: '#16B8F1',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

    if (markerRef.current[0]) {
      naver.maps.Event.addListener(markerRef.current[0], 'click', function () {
        polymap.current = true;
        setPolymap_(true);

        if (polygonRef.current) {
          polygonRef.current.setMap(null);
        }
        drowPolygon(path);

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        // 업종코드가 있는 경우 자동으로 API 호출
        if (업종코드) {
          polymap.current = true;
          setPolymap_(true);
        }
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [markerList]);

  //  상권API 호출
  useEffect(() => {
    if (polymap_) {
      result = markerList
        .map((item) => `${item.x}%20${item.y}`)
        .join(',');


      // 업종코드가 비어있는지 확인
      if (!업종코드) {
        return;
      }

      const api = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInPolygon?serviceKey=${process.env.REACT_APP_SANGGWON_API_KEY}&pageNo=1&numOfRows=1000&key=POLYGON%20((${result}))&indsSclsCd=${업종코드}&type=json`;


      axios
        .get(api)
        .then((res) => {

          if (res.data && res.data.body && res.data.body.items) {
            setMarkerPosition(res.data);
            localStorage.setItem('markerPosition', JSON.stringify(res.data));
          } else {
          }

          markerRef.current.forEach((marker) => marker.setMap(null));
          markerRef.current = [];
          setMarkerList([]);
          setPolymap_(false);
        })
        .catch((err) => {
          console.error('Error : ', err);
          console.error('Error response:', err.response);
        });
    }
  }, [polymap_]);

  // 상권 Pin찍기
  useEffect(() => {
    if (markerPosition) {
      try {

        if (!markerPosition.body || !markerPosition.body.items || !Array.isArray(markerPosition.body.items)) {
          return;
        }

        // 기존 마커 제거
        markerRef.current.forEach((marker) => marker.setMap(null));
        markerRef.current = [];

        // 새 마커 추가
        const pins = markerPosition.body.items.map((position) => {
          return new naver.maps.LatLng(position.lat, position.lon);
        });


        pins.forEach((pin) => {
          markerSet(pin);
        });

      } catch (error) {
        console.error(" [MainPage] 마커 찍기 오류:", error);
      }
    }
  }, [markerPosition]);

  // 행정동 geojson
  useEffect(() => {
    fetch('/data/seogu.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('GeoJSON 파일을 불러오는 데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setDong(data.features);
      })
      .catch((error) => {
        console.error('에러 발생:', error);
      });
  }, []);

  const btn2Event = (text1, text2) => {
    clearAll();
    if (text2 === '다각형 설정') {
      btnFlagRef.current = true;
    } else {
      btnFlagRef.current = false;
      if (text2 !== '동 설정') {
        dong.forEach((item) => {
          if (item.properties.adm_nm === text2) {
            dongPositionsRef.current = item.geometry.coordinates[0];
            clearAll();

            // naver LatLng로 변환
            const convertedPath = dongPositionsRef.current.map(coord =>
              new naver.maps.LatLng(coord[1], coord[0])
            );

            drowPolygon(convertedPath); // 변경된 부분
          }
        });
      }
    }
  };

  // 외부에서 접근 가능한 함수들 
// 외부에서 접근 가능한 함수들
useImperativeHandle(ref, () => ({
  btn1Event: (업종) => {
    // console.log("✅ [MainPage] 버튼1 이벤트 실행됨 - 업종:", 업종);
    // 필요 시 업종 관련 로직 추가
  },
  btn2Event: (지역또는다각형, 좌표 = null) => {
    // console.log("✅ [MainPage] 버튼2 이벤트 실행됨 - 지역/다각형:", 지역또는다각형, "좌표:", 좌표);
    clearAll();

    if (지역또는다각형 === '다각형 설정') {
      btnFlagRef.current = true;
      // console.log("🟨 [MainPage] 다각형 설정 모드 진입");

      if (좌표 && Array.isArray(좌표)) {
        const path = 좌표.map(([lng, lat]) => new naver.maps.LatLng(lat, lng));
        // console.log("🟩 [MainPage] 좌표 기반으로 다각형 그리기");
        drowPolygon(path);
      }
    } else {
      btnFlagRef.current = false;
      // console.log("🟦 [MainPage] 행정동 설정 시도:", 지역또는다각형);

      const matchedDong = dong.find(item => item.properties.adm_nm === 지역또는다각형);
      if (matchedDong) {
        dongPositionsRef.current = matchedDong.geometry.coordinates[0];
        const convertedPath = dongPositionsRef.current.map(coord =>
          new naver.maps.LatLng(coord[1], coord[0])
        );
        // console.log("🟧 [MainPage] 행정동 기반으로 폴리곤 그리기:", 지역또는다각형);
        drowPolygon(convertedPath);
      } else {
        // console.warn("❌ [MainPage] 해당 행정동을 찾을 수 없음:", 지역또는다각형);
      }
    }
  }
}));



  return (
    <div className='main'>
      <div id='map'></div>
    </div>
  );
});

export default MainPage;