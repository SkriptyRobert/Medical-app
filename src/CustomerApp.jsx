import React, { useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Stage } from '@react-three/drei'

function HeartModel() {
  const gltf = useGLTF('/hearth/scene.gltf')
  
  return (
    <Stage environment="city" intensity={0.2}>
      <primitive 
        object={gltf.scene} 
        scale={[0.5, 0.5, 0.5]}
        position={[0, -1, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </Stage>
  )
}

useGLTF.preload('/hearth/scene.gltf')

function CustomerApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [dbTestData, setDbTestData] = useState({
    testName: '',
    testValue: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Vytvoření mailto odkazu
    const mailtoLink = `mailto:robert.pesout@gmail.com?subject=Zpráva z FireSphere od ${formData.name}&body=Jméno: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AZpráva:%0D%0A${formData.message}`
    
    // Otevření emailového klienta
    window.location.href = mailtoLink

    // Vyčištění formuláře
    setFormData({
      name: '',
      email: '',
      message: ''
    })
  }

  const handleDbTest = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbTestData)
      })
      
      if (response.ok) {
        alert('Data úspěšně uložena do PostgreSQL!')
        setDbTestData({ testName: '', testValue: '' })
      } else {
        alert('Chyba při ukládání dat')
      }
    } catch (error) {
      console.error('Chyba:', error)
      alert('Chyba při komunikaci s databází')
    }
  }

  return (
    <div className="customer-app">
      {/* Navigační lišta */}
      <nav className="navbar">
        <div className="logo">FireSphere</div>
        <div className="nav-links">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            Domů
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            Produkty
          </button>
          <button 
            className={activeTab === 'contact' ? 'active' : ''} 
            onClick={() => setActiveTab('contact')}
          >
            Kontakt
          </button>
          <button 
            className="db-test-btn"
            onClick={() => setActiveTab('dbtest')}
          >
            DB Test
          </button>
        </div>
      </nav>

      {/* Hlavní obsah */}
      <main className="content">
        {activeTab === 'home' && (
          <div className="home-section">
            <div className="welcome-header">
              <div className="presentation-note">
                Aplikace připravena pro pohovor v Medical System
                <span className="date">19. ledna 2025</span>
              </div>
              <h1>Vítejte ve FireSphere</h1>
              <div className="tagline">Uděláme spolu díru do vesmíru?</div>
            </div>
            
            <div className="intro-text">
              <p>
                FireSphere je má demonstrace kreativity a technických dovedností v oblasti 3D vizualizace
                a webových aplikací. Kombinuje moderní technologie Three.js pro 3D animace s React
                frameworkem pro vytvoření interaktivního uživatelského rozhraní.
              </p>
              <p>
                Aplikace demonstruje schopnost vytvářet komplexní vizuální efekty, práci s 3D modely
                a plynulé přechody mezi scénami, což jsou dovednosti využitelné i v oblasti
                medicínských vizualizací a systémů.
              </p>
            </div>

            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">🔭</div>
                <h3>3D Vizualizace</h3>
                <p>Pokročilé renderování 3D modelů s realistickými efekty a animacemi</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Interaktivita</h3>
                <p>Plynulé přechody a responzivní uživatelské rozhraní</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Přesnost</h3>
                <p>Precizní práce s detaily a časováním animací</p>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Vlastní kód</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">React</div>
                <div className="stat-label">+ Three.js</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2024</div>
                <div className="stat-label">Nejnovější technologie</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h2>Ukázky Technologií</h2>
            <p className="section-intro">
              Demonstrace možností využití 3D vizualizací a interaktivních technologií
              v medicínských aplikacích
            </p>
            <div className="product-content">
              <div className="product-grid">
                <div className="product-card">
                  <div className="product-icon">🔬</div>
                  <h3>3D Modelování</h3>
                  <p>Vizualizace medicínských dat, orgánů a tkání s možností interaktivní manipulace</p>
                  <ul className="feature-list">
                    <li>Vysoké rozlišení detailů</li>
                    <li>Realistické textury</li>
                    <li>Plynulé animace</li>
                  </ul>
                  <button className="btn">Prozkoumat Demo</button>
                </div>

                <div className="product-card">
                  <div className="product-icon">⚡</div>
                  <h3>Interaktivní Rozhraní</h3>
                  <p>Moderní uživatelské rozhraní pro efektivní práci s medicínskými daty</p>
                  <ul className="feature-list">
                    <li>Intuitivní ovládání</li>
                    <li>Responzivní design</li>
                    <li>Real-time aktualizace</li>
                  </ul>
                  <button className="btn">Vyzkoušet Demo</button>
                </div>

                <div className="product-card">
                  <div className="product-icon">🎯</div>
                  <h3>Vizuální Efekty</h3>
                  <p>Pokročilé efekty pro zvýraznění důležitých částí a přechodů</p>
                  <ul className="feature-list">
                    <li>Částicové systémy</li>
                    <li>Světelné efekty</li>
                    <li>Plynulé přechody</li>
                  </ul>
                  <button className="btn">Zobrazit Ukázku</button>
                </div>

                <div className="product-card heart-model-card">
                  <h3>Interaktivní 3D Model Srdce</h3>
                  <div className="heart-canvas">
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      style={{ 
                        width: '100%', 
                        height: '300px',
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        marginTop: '1rem'
                      }}
                    >
                      <Suspense fallback={null}>
                        <HeartModel />
                        <OrbitControls 
                          enableZoom={true} 
                          autoRotate={true} 
                          autoRotateSpeed={1.5}
                          minPolarAngle={Math.PI / 4}
                          maxPolarAngle={Math.PI * 3/4}
                        />
                      </Suspense>
                    </Canvas>
                  </div>
                  <p className="model-description">
                    Ukázka schopností vizualizace anatomických struktur
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>Kontaktujte Mě!</h2>
            <p className="section-intro">
              Rád zodpovím vaše dotazy ohledně mých technických dovedností a možností spolupráce
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Vaše jméno</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jan Novák"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Váš email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jan.novak@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Vaše zpráva</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Napište mi svou zprávu..."
                  required
                />
              </div>
              <button type="submit" className="btn submit-btn">
                <span className="btn-icon">📧</span>
                Odeslat zprávu
              </button>
            </form>
          </div>
        )}

        {activeTab === 'dbtest' && (
          <div className="dbtest-section">
            <h2>Test PostgreSQL Databáze</h2>
            <p className="section-intro">
              Demonstrace propojení React aplikace s PostgreSQL databází přes Docker kontejner
            </p>
            <div className="test-container">
              <form className="db-test-form" onSubmit={handleDbTest}>
                <div className="form-group">
                  <label htmlFor="testName">Název testu</label>
                  <input
                    type="text"
                    id="testName"
                    value={dbTestData.testName}
                    onChange={(e) => setDbTestData(prev => ({...prev, testName: e.target.value}))}
                    placeholder="Zadejte název testu"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testValue">Testovací hodnota</label>
                  <input
                    type="text"
                    id="testValue"
                    value={dbTestData.testValue}
                    onChange={(e) => setDbTestData(prev => ({...prev, testValue: e.target.value}))}
                    placeholder="Zadejte testovací hodnotu"
                    required
                  />
                </div>
                <button type="submit" className="btn submit-btn">
                  <span className="btn-icon">💾</span>
                  Uložit do DB
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .customer-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          font-family: Arial, sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ff6b6b;
        }

        .nav-links button {
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          color: white;
          cursor: pointer;
          transition: color 0.3s;
        }

        .nav-links button:hover,
        .nav-links button.active {
          color: #ff6b6b;
        }

        .content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .features,
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card,
        .product-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
          transition: transform 0.3s;
        }

        .feature-card:hover,
        .product-card:hover {
          transform: translateY(-5px);
        }

        .btn {
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #ff5252;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 5px;
        }

        .contact-form textarea {
          height: 150px;
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .presentation-note {
          background: rgba(255, 107, 107, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          display: inline-block;
          font-size: 1.1rem;
        }

        .date {
          background: #ff6b6b;
          padding: 0.2rem 0.8rem;
          border-radius: 15px;
          margin-left: 1rem;
          font-weight: bold;
        }

        .tagline {
          font-size: 1.8rem;
          color: #ff6b6b;
          margin-top: 1rem;
          font-style: italic;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
        }

        .intro-text {
          max-width: 800px;
          margin: 2rem auto 3rem;
          text-align: center;
          line-height: 1.6;
          background: rgba(0, 0, 0, 0.2);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .intro-text p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stats-section {
          display: flex;
          justify-content: space-around;
          margin-top: 4rem;
          padding: 2rem;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 15px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ff6b6b;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .feature-card {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 107, 107, 0.2);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: #ff6b6b;
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #ff6b6b;
          text-align: center;
        }

        .section-intro {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 2rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }

        .product-content {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(300px, 1fr)) 300px;
          gap: 2rem;
          padding: 2rem 0;
        }

        .product-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .product-card p {
          margin-bottom: 1.5rem;
          flex-grow: 0;
          min-height: 3em;
        }

        .product-card .feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .product-card .feature-list li {
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .product-card .btn {
          margin-top: auto;
          width: 100%;
          padding: 0.8rem;
          border-radius: 8px;
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .product-card .btn:hover {
          transform: translateY(-2px);
        }

        .heart-model-card {
          width: 300px;
          min-width: auto;
          padding: 1rem;
        }

        .heart-model-card h3 {
          margin-bottom: 1rem;
        }

        .heart-model-card .model-description {
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .heart-canvas {
          flex-grow: 1;
          min-height: 200px;
        }

        .model-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        @media (max-width: 1600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .heart-model-card {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
          .product-content {
            padding: 0 1rem;
          }
        }

        .product-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
          text-align: left;
        }

        .feature-list li {
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.8);
          position: relative;
          padding-left: 1.5rem;
        }

        .feature-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #ff6b6b;
        }

        .btn {
          margin-top: auto;
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .btn:hover {
          background: linear-gradient(45deg, #ff8e8e, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }

        h3 {
          color: #ff6b6b;
          font-size: 1.5rem;
          margin: 1rem 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          color: #ff6b6b;
          font-weight: bold;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 1rem;
          border: 1px solid rgba(255, 107, 107, 0.2);
          background: rgba(0, 0, 0, 0.2);
          color: white;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 10px rgba(255, 107, 107, 0.2);
        }

        .contact-form textarea {
          min-height: 150px;
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          font-size: 1.1rem;
          margin-top: 1rem;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        @media (min-width: 768px) {
          .contact-form {
            max-width: 600px;
            margin: 0 auto;
          }
        }

        .db-test-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          margin-left: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .db-test-btn:hover {
          background: linear-gradient(45deg, #45a049, #4CAF50);
          transform: translateY(-2px);
        }

        .dbtest-section {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .test-container {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 15px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .db-test-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .db-test-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .db-test-form label {
          color: #4CAF50;
          font-weight: bold;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .db-test-form input {
          padding: 1rem;
          border: 1px solid rgba(76, 175, 80, 0.2);
          background: rgba(0, 0, 0, 0.2);
          color: white;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .db-test-form input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.2);
        }

        .db-test-form .submit-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .db-test-form .submit-btn:hover {
          background: linear-gradient(45deg, #45a049, #4CAF50);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

export default CustomerApp 