"use client";

import React, { useState } from "react";
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Footer";

interface Resource {
  title: string;
  description: string;
  category: string;
  image: string;
  lyrics: string;
  translation: string;
  duration: string;
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"lyrics" | "meaning">("lyrics");

  const categories = ["All", "Stotrams", "Mantras", "Chalisa & Hymns", "Bhajans"];

  const resources: Resource[] = [
    {
      title: "Mahakal Chalisa",
      description: "Forty verses of devotion to Lord Mahakal",
      category: "Chalisa & Hymns",
      image: "/library/mahakal chalisa.jpeg",
      duration: "09:45",
      lyrics: `जय श्री महाकाल प्रभु हरण दुःख भारी।
जय गिरीश गिरिजापति भव-भय-हारी॥

ॐ नमो जी महाकालेश्वरा।
करत कृपा तव भव जल तरा॥

त्राहिमाम शरणागतं महाकाल कालपाल।
मस्तक पर शशि सोहे गले रुण्डमाल॥

नयन विशाला जटा मुकुट धारी।
हाथ त्रिशूल डमरू धारी भारी॥

(Verse 5 - 40 Praise to Lord Mahakal)
करहु कृपा प्रभु सदा भक्तन पर।
दीजै भक्ति मुक्ति सुख अचल वर॥`,
      translation: `Hail to the Lord Mahakal of Ujjain, the vanquisher of great miseries!
Salutations to the Lord of Mount Kailash, the consort of Parvati, who dispels the fear of material existence.
O Mahakaleshwar! Protect me, who has sought refuge under your holy feet.
With the crescent moon embellishing your head and wearing a garland of skulls, you hold the Trishul and Damru, showering blessings upon devotees for physical well-being and ultimate liberation.`
    },
    {
      title: "Shiv Tandav Stotram",
      description: "The cosmic dance hymn of Ravana",
      category: "Stotrams",
      image: "/library/shiv tandav stotram.jpeg",
      duration: "12:15",
      lyrics: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्‌।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्‌॥१॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
-विलोलवीचिवल्लरीविराजमानमूर्धनि।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥२॥

नवीनमेघमण्डली निरुद्धदुर्धरस्फुर-
त्कुहूनिशीथिनीतमः प्रबन्धबद्धकन्धरः।
निलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः
कलानिधानबन्धुरः श्रियं जगद्धुरन्धरः॥३॥`,
      translation: `With his neck consecrated by the flow of water flowing from his forest-like matted hair, and on his neck a snake-garland hanging like a giant necklace, Lord Shiva performed the fierce Tandava dance to the sound of the damaru. May He shower auspiciousness upon us! (1)

My deep devotion is to Lord Shiva, whose head is adorned by the rows of waves of the celestial Ganga river, whose forehead shines with the brilliant fire burning 'dhagadh dhagadh', and who wears the young crescent moon as a crown. (2)

May Lord Shiva, who holds the universe, whose neck is dark like dark clouds at midnight, who wears a tiger skin, and who is the source of all wealth and arts, bless us with spiritual and material abundance. (3)`
    },
    {
      title: "Mahamrityunjaya Mantra",
      description: "The great mantra of liberation and healing",
      category: "Mantras",
      image: "/library/mahamrityunjay mantra.jpeg",
      duration: "05:30",
      lyrics: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥

(Chanted 108 times for health, peace, and spiritual awakening)`,
      translation: `We worship the three-eyed Lord Shiva, who is fragrant and who nourishes all beings.
Just as a ripe cucumber is automatically liberated from its stalk, may He liberate us from death, and lead us towards immortality.`
    },
    {
      title: "Shiv Bhajans Collection",
      description: "Devotional songs curated for worship",
      category: "Bhajans",
      image: "/library/shiv bhajans.jpeg",
      duration: "24:50",
      lyrics: `मन मेरा मंदिर, शिव मेरी पूजा,
शिव से बड़ा नहीं कोई दूजा।

हर हर शंभु शशिशेखराय,
गंगाधराय प्रमथप्रियाय।
नमामि शंकर भजामि शंकर,
उमामहेश्वर साम्बसदाशिव।`,
      translation: `My mind is the temple and Shiva is my worship. There is no supreme power greater than Shiva.
Glory to the auspicious Lord who wears the crescent moon on his head, holds the holy Ganges, and is beloved of his devotees. I bow to Shankara, the consort of Parvati, the eternal Sadashiva.`
    },
    {
      title: "Rudrashtakam",
      description: "The eight-verse hymn dedicated to Lord Shiva",
      category: "Chalisa & Hymns",
      image: "/library/rudrashtakam.jpeg",
      duration: "08:10",
      lyrics: `नमामीशमीशान निर्वाणरूपं।
विभुं व्यापकं ब्रह्मवेदस्वरूपम्॥
निजं निर्गुणं निर्विकल्पं निरीहं।
चिदाकाशमाकाशवासं भजेऽहम्॥१॥

निराकारमोंकारमूलं तुरीयं।
गिराज्ञानगोतीतमीशं गिरीशम्॥
करालं महाकालकालं कृपालं।
गुणागारसंसारपारं नतोऽहम्॥२॥`,
      translation: `I bow to the Lord of the Northeast, whose form is liberation itself. He is all-pervading, all-encompassing, the supreme Brahman, and the embodiment of the Vedas. I worship Him who is self-effulgent, formless, attribute-less, without any doubt, desire-less, who resides in the sky of consciousness. (1)

I bow to Him who is formless, the source of Omkar, beyond the states of consciousness, beyond speech, intellect, and senses. He is the ruler of mountain peaks, the terrifying Mahakal, yet extremely merciful and the destroyer of death itself. (2)`
    },
    {
      title: "Shivashtakam",
      description: "The eight-verse hymn dedicated to Lord Shiva",
      category: "Chalisa & Hymns",
      image: "/library/Shivashtakam.jpeg",
      duration: "07:20",
      lyrics: `प्रभुं प्राणनाथं विभुं विश्वनाथं
जगन्नाथनाथं सदानन्दभाजम्‌।
भवद्भव्यभूतेश्वरं भूतनाथं
शिवं शङ्करं शम्भुमीशानमीडे॥१॥

गले मुण्डमालं तनौ सर्पजालं
महाकालेकालं गिरीन्द्रे विलोलम्‌।
जटाजूटगङ्गोत्तरङ्गैर्विशालं
शिवं शङ्करं शम्भुमीशानमीडे॥२॥`,
      translation: `I praise the Lord Shiva, who is the master of breath, the all-pervading Lord of the universe, the protector of the cosmos, ever-blissful, the ruler of existence, the master of all elements, and the source of ultimate peace and joy. (1)

I worship Lord Shiva, who wears a garland of skulls around his neck and snakes coiled around his body. He is the destroyer of death, resides on Mount Kailash, and holds the massive currents of the river Ganga within his matted locks. (2)`
    },
    {
      title: "Shiv Sahasranama",
      description: "1000 names of Lord Shiva with meaning",
      category: "Chalisa & Hymns",
      image: "/library/shiv sahasranamam.jpeg",
      duration: "32:40",
      lyrics: `ॐ स्थिराय नमः।
ॐ स्थाणवे नमः।
ॐ भगाय नमः।
ॐ प्रधनाय नमः।
ॐ ईशाय नमः।
ॐ महादेवाय नमः।
ॐ महेशाय नमः।
ॐ शम्भवे नमः।
ॐ पिनाकिने नमः।
ॐ उग्राय नमः।`,
      translation: `Salutations to the Constant One (Sthira).
Salutations to the Unmoving One (Sthanu).
Salutations to the Lord of Divine Virtues (Bhaga).
Salutations to the Supreme Cause of Nature (Pradhana).
Salutations to the Sovereign Lord of All (Isha).
Salutations to the Great Deity (Mahadeva).
Salutations to the Supreme Lord (Maheshvara).
Salutations to the Source of Bliss (Shambhu).
Salutations to the Bearer of Pinaka Bow (Pinaki).
Salutations to the Terrifying Form (Ugra).`
    },
    {
      title: "Lingashtakam Stotram",
      description: "The eight-verse hymn dedicated to Shiva Linga",
      category: "Stotrams",
      image: "/library/lingashtakam.jpeg",
      duration: "06:15",
      lyrics: `ब्रह्ममुरारिसुरार्चितलिङ्गं निर्मलभासितशोभितलिङ्गम्।
जन्मजदुःखविनाशकलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम्॥१॥

देवमुनिप्रवरार्चितलिङ्गं कामदहं करुणाकरलिङ्गम्।
रावणदर्पविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम्॥२॥`,
      translation: `I bow before that Sadashiva Lingam, which is adored by Brahma, Vishnu, and all other gods, which is pure, radiant and decorated with ornaments, and which destroys the cycle of births and grief. (1)

I bow before that Sadashiva Lingam, which is worshiped by sages and gods, which destroys desire, is compassionate, and shattered the pride of Ravana. (2)`
    }
  ];

  const handleResourceClick = (res: Resource) => {
    setSelectedResource(res);
    setIsPlaying(false);
    setActiveModalTab("lyrics");
  };

  // Filter resources based on category and search query
  const filteredResources = resources.filter((res) => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="archive-container">
        {/* Back to Home Header */}
        <a href="/" className="archive-back-btn">
          ← Return to Home
        </a>

      {/* Main Wording */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label">Spiritual Resources</div>
        <h1 className="hero-h1" style={{ margin: "0.5rem 0 1rem", fontSize: "2.8rem" }}>
          Shri Mahakaleshwar <em>Devotional Library</em>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.75", fontSize: "0.95rem" }}>
          Explore, read, search, and listen to the sacred hymns, stotrams, mantras, and bhajans of Lord Shiva. Select any resource to view its Sanskrit lyrics, English translations, and stream audio.
        </p>
      </div>

      {/* Search and Category Tabs container */}
      <div className="library-search-container">
        <div className="library-search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="library-search-input"
            type="text"
            placeholder="Search resources by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="library-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`library-category-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="library-grid" style={{ marginTop: "1rem" }}>
        {filteredResources.length > 0 ? (
          filteredResources.map((res, index) => (
            <div
              key={index}
              className="library-card"
              onClick={() => handleResourceClick(res)}
            >
              <div
                className="library-icon"
                style={{ backgroundImage: `url('${res.image}')` }}
              ></div>
              <div className="library-info">
                <h4>{res.title}</h4>
                <p>{res.description}</p>
              </div>
              <div className="library-play">
                <svg viewBox="0 0 16 16">
                  <polygon points="4,2 13,8 4,14" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--text-secondary)", gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", fontSize: "0.9rem" }}>
            No spiritual resources found matching your search.
          </p>
        )}
      </div>

      {/* Detail Lyrics & Simulated Player Modal */}
      {selectedResource && (
        <div className="library-modal-backdrop" onClick={() => setSelectedResource(null)}>
          <div className="library-modal" onClick={(e) => e.stopPropagation()}>
            <div className="library-modal-header">
              <div
                className="library-modal-icon"
                style={{ backgroundImage: `url('${selectedResource.image}')` }}
              ></div>
              <div className="library-modal-title-wrap">
                <h3>{selectedResource.title}</h3>
                <p>{selectedResource.category} • {selectedResource.duration}</p>
              </div>
              <button className="library-modal-close-btn" onClick={() => setSelectedResource(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="library-modal-content">
              <div className="library-modal-tab-bar">
                <button
                  className={`library-modal-tab ${activeModalTab === "lyrics" ? "active" : ""}`}
                  onClick={() => setActiveModalTab("lyrics")}
                >
                  Sanskrit Lyrics
                </button>
                <button
                  className={`library-modal-tab ${activeModalTab === "meaning" ? "active" : ""}`}
                  onClick={() => setActiveModalTab("meaning")}
                >
                  English Meaning
                </button>
              </div>

              <div style={{ flexGrow: 1, minHeight: "200px" }}>
                {activeModalTab === "lyrics" ? (
                  <div className="lyrics-text-container">
                    {selectedResource.lyrics}
                  </div>
                ) : (
                  <div className="translation-text-container">
                    {selectedResource.translation}
                  </div>
                )}
              </div>

              {/* Simulated Audio Player */}
              <div className="library-audio-player">
                <button className="player-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ width: "12px", height: "12px", display: "block", margin: "auto" }}>
                      <rect x="3" y="3" width="4" height="18" rx="1" fill="#fff" />
                      <rect x="13" y="3" width="4" height="18" rx="1" fill="#fff" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" style={{ width: "12px", height: "12px", display: "block", margin: "auto" }}>
                      <polygon points="4,2 13,8 4,14" fill="#fff" />
                    </svg>
                  )}
                </button>

                <div className="player-progress-area">
                  <div className="player-progress-bar-container">
                    <div className="player-progress-bar-fill" style={{ width: isPlaying ? "48%" : "15%" }}></div>
                  </div>
                  <div className="player-time-display">
                    <span>{isPlaying ? "01:24" : "00:15"}</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                </div>

                <div className="player-volume-control">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-secondary)" }}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <div className="player-volume-slider">
                    <div className="player-volume-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
