import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className="navbar navbar-expand-sm custom-navbar"
      style={{
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontSize: "0.9rem",
      }}
    >
      <div className="container-fluid">
        {/* Sol Tarafa Logo Ekleme */}
        <div className="navbar-brand">
          <img
            src="/logo_ilhan.png" // Public klasöründeki logo dosyasına göre yol verilmiştir
            alt="Logo"
            style={{
              height: "65px", // Logo yüksekliği
              width: "125px", // Genişlik otomatik olarak ayarlanır
            }}
          />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
          style={{
            padding: "0.25rem 0.5rem", // Küçültme
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                AnaSayfa
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://crccalc.com/?crc=123456789&method=&datatype=ascii&outtype=hex"
                target="_blank"
                rel="noopener noreferrer"
              >
                CRC-Dönüşüm
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Sayı Dönüşümleri
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="https://www.rapidtables.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Rapidtables
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://www.rapidtables.com/convert/number/ascii-hex-bin-dec-converter.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Genel Dönüşüm
                  </a>
                </li>
                <li></li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://www.hesapla.online/sayi-sistemleri-cevirme"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sayı Sistemleri
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          {/* Sosyal Medya Linkleri */}
          <div className="social-links">
            <a
              href="https://www.facebook.com/sunny.turkiye"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://x.com/sunny_turkiye"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com/sunny.turkiye/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://tr.linkedin.com/company/sunnyelektronik"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{ fontSize: "0.8rem", width: "12.2rem", height: "2.1rem" }} // Arama kutusunu küçültme
            />
            <button
              className="btn btn-primary"
              type="submit"
              style={{
                fontSize: "0.9rem",
                padding: "0.4rem 0.2rem", // Buton boyutunu küçültme
                borderRadius: "8px",
                border: "none",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
