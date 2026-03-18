import React from 'react';
import { ArrowLeft, Calendar, MapPin, Share2, Info, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../nav/Sidebar'; 
import './ActivityProfile.css';

const ActivityProfile = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return <div className="loading-state-web">Loading event details...</div>;

  return (
    <div className="web-activity-layout" dir="rtl">
      <Sidebar />

      <main className="activity-main-web">
        {/* Top Navigation Row */}
        <div className="activity-nav-web">
          <button className="back-btn-web" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> العودة
          </button>
          <button className="share-btn-web"><Share2 size={20} /></button>
        </div>

        <div className="activity-grid-web">
          {/* Left Column: Event Details */}
          <div className="event-details-column">
            <div className="event-hero-banner">
              <img src={event.bannerImage || event.organizerLogo} alt={event.title} className="hero-img-web" />
              <div className="hero-badge-web">فعالية مميزة</div>
            </div>

            <div className="event-content-web">
              <h1 className="event-title-web">{event.title}</h1>
              <div className="organizer-row-web">
                <img src={event.organizerLogo} alt={event.organizer} className="mini-org-logo" />
                <span>بواسطة <span className="org-name-highlight">{event.organizer}</span></span>
              </div>

              <div className="description-section-web">
                <h3 className="section-label-web">نبذة عن الفعالية</h3>
                <p className="description-text-web">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Card */}
          <aside className="event-action-sidebar">
            <div className="action-card-web">
              <h3 className="card-title-web">معلومات الحجز</h3>
              
              <div className="meta-info-list">
                <div className="meta-item-web">
                  <Calendar className="meta-icon" />
                  <div className="meta-text">
                    <p className="meta-label">التاريخ</p>
                    <p className="meta-value">{event.date}</p>
                  </div>
                </div>

                <div className="meta-item-web">
                  <Clock className="meta-icon" />
                  <div className="meta-text">
                    <p className="meta-label">الوقت</p>
                    <p className="meta-value">{event.time}</p>
                  </div>
                </div>

                <div className="meta-item-web">
                  <MapPin className="meta-icon" />
                  <div className="meta-text">
                    <p className="meta-label">الموقع</p>
                    <p className="meta-value">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="price-tag-web">
                <span className="price-label-web">سعر التذكرة</span>
                <h2 className="price-amount-web">{event.price} <span>JOD</span></h2>
              </div>

              <button className="primary-register-btn-web">
                سجل الآن
              </button>
              
              <p className="guarantee-text">
                <Info size={14} /> الدفع عند الحضور متاح لهذا الحدث
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ActivityProfile;