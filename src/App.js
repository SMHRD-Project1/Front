import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SalesChartEchart from './chart/SalesChartEchart';
import ExampleDonut from "./chart/ExampleDonut";

import Home from "./pages/home";
// import Main from "./page/Detail";
// import Main from "./page/MyPage";
// import Main from "./page/Sale";

function App() {
  return (

    // <div>
    //   <ExampleDonut />
    // </div>

    // 매출
    // <div className="App">
    //   <SalesChartEchart 업종이름="돼지고기 구이/찜" />
    // </div>

    // 메인 화면
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} />
        {/* <Route path="/mypage" element={<MyPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
