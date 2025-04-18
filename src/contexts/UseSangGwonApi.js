import { useEffect, useState } from 'react';
import axios from 'axios';
import cateList from '../config/업종코드목록.json';

export const useSangGwonApi = (cate, paths) => {
    const [cateCode, setCateCode] = useState([]);

    useEffect(() => {
        if (!cate || !paths || paths.length === 0) return;

        const matchedCate = cateList.find(item => item.업종이름 === cate);
        const coordinates = paths.map(latlng => `${latlng.lng()} ${latlng.lat()}`).join(', ');
        const 업종코드 = matchedCate.업종코드;
        const api = 
        `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInPolygon?serviceKey=${process.env.REACT_APP_SANGGWON_API_KEY}&pageNo=1&numOfRows=1000&key=POLYGON%20((${coordinates}))&indsSclsCd=${업종코드}&type=json`;


        axios
            .get(api)
            .then((res) => {
                if (res.data?.body?.items) {
                    setCateCode(res.data.body.items);
                } else {
                    console.warn("데이터 없음");
                }
            })
            .catch((err) => {
                console.error("API 호출 오류:", err);
            });

    }, [cate, paths]);

    return cateCode;
};
