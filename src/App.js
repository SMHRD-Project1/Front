import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StackedLineChart from "./components/StackedLineChart";
import MyPage from "./pages/MyPage";

function App() {
  return (
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
