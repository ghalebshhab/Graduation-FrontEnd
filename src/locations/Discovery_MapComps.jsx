import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, ArrowLeft, Info, Compass, ChevronLeft } from 'lucide-react';
import Sidebar from '../nav/Sidebar'; 
import './Discovery.css';

const GOVERNORATES = ["عمان", "الزرقاء", "إربد", "المفرق", "عجلون", "العقبة", "الكرك"];

const RECOMMENDED_PLACES = [
  { id: 1, name: "شارع الرينبو", city: "عمان", img: "/rainbow.jpg", rating: 4.8, type: "سياحة" },
  { id: 2, name: "الحديقة اليابانية", city: "عمان", img: "/japan.jpg", rating: 4.5, type: "منتزه" },
  { id: 3, name: "جبل القلعة", city: "عمان", img: "/citadel.jpg", rating: 4.9, type: "تاريخ" }
];

export default function JoMapDiscovery() {
  const [activeGov, setActiveGov] = useState("عمان");
  const navigate = useNavigate();

  return (
    <div className="web-discovery-layout" dir="rtl">
      <Sidebar />

      <main className="discovery-main-web">
        {/* Left Side: Information & Exploration */}
        <section className="discovery-content-panel">
          <header className="discovery-header-web">
            <div className="search-box-web">
              <Search className="search-icon-gray" size={20} />
              <input type="text" placeholder="ابحث عن أماكن، مطاعم، أو معالم..." />
            </div>
          </header>

          <nav className="gov-filter-web">
            {GOVERNORATES.map((gov) => (
              <button
                key={gov}
                onClick={() => setActiveGov(gov)}
                className={`gov-chip-web ${activeGov === gov ? "active" : ""}`}
              >
                {gov}
              </button>
            ))}
          </nav>

          <div className="scrollable-exploration-area">
            {/* Governorate Hero Card */}
            <div className="gov-web-hero">
              <img src="/amman-citadel.jpg" className="hero-bg-web" alt={activeGov} />
              <div className="hero-overlay-web" />
              <div className="hero-text-web">
                <span className="country-tag">المملكة الأردنية الهاشمية</span>
                <h1 className="hero-title-web">{activeGov}</h1>
                <p className="hero-desc-web">
                  اكتشف قلب الأردن النابض، حيث يلتقي التاريخ العريق بالحداثة المستمرة في مدينة الجبال السبعة.
                </p>
              </div>
            </div>

            {/* Places Grid */}
            <section className="places-section-web">
              <div className="section-header-web">
                <h3 className="section-title-web">أفضل الوجهات في {activeGov}</h3>
                <button className="text-btn-blue">عرض الكل</button>
              </div>
              
              <div className="places-grid-web">
                {RECOMMENDED_PLACES.map(place => (
                  <div key={place.id} className="place-card-web" onClick={() => navigate('/business')}>
                    <div className="place-img-container">
                      <img src={place.img} alt={place.name} />
                      <div className="rating-badge-web">
                        <Star size={12} fill="#ffb800" color="#ffb800" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                    <div className="place-info-web">
                      <h4 className="place-name-web">{place.name}</h4>
                      <p className="place-meta-web">{place.type} • {place.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        {/* Right Side: Interactive Map Placeholder / Visual Gallery */}
        <section className="discovery-map-panel">
          <div className="map-placeholder-web">
             <div className="map-overlay-ui">
                <button className="map-tool-btn"><Compass /></button>
                <div className="map-zoom-tools">
                   <button>+</button>
                   <button>-</button>
                </div>
             </div>
             {/* Integrate Google Maps API or Leaflet here later */}
             <div className="map-bg-mock">
                <p>خريطة {activeGov} التفاعلية</p>
                <span className="map-hint">انقر لاستكشاف المواقع القريبة</span>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}