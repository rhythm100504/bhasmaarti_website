"use client";


import { API_URL } from "@/config";
import React, { useEffect, useRef, useState } from "react";

interface HeroData {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
}

const DEFAULT_HERO = {
  eyebrow: "Shri Mahakaleshwar Jyotirlinga, Ujjain",
  title: "Experience the\nDivine Presence of Mahakal\nAnytime. Anywhere.",
  subtitle: "Discover the sacred world of Shri Mahakaleshwar Jyotirlinga through recorded Bhasma Aarti videos, devotional archives, temple information, spiritual resources, and festival celebrations from the holy city of Ujjain.",
  cta_primary: "Watch Latest Bhasma Aarti",
  cta_secondary: "Explore Archive"
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heroData, setHeroData] = useState<HeroData>(DEFAULT_HERO);

  // Fetch Hero settings on load
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hero`);
        const data = await res.json();
        if (data.success && data.settings) {
          setHeroData(data.settings);
        }
      } catch (err) {
        console.error("Failed to load hero settings from API, using defaults.", err);
      }
    };
    fetchHeroData();
  }, []);

  // Floating Particles Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    class Particle {
      x!: number;
      y!: number;
      r!: number;
      vx!: number;
      vy!: number;
      alpha!: number;
      gold!: boolean;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.1;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.gold = Math.random() > 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.0008;
        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
          this.y = H + 10; // Start again from bottom
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fillStyle = this.gold
          ? `rgba(212,160,23,${this.alpha})`
          : `rgba(230,106,0,${this.alpha})`;
        context.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Format the title with <em> tags if it matches the default format, or display split lines
  const renderTitle = () => {
    const lines = heroData.title.split("\n");
    if (lines.length >= 3 && lines[1].toLowerCase().includes("divine presence")) {
      return (
        <>
          {lines[0]}
          <br />
          <em>{lines[1]}</em>
          <br />
          {lines.slice(2).join("\n")}
        </>
      );
    }
    return <span style={{ whiteSpace: "pre-line" }}>{heroData.title}</span>;
  };

  return (
    <section id="hero">
      <div className="hero-bg"></div>
      <canvas id="particles" ref={canvasRef}></canvas>

      <div className="hero-content">
        <div className="hero-eyebrow">{heroData.eyebrow}</div>
        <h1 className="hero-h1">
          {renderTitle()}
        </h1>
        <p className="hero-sub">
          {heroData.subtitle}
        </p>
        <div className="hero-ctas">
          <a href="#aarti" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            {heroData.cta_primary}
          </a>
          <a href="#archive" className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="12" height="10" rx="1" />
              <line x1="5" y1="7" x2="11" y2="7" />
              <line x1="5" y1="10" x2="9" y2="10" />
            </svg>
            {heroData.cta_secondary}
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
