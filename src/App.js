import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/Navbar"; 
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Navbar Bileşenini Burada Kullanıyoruz */}
        <NavbarComponent /> {/* Navbar'ı burada kullanıyoruz */}
        
        {/* Sayfalar arası yönlendirme */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Ana sayfa */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
