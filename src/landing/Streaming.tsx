import React from "react";

export default function Streaming() {
  return (
    <section id="streaming">
      <div className="center">
        <div className="section-label">Coming Soon</div>
        <h2 className="section-title">Live Streaming — The Next Chapter</h2>
        <div className="gold-line"></div>
        <p className="section-sub" style={{ margin: "0 auto 3rem" }}>
          We are building the foundation for future live-streaming experiences, subject to official permissions and
          partnerships with Mahakaleshwar Temple authorities.
        </p>
      </div>
      <div className="stream-container">
        <div className="stream-visual">
          <div className="stream-grid"></div>
          <div className="stream-badge">⚡ Live Streaming — Coming Soon</div>
        </div>
        <div className="stream-features">
          <div className="stream-feature">
            <div className="sf-icon">📡</div>
            <p>HD Live Feed</p>
          </div>
          <div className="stream-feature">
            <div className="sf-icon">🌍</div>
            <p>Global Access</p>
          </div>
          <div className="stream-feature">
            <div className="sf-icon">📱</div>
            <p>All Devices</p>
          </div>
          <div className="stream-feature">
            <div className="sf-icon">🔔</div>
            <p>Aarti Alerts</p>
          </div>
        </div>
      </div>
    </section>
  );
}
