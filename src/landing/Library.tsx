import React from "react";

export default function Library() {
  return (
    <section id="library">
      <div className="section-header-flex">
        <div>
          <div className="section-label">Spiritual Resources</div>
          <h2 className="section-title">Strengthen Your Spiritual Journey</h2>
          <div className="gold-line"></div>
        </div>
        <a href="/library" className="see-all" style={{ marginBottom: "1.5rem" }}>
          See all →
        </a>
      </div>

      <div className="library-grid">
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/mahakal%20chalisa.jpeg')" }}></div>
          <div className="library-info">
            <h4>Mahakal Chalisa</h4>
            <p>Forty verses of devotion to Lord Mahakal</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/shiv%20tandav%20stotram.jpeg')" }}></div>
          <div className="library-info">
            <h4>Shiv Tandav Stotram</h4>
            <p>The cosmic dance hymn of Ravana</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/mahamrityunjay%20mantra.jpeg')" }}></div>
          <div className="library-info">
            <h4>Mahamrityunjaya Mantra</h4>
            <p>The great mantra of liberation and healing</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/shiv%20bhajans.jpeg')" }}></div>
          <div className="library-info">
            <h4>Shiv Bhajans Collection</h4>
            <p>Devotional songs curated for worship</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/rudrashtakam.jpeg')" }}></div>
          <div className="library-info">
            <h4>Rudrashtakam</h4>
            <p>The eight-verse hymn dedicated to Lord Shiva</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/Shivashtakam.jpeg')" }}></div>
          <div className="library-info">
            <h4>Shivashtakam</h4>
            <p>The eight-verse hymn dedicated to Lord Shiva</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/shiv%20sahasranamam.jpeg')" }}></div>
          <div className="library-info">
            <h4>Shiv Sahasranama</h4>
            <p>1000 names of Lord Shiva with meaning</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
        <div className="library-card fade-in">
          <div className="library-icon" style={{ backgroundImage: "url('/library/lingashtakam.jpeg')" }}></div>
          <div className="library-info">
            <h4>Lingashtakam Stotram</h4>
            <p>The eight-verse hymn dedicated to Shiva Linga</p>
          </div>
          <div className="library-play">
            <svg viewBox="0 0 16 16">
              <polygon points="4,2 13,8 4,14" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
