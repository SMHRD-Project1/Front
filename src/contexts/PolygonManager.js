/* global naver */

let polygon = null;
let polyline = null;

export const drawPolyline = (map, coords) => {
  if (polyline) polyline.setMap(null);

  polyline = new naver.maps.Polyline({
    map,
    path: coords,
    strokeColor: '#16B8F1',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  });

  return polyline;
};

export const drawPolygon = (map, coords, onClick) => {
  if (polygon) polygon.setMap(null);

  polygon = new naver.maps.Polygon({
    map,
    paths: [coords],
    fillColor: '#9ad8ed',
    fillOpacity: 0.3,
    strokeColor: '#9ad8ed',
    strokeOpacity: 0.6,
    strokeWeight: 3,
  });

  if (onClick) {
    naver.maps.Event.addListener(polygon, 'click', onClick);
  }

  return polygon;
};

export const clearShapes = () => {
  if (polyline) polyline.setMap(null);
  if (polygon) polygon.setMap(null);
  polyline = null;
  polygon = null;
};


export const clearPolyline = () => {
  if (polyline) {
    polyline.setMap(null);
    polyline = null;
  }
};
