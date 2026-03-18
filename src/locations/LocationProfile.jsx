import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Info, Share2, Phone, X, CheckCircle, Navigation } from "lucide-react";
import Sidebar from "../nav/Sidebar"; 
import "./Location.css";

const LocationProfile = ({ location }) => {
  const navigate = useNavigate();

  // If used as a standalone page, we include the Sidebar. 
  // If used as a modal/drawer, we just render the content.
  if (!location) return null;

  return (
    <div className="web-location-container" dir="rtl">
      <Sidebar />

      <main className="location-main-content">
        {/* Web Navigation Header */}
        <div className="location-nav-header">
          <button className="back-circle-web" onClick={() => navigate(-1)}>
            <X size={20} />
          </button>
          <div className="header-actions-group">
            <button className="secondary-action-btn"><Share2 size={18} /> مشاركة</button>
            <button className="primary-action-btn"><Phone size={18} /> اتصل الآن</button>
          </div>
        </div>

        <div className="location-grid-web">
          {/* Left Column: Image Gallery & Description */}
          <section className="location-info-column">
            <div className="location-image-hero">
               <img 
                 src={location.image || "/api/placeholder/800/400"} 
                 alt={location.name} 
                 className="main-hero-img" 
               />
               <div className="hero-tags">
                 <span className="web-badge-status open">
                    <Clock size={14} /> {location.isOpen ? "مفتوح الآن" : "مغلق الآن"}
                 </span>
                 <span className="web-badge-status category">
                    <Info size={14} /> {location.category || "نادي رياضي"}
                 </span>
               </div>
            </div>

            <div className="location-text-card">
              <div className="title-row-web">
                <h1 className="location-display-name">{location.name}</h1>
                <p className="location-dist-web">
                  <MapPin size={16} color="#3b82f6" /> {location.distance || "2.5 كم"} عن موقعك الحالي
                </p>
              </div>

              <div className="verified-owner-card">
                <div className="owner-header-web">
                  <CheckCircle size={18} className="text-blue" />
                  <span>إدارة {location.name} (موثق)</span>
                </div>
                <p className="owner-bio-web">
                  {location.description || "أهلاً بك في صفحتنا! نحن هنا لخدمتكم بأفضل جودة وتقديم أفضل تجربة ممكنة لزوارنا في الأردن."}
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Offers & Action Sidebar */}
          <aside className="location-sidebar-column">
            <div className="sidebar-widget">
              <h3 className="widget-title">العروض الحالية</h3>
              <div className="web-offers-list">
                {location.offers?.map((offer, idx) => (
                  <div key={idx} className="web-offer-card">
                    <img src={offer.image || "/api/placeholder/150/100"} alt="offer" />
                    <div className="offer-details-web">
                      <p className="offer-tag">عرض خاص</p>
                      <h4 className="offer-price-web">{offer.price}</h4>
                    </div>
                  </div>
                )) || <p className="empty-msg">لا توجد عروض متاحة حالياً</p>}
              </div>
            </div>

            <div className="sidebar-widget sticky-map-widget">
               <h3 className="widget-title">الموقع على الخريطة</h3>
               <div className="mini-map-placeholder">
                  <Navigation size={32} color="#3b82f6" />
                  <button className="get-directions-btn">فتح في خرائط Google</button>
               </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LocationProfile;