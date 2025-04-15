import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SalesChartEchart from './chart/SalesChartEchart';
import ExampleDonut from "./chart/ExampleDonut";
import ChatBot from "./ChatBot"
import Home from "./pages/home";
import StackedLineChart from "./components/StackedLineChart";


function App() {
  return (

    // <div>
    //   <ChatBot></ChatBot>
    // </div>

    // <div>
    //   <ExampleDonut />
    //   <SalesChartEchart 업종이름="돼지고기 구이/찜" />
    // </div>

    // 메인 화면
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/stackedlinechart" element={<StackedLineChart />} />
        {/* <Route path="/mypage" element={<MyPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
