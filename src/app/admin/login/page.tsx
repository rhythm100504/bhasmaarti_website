"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Particles Effect for Login Page
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
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = -Math.random() * 0.4 - 0.1;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.gold = Math.random() > 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.0006;
        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
          this.y = H + 10;
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
    for (let i = 0; i < 40; i++) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store JWT token and admin info
      localStorage.setItem("bhasmaAdminToken", data.token);
      localStorage.setItem("bhasmaAdminInfo", JSON.stringify(data.admin));

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Unable to reach the server. Please make sure the API is running on port 5001.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic animated background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Decorative center mandala silhouette */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          border: "1px dashed rgba(212, 160, 23, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "10rem",
          color: "rgba(212, 160, 23, 0.02)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        ॐ
      </div>

      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="login-logo">
            Bhasma<span>Arti</span>.com
          </Link>
          <div className="login-subtitle">Admin Portal</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label" htmlFor="username">
              Username
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                id="username"
                className="login-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>
        </form>

        <div className="login-footer-link">
          <Link href="/">← Back to Home Page</Link>
        </div>
      </div>
    </div>
  );
}
