import React from "react";

export default function Footer() {
  return (
    <>
      {/* SECTION 12: FINAL CTA */}
      <section id="cta-final">
        <div className="cta-glow"></div>
        <div className="section-label" style={{ justifyContent: "center" }}>
          ॥ ॐ नमः शिवाय ॥
        </div>
        <h2 className="cta-final-title">Stay Connected with Mahakal</h2>
        <p className="cta-sub">
          Every day, millions turn toward Ujjain in devotion.
          <br />
          Now you can too — from wherever you are in the world.
        </p>
        <div className="cta-buttons">
          <a href="/#aarti" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            Watch Latest Aarti
          </a>
          <a href="/archive" className="btn-outline">
            Explore Archive
          </a>
          <a href="/#about" className="btn-outline">
            Learn About Mahakaleshwar
          </a>
        </div>
      </section>

      {/* SECTION 13: FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              Bhasma<span>Arti</span>.com
            </a>
            <p>
              A premium devotional media platform dedicated exclusively to Shri Mahakaleshwar Jyotirlinga, preserving and
              sharing the sacred heritage of Ujjain with devotees worldwide.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="YouTube">
                ▶
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                📸
              </a>
              <a href="#" className="social-btn" aria-label="Facebook">
                f
              </a>
              <a href="#" className="social-btn" aria-label="Twitter/X">
                𝕏
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              <li>
                <a href="/#aarti">Bhasma Aarti</a>
              </li>
              <li>
                <a href="/archive">Aarti Archive</a>
              </li>
              <li>
                <a href="/library">Devotional Library</a>
              </li>
              <li>
                <a href="/calendar">Sacred Calendar</a>
              </li>
              <li>
                <a href="/gallery">Sacred Moments</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Temple</h5>
            <ul>
              <li>
                <a href="/#about">About Mahakaleshwar</a>
              </li>
              <li>
                <a href="/archive">Aarti Timings</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Use</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer-quote">
          &quot;Yah Shiv ki nagari hai, yahan Mahakal ka raaj hai — This is Shiva&apos;s city, here Mahakal reigns eternal.&quot;
        </p>

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 BhasmaArti.com — All rights reserved. Not affiliated with Mahakaleshwar Temple Trust.</span>
          <div className="footer-mantra">॥ ॐ नमः शिवाय ॥ Har Har Mahadev. Jai Mahakal.</div>
        </div>
      </footer>
    </>
  );
}
