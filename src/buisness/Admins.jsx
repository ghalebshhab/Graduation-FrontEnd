import React, { useState } from 'react';
import { Settings, ArrowLeft, Star, Eye, Info, Share2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../nav/Sidebar'; // Assuming you'll use a persistent sidebar
import './BusinessDashboard.css';

const BusinessDashboard = ({ businessData }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'Overview', label: 'نظرة عامة' },
    { id: 'Posts', label: 'المنشورات' },
    { id: 'Events', label: 'الفعاليات' },
    { id: 'Reviews', label: 'التقييمات' }
  ];

  if (!businessData) return null;

  return (
    <div className="web-dashboard-container" dir="rtl">
      {/* Persistant Web Sidebar */}
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Web Hero Section */}
        <div className="business-hero-web">
          <img src={businessData.coverImage} className="cover-img-web" alt="cover" />
          <div className="hero-overlay-web" />
          
          <div className="hero-content-web">
            <div className="business-profile-header">
              <div className="logo-box-web">
                <img src={businessData.logo} alt="logo" />
              </div>
              <div className="title-info-web">
                <h1 className="business-name-web">{businessData.name}</h1>
                <div className="status-badge-web">
                  <span className="dot" /> {businessData.status}
                </div>
              </div>
            </div>

            <div className="header-actions-web">
              <button className="action-btn-outline"><Share2 size={18} /> مشاركة</button>
              <button className="action-btn-primary"><ExternalLink size={18} /> زيارة الموقع</button>
              <button className="settings-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            </div>
          </div>
        </div>

        {/* Layout Grid: Content + Stats Sidebar */}
        <div className="dashboard-grid-web">
          <div className="content-area-web">
            <div className="tabs-nav-web">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-link-web ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="dynamic-tab-body">
              {activeTab === 'Overview' ? (
                <div className="overview-web-body">
                  <div className="alert-box-web">
                    <Info className="icon-orange" size={24} />
                    <div className="alert-text-content">
                      <p className="alert-title">تنبيه الإدارة</p>
                      <p className="alert-desc">{businessData.alert}</p>
                    </div>
                  </div>
                  {/* Additional web-only info can go here */}
                  <div className="business-about-web">
                    <h3>عن المنشأة</h3>
                    <p>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى.</p>
                  </div>
                </div>
              ) : (
                <div className="empty-state-web">
                  <p>سيتم عرض محتوى {activeTab} هنا قريباً</p>
                </div>
              )}
            </div>
          </div>

          <aside className="stats-sidebar-web">
            <h3 className="sidebar-title">أداء النشاط</h3>
            <div className="stat-card-web">
              <div className="stat-icon-circle yellow"><Star /></div>
              <div className="stat-info">
                <p className="stat-label">التقييم العام</p>
                <h4 className="stat-value">{businessData.stats.rating}</h4>
              </div>
            </div>
            
            <div className="stat-card-web">
              <div className="stat-icon-circle blue"><Eye /></div>
              <div className="stat-info">
                <p className="stat-label">زيارات البروفايل</p>
                <h4 className="stat-value">{businessData.stats.views}</h4>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;