import React, { useState } from 'react';
import { Search, Edit2, Send, Paperclip, Smile, MoreVertical, Camera } from 'lucide-react';
import Sidebar from '../nav/Sidebar';
import './Chat.css';

const ACTIVE_USERS = [
  { id: 1, name: "Abdalrahmman", img: "/path-to-dr.jpg" },
  { id: 2, name: "Ziad", img: "/path-to-ziad.jpg" },
  { id: 3, name: "Eyad", img: "/path-to-eyad.jpg" },
];

const MESSAGE_THREADS = [
  { id: 1, name: "Abdalrahmman alghwari", message: "شو رأيك نحضر ملتقى الصناع؟", time: "2h", unread: true, img: "/path-to-dr.jpg" },
  { id: 2, name: "Ziad Qafisheh", message: "دكتور بتنصحني احضر مؤتمر PGC؟", time: "3h", unread: true, img: "/path-to-ziad.jpg" },
  { id: 4, name: "Ghaleb Shhab", message: "رح ترسبوا كلكم بالفاينل", time: "14h", unread: false, img: "/path-to-ghaleb.jpg" }
];

export default function JoMapChat() {
  const [selectedChat, setSelectedChat] = useState(MESSAGE_THREADS[0]);

  return (
    <div className="web-chat-layout" dir="rtl">
      <Sidebar />

      <main className="chat-main-container">
        {/* Left Sidebar: Message List */}
        <aside className="chat-list-sidebar">
          <header className="chat-list-header">
            <h2 className="header-title-web">الرسائل</h2>
            <Edit2 size={20} className="header-icon-web" />
          </header>

          <div className="chat-search-web">
            <div className="search-bar-inner-web">
              <Search size={18} className="search-icon-web" />
              <input type="text" placeholder="بحث عن محادثة..." className="search-input-web" />
            </div>
          </div>

          <section className="active-users-web">
            <div className="active-scroll-web">
              {ACTIVE_USERS.map(user => (
                <div key={user.id} className="active-user-circle-web">
                  <img src={user.img} alt={user.name} />
                  <div className="online-status-web" />
                </div>
              ))}
            </div>
          </section>

          <div className="threads-list-web">
            {MESSAGE_THREADS.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item-web ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <img src={chat.img} className="chat-avatar-web" alt="" />
                <div className="chat-info-web">
                  <div className="chat-top-row">
                    <span className="user-name-web">{chat.name}</span>
                    <span className="time-web">{chat.time}</span>
                  </div>
                  <p className="last-msg-web">{chat.message}</p>
                </div>
                {chat.unread && <div className="unread-dot-web" />}
              </div>
            ))}
          </div>
        </aside>

        {/* Right Section: Active Conversation */}
        <section className="chat-window-web">
          {selectedChat ? (
            <>
              <header className="chat-window-header">
                <div className="window-user-info">
                  <img src={selectedChat.img} alt="" className="window-avatar" />
                  <div>
                    <h3 className="window-name">{selectedChat.name}</h3>
                    <p className="window-status">نشط الآن</p>
                  </div>
                </div>
                <div className="window-actions">
                  <Camera size={20} />
                  <MoreVertical size={20} />
                </div>
              </header>

              <div className="chat-messages-area">
                <div className="msg-received">
                  <p>{selectedChat.message}</p>
                  <span>{selectedChat.time}</span>
                </div>
                <div className="msg-sent">
                  <p>إن شاء الله دكتور، رح نكون موجودين!</p>
                  <span>14:02</span>
                </div>
              </div>

              <footer className="chat-input-footer">
                <div className="input-toolbar-web">
                  <Smile size={22} />
                  <Paperclip size={22} />
                  <input type="text" placeholder="اكتب رسالتك هنا..." className="main-chat-input" />
                  <button className="send-btn-web"><Send size={20} /></button>
                </div>
              </footer>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={64} />
              <p>اختر محادثة للبدء</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}