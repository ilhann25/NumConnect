import React, { useState,useEffect } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";

const Home = () => {
  const [sourceType, setSourceType] = useState("decimal");
  const [sourceValue, setSourceValue] = useState("");
  const [cleanValue, setCleanValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [asciiValue, setAsciiValue] = useState("");
  const [decimalValue, setDecimalValue] = useState("");
  const [crcValue, setCrcValue] = useState("");

 //! Tv bağlanma ve veri gönderme için gerekli
  const [log, setLog] = useState(""); // TV'den alınan veriler 
  const [connected, setConnected] = useState(false); // Bağlantı durumu
  const [inputData, setInputData] = useState(""); // Gönderilecek veri
  const [port, setPort] = useState(null); // USB port bilgisi


  //! TV'ye bağlanma fonksiyonu
  const connectToUsbDevice = async () => {
    if (connected) {
      console.warn("Zaten cihaza bağlısınız.");
      return;
    }
  
    try {
      const selectedPort = await navigator.serial.requestPort(); // Kullanıcıdan port seçimi
      console.log("Cihaz seçildi:", selectedPort);
  
      await selectedPort.open({ baudRate: 115200 }); // Portu aç  baund
  
      if (!selectedPort.readable || !selectedPort.writable) {
        console.error("Port okunabilir veya yazılabilir durumda değil!");
        return;
      }
  
      selectedPort.ondisconnect = () => {
        console.warn("Cihaz bağlantısı kesildi.");
        setConnected(false);
        setPort(null);
      };
  
      setPort(selectedPort);
      setConnected(true);
      console.log("Cihaza bağlanıldı!");
    } catch (error) {
      console.error("Cihaza bağlanma hatası:", error);
      setLog((prevLog) => prevLog + `\nBağlanma hatası: ${error.message}`);
    }
  };
  

  //! TV'ye veri gönderme fonksiyonu
  const sendToTv = async () => {
    if (!connected) {
      console.error("Önce TV'ye bağlanmalısınız.");
      return;
    }

    if (!inputData || typeof inputData !== "string") {
      console.error("Geçersiz veri. Lütfen uygun formatta bir mesaj girin.");
      return;
    }

    try {
      const writer = port.writable.getWriter(); // Yazıcı oluştur
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(inputData)); // Veriyi gönder
      console.log("TV'ye veri gönderildi:", inputData);
      writer.releaseLock(); // Yazıcıyı serbest bırak
    } catch (error) {
      console.error("TV'ye veri gönderme hatası:", error);
      setLog((prevLog) => prevLog + `\nGönderim hatası: ${error.message}`);
    }
  };

  //! TV'den veri alma fonksiyonu( Veri Alma ile ilgili Hata Var )
  const receiveFromTv = async () => {
    if (!connected || !port || !port.readable) {
      console.error("TV'ye bağlanmadınız veya port geçerli değil.");
      return;
    }
  
    try {
      const reader = port.readable.getReader(); // Okuyucu oluştur
      const decoder = new TextDecoder(); // Veriyi çözecek bir çözümleyici
      let charsReceived = 0; // Alınan toplam karakter sayısı
      let result = ""; // Gelen veriyi birleştirmek için
  
      while (true) {
        const { value, done } = await reader.read(); // Veriyi oku
        if (done) {
          console.log("Veri akışı tamamlandı.");
          break;
        }
  
        if (value) {
          charsReceived += value.length;
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
  
          console.log(`Şu ana kadar alınan toplam karakter sayısı: ${charsReceived}`);
          console.log(`Şu anki veri parçası: ${chunk}`);
        }
      }
  
      console.log("TV'den gelen tam veri:", result);
      setLog((prevLog) => prevLog + result); // Gelen veriyi loga ekle
  
      // Okuyucuyu serbest bırak
      reader.releaseLock();
    } catch (error) {
      console.error("TV'den veri alma hatası:", error);
      setLog((prevLog) => prevLog + `\nVeri Alma hatası: ${error.message}`);
    }
  };
  
  
  // TV'den otomatik veri alma işlemi use
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (connected && isMounted) {
        try {
          await receiveFromTv();
        } catch (error) {
          console.error("Veri alma sırasında hata:", error);
        }
      }
    };

    const interval = setInterval(fetchData, 10000); // 10 saniyede bir veri alma 

    return () => {
      isMounted = false;
      clearInterval(interval); // Temizleme
    };
  }, [connected]);
  

  //! Split Input Helper Function
const splitInput = (input) => {
  return input
    .replace(/\s+/g, " ")
    .split(/[ ,]+/)     
    .filter((val) => val.trim() !== ""); 
};

    //! DÖNÜŞÜMLER !!!!

  //! Decimal to Hexadecimal
  const decimalToHex = (decimal) => {
    return splitInput(decimal)
      .map((num) => {
        const parsedNum = Number(num);
        return isNaN(parsedNum)
          ? "Invalid"
          : parsedNum.toString(16).toUpperCase();
      })
      .join(" ");
  };

  //! Decimal to ASCII
  const decimalToAscii = (decimal) => {
    return splitInput(decimal)
      .map((num) => {
        const parsedNum = Number(num);
        return isNaN(parsedNum) ? "Invalid" : String.fromCharCode(parsedNum);
      })
      .join("");
  };

  //! ASCII to Decimal
  const asciiToDecimal = (ascii) => {
    return ascii
      .split("")
      .map((char) => char.charCodeAt(0))
      .join(" ");
  };

  //! ASCII to Hexadecimal
  const asciiToHex = (ascii) => {
    return ascii
      .split("")
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase())
      .join(" ");
  };

  //! Hexadecimal to Decimal
  const hexToDecimal = (hex) => {
    return splitInput(hex)
      .map((num) => {
        try {
          const parsedNum = BigInt("0x" + num);
          return parsedNum.toString();
        } catch (error) {
          console.error(`Invalid Hexadecimal Value: ${num}`);
          return "Invalid";
        }
      })
      .join(" ");
  };

  //! Hexadecimal to ASCII
  const hexToAscii = (hex) => {
    return splitInput(hex)
      .map((num) => {
        try {
          const parsedNum = BigInt("0x" + num);
          if (parsedNum >= 0 && parsedNum <= 65535n) {
            return String.fromCharCode(Number(parsedNum));
          } else {
            return "Invalid";
          }
        } catch (error) {
          console.error(`Invalid Hexadecimal Value: ${num}`);
          return "Invalid";
        }
      })
      .join("");
  };

  //! Format Hexadecimal Input
  const formatHexInput = (hex) => {
    return hex
      .replace(/\s+/g, " ")
      .split(/[ ,]+/)
      .map((num) => {
        const trimmedNum = num.trim();
        return trimmedNum.length === 1 ? "0" + trimmedNum : trimmedNum;
      })
      .join(" ");
  };

  //! Handle Input Change
  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSourceValue(value);
    const cleaned = value.replace(/,/g, " ").replace(/\s+/g, " ");
    setCleanValue(cleaned);
  
    if (sourceType === "decimal") {
      setDecimalValue(cleaned);
      setHexValue(decimalToHex(cleaned));
      setAsciiValue(decimalToAscii(cleaned));
      setCrcValue("N/A");
    } else if (sourceType === "ascii") {
      setAsciiValue(cleaned);
      setDecimalValue(asciiToDecimal(cleaned));
      setHexValue(asciiToHex(cleaned));
      setCrcValue("N/A");
    } else if (sourceType === "hex") {
      const formattedHex = formatHexInput(cleaned);
      setCleanValue(formattedHex);
      setDecimalValue(hexToDecimal(formattedHex));
      setAsciiValue(hexToAscii(formattedHex));
      setHexValue(formattedHex);
      setCrcValue("N/A");  // CRC hesaplama kaldırıldı
    }
  };



  return (
    <Container fluid style={{ height: "42vh" }}>
      <Row className="justify-content-center" style={{ width: "101.7%" }}>
        <Col md={13}>
          <Card
            className="p-2 shadow"
            style={{ backgroundColor: "#DFF2D8", height: "auto" }}
          >
            <Row className="mb-15">
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label
                    style={{
                      fontSize: "1.2rem",
                      color: "Black",
                      textAlign: "center",
                      display: "block",
                      fontWeight: "bold",
                    }}
                  >
                    Veri Türü:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    style={{
                      fontSize: "0.93rem",
                      height: "2.5rem",
                      borderRadius: "8px",
                      padding: "0.25rem 0.5rem",
                    }}
                  >
                    <option value="decimal">Decimal</option>
                    <option value="hex">Hexadecimal</option>
                    <option value="ascii">ASCII</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label
                    style={{
                      fontSize: "1.2rem",
                      color: "Black",
                      textAlign: "center",
                      display: "block",
                      fontWeight: "bold",
                    }}
                  >
                    Değer Girin:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={sourceValue}
                    onChange={handleInputChange}
                    placeholder="Geçerli bir değer girin"
                    style={{
                      fontSize: "0.95rem",
                      padding: "0.5rem",
                      width: "102%",
                      color: "black",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4} style={{ width: "40%", height: "50%" }}>
                <Form.Label
                  style={{
                    fontSize: "1.2rem",
                    color: "Black",
                    textAlign: "center",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Düzgün Değer:
                </Form.Label>
                <Card className="p-2 shadow-sm">
                  <textarea
                    className="form-control"
                    style={{
                      fontSize: "1rem",
                      color: "black",
                      width: "100%",
                      height: "90px",
                      padding: "0.5rem",
                    }}
                    readOnly
                    value={cleanValue || "Veri Mevcut Değil"}
                  />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={15}>
                <Card className="p-2 shadow-sm" style={{ backgroundColor: "#FFF3E0" }}>
                  {sourceType !== "decimal" && (
                    <>
                      <h6 style={{ fontSize: "1rem", color: "red" }}>
                        Decimal Karşılık:
                      </h6>
                      <p style={{ fontSize: "0.93rem" }}>
                        {decimalValue || "Veri Mevcut Değil"}
                      </p>
                    </>
                  )}
                  {sourceType !== "hex" && (
                    <>
                      <h6 style={{ fontSize: "1rem", color: "red" }}>
                        Hexadecimal Karşılık:
                      </h6>
                      <p style={{ fontSize: "0.93rem" }}>
                        {hexValue || "Veri Mevcut Değil"}
                      </p>
                    </>
                  )}
                  {sourceType !== "ascii" && (
                    <>
                      <h6 style={{ fontSize: "1rem", color: "red" }}>
                        ASCII Karşılık:
                      </h6>
                      <p style={{ fontSize: "0.93rem" }}>
                        {asciiValue || "Veri Mevcut Değil"}
                      </p>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
  
{/* Yeni Bağlan Butonu */}
<Row className="justify-content-center" style={{ marginTop: "40px" }}>
  <Col md={10}>
    <Card className="p-3 shadow-lg rounded" style={{ backgroundColor: "#E8F5E9" }}>
      <Row className="align-items-center">
        <Col md={8} className="text-center">
          <h5 style={{ fontWeight: "bold", color: "#388E3C" }}>TV Bağlantısı</h5>
          <p style={{ fontSize: "0.9rem", color: "#616161" }}>
            TV'ye bağlanarak veri gönderme ve alma işlemini başlatabilirsiniz.
          </p>
        </Col>
        <Col md={4}>
          <Button
            onClick={connectToUsbDevice}
            style={{
              fontSize: "1.2rem",
              height: "4rem",
              borderRadius: "12px",
              width: "100%",
              backgroundColor: "#4CAF50",
              color: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            TV'ye Bağlan
          </Button>
        </Col>
      </Row>
    </Card>
  </Col>
</Row>

{/* TV'ye veri gönderme ve alınan veri logunu yan yana göstermek için düzenleme */}
<Row className="justify-content-center" style={{ marginTop: "27px",height:"50px" }}>
  <Col md={10}>
    <Card className="p-3 shadow-lg rounded" style={{ backgroundColor: "#F1F8E9" }}>
      <Card.Body>
        <Row>
          {/* Veri Gönderme Bölümü */}
          <Col md={6} style={{ borderRight: "1px solid #C0CA33" }}>
            <h5 style={{ fontWeight: "bold", color: "#1976D2", textAlign: "center" }}>Veri Gönderme</h5>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "#1565C0" }}>
                TV'ye Gönderilecek Veri:
              </Form.Label>
              <Form.Control
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Hexadecimal veri girin"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>
            <Button
              onClick={sendToTv}
              style={{
                fontSize: "1rem",
                height: "3rem",
                borderRadius: "8px",
                width: "100%",
                backgroundColor: "#2196F3",
                color: "white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              TV'ye Veri Gönder
            </Button>
          </Col>

          {/* Alınan Veri Logu Bölümü */}
          <Col md={6}>
            <h5 style={{ fontWeight: "bold", color: "#827717", textAlign: "center" }}>Alınan Veri Logu</h5>
            <div
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "#FFFDE7",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #C0CA33",
                color: "#616161",
                marginTop: "15px",
              }}
            >
              {log || "Henüz bir veri alınmadı."}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>
</Row>


    </Container>
  );
};
    
export default Home;
