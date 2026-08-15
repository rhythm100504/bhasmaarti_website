import React from "react";

export default function TempleInfo() {
  return (
    <section id="temple-info">
      <div className="section-label">Visitor Guidance</div>
      <h2 className="section-title">Planning a Visit to Mahakaleshwar Temple?</h2>
      <div className="gold-line"></div>
      <div className="info-grid">
        <div className="info-card fade-in">
          <div className="info-card-icon">⏰</div>
          <h3>Temple Timings</h3>
          <p>
            Bhasma Aarti: 4:00 AM — 6:00 AM
            <br />
            Gates open at 3:00 AM daily. Temple remains accessible until 11:00 PM with scheduled darshan breaks between
            ceremonies.
          </p>
        </div>
        <div className="info-card fade-in">
          <div className="info-card-icon">🙏</div>
          <h3>Darshan Guidelines</h3>
          <p>
            Bhasma Aarti requires prior registration. General darshan is available through designated queues. VIP passes are
            available through the temple trust for special occasions.
          </p>
        </div>
        <div className="info-card fade-in">
          <div className="info-card-icon">👘</div>
          <h3>Dress Code</h3>
          <p>
            Traditional attire is encouraged. Dhoti or kurta for men, saree or salwar kameez for women. Western formals are
            permitted. Shorts and sleeveless clothing are not allowed inside the sanctum.
          </p>
        </div>
        <div className="info-card fade-in">
          <div className="info-card-icon">🚂</div>
          <h3>Travel Information</h3>
          <p>
            Ujjain is well connected by rail to Mumbai, Delhi, and Bhopal. Nearest airport is Indore (55 km). Auto-rickshaws and
            taxis available to the temple from all major arrival points.
          </p>
        </div>
        <div className="info-card fade-in">
          <div className="info-card-icon">📅</div>
          <h3>Festival Calendar</h3>
          <p>
            Major celebrations include Mahashivratri, Shravan Maas, Navratri, and Kumbh Mela. The temple conducts special
            Aartis and abhisheks on auspicious days throughout the year.
          </p>
        </div>
        <div className="info-card fade-in">
          <div className="info-card-icon">🗺</div>
          <h3>Visitor Guide</h3>
          <p>
            The temple complex includes the Kund (sacred tank), Kotitirth, and surrounding mandirs. Allow 2–3 hours for a
            complete visit. Lockers and cloak rooms are available at the entrance.
          </p>
        </div>
      </div>
    </section>
  );
}
