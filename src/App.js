import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import StackedLineChart from "./components/StackedLineChart";
import MyPage from "./pages/MyPage";

function App() {
  return (
    
    // <div>
    //   <Login/>
    // </div>

    // <div>
    //   <ChatBot></ChatBot>
    // </div>

    // <div>
    //   <ExampleDonut />
    //   <SalesChartEchart 업종이름="돼지고기 구이/찜" />
    // </div>

    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/stackedlinechart" element={<StackedLineChart />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
