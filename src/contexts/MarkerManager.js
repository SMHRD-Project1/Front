/* global naver */

let markerList = [];

export const clearMarkers = () => {
    markerList.forEach(marker => marker.setMap(null));
    markerList = [];
};

export const addMarker = (map, position) => {
    const marker = new naver.maps.Marker({
        position,
        map,
    });

    markerList.push(marker);
    return marker;
};

export const getMarkers = () => markerList; // ✅ 현재 마커 목록 반환