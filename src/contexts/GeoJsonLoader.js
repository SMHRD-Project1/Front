import { useEffect, useState } from 'react';

const useGeoJson = (region) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // GeoJSON 파일을 불러옴
    fetch('/data/seogu.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('GeoJSON 파일을 불러오는 데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 'region'에 맞는 'adm_nm'을 가진 데이터를 필터링
        const filteredFeatures = data.features.filter(
          (feature) => feature.properties.adm_nm === region
        );
        setFeatures(filteredFeatures);
      })
      .catch((error) => {
        console.error('에러 발생:', error);
      });
  }, [region]); // 'region'이 변경될 때마다 다시 호출

  return features;
};

export default useGeoJson;
