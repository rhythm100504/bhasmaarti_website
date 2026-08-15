"use client";

import React, { useEffect } from "react";
import Navbar from "@/landing/Navbar";
import Hero from "@/landing/Hero";
import Trust from "@/landing/Trust";
import LatestAarti from "@/landing/LatestAarti";
import About from "@/landing/About";
import Archive from "@/landing/Archive";
import Library from "@/landing/Library";
import Festivals from "@/landing/Festivals";
// import TempleInfo from "@/landing/TempleInfo";
import Gallery from "@/landing/Gallery";
// import Streaming from "@/landing/Streaming";
// import PromiseSection from "@/landing/Promise";
import Footer from "@/landing/Footer";

export default function Home() {
  // Scroll-triggered fade-in reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BhasmaArti.com",
            "url": "https://bhasmarti.com",
            "description": "Premium devotional media platform dedicated to Shri Mahakaleshwar Jyotirlinga, Ujjain. Watch Bhasma Aarti videos, explore devotional archives, and access temple information.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://bhasmarti.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ReligiousOrganization",
            "name": "Shri Mahakaleshwar Jyotirlinga",
            "description": "One of the twelve Jyotirlingas of India, located in Ujjain, Madhya Pradesh",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ujjain",
              "addressRegion": "Madhya Pradesh",
              "addressCountry": "IN"
            }
          })
        }}
      />

      <Navbar />
      <Hero />
      <div className="section-divider"></div>
      <Trust />
      <div className="section-divider"></div>
      <LatestAarti />
      <div className="section-divider"></div>
      <About />
      <div className="section-divider"></div>
      <Archive />
      <div className="section-divider"></div>
      <Library />
      <div className="section-divider"></div>
      <Festivals />
      <div className="section-divider"></div>
      <Gallery />
      <div className="section-divider"></div>
      <Footer />
    </>
  );
}
