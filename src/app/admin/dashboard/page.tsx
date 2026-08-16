"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export enum AartiCategory {
  BHASMA = "Bhasma Aarti",
  DADYODAK = "Dadyodak Aarti (Bal Bhog)",
  BHOG = "Bhog Aarti",
  SANDHYA = "Sandhya Aarti",
  SHAYAN = "Shayan Aarti",
  FESTIVAL = "Festival Special"
}

interface Recording {
  id: number;
  title: string;
  category: AartiCategory;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  status: "Published" | "Draft";
  created_at?: string;
  date?: string;
}

interface LibraryResource {
  id: number;
  title: string;
  category: string;
  duration: string;
  status: "Published" | "Draft";
}

interface GalleryItem {
  id: number;
  title: string;
  date: string;
  fileName: string;
  status: "Published" | "Draft";
}

interface OccasionItem {
  id: number;
  title: string;
  date: string;
  image: string;
  aartisCount: number;
  status: "Published" | "Draft";
}

interface RecentAartiItem {
  id: number;
  title: string;
  date: string;
  duration: string;
  image: string;
}

interface TrustCardItem {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  status: "Active" | "Inactive";
}

interface AboutStatItem {
  id: number;
  label: string;
  value: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "hero" | "latest-aarti" | "about" | "trust" | "archive" | "library" | "gallery" | "calendar" | "media" | "admins"
  >("overview");

  // Auth guard — verify JWT token on every mount
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("bhasmaAdminToken");
      if (!token) {
        router.replace("/admin/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5001/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success || !data.valid) {
          localStorage.removeItem("bhasmaAdminToken");
          localStorage.removeItem("bhasmaAdminInfo");
          router.replace("/admin/login");
          return;
        }
        setAuthChecked(true);
      } catch {
        // If server is unreachable, still allow access if token exists (offline mode)
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, [router]);

  // Admin management state
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Form states for creating a new admin
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("administrator");
  const [adminFormError, setAdminFormError] = useState("");
  const [adminFormSubmitting, setAdminFormSubmitting] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Set logged in admin details from localStorage
  useEffect(() => {
    if (authChecked) {
      try {
        const infoStr = localStorage.getItem("bhasmaAdminInfo");
        if (infoStr) {
          setCurrentAdmin(JSON.parse(infoStr));
        }
      } catch (e) {
        console.error("Failed to parse admin info from local storage", e);
      }
    }
  }, [authChecked]);

  // Fetch admins list when admins tab is active
  useEffect(() => {
    if (activeTab === "admins" && authChecked) {
      fetchAdmins();
    }
  }, [activeTab, authChecked]);

  useEffect(() => {
    if (activeTab === "media" && authChecked) {
      fetchMediaItems();
    }
  }, [activeTab, authChecked]);


  // Load hero settings from database
  useEffect(() => {
    const fetchDashboardHero = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/hero");
        const data = await res.json();
        if (data.success && data.settings) {
          setHeroEyebrow(data.settings.eyebrow);
          setHeroTitle(data.settings.title);
          setHeroSubtitle(data.settings.subtitle);
          setHeroCtaPrimary(data.settings.cta_primary);
          setHeroCtaSecondary(data.settings.cta_secondary);
        }
      } catch (err) {
        console.error("Failed to load hero settings on dashboard initialization", err);
      }
    };
    if (authChecked) {
      fetchDashboardHero();
    }
  }, [authChecked]);

  // Load about settings from database
  useEffect(() => {
    const fetchDashboardAbout = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/about");
        const data = await res.json();
        if (data.success && data.settings) {
          setAboutLabel(data.settings.eyebrow);
          setAboutTitle(data.settings.title);
          setAboutSub(data.settings.subtitle);
          setAboutText1(data.settings.text_1);
          setAboutText2(data.settings.text_2);
          if (data.settings.stats && Array.isArray(data.settings.stats)) {
            setAboutStats(data.settings.stats);
          }
        }
      } catch (err) {
        console.error("Failed to load about settings on dashboard initialization", err);
      }
    };
    if (authChecked) {
      fetchDashboardAbout();
    }
  }, [authChecked]);

  // Load trust settings & features from database
  useEffect(() => {
    const fetchDashboardTrust = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/trust");
        const data = await res.json();
        if (data.success) {
          if (data.settings) {
            setTrustLabel(data.settings.eyebrow);
            setTrustTitleText(data.settings.title);
          }
          if (data.features) {
            setTrustCards(data.features);
          }
        }
      } catch (err) {
        console.error("Failed to load trust settings on dashboard initialization", err);
      }
    };
    if (authChecked) {
      fetchDashboardTrust();
    }
  }, [authChecked]);

  const fetchRecordings = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/aartis");
      const data = await res.json();
      if (data.success && data.aartis) {
        setRecordings(data.aartis);
      }
    } catch (err) {
      console.error("Failed to load recordings from API", err);
    }
  };

  const fetchLibraryResources = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/library");
      const data = await res.json();
      if (data.success && data.items) {
        setLibraryResources(data.items);
      }
    } catch (err) {
      console.error("Failed to load library resources", err);
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/gallery");
      const data = await res.json();
      if (data.success && data.items) {
        // Map backend gallery moments to frontend GalleryItem format
        const mapped = data.items.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          fileName: e.image_url ? e.image_url.split("/uploads/")[1] || e.image_url : "",
          status: e.status
        }));
        setGalleryItems(mapped);
      }
    } catch (err) {
      console.error("Failed to load gallery items", err);
    }
  };

  const fetchOccasions = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/calendar");
      const data = await res.json();
      if (data.success && data.events) {
        const mapped = data.events.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          image: e.image_url,
          aartisCount: e.aartis_count,
          status: e.status
        }));
        setOccasions(mapped);
      }
    } catch (err) {
      console.error("Failed to load occasions", err);
    }
  };

  useEffect(() => {
    if (authChecked) {
      fetchRecordings();
      fetchLibraryResources();
      fetchGalleryItems();
      fetchOccasions();
    }
  }, [authChecked]);

  const fetchTrustFeatures = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/trust");
      const data = await res.json();
      if (data.success && data.features) {
        setTrustCards(data.features);
      }
    } catch (err) {
      console.error("Failed to reload trust features list", err);
    }
  };

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(data.admins);
      } else {
        showToast(data.message || "Failed to fetch admin accounts.", "info");
      }
    } catch (err) {
      showToast("Unable to reach the server to fetch admins.", "info");
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError("");

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      setAdminFormError("All fields are required.");
      return;
    }

    if (newAdminPassword.length < 6) {
      setAdminFormError("Password must be at least 6 characters long.");
      return;
    }

    setAdminFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Admin account for "${newAdminName}" created successfully!`, "success");
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminRole("administrator");
        fetchAdmins();
      } else {
        setAdminFormError(data.message || "Failed to create admin account.");
      }
    } catch (err) {
      setAdminFormError("Unable to reach server. Please try again.");
    } finally {
      setAdminFormSubmitting(false);
    }
  };

  const handleToggleAdmin = async (id: number, name: string) => {
    if (currentAdmin && id === currentAdmin.id) {
      showToast("You cannot deactivate your own account.", "info");
      return;
    }

    if (!confirm(`Are you sure you want to change status for "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/admins/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, "success");
        fetchAdmins();
      } else {
        showToast(data.message || "Failed to update admin status.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    }
  };

  const handleDeleteAdmin = async (id: number, name: string) => {
    if (currentAdmin && id === currentAdmin.id) {
      showToast("You cannot delete your own account.", "info");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete admin "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, "success");
        fetchAdmins();
      } else {
        showToast(data.message || "Failed to delete admin account.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    }
  };

  const [siteSettingsOpen, setSiteSettingsOpen] = useState(false);

  // When a site settings sub-tab is clicked, expand the accordion and switch tab
  const openSiteSettingsTab = (tab: "hero" | "latest-aarti" | "about" | "trust") => {
    setSiteSettingsOpen(true);
    setActiveTab(tab);
  };

  // Premium Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Hero Section State Data
  const [heroEyebrow, setHeroEyebrow] = useState("Shri Mahakaleshwar Jyotirlinga, Ujjain");
  const [heroTitle, setHeroTitle] = useState("Experience the Divine Presence of Mahakal");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Discover the sacred world of Shri Mahakaleshwar Jyotirlinga through recorded Bhasma Aarti videos, devotional archives, temple information, spiritual resources, and festival celebrations from the holy city of Ujjain."
  );
  const [heroCtaPrimary, setHeroCtaPrimary] = useState("Watch Latest Bhasma Aarti");
  const [heroCtaSecondary, setHeroCtaSecondary] = useState("Explore Archive");

  // 2. Latest Aarti Section State Data


  // 3. About Section State Data
  const [aboutLabel, setAboutLabel] = useState("The Sacred Legend");
  const [aboutTitle, setAboutTitle] = useState("Shri Mahakaleshwar Jyotirlinga");
  const [aboutSub, setAboutSub] = useState("One of the Twelve Sacred Jyotirlingas of India");
  const [aboutText1, setAboutText1] = useState(
    "Located in the ancient city of Ujjain, Shri Mahakaleshwar Jyotirlinga is one of the most powerful manifestations of Lord Shiva on earth — a sacred flame of divine consciousness that has burned continuously since the dawn of cosmic time."
  );
  const [aboutText2, setAboutText2] = useState(
    "Known as the only Dakshinamukhi Jyotirlinga — the one that faces south — Mahakaleshwar represents the supreme force of time itself. As Mahakal, Lord Shiva is the master of death and liberation, transcending the boundaries of past, present, and future."
  );
  const [aboutStats, setAboutStats] = useState<AboutStatItem[]>([
    { id: 1, label: "Sacred Jyotirlingas", value: "12" },
    { id: 2, label: "Years of History", value: "5000+" },
    { id: 3, label: "Daily Aartis", value: "6" },
    { id: 4, label: "Divine Blessings", value: "∞" },
  ]);

  // 4. Trust / Features Section State Data
  const [trustLabel, setTrustLabel] = useState("Why BhasmaArti.com");
  const [trustTitleText, setTrustTitleText] = useState("Sacred. Authentic. Devotional.");
  const [trustCards, setTrustCards] = useState<TrustCardItem[]>([]);

  // Form states for feature cards CRUD
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDesc, setFeatureDesc] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [trustFormSubmitting, setTrustFormSubmitting] = useState(false);
  const [trustHeadersSubmitting, setTrustHeadersSubmitting] = useState(false);

  // Media Library State Definitions
  interface MediaItem {
    id: number;
    name: string;
    filename: string;
    file_type: "image" | "video" | "pdf";
    file_url: string;
    file_size: number;
    duration?: string;
    created_at: string;
  }
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [mediaFilterType, setMediaFilterType] = useState<"all" | "image" | "video" | "pdf">("all");
  const [previewMediaItem, setPreviewMediaItem] = useState<MediaItem | null>(null);

  const fetchMediaItems = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/media");
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaItems(data.media);
      } else {
        showToast(data.message || "Failed to fetch media library.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server to fetch media.", "info");
    } finally {
      setMediaLoading(false);
    }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      showToast("File is too large. Max size is 100MB.", "info");
      return;
    }

    setMediaUploading(true);

    // Extract video duration if it's a video file
    let extractedDuration = "";
    if (file.type.startsWith("video/")) {
      try {
        extractedDuration = await new Promise<string>((resolve) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            const dur = video.duration;
            if (!dur || isNaN(dur)) {
              resolve("");
              return;
            }
            const hrs = Math.floor(dur / 3600);
            const mins = Math.floor((dur % 3600) / 60);
            const secs = Math.floor(dur % 60);
            let formatted = "";
            if (hrs > 0) {
              formatted += `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
            } else {
              formatted += `${mins}:${secs.toString().padStart(2, "0")}`;
            }
            resolve(formatted);
          };
          video.onerror = () => {
            resolve("");
          };
        });
      } catch (err) {
        console.error("Failed to read video duration:", err);
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    if (extractedDuration) {
      formData.append("duration", extractedDuration);
    }

    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("File uploaded successfully to Media Library!", "success");
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to upload file.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server to upload media.", "info");
    } finally {
      setMediaUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this file? This cannot be undone and will break any pages referencing this URL.")) {
      return;
    }
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("File deleted successfully.", "success");
        fetchMediaItems();
        if (previewMediaItem?.id === id) {
          setPreviewMediaItem(null);
        }
      } else {
        showToast(data.message || "Failed to delete file.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearchQuery.toLowerCase());
    const matchesType = mediaFilterType === "all" || item.file_type === mediaFilterType;
    return matchesSearch && matchesType;
  });


  // 5. Aarti Archive State Data
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [showAartiModal, setShowAartiModal] = useState(false);
  const [aartiTitle, setAartiTitle] = useState("");
  const [aartiCategory, setAartiCategory] = useState<AartiCategory>(AartiCategory.BHASMA);
  const [aartiStatus, setAartiStatus] = useState<"Published" | "Draft">("Published");
  const [aartiVideoFile, setAartiVideoFile] = useState<File | null>(null);
  const [aartiThumbFile, setAartiThumbFile] = useState<File | null>(null);
  const [aartiDuration, setAartiDuration] = useState("");
  const [editingAartiId, setEditingAartiId] = useState<number | null>(null);
  const [aartiSubmitting, setAartiSubmitting] = useState(false);
  const [previewAarti, setPreviewAarti] = useState<Recording | null>(null);
  const [aartiDate, setAartiDate] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentThumbUrl, setCurrentThumbUrl] = useState("");


  // 6. Devotional Library State Data & Modals
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>([]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryTitle, setLibraryTitle] = useState("");
  const [libraryDescription, setLibraryDescription] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("Stotrams");
  const [libraryDuration, setLibraryDuration] = useState("");
  const [libraryLyrics, setLibraryLyrics] = useState("");
  const [libraryTranslation, setLibraryTranslation] = useState("");
  const [libraryStatus, setLibraryStatus] = useState<"Published" | "Draft">("Published");
  const [libraryAudioFile, setLibraryAudioFile] = useState<File | null>(null);
  const [libraryThumbFile, setLibraryThumbFile] = useState<File | null>(null);
  const [editingLibraryId, setEditingLibraryId] = useState<number | null>(null);
  const [librarySubmitting, setLibrarySubmitting] = useState(false);
  const [currentLibraryAudioUrl, setCurrentLibraryAudioUrl] = useState("");
  const [currentLibraryThumbUrl, setCurrentLibraryThumbUrl] = useState("");
  const [libraryDate, setLibraryDate] = useState("");

  // 7. Sacred Moments State Data & Modals
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryDateStr, setGalleryDateStr] = useState("");
  const [galleryStatus, setGalleryStatus] = useState<"Published" | "Draft">("Published");
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);
  const [currentGalleryImageUrl, setCurrentGalleryImageUrl] = useState("");

  // 8. Sacred Calendar State Data & Modals
  const [occasions, setOccasions] = useState<OccasionItem[]>([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarTitle, setCalendarTitle] = useState("");
  const [calendarDescription, setCalendarDescription] = useState("");
  const [calendarDateStr, setCalendarDateStr] = useState("");
  const [calendarMoreInfo, setCalendarMoreInfo] = useState("");
  const [calendarStatus, setCalendarStatus] = useState<"Published" | "Draft">("Published");
  const [calendarImageFile, setCalendarImageFile] = useState<File | null>(null);
  const [editingCalendarId, setEditingCalendarId] = useState<number | null>(null);
  const [calendarSubmitting, setCalendarSubmitting] = useState(false);
  const [currentCalendarImageUrl, setCurrentCalendarImageUrl] = useState("");

  const handleLogout = async () => {
    const token = localStorage.getItem("bhasmaAdminToken");
    // Notify server (fire-and-forget)
    if (token) {
      fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("bhasmaAdminToken");
    localStorage.removeItem("bhasmaAdminInfo");
    router.replace("/admin/login");
  };

  // --- SAVE HANDLERS ---
  const [heroFormSubmitting, setHeroFormSubmitting] = useState(false);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eyebrow: heroEyebrow,
          title: heroTitle,
          subtitle: heroSubtitle,
          cta_primary: heroCtaPrimary,
          cta_secondary: heroCtaSecondary
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Hero Section settings updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update Hero settings.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setHeroFormSubmitting(false);
    }
  };

  const handleResetHero = async () => {
    if (!confirm("Are you sure you want to reset the Hero section back to default settings?")) {
      return;
    }
    setHeroFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/hero/reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Hero Section settings reset to defaults!", "success");
        setHeroEyebrow(data.settings.eyebrow);
        setHeroTitle(data.settings.title);
        setHeroSubtitle(data.settings.subtitle);
        setHeroCtaPrimary(data.settings.cta_primary);
        setHeroCtaSecondary(data.settings.cta_secondary);
      } else {
        showToast(data.message || "Failed to reset Hero settings.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setHeroFormSubmitting(false);
    }
  };



  const [aboutFormSubmitting, setAboutFormSubmitting] = useState(false);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eyebrow: aboutLabel,
          title: aboutTitle,
          subtitle: aboutSub,
          text_1: aboutText1,
          text_2: aboutText2,
          stats: aboutStats
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("About Section settings updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update About settings.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setAboutFormSubmitting(false);
    }
  };

  const handleResetAbout = async () => {
    if (!confirm("Are you sure you want to reset the About section back to default settings?")) {
      return;
    }
    setAboutFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/about/reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("About Section settings reset to defaults!", "success");
        setAboutLabel(data.settings.eyebrow);
        setAboutTitle(data.settings.title);
        setAboutSub(data.settings.subtitle);
        setAboutText1(data.settings.text_1);
        setAboutText2(data.settings.text_2);
        if (data.settings.stats && Array.isArray(data.settings.stats)) {
          setAboutStats(data.settings.stats);
        }
      } else {
        showToast(data.message || "Failed to reset About settings.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setAboutFormSubmitting(false);
    }
  };

  const handleSaveTrustInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrustHeadersSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/trust", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eyebrow: trustLabel,
          title: trustTitleText
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Trust Section headers updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update Trust headers.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setTrustHeadersSubmitting(false);
    }
  };

  const handleResetTrust = async () => {
    if (!confirm("Are you sure you want to reset the Trust & Features section back to default settings? This will restore the 6 default cards and header text.")) {
      return;
    }
    setTrustHeadersSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch("http://localhost:5001/api/trust/reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Trust & Features reset to default settings!", "success");
        if (data.settings) {
          setTrustLabel(data.settings.eyebrow);
          setTrustTitleText(data.settings.title);
        }
        if (data.features) {
          setTrustCards(data.features);
        }
        setEditingFeatureId(null);
        setFeatureTitle("");
        setFeatureDesc("");
        setFeatureImage("");
      } else {
        showToast(data.message || "Failed to reset Trust settings.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setTrustHeadersSubmitting(false);
    }
  };

  const handleSaveFeatureCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureTitle.trim() || !featureDesc.trim()) {
      showToast("Title and Description are required.", "info");
      return;
    }
    setTrustFormSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const isEditing = editingFeatureId !== null;
      const url = isEditing
        ? `http://localhost:5001/api/trust/features/${editingFeatureId}`
        : "http://localhost:5001/api/trust/features";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: featureTitle.trim(),
          description: featureDesc.trim(),
          image_url: featureImage.trim() || null
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          isEditing ? "Feature card updated successfully!" : "Feature card added successfully!",
          "success"
        );
        setFeatureTitle("");
        setFeatureDesc("");
        setFeatureImage("");
        setEditingFeatureId(null);
        fetchTrustFeatures();
      } else {
        showToast(data.message || "Failed to save feature card.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    } finally {
      setTrustFormSubmitting(false);
    }
  };


  // --- DELETE HANDLERS ---
  const handleDeleteRecording = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this Aarti recording?")) {
      try {
        const token = localStorage.getItem("bhasmaAdminToken");
        const res = await fetch(`http://localhost:5001/api/aartis/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          showToast("Aarti recording deleted successfully.");
          fetchRecordings();
        } else {
          showToast(data.message || "Failed to delete Aarti recording.", "info");
        }
      } catch (err) {
        console.error("Delete aarti error", err);
        showToast("Server error occurred. Please try again.", "info");
      }
    }
  };



  const handleDeleteTrustCard = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this trust feature card?")) {
      return;
    }
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/trust/features/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Feature card deleted successfully.", "success");
        fetchTrustFeatures();
        if (editingFeatureId === id) {
          setEditingFeatureId(null);
          setFeatureTitle("");
          setFeatureDesc("");
          setFeatureImage("");
        }
      } else {
        showToast(data.message || "Failed to delete feature card.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    }
  };


  // --- AARTI ARCHIVE INTEGRATION HANDLERS ---
  const resetAartiForm = () => {
    setAartiTitle("");
    setAartiCategory(AartiCategory.BHASMA);
    setAartiStatus("Published");
    setAartiVideoFile(null);
    setAartiThumbFile(null);
    setAartiDuration("");
    setEditingAartiId(null);
    setAartiDate("");
    setCurrentVideoUrl("");
    setCurrentThumbUrl("");
  };

  const handleEditAartiClick = (rec: Recording) => {
    setEditingAartiId(rec.id);
    setAartiTitle(rec.title);
    setAartiCategory(rec.category);
    setAartiStatus(rec.status);
    setAartiDuration(rec.duration);
    setAartiVideoFile(null);
    setAartiThumbFile(null);
    
    // Fix timezone shift bug using Asia/Kolkata timezone components
    if (rec.created_at) {
      const dateObj = new Date(rec.created_at);
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      setAartiDate(formatter.format(dateObj));
    } else {
      setAartiDate("");
    }

    setCurrentVideoUrl(rec.video_url || "");
    setCurrentThumbUrl(rec.thumbnail_url || "");
    setShowAartiModal(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAartiVideoFile(file);
      // Automatically extract duration
      const videoUrl = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.src = videoUrl;
      videoEl.onloadedmetadata = () => {
        const durationSeconds = Math.round(videoEl.duration);
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        setAartiDuration(formattedDuration);
        URL.revokeObjectURL(videoUrl);
      };
    }
  };

  const handleSaveAarti = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aartiTitle || !aartiCategory) {
      showToast("Please provide a title and select a category.", "info");
      return;
    }
    if (!editingAartiId && !aartiVideoFile) {
      showToast("A video file is required for new recordings.", "info");
      return;
    }
    setAartiSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const formData = new FormData();
      formData.append("title", aartiTitle);
      formData.append("category", aartiCategory);
      formData.append("duration", aartiDuration || "0:00");
      formData.append("status", aartiStatus);
      if (aartiVideoFile) {
        formData.append("video", aartiVideoFile);
      }
      if (aartiThumbFile) {
        formData.append("thumbnail", aartiThumbFile);
      }
      if (aartiDate) {
        formData.append("created_at", aartiDate);
      }

      const url = editingAartiId
        ? `http://localhost:5001/api/aartis/${editingAartiId}`
        : "http://localhost:5001/api/aartis";
      const method = editingAartiId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingAartiId ? "Aarti recording updated successfully!" : "Aarti recording uploaded successfully!");
        setShowAartiModal(false);
        resetAartiForm();
        fetchRecordings();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to save Aarti recording.", "info");
      }
    } catch (err) {
      console.error("Save aarti error", err);
      showToast("Server error occurred. Please try again.", "info");
    } finally {
      setAartiSubmitting(false);
    }
  };


  // --- DEVOTIONAL LIBRARY HANDLERS ---
  const resetLibraryForm = () => {
    setLibraryTitle("");
    setLibraryDescription("");
    setLibraryCategory("Stotrams");
    setLibraryDuration("");
    setLibraryLyrics("");
    setLibraryTranslation("");
    setLibraryStatus("Published");
    setLibraryAudioFile(null);
    setLibraryThumbFile(null);
    setEditingLibraryId(null);
    setCurrentLibraryAudioUrl("");
    setCurrentLibraryThumbUrl("");
    setLibraryDate("");
  };

  const handleEditLibraryClick = (res: LibraryResource & { description?: string, lyrics?: string, translation?: string, audio_url?: string, thumbnail_url?: string, created_at?: string }) => {
    setEditingLibraryId(res.id);
    setLibraryTitle(res.title);
    setLibraryDescription(res.description || "");
    setLibraryCategory(res.category);
    setLibraryDuration(res.duration);
    setLibraryLyrics(res.lyrics || "");
    setLibraryTranslation(res.translation || "");
    setLibraryStatus(res.status);
    setLibraryAudioFile(null);
    setLibraryThumbFile(null);
    setCurrentLibraryAudioUrl(res.audio_url || "");
    setCurrentLibraryThumbUrl(res.thumbnail_url || "");

    if (res.created_at) {
      const dateObj = new Date(res.created_at);
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      setLibraryDate(formatter.format(dateObj));
    } else {
      setLibraryDate("");
    }
    setShowLibraryModal(true);
  };

  const handleLibraryAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLibraryAudioFile(file);
      // Try to read audio duration
      const audioUrl = URL.createObjectURL(file);
      const audioEl = document.createElement("audio");
      audioEl.src = audioUrl;
      audioEl.onloadedmetadata = () => {
        const durationSeconds = Math.round(audioEl.duration);
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        setLibraryDuration(formattedDuration);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const handleSaveLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libraryTitle || !libraryCategory) {
      showToast("Please provide a title and category.", "info");
      return;
    }
    if (!editingLibraryId && !libraryAudioFile) {
      showToast("An audio file upload is required.", "info");
      return;
    }
    setLibrarySubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const formData = new FormData();
      formData.append("title", libraryTitle);
      formData.append("description", libraryDescription);
      formData.append("category", libraryCategory);
      formData.append("duration", libraryDuration || "0:00");
      formData.append("lyrics", libraryLyrics);
      formData.append("translation", libraryTranslation);
      formData.append("status", libraryStatus);
      if (libraryAudioFile) {
        formData.append("audio", libraryAudioFile);
      }
      if (libraryThumbFile) {
        formData.append("thumbnail", libraryThumbFile);
      }
      if (libraryDate) {
        formData.append("created_at", libraryDate);
      }

      const url = editingLibraryId
        ? `http://localhost:5001/api/library/${editingLibraryId}`
        : "http://localhost:5001/api/library";
      const method = editingLibraryId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingLibraryId ? "Library item updated successfully!" : "Library item added successfully!");
        setShowLibraryModal(false);
        resetLibraryForm();
        fetchLibraryResources();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to save library item.", "info");
      }
    } catch (err) {
      console.error("Save library error", err);
      showToast("Server error occurred.", "info");
    } finally {
      setLibrarySubmitting(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this spiritual resource?")) {
      return;
    }
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/library/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Spiritual resource deleted successfully.");
        fetchLibraryResources();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to delete resource.", "info");
      }
    } catch (err) {
      console.error("Delete resource error", err);
      showToast("Server error occurred.", "info");
    }
  };


  // --- SACRED CALENDAR HANDLERS ---
  const resetCalendarForm = () => {
    setCalendarTitle("");
    setCalendarDescription("");
    setCalendarDateStr("");
    setCalendarMoreInfo("");
    setCalendarStatus("Published");
    setCalendarImageFile(null);
    setEditingCalendarId(null);
    setCurrentCalendarImageUrl("");
  };

  const handleEditCalendarClick = (occ: OccasionItem & { description?: string, shringarInfo?: string, more_info?: string, image_url?: string }) => {
    setEditingCalendarId(occ.id);
    setCalendarTitle(occ.title);
    setCalendarDescription(occ.description || "");
    setCalendarDateStr(occ.date);
    setCalendarMoreInfo(occ.more_info || occ.shringarInfo || "");
    setCalendarStatus(occ.status);
    setCalendarImageFile(null);
    setCurrentCalendarImageUrl(occ.image || occ.image_url || "");
    setShowCalendarModal(true);
  };

  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarTitle || !calendarDescription || !calendarDateStr) {
      showToast("Please provide a title, description, and date.", "info");
      return;
    }
    if (!editingCalendarId && !calendarImageFile) {
      showToast("An image file is required.", "info");
      return;
    }
    setCalendarSubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const formData = new FormData();
      formData.append("title", calendarTitle);
      formData.append("description", calendarDescription);
      formData.append("date", calendarDateStr);
      formData.append("more_info", calendarMoreInfo);
      formData.append("status", calendarStatus);
      if (calendarImageFile) {
        formData.append("image", calendarImageFile);
      }

      const url = editingCalendarId
        ? `http://localhost:5001/api/calendar/${editingCalendarId}`
        : "http://localhost:5001/api/calendar";
      const method = editingCalendarId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingCalendarId ? "Calendar occasion updated successfully!" : "Calendar occasion added successfully!");
        setShowCalendarModal(false);
        resetCalendarForm();
        fetchOccasions();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to save occasion.", "info");
      }
    } catch (err) {
      console.error("Save occasion error", err);
      showToast("Server error occurred.", "info");
    } finally {
      setCalendarSubmitting(false);
    }
  };

  const handleDeleteOccasion = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this calendar occasion?")) {
      return;
    }
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/calendar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Calendar occasion deleted successfully.");
        fetchOccasions();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to delete occasion.", "info");
      }
    } catch (err) {
      console.error("Delete occasion error", err);
      showToast("Server error occurred.", "info");
    }
  };


  // --- SACRED MOMENTS (GALLERY) HANDLERS ---
  const resetGalleryForm = () => {
    setGalleryTitle("");
    setGalleryDescription("");
    setGalleryDateStr("");
    setGalleryStatus("Published");
    setGalleryImageFile(null);
    setEditingGalleryId(null);
    setCurrentGalleryImageUrl("");
  };

  const handleEditGalleryClick = (item: GalleryItem & { description?: string, image_url?: string }) => {
    setEditingGalleryId(item.id);
    setGalleryTitle(item.title);
    setGalleryDescription(item.description || "");
    setGalleryDateStr(item.date);
    setGalleryStatus(item.status);
    setGalleryImageFile(null);
    setCurrentGalleryImageUrl(item.image_url || "");
    setShowGalleryModal(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle || !galleryDescription || !galleryDateStr) {
      showToast("Please provide a title, description, and date.", "info");
      return;
    }
    if (!editingGalleryId && !galleryImageFile) {
      showToast("An image file is required.", "info");
      return;
    }
    setGallerySubmitting(true);
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const formData = new FormData();
      formData.append("title", galleryTitle);
      formData.append("description", galleryDescription);
      formData.append("date", galleryDateStr);
      formData.append("status", galleryStatus);
      if (galleryImageFile) {
        formData.append("image", galleryImageFile);
      }

      const url = editingGalleryId
        ? `http://localhost:5001/api/gallery/${editingGalleryId}`
        : "http://localhost:5001/api/gallery";
      const method = editingGalleryId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingGalleryId ? "Gallery photo updated successfully!" : "Gallery photo added successfully!");
        setShowGalleryModal(false);
        resetGalleryForm();
        fetchGalleryItems();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to save gallery photo.", "info");
      }
    } catch (err) {
      console.error("Save gallery photo error", err);
      showToast("Server error occurred.", "info");
    } finally {
      setGallerySubmitting(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this gallery item?")) {
      return;
    }
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Gallery item deleted successfully.");
        fetchGalleryItems();
        fetchMediaItems();
      } else {
        showToast(data.message || "Failed to delete gallery item.", "info");
      }
    } catch (err) {
      console.error("Delete gallery error", err);
      showToast("Server error occurred.", "info");
    }
  };



  // Mock trust card helper removed

  // --- TOGGLE ACTIONS ---
  const toggleTrustCardStatus = async (id: number) => {
    try {
      const token = localStorage.getItem("bhasmaAdminToken");
      const res = await fetch(`http://localhost:5001/api/trust/features/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Feature status toggled!", "success");
        fetchTrustFeatures();
      } else {
        showToast(data.message || "Failed to toggle feature status.", "info");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.", "info");
    }
  };


  const handleStatValueChange = (id: number, newValue: string) => {
    setAboutStats(
      aboutStats.map((s) => (s.id === id ? { ...s, value: newValue } : s))
    );
  };

  const handleStatLabelChange = (id: number, newLabel: string) => {
    setAboutStats(
      aboutStats.map((s) => (s.id === id ? { ...s, label: newLabel } : s))
    );
  };

  // Reusable SVG icon components
  const IconOverview = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  const IconSettings = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
  const IconHero = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
  const IconLatestAarti = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
  const IconAbout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
  const IconTrust = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  const IconArchive = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
  const IconLibrary = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
  const IconGallery = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  const IconMedia = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="3"/><path d="M12 10v6"/></svg>;

  const IconChevron = ({ open }: { open: boolean }) => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}><polyline points="6 9 12 15 18 9"/></svg>;
  const IconArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
  const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  const IconInfo = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
  const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  const IconEye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const IconPlay = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
  const IconTrendUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
  const IconRepeat = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;

  // Don't render anything until auth is confirmed
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary, #0a0804)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(212,160,23,0.15)", borderTopColor: "var(--accent-gold, #d4a017)", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "0.8rem", color: "rgba(212,160,23,0.5)", fontFamily: "var(--font-cinzel, serif)", letterSpacing: "0.1em" }}>Verifying access…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`dashboard-toast ${toast.type}`}>
          <span className="dashboard-toast-icon">{toast.type === "success" ? <IconCheck /> : <IconInfo />}</span>
          <div>{toast.message}</div>
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Bhasma<span>Arti</span>.com</h1>
          <p>Temple Administration Dashboard</p>
        </div>
        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <div className="dashboard-user-name">Temple Admin</div>
            <div className="dashboard-user-role">Administrator</div>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* BODY SIDEBAR AND WORKSPACE */}
      <div className="dashboard-body">
        {/* SIDEBAR PANEL */}
        <aside className="dashboard-sidebar">
          <ul className="sidebar-nav">
            <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              <span className="sidebar-icon"><IconOverview /></span> Overview
            </li>

            {/* ── SITE SETTINGS ACCORDION ── */}
            <li
              className="sidebar-accordion-parent"
              onClick={() => setSiteSettingsOpen(!siteSettingsOpen)}
              style={{
                padding: "0.8rem 1.1rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.88rem",
                color: ["hero", "latest-aarti", "about", "trust"].includes(activeTab)
                  ? "var(--accent-gold)"
                  : "var(--text-secondary)",
                fontWeight: ["hero", "latest-aarti", "about", "trust"].includes(activeTab) ? 600 : 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
                background: ["hero", "latest-aarti", "about", "trust"].includes(activeTab)
                  ? "rgba(230, 106, 0, 0.08)"
                  : "transparent",
                border: ["hero", "latest-aarti", "about", "trust"].includes(activeTab)
                  ? "1px solid rgba(230, 106, 0, 0.2)"
                  : "1px solid transparent",
                userSelect: "none",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <span className="sidebar-icon"><IconSettings /></span> Site Settings
              </span>
              <IconChevron open={siteSettingsOpen} />
            </li>

            {/* Site Settings Sub-options */}
            {siteSettingsOpen && (
              <>
                <li
                  className={activeTab === "hero" ? "active" : ""}
                  onClick={() => openSiteSettingsTab("hero")}
                  style={{ paddingLeft: "2.5rem" }}
                >
                  <span className="sidebar-icon"><IconHero /></span> Hero Section
                </li>
                <li
                  className={activeTab === "latest-aarti" ? "active" : ""}
                  onClick={() => openSiteSettingsTab("latest-aarti")}
                  style={{ paddingLeft: "2.5rem" }}
                >
                  <span className="sidebar-icon"><IconLatestAarti /></span> Latest Aarti
                </li>
                <li
                  className={activeTab === "about" ? "active" : ""}
                  onClick={() => openSiteSettingsTab("about")}
                  style={{ paddingLeft: "2.5rem" }}
                >
                  <span className="sidebar-icon"><IconAbout /></span> About Section
                </li>
                <li
                  className={activeTab === "trust" ? "active" : ""}
                  onClick={() => openSiteSettingsTab("trust")}
                  style={{ paddingLeft: "2.5rem" }}
                >
                  <span className="sidebar-icon"><IconTrust /></span> Trust & Features
                </li>
              </>
            )}

            <li className={activeTab === "archive" ? "active" : ""} onClick={() => setActiveTab("archive")}>
              <span className="sidebar-icon"><IconArchive /></span> Aarti Archive
            </li>
            <li className={activeTab === "library" ? "active" : ""} onClick={() => setActiveTab("library")}>
              <span className="sidebar-icon"><IconLibrary /></span> Devotional Library
            </li>
            <li className={activeTab === "gallery" ? "active" : ""} onClick={() => setActiveTab("gallery")}>
              <span className="sidebar-icon"><IconGallery /></span> Sacred Moments
            </li>
            <li className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>
              <span className="sidebar-icon"><IconCalendar /></span> Sacred Calendar
            </li>
            <li className={activeTab === "media" ? "active" : ""} onClick={() => setActiveTab("media")}>
              <span className="sidebar-icon"><IconMedia /></span> Media Library
            </li>
            <li className={activeTab === "admins" ? "active" : ""} onClick={() => setActiveTab("admins")}>
              <span className="sidebar-icon"><IconUsers /></span> Admin Accounts
            </li>
          </ul>
          <div className="sidebar-footer">
            <a href="/" className="sidebar-back-link">
              ← Return to Site
            </a>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="dashboard-main-content">
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

              {/* PAGE HEADER */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: "1px solid rgba(212,160,23,0.1)" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.2rem", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
                    Dashboard Overview
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
                    BhasmaArti.com — Temple Administration Panel
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.38rem 0.8rem", background: "rgba(46,204,113,0.07)", border: "1px solid rgba(46,204,113,0.18)", borderRadius: "20px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ecc71", display: "inline-block", boxShadow: "0 0 5px #2ecc71" }}></span>
                  <span style={{ fontSize: "0.7rem", color: "#2ecc71", fontWeight: 600, letterSpacing: "0.04em" }}>All Systems Operational</span>
                </div>
              </div>

              {/* ANALYTICS STRIP — 4 columns */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem" }}>
                {[
                  { icon: <IconUsers />, value: "1,84,320", label: "Total Visitors", sub: "Last 30 days", badge: "+12.4%", live: false, accentColor: "var(--accent-gold)", iconBg: "rgba(212,160,23,0.09)", iconBorder: "rgba(212,160,23,0.18)" },
                  { icon: <IconEye />, value: "2,418", label: "Active Viewers", sub: "Watching now", badge: "Live", live: true, accentColor: "var(--accent-saffron)", iconBg: "rgba(230,106,0,0.09)", iconBorder: "rgba(230,106,0,0.18)" },
                  { icon: <IconPlay />, value: "9,62,104", label: "Video Plays", sub: "All-time", badge: "+8.7%", live: false, accentColor: "var(--accent-gold)", iconBg: "rgba(212,160,23,0.09)", iconBorder: "rgba(212,160,23,0.18)" },
                  { icon: <IconRepeat />, value: "68.3%", label: "Return Rate", sub: "Revisiting daily", badge: "+3.2%", live: false, accentColor: "var(--accent-saffron)", iconBg: "rgba(230,106,0,0.09)", iconBorder: "rgba(230,106,0,0.18)" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: c.iconBg, border: `1px solid ${c.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accentColor }}>
                        {c.icon}
                      </div>
                      {c.live ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.28rem", fontSize: "0.66rem", color: "#2ecc71", fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ecc71", display: "inline-block" }}></span>{c.badge}
                        </span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.66rem", color: "#2ecc71", fontWeight: 600 }}>
                          <IconTrendUp />{c.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-cinzel), serif", fontWeight: 700, color: c.accentColor, lineHeight: 1.1 }}>{c.value}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-primary)", fontWeight: 600, marginTop: "0.18rem" }}>{c.label}</div>
                      <div style={{ fontSize: "0.64rem", color: "var(--text-secondary)", marginTop: "0.08rem" }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MIDDLE ROW: Quick Access (left) + Content DB (right) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>

                {/* Quick Access Panel */}
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "0.75rem" }}>Quick Access</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {[
                      { tab: "archive" as const, label: "Aarti Archive", count: `${recordings.length} recordings`, icon: <IconArchive /> },
                      { tab: "library" as const, label: "Devotional Library", count: `${libraryResources.length} resources`, icon: <IconLibrary /> },
                      { tab: "calendar" as const, label: "Sacred Calendar", count: `${occasions.length} occasions`, icon: <IconCalendar /> },
                      { tab: "gallery" as const, label: "Sacred Moments", count: `${galleryItems.length} photos`, icon: <IconGallery /> },
                    ].map(item => (
                      <button
                        key={item.tab}
                        onClick={() => setActiveTab(item.tab)}
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "7px", padding: "0.6rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.7rem", transition: "all 0.18s ease", width: "100%" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.28)"; e.currentTarget.style.background = "rgba(212,160,23,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(212,160,23,0.07)", border: "1px solid rgba(212,160,23,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-gold)", flexShrink: 0 }}>
                          {item.icon}
                        </span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{item.label}</div>
                          <div style={{ fontSize: "0.64rem", color: "var(--text-secondary)" }}>{item.count}</div>
                        </div>
                        <span style={{ color: "rgba(212,160,23,0.45)", flexShrink: 0 }}><IconArrow /></span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Database Panel */}
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "0.75rem" }}>Content Database</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {[
                      { icon: <IconLatestAarti />, label: "Recorded Aartis", value: recordings.length, unit: "videos", pct: Math.min(100, recordings.length * 20) },
                      { icon: <IconLibrary />, label: "Library Resources", value: libraryResources.length, unit: "tracks", pct: Math.min(100, libraryResources.length * 12) },
                      { icon: <IconGallery />, label: "Sacred Moments", value: galleryItems.length, unit: "photos", pct: Math.min(100, galleryItems.length * 16) },
                      { icon: <IconCalendar />, label: "Sacred Occasions", value: occasions.length, unit: "events", pct: Math.min(100, occasions.length * 25) },
                    ].map((row, i) => (
                      <div key={i} style={{ padding: "0.6rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                            <span style={{ color: "var(--accent-gold)", display: "flex", opacity: 0.85 }}>{row.icon}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{row.label}</span>
                          </div>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {row.value} <span style={{ fontSize: "0.62rem", color: "var(--text-secondary)", fontWeight: 400 }}>{row.unit}</span>
                          </span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${row.pct}%`, background: "linear-gradient(90deg, var(--accent-saffron), var(--accent-gold))", borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SYSTEM STATUS BAR */}
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "0.8rem 1.1rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                {[
                  { label: "Streaming Servers", status: "Operational", detail: "All regions active" },
                  { label: "Database", status: "Connected", detail: "99.98% uptime" },
                  { label: "CDN / Media", status: "Healthy", detail: "Avg 42ms latency" },
                  { label: "Last Backup", status: "Success", detail: "Today 02:00 AM" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "0 0.9rem", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                    <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.18rem" }}>{item.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ecc71", display: "inline-block", flexShrink: 0 }}></span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "var(--text-secondary)", marginTop: "0.08rem" }}>{item.detail}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 2. HERO SECTION TAB */}
          {activeTab === "hero" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Manage Hero Banner Section</h2>
              </div>
              <form onSubmit={handleSaveHero} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Hero Eyebrow Text</label>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={heroEyebrow}
                    onChange={(e) => setHeroEyebrow(e.target.value)}
                    disabled={heroFormSubmitting}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Hero Title</label>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    disabled={heroFormSubmitting}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Hero Subtitle</label>
                  <textarea
                    className="dashboard-textarea"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    disabled={heroFormSubmitting}
                    required
                  />
                </div>
                <div className="dashboard-form-grid two-col">
                  <div className="dashboard-form-group">
                    <label className="dashboard-label">Primary Call to Action (CTA)</label>
                    <input
                      type="text"
                      className="dashboard-input"
                      value={heroCtaPrimary}
                      onChange={(e) => setHeroCtaPrimary(e.target.value)}
                      disabled={heroFormSubmitting}
                      required
                    />
                  </div>
                  <div className="dashboard-form-group">
                    <label className="dashboard-label">Secondary Call to Action</label>
                    <input
                      type="text"
                      className="dashboard-input"
                      value={heroCtaSecondary}
                      onChange={(e) => setHeroCtaSecondary(e.target.value)}
                      disabled={heroFormSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Simulated Live Preview */}
                <div style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px dashed rgba(212, 160, 23, 0.2)",
                  borderRadius: "6px",
                  padding: "1.5rem",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-saffron)", marginBottom: "0.75rem", fontWeight: 600 }}>
                    Live Preview (Mockup)
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)" }}>{heroEyebrow}</div>
                    <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.4rem", margin: "0.5rem 0", color: "var(--text-primary)", whiteSpace: "pre-line" }}>
                      {heroTitle}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 1rem auto", lineHeight: "1.6" }}>
                      {heroSubtitle}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", background: "var(--accent-saffron)", borderRadius: "4px" }}>{heroCtaPrimary}</span>
                      <span style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", border: "1px solid var(--accent-gold)", borderRadius: "4px" }}>{heroCtaSecondary}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <button type="submit" className="dashboard-save-btn" disabled={heroFormSubmitting}>
                    {heroFormSubmitting ? "Saving Changes..." : "Save Hero Section Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetHero}
                    disabled={heroFormSubmitting}
                    style={{
                      padding: "0.7rem 1.8rem",
                      background: "transparent",
                      border: "1px solid rgba(212, 160, 23, 0.4)",
                      borderRadius: "4px",
                      color: "var(--accent-gold)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(212, 160, 23, 0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Reset to Default Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. LATEST AARTI TAB */}
          {activeTab === "latest-aarti" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Latest Aarti & Recent Video Grid</h2>
                </div>
                <div style={{ padding: "1rem", background: "rgba(212, 160, 23, 0.05)", borderLeft: "4px solid var(--accent-gold)", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <strong>Note:</strong> The "Featured Latest Aarti" and the "Recent Video Grid" on the public homepage are <strong>live and automatically synced</strong>. 
                  </p>
                  <p style={{ marginTop: "0.5rem", marginBottom: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    The system automatically pulls the <strong>5 most recently published videos</strong> from your <em>Aarti Archive</em>. To change what appears on the homepage, navigate to the <strong>Aarti Archive</strong> tab and upload or edit your recordings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. ABOUT SECTION TAB */}
          {activeTab === "about" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Manage About & Legends Section</h2>
              </div>
              <form onSubmit={handleSaveAbout} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="dashboard-form-grid two-col">
                  <div className="dashboard-form-group">
                    <label className="dashboard-label">Section Eyebrow Label</label>
                    <input
                      type="text"
                      className="dashboard-input"
                      value={aboutLabel}
                      onChange={(e) => setAboutLabel(e.target.value)}
                      disabled={aboutFormSubmitting}
                      required
                    />
                  </div>
                  <div className="dashboard-form-group">
                    <label className="dashboard-label">Section Title</label>
                    <input
                      type="text"
                      className="dashboard-input"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      disabled={aboutFormSubmitting}
                      required
                    />
                  </div>
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Section Subtitle / Quotation</label>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={aboutSub}
                    onChange={(e) => setAboutSub(e.target.value)}
                    disabled={aboutFormSubmitting}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">First Narrative Paragraph</label>
                  <textarea
                    className="dashboard-textarea"
                    value={aboutText1}
                    onChange={(e) => setAboutText1(e.target.value)}
                    disabled={aboutFormSubmitting}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Second Narrative Paragraph</label>
                  <textarea
                    className="dashboard-textarea"
                    value={aboutText2}
                    onChange={(e) => setAboutText2(e.target.value)}
                    disabled={aboutFormSubmitting}
                    required
                  />
                </div>

                <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.9rem", color: "var(--accent-gold)", marginBottom: "1rem", fontFamily: "var(--font-cinzel), serif" }}>
                    Bottom Section Counter Stat Values
                  </h3>
                  <div className="dashboard-form-grid two-col" style={{ gap: "1rem" }}>
                    {aboutStats.map((stat) => (
                      <div key={stat.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <label className="dashboard-label" style={{ fontSize: "0.7rem" }}>Label</label>
                          <input
                            type="text"
                            className="dashboard-input"
                            value={stat.label}
                            onChange={(e) => handleStatLabelChange(stat.id, e.target.value)}
                            disabled={aboutFormSubmitting}
                          />
                        </div>
                        <div style={{ width: "100px" }}>
                          <label className="dashboard-label" style={{ fontSize: "0.7rem" }}>Counter</label>
                          <input
                            type="text"
                            className="dashboard-input"
                            value={stat.value}
                            onChange={(e) => handleStatValueChange(stat.id, e.target.value)}
                            disabled={aboutFormSubmitting}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
                  <button type="submit" className="dashboard-save-btn" disabled={aboutFormSubmitting}>
                    {aboutFormSubmitting ? "Saving Configuration..." : "Save About Section Configuration"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAbout}
                    disabled={aboutFormSubmitting}
                    style={{
                      padding: "0.7rem 1.8rem",
                      background: "transparent",
                      border: "1px solid rgba(212, 160, 23, 0.4)",
                      borderRadius: "4px",
                      color: "var(--accent-gold)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(212, 160, 23, 0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Reset to Default Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. TRUST / FEATURES TAB */}
          {activeTab === "trust" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Headers Setting Box */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Trust Section Header Text Settings</h2>
                </div>
                <form onSubmit={handleSaveTrustInfo} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="dashboard-form-grid two-col">
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Section Label (Why BhasmaArti)</label>
                      <input
                        type="text"
                        className="dashboard-input"
                        value={trustLabel}
                        onChange={(e) => setTrustLabel(e.target.value)}
                        disabled={trustHeadersSubmitting}
                        required
                      />
                    </div>
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Section Main Header</label>
                      <input
                        type="text"
                        className="dashboard-input"
                        value={trustTitleText}
                        onChange={(e) => setTrustTitleText(e.target.value)}
                        disabled={trustHeadersSubmitting}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button type="submit" className="dashboard-save-btn" disabled={trustHeadersSubmitting}>
                      {trustHeadersSubmitting ? "Saving Headers..." : "Save Headers Info"}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTrust}
                      disabled={trustHeadersSubmitting}
                      style={{
                        padding: "0.7rem 1.8rem",
                        background: "transparent",
                        border: "1px solid rgba(212, 160, 23, 0.4)",
                        borderRadius: "4px",
                        color: "var(--accent-gold)",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(212, 160, 23, 0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      Reset Section Defaults
                    </button>
                  </div>
                </form>
              </div>

              {/* Add/Edit Feature Card Form */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>{editingFeatureId ? "Edit Feature Card" : "Create New Feature Card"}</h2>
                </div>
                <form onSubmit={handleSaveFeatureCard} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="dashboard-form-grid two-col">
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Feature Title</label>
                      <input
                        type="text"
                        className="dashboard-input"
                        placeholder="e.g. Daily Updated Archive"
                        value={featureTitle}
                        onChange={(e) => setFeatureTitle(e.target.value)}
                        disabled={trustFormSubmitting}
                        required
                      />
                    </div>
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Image URL / Option (Optional)</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <input
                          type="text"
                          className="dashboard-input"
                          placeholder="e.g. /aarti-diya-thumb.png or custom link"
                          value={featureImage}
                          onChange={(e) => setFeatureImage(e.target.value)}
                          disabled={trustFormSubmitting}
                        />
                        {featureImage && (
                          <div style={{ marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Preview:</span>
                            <img
                              src={featureImage}
                              alt="Feature Preview"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid var(--accent-gold)"
                              }}
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-form-group">
                    <label className="dashboard-label">Detailed Description</label>
                    <textarea
                      className="dashboard-textarea"
                      placeholder="Enter a brief, engaging description of this feature..."
                      value={featureDesc}
                      onChange={(e) => setFeatureDesc(e.target.value)}
                      disabled={trustFormSubmitting}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button type="submit" className="dashboard-save-btn" disabled={trustFormSubmitting}>
                      {trustFormSubmitting
                        ? "Saving..."
                        : editingFeatureId
                        ? "Update Feature Card"
                        : "Add Feature Card"}
                    </button>
                    {editingFeatureId && (
                      <button
                        type="button"
                        className="dashboard-logout-btn"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
                        onClick={() => {
                          setEditingFeatureId(null);
                          setFeatureTitle("");
                          setFeatureDesc("");
                          setFeatureImage("");
                        }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Feature Cards Listing */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Platform Feature Cards Listing ({trustCards.length})</h2>
                </div>
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Feature Card</th>
                        <th>Detailed Description</th>
                        <th>Image / Icon</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trustCards.map((card) => (
                        <tr key={card.id}>
                          <td style={{ fontWeight: 600, color: "var(--accent-gold)", width: "220px" }}>{card.title}</td>
                          <td style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{card.description}</td>
                          <td style={{ width: "120px" }}>
                            {card.image_url ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                <img
                                  src={card.image_url}
                                  alt={card.title}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "1px solid var(--accent-gold)"
                                  }}
                                />
                                <code style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                                  {card.image_url.length > 15 ? card.image_url.slice(0, 12) + "..." : card.image_url}
                                </code>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                SVG Fallback
                              </span>
                            )}
                          </td>
                          <td style={{ width: "120px" }}>
                            <button
                              onClick={() => toggleTrustCardStatus(card.id)}
                              style={{
                                background: card.status === "Active" ? "rgba(46, 204, 113, 0.12)" : "rgba(255, 255, 255, 0.05)",
                                border: card.status === "Active" ? "1px solid rgba(46, 204, 113, 0.3)" : "1px solid rgba(255,255,255,0.1)",
                                color: card.status === "Active" ? "#2ecc71" : "var(--text-secondary)",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                cursor: "pointer"
                              }}
                            >
                              {card.status}
                            </button>
                          </td>
                          <td style={{ width: "140px" }}>
                            <div className="action-links">
                              <span
                                className="action-link edit"
                                onClick={() => {
                                  setEditingFeatureId(card.id);
                                  setFeatureTitle(card.title);
                                  setFeatureDesc(card.description);
                                  setFeatureImage(card.image_url || "");
                                }}
                                style={{ marginRight: "0.75rem", cursor: "pointer" }}
                              >
                                Edit
                              </span>
                              <span
                                className="action-link delete"
                                onClick={() => handleDeleteTrustCard(card.id)}
                                style={{ cursor: "pointer" }}
                              >
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. AARTI ARCHIVE TAB */}
          {activeTab === "archive" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Recorded Aarti Archives</h2>
                <button className="dashboard-add-btn" onClick={() => { resetAartiForm(); setShowAartiModal(true); }}>
                  + Upload Aarti
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Video Title</th>
                      <th>Category</th>
                      <th>Upload Date</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordings.length > 0 ? (
                      recordings.map((rec) => (
                        <tr key={rec.id}>
                          <td style={{ fontWeight: 500 }}>{rec.title}</td>
                          <td>{rec.category}</td>
                          <td>
                            {rec.created_at
                              ? new Date(rec.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  timeZone: "Asia/Kolkata"
                                })
                              : (rec.date || "N/A")}
                          </td>
                          <td>{rec.duration}</td>
                          <td>
                            <span className={`status-badge ${rec.status.toLowerCase()}`}>{rec.status}</span>
                          </td>
                          <td>
                            <div className="action-links">
                              <span className="action-link edit" style={{ cursor: "pointer", marginRight: "0.75rem", color: "#3498db" }} onClick={() => setPreviewAarti(rec)}>
                                View
                              </span>
                              <span className="action-link edit" style={{ cursor: "pointer", marginRight: "0.75rem" }} onClick={() => handleEditAartiClick(rec)}>
                                Edit
                              </span>
                              <span className="action-link delete" style={{ cursor: "pointer" }} onClick={() => handleDeleteRecording(rec.id)}>
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                          No recordings found. Click "+ Upload Aarti" to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. DEVOTIONAL LIBRARY TAB */}
          {activeTab === "library" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Spiritual Resources Library</h2>
                <button className="dashboard-add-btn" onClick={() => { resetLibraryForm(); setShowLibraryModal(true); }}>
                  + Add Resource
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Resource Name</th>
                      <th>Category</th>
                      <th>Audio Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libraryResources.length > 0 ? (
                      libraryResources.map((res) => (
                        <tr key={res.id}>
                          <td style={{ fontWeight: 500 }}>{res.title}</td>
                          <td>{res.category}</td>
                          <td>{res.duration}</td>
                          <td>
                            <span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
                          </td>
                          <td>
                            <div className="action-links">
                              <span className="action-link edit" style={{ cursor: "pointer", marginRight: "0.75rem" }} onClick={() => handleEditLibraryClick(res)}>
                                Edit
                              </span>
                              <span className="action-link delete" style={{ cursor: "pointer" }} onClick={() => handleDeleteResource(res.id)}>
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                          No resources found. Click "+ Add Resource" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. SACRED MOMENTS TAB */}
          {activeTab === "gallery" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Sacred Moments Gallery</h2>
                <button className="dashboard-add-btn" onClick={() => { resetGalleryForm(); setShowGalleryModal(true); }}>
                  + Add Moment Photo
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Moment Title</th>
                      <th>Capture Date</th>
                      <th>Image File Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.length > 0 ? (
                      galleryItems.map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 500 }}>{item.title}</td>
                          <td>{item.date}</td>
                          <td>{item.fileName}</td>
                          <td>
                            <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                          </td>
                          <td>
                            <div className="action-links">
                              <span className="action-link edit" style={{ cursor: "pointer", marginRight: "0.75rem" }} onClick={() => handleEditGalleryClick(item)}>
                                Edit
                              </span>
                              <span className="action-link delete" style={{ cursor: "pointer" }} onClick={() => handleDeleteGallery(item.id)}>
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                          No gallery items found. Click "+ Add Moment Photo" to upload one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. SACRED CALENDAR TAB */}
          {activeTab === "calendar" && (
            <div className="dashboard-content-box">
              <div className="dashboard-content-header">
                <h2>Sacred Calendar Occasions</h2>
                <button className="dashboard-add-btn" onClick={() => { resetCalendarForm(); setShowCalendarModal(true); }}>
                  + Add Occasion
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Occasion Name</th>
                      <th>Target Date</th>
                      <th>Darshan Image</th>
                      <th>Aartis Count</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occasions.length > 0 ? (
                      occasions.map((occ) => (
                        <tr key={occ.id}>
                          <td style={{ fontWeight: 500 }}>{occ.title}</td>
                          <td>{occ.date}</td>
                          <td>{occ.image ? occ.image.split("/uploads/")[1] || occ.image : ""}</td>
                          <td>{occ.aartisCount} Aartis</td>
                          <td>
                            <span className={`status-badge ${occ.status.toLowerCase()}`}>{occ.status}</span>
                          </td>
                          <td>
                            <div className="action-links">
                              <span className="action-link edit" style={{ cursor: "pointer", marginRight: "0.75rem" }} onClick={() => handleEditCalendarClick(occ)}>
                                Edit
                              </span>
                              <span className="action-link delete" style={{ cursor: "pointer" }} onClick={() => handleDeleteOccasion(occ.id)}>
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                          No occasions found. Click "+ Add Occasion" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. MEDIA LIBRARY TAB */}
          {activeTab === "media" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Upload Panel */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Upload Media Files</h2>
                </div>
                <div style={{
                  border: "2px dashed var(--glass-border, rgba(212,160,23,0.18))",
                  borderRadius: "8px",
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  background: "rgba(212, 160, 23, 0.01)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.85rem",
                  transition: "all 0.2s ease"
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold, #d4a017)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.95rem", color: "var(--text-primary)", margin: "0 0 0.25rem 0" }}>
                      Upload Files to Library
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
                      Supports images (PNG, JPEG, WebP, GIF), videos (MP4, WebM) and PDFs up to 100MB.
                    </p>
                  </div>
                  <label style={{
                    padding: "0.6rem 1.8rem",
                    background: "var(--accent-saffron, #e66a00)",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: mediaUploading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem"
                  }}>
                    {mediaUploading ? (
                      <>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                        Uploading Asset...
                      </>
                    ) : (
                      "Select File to Upload"
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={handleUploadMedia}
                      disabled={mediaUploading}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Media Listing & Library Panel */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h2>Media Library Files</h2>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
                      Copy URLs to populate other site settings images or videos.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", width: "100%", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
                      <input
                        type="text"
                        className="dashboard-input"
                        placeholder="Search by file name..."
                        value={mediaSearchQuery}
                        onChange={e => setMediaSearchQuery(e.target.value)}
                        style={{ paddingLeft: "2rem", fontSize: "0.8rem", paddingTop: "0.45rem", paddingBottom: "0.45rem" }}
                      />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)" }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>

                    <div style={{ display: "flex", gap: "2px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", padding: "2px" }}>
                      {(["all", "image", "video", "pdf"] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setMediaFilterType(type)}
                          style={{
                            background: mediaFilterType === type ? "rgba(212,160,23,0.12)" : "transparent",
                            border: "none",
                            borderRadius: "3px",
                            padding: "0.3rem 0.8rem",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: mediaFilterType === type ? "var(--accent-gold)" : "var(--text-secondary)",
                            textTransform: "capitalize",
                            cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                        >
                          {type === "all" ? "All Files" : type + "s"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="dashboard-table-wrapper">
                  {mediaLoading ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(212,160,23,0.15)", borderTopColor: "var(--accent-gold)", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem auto" }} />
                      Loading Media Library files…
                    </div>
                  ) : filteredMediaItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "0.5rem" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
                      </svg>
                      {mediaItems.length === 0
                        ? "No media files uploaded yet. Select files above to start!"
                        : "No files matched your search filters."}
                    </div>
                  ) : (
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>Date Uploaded</th>
                          <th>File Type</th>
                          <th>File Size</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMediaItems.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.name}>
                              {item.name}
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                              {new Date(item.created_at).toLocaleString()}
                            </td>
                            <td style={{ width: "120px" }}>
                              <span style={{
                                textTransform: "uppercase",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                border: item.file_type === "image"
                                  ? "1px solid rgba(46, 204, 113, 0.25)"
                                  : item.file_type === "video"
                                  ? "1px solid rgba(52, 152, 219, 0.25)"
                                  : "1px solid rgba(155, 89, 182, 0.25)",
                                background: item.file_type === "image"
                                  ? "rgba(46, 204, 113, 0.08)"
                                  : item.file_type === "video"
                                  ? "rgba(52, 152, 219, 0.08)"
                                  : "rgba(155, 89, 182, 0.08)",
                                color: item.file_type === "image"
                                  ? "#2ecc71"
                                  : item.file_type === "video"
                                  ? "#3498db"
                                  : "#9b59b6"
                              }}>
                                {item.file_type === "video" && item.duration
                                  ? `video (${item.duration})`
                                  : item.file_type}
                              </span>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                              {formatBytes(item.file_size)}
                            </td>
                            <td style={{ width: "220px" }}>
                              <div className="action-links">
                                <span
                                  className="action-link edit"
                                  onClick={() => setPreviewMediaItem(item)}
                                  style={{ marginRight: "0.8rem", cursor: "pointer" }}
                                >
                                  View
                                </span>
                                <span
                                  className="action-link edit"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.file_url);
                                    showToast("Public URL copied!", "success");
                                  }}
                                  style={{ marginRight: "0.8rem", cursor: "pointer", color: "var(--accent-gold)" }}
                                >
                                  Copy URL
                                </span>
                                <span
                                  className="action-link delete"
                                  onClick={() => handleDeleteMedia(item.id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  Delete
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 10. ADMIN MANAGEMENT TAB */}
          {activeTab === "admins" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Create New Admin Form */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Create New Admin Account</h2>
                </div>
                {adminFormError && (
                  <div style={{
                    background: "rgba(231,76,60,0.08)",
                    border: "1px solid rgba(231,76,60,0.25)",
                    borderRadius: "6px",
                    padding: "0.8rem 1.2rem",
                    marginBottom: "1.2rem",
                    fontSize: "0.85rem",
                    color: "#e74c3c"
                  }}>
                    {adminFormError}
                  </div>
                )}
                <form onSubmit={handleCreateAdmin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="dashboard-form-grid two-col">
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Full Name</label>
                      <input
                        type="text"
                        className="dashboard-input"
                        placeholder="e.g. Mahakal Devotee"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        disabled={adminFormSubmitting}
                        required
                      />
                    </div>
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Email Address</label>
                      <input
                        type="email"
                        className="dashboard-input"
                        placeholder="e.g. name@bhasmaarti.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        disabled={adminFormSubmitting}
                        required
                      />
                    </div>
                  </div>
                  <div className="dashboard-form-grid two-col">
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          className="dashboard-input"
                          placeholder="At least 6 characters"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          disabled={adminFormSubmitting}
                          required
                          style={{ paddingRight: "2.5rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          style={{
                            position: "absolute",
                            right: "0.8rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {showAdminPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="dashboard-form-group">
                      <label className="dashboard-label">System Role</label>
                      <select
                        className="dashboard-select"
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value)}
                        disabled={adminFormSubmitting}
                      >
                        <option value="administrator">Administrator (Full Access)</option>
                        <option value="moderator">Moderator (Limited Access)</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="dashboard-save-btn" disabled={adminFormSubmitting} style={{ alignSelf: "flex-start" }}>
                    {adminFormSubmitting ? "Creating Admin Account..." : "Create Admin"}
                  </button>
                </form>
              </div>

              {/* Admins Table */}
              <div className="dashboard-content-box">
                <div className="dashboard-content-header">
                  <h2>Active Admin Accounts</h2>
                  <button className="dashboard-add-btn" onClick={fetchAdmins} disabled={adminsLoading}>
                    {adminsLoading ? "Refreshing..." : "Refresh List"}
                  </button>
                </div>

                <div className="dashboard-table-wrapper">
                  {adminsLoading && admins.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(212,160,23,0.15)", borderTopColor: "var(--accent-gold)", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem auto" }} />
                      Loading admin accounts…
                    </div>
                  ) : (
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Admin Name</th>
                          <th>Email Address</th>
                          <th>System Role</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Date Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => {
                          const isSelf = currentAdmin && admin.id === currentAdmin.id;
                          return (
                            <tr key={admin.id}>
                              <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                {admin.name} {isSelf && <span style={{ color: "var(--accent-gold)", fontSize: "0.75rem", marginLeft: "0.25rem", fontStyle: "italic" }}>(You)</span>}
                              </td>
                              <td style={{ color: "var(--text-secondary)" }}>{admin.email}</td>
                              <td style={{ textTransform: "capitalize", fontSize: "0.82rem" }}>{admin.role}</td>
                              <td>
                                {admin.email === "admin@bhasmaarti.com" ? (
                                  <span
                                    style={{
                                      background: "rgba(46, 204, 113, 0.08)",
                                      border: "1px solid rgba(46, 204, 113, 0.2)",
                                      color: "#2ecc71",
                                      padding: "0.2rem 0.5rem",
                                      borderRadius: "4px",
                                      fontSize: "0.72rem",
                                      fontWeight: 600,
                                      letterSpacing: "0.02em"
                                    }}
                                  >
                                    Active (Protected)
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleAdmin(admin.id, admin.name)}
                                    disabled={isSelf}
                                    style={{
                                      background: admin.is_active ? "rgba(46, 204, 113, 0.12)" : "rgba(231, 76, 60, 0.12)",
                                      border: admin.is_active ? "1px solid rgba(46, 204, 113, 0.3)" : "1px solid rgba(231, 76, 60, 0.3)",
                                      color: admin.is_active ? "#2ecc71" : "#e74c3c",
                                      padding: "0.2rem 0.5rem",
                                      borderRadius: "4px",
                                      fontSize: "0.72rem",
                                      cursor: isSelf ? "not-allowed" : "pointer",
                                      opacity: isSelf ? 0.75 : 1
                                    }}
                                  >
                                    {admin.is_active ? "Active" : "Inactive"}
                                  </button>
                                )}
                              </td>
                              <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}
                              </td>
                              <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                {new Date(admin.created_at).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="action-links">
                                  {admin.email === "admin@bhasmaarti.com" ? (
                                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", opacity: 0.5, fontStyle: "italic" }}>
                                      System Protected
                                    </span>
                                  ) : isSelf ? (
                                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", opacity: 0.5, cursor: "not-allowed" }}>
                                      No actions
                                    </span>
                                  ) : (
                                    <span className="action-link delete" onClick={() => handleDeleteAdmin(admin.id, admin.name)}>
                                      Delete
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MEDIA PREVIEW MODAL ── */}
      {previewMediaItem && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 4, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div style={{
            background: "var(--bg-secondary, #151108)",
            border: "1px solid var(--glass-border, rgba(212,160,23,0.15))",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "750px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1.1rem 1.5rem",
              borderBottom: "1px solid rgba(212,160,23,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(212,160,23,0.02)"
            }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.05rem", color: "var(--accent-gold)", margin: 0 }}>
                  File Preview
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                  {previewMediaItem.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewMediaItem(null)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(231,76,60,0.15)"; e.currentTarget.style.borderColor = "rgba(231,76,60,0.3)"; e.currentTarget.style.color = "#e74c3c"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              >
                ✕
              </button>
            </div>

            {/* Modal Preview Area */}
            <div style={{
              flex: 1,
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.3)",
              overflowY: "auto",
              minHeight: "350px",
              maxHeight: "550px"
            }}>
              {previewMediaItem.file_type === "image" && (
                <img
                  src={previewMediaItem.file_url}
                  alt={previewMediaItem.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "450px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    border: "1px solid rgba(212,160,23,0.15)"
                  }}
                />
              )}
              {previewMediaItem.file_type === "video" && (
                <video
                  src={previewMediaItem.file_url}
                  controls
                  autoPlay
                  style={{
                    maxWidth: "100%",
                    maxHeight: "450px",
                    borderRadius: "6px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                  }}
                />
              )}
              {previewMediaItem.file_type === "pdf" && (
                <iframe
                  src={`${previewMediaItem.file_url}#toolbar=0`}
                  title={previewMediaItem.name}
                  style={{
                    width: "100%",
                    height: "450px",
                    border: "none",
                    borderRadius: "6px"
                  }}
                />
              )}
            </div>

            {/* Modal Footer Info */}
            <div style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid rgba(212,160,23,0.1)",
              background: "rgba(212,160,23,0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                Size: <strong>{formatBytes(previewMediaItem.file_size)}</strong>{previewMediaItem.file_type === "video" && previewMediaItem.duration && (
                  <> • Duration: <strong>{previewMediaItem.duration}</strong></>
                )} • Uploaded: <strong>{new Date(previewMediaItem.created_at).toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewMediaItem.file_url);
                    showToast("Public URL copied to clipboard!", "success");
                  }}
                  style={{
                    padding: "0.45rem 1rem",
                    background: "var(--accent-saffron, #e66a00)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                >
                  Copy URL Link
                </button>
                <a
                  href={previewMediaItem.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "0.45rem 1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AARTI UPLOAD/EDIT MODAL ── */}
      {showAartiModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 4, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div style={{
            background: "var(--bg-secondary, #151108)",
            border: "1px solid var(--glass-border, rgba(212,160,23,0.15))",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1.1rem 1.5rem",
              borderBottom: "1px solid rgba(212,160,23,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(212,160,23,0.02)"
            }}>
              <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.1rem", color: "var(--accent-gold)", margin: 0 }}>
                {editingAartiId ? "Edit Aarti Recording" : "Upload Aarti Recording"}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAartiModal(false); resetAartiForm(); }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveAarti} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "1.5rem", overflowY: "auto" }}>
              <div className="dashboard-form-group">
                <label className="dashboard-label">Aarti Name (Title) *</label>
                <input
                  type="text"
                  className="dashboard-input"
                  placeholder="e.g. Bhasma Aarti — Monday Special"
                  value={aartiTitle}
                  onChange={(e) => setAartiTitle(e.target.value)}
                  disabled={aartiSubmitting}
                  required
                />
              </div>

              <div className="dashboard-form-grid two-col">
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Category *</label>
                  <select
                    className="dashboard-select"
                    value={aartiCategory}
                    onChange={(e) => setAartiCategory(e.target.value as AartiCategory)}
                    disabled={aartiSubmitting}
                    required
                  >
                    {Object.values(AartiCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label className="dashboard-label">Status *</label>
                  <select
                    className="dashboard-select"
                    value={aartiStatus}
                    onChange={(e) => setAartiStatus(e.target.value as "Published" | "Draft")}
                    disabled={aartiSubmitting}
                    required
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Video File {editingAartiId ? "(Optional - select to replace)" : "*"}</label>
                <input
                  type="file"
                  accept="video/mp4,video/mkv,video/avi,video/quicktime"
                  onChange={handleVideoChange}
                  disabled={aartiSubmitting}
                  required={!editingAartiId}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(212,160,23,0.25)",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    width: "100%"
                  }}
                />
                {aartiDuration && (
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "0.25rem", display: "inline-block", marginRight: "1rem" }}>
                    Detected Duration: {aartiDuration}
                  </span>
                )}
                {editingAartiId && currentVideoUrl && (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(212, 160, 23, 0.04)",
                    border: "1px solid rgba(212, 160, 23, 0.15)",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem"
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Current Uploaded Video File:</span>
                    <a href={currentVideoUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent-gold)", textDecoration: "underline", fontWeight: 500, wordBreak: "break-all" }}>
                      {currentVideoUrl.split("/uploads/")[1] || currentVideoUrl}
                    </a>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)", wordBreak: "break-all" }}>URL: {currentVideoUrl}</span>
                  </div>
                )}
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Cover Thumbnail Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAartiThumbFile(e.target.files?.[0] || null)}
                  disabled={aartiSubmitting}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(212,160,23,0.25)",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    width: "100%"
                  }}
                />
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "inline-block", marginRight: "1rem" }}>
                  If left empty, a beautiful category-specific temple fallback cover will be assigned automatically.
                </span>
                {editingAartiId && currentThumbUrl && (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(212, 160, 23, 0.04)",
                    border: "1px solid rgba(212, 160, 23, 0.15)",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem"
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Current Cover Image:</span>
                    <a href={currentThumbUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent-gold)", textDecoration: "underline", fontWeight: 500, wordBreak: "break-all" }}>
                      {currentThumbUrl.startsWith("/") ? currentThumbUrl : (currentThumbUrl.split("/uploads/")[1] || currentThumbUrl)}
                    </a>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)", wordBreak: "break-all" }}>URL: {currentThumbUrl}</span>
                  </div>
                )}
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Upload/Recording Date (Optional)</label>
                <input
                  type="date"
                  className="dashboard-input"
                  value={aartiDate}
                  onChange={(e) => setAartiDate(e.target.value)}
                  disabled={aartiSubmitting}
                />
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "inline-block" }}>
                  Select a date if you want to override the default system upload date/time.
                </span>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Duration Override (e.g. MM:SS or H:MM:SS)</label>
                <input
                  type="text"
                  className="dashboard-input"
                  placeholder="e.g. 45:10"
                  value={aartiDuration}
                  onChange={(e) => setAartiDuration(e.target.value)}
                  disabled={aartiSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => { setShowAartiModal(false); resetAartiForm(); }}
                  className="dashboard-logout-btn"
                  disabled={aartiSubmitting}
                  style={{
                    padding: "0.7rem 1.5rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    margin: 0,
                    fontSize: "0.85rem",
                    height: "auto",
                    width: "auto"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dashboard-save-btn"
                  disabled={aartiSubmitting}
                  style={{
                    padding: "0.7rem 1.8rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    margin: 0,
                    width: "auto"
                  }}
                >
                  {aartiSubmitting ? "Uploading..." : editingAartiId ? "Save Changes" : "Upload Recording"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AARTI PREVIEW MODAL ── */}
      {previewAarti && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 4, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div style={{
            background: "var(--bg-secondary, #151108)",
            border: "1px solid var(--glass-border, rgba(212,160,23,0.15))",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "750px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1.1rem 1.5rem",
              borderBottom: "1px solid rgba(212,160,23,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(212,160,23,0.02)"
            }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.05rem", color: "var(--accent-gold)", margin: 0 }}>
                  Aarti Video Preview
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                  {previewAarti.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewAarti(null)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Video Player */}
            <div style={{ width: "100%", background: "#000", borderTop: "1px solid rgba(212,160,23,0.1)", borderBottom: "1px solid rgba(212,160,23,0.1)" }}>
              <video
                src={previewAarti.video_url}
                controls
                autoPlay
                style={{ width: "100%", maxHeight: "50vh", display: "block" }}
              />
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(212,160,23,0.02)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)"
            }}>
              <div>
                Category: <strong>{previewAarti.category}</strong> • Duration: <strong>{previewAarti.duration}</strong>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewAarti.video_url);
                  showToast("Video URL copied!", "success");
                }}
                className="dashboard-save-btn"
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  margin: 0,
                  width: "auto"
                }}
              >
                Copy Video URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEVOTIONAL LIBRARY MODAL ── */}
      {showLibraryModal && (
        <div className="dashboard-modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 8, 4, 0.85)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "var(--bg-secondary, #151108)", border: "1px solid var(--glass-border, rgba(212,160,23,0.15))", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(212,160,23,0.02)" }}>
              <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.05rem", color: "var(--accent-gold)", margin: 0 }}>
                {editingLibraryId ? "Edit Library Resource" : "Add Library Resource"}
              </h3>
              <button onClick={() => { setShowLibraryModal(false); resetLibraryForm(); }} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <form onSubmit={handleSaveLibrary} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="dashboard-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Resource Title *</label>
                  <input type="text" className="dashboard-input" required value={libraryTitle} onChange={(e) => setLibraryTitle(e.target.value)} disabled={librarySubmitting} />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Category *</label>
                  <select className="dashboard-input" value={libraryCategory} onChange={(e) => setLibraryCategory(e.target.value)} disabled={librarySubmitting}>
                    <option value="Stotrams">Stotrams</option>
                    <option value="Mantras">Mantras</option>
                    <option value="Chalisa & Hymns">Chalisa & Hymns</option>
                    <option value="Bhajans">Bhajans</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Short Description</label>
                <input type="text" className="dashboard-input" value={libraryDescription} onChange={(e) => setLibraryDescription(e.target.value)} disabled={librarySubmitting} />
              </div>

              <div className="dashboard-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Audio File {editingLibraryId ? "(Optional)" : "*"}</label>
                  <input type="file" accept="audio/*" onChange={handleLibraryAudioChange} required={!editingLibraryId} disabled={librarySubmitting} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Thumbnail Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setLibraryThumbFile(e.target.files?.[0] || null)} disabled={librarySubmitting} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />
                </div>
              </div>

              <div className="dashboard-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Duration Override</label>
                  <input type="text" className="dashboard-input" placeholder="e.g. 09:45" value={libraryDuration} onChange={(e) => setLibraryDuration(e.target.value)} disabled={librarySubmitting} />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Creation Date (Optional)</label>
                  <input type="date" className="dashboard-input" value={libraryDate} onChange={(e) => setLibraryDate(e.target.value)} disabled={librarySubmitting} />
                </div>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Sanskrit Lyrics</label>
                <textarea className="dashboard-input" rows={3} style={{ resize: "vertical", fontFamily: "inherit" }} value={libraryLyrics} onChange={(e) => setLibraryLyrics(e.target.value)} disabled={librarySubmitting} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">English Translation</label>
                <textarea className="dashboard-input" rows={3} style={{ resize: "vertical", fontFamily: "inherit" }} value={libraryTranslation} onChange={(e) => setLibraryTranslation(e.target.value)} disabled={librarySubmitting} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Status</label>
                <select className="dashboard-input" value={libraryStatus} onChange={(e) => setLibraryStatus(e.target.value as any)} disabled={librarySubmitting}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => { setShowLibraryModal(false); resetLibraryForm(); }} className="dashboard-logout-btn" disabled={librarySubmitting} style={{ padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", margin: 0, fontSize: "0.85rem", height: "auto", width: "auto" }}>Cancel</button>
                <button type="submit" className="dashboard-save-btn" disabled={librarySubmitting} style={{ padding: "0.6rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", margin: 0, width: "auto" }}>
                  {librarySubmitting ? "Saving..." : editingLibraryId ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SACRED CALENDAR MODAL ── */}
      {showCalendarModal && (
        <div className="dashboard-modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 8, 4, 0.85)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "var(--bg-secondary, #151108)", border: "1px solid var(--glass-border, rgba(212,160,23,0.15))", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(212,160,23,0.02)" }}>
              <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.05rem", color: "var(--accent-gold)", margin: 0 }}>
                {editingCalendarId ? "Edit Calendar Occasion" : "Add Calendar Occasion"}
              </h3>
              <button onClick={() => { setShowCalendarModal(false); resetCalendarForm(); }} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <form onSubmit={handleSaveCalendar} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="dashboard-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Occasion Title *</label>
                  <input type="text" className="dashboard-input" required value={calendarTitle} onChange={(e) => setCalendarTitle(e.target.value)} disabled={calendarSubmitting} />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Date String * (e.g. 15 February 2026)</label>
                  <input type="text" className="dashboard-input" placeholder="e.g. 15 February 2026" required value={calendarDateStr} onChange={(e) => setCalendarDateStr(e.target.value)} disabled={calendarSubmitting} />
                </div>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Occasion Image {editingCalendarId ? "(Optional)" : "*"}</label>
                <input type="file" accept="image/*" onChange={(e) => setCalendarImageFile(e.target.files?.[0] || null)} required={!editingCalendarId} disabled={calendarSubmitting} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Short Description *</label>
                <textarea className="dashboard-input" rows={2} required value={calendarDescription} onChange={(e) => setCalendarDescription(e.target.value)} disabled={calendarSubmitting} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">More Details / Shringar Info</label>
                <textarea className="dashboard-input" rows={4} value={calendarMoreInfo} onChange={(e) => setCalendarMoreInfo(e.target.value)} disabled={calendarSubmitting} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Status</label>
                <select className="dashboard-input" value={calendarStatus} onChange={(e) => setCalendarStatus(e.target.value as any)} disabled={calendarSubmitting}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => { setShowCalendarModal(false); resetCalendarForm(); }} className="dashboard-logout-btn" disabled={calendarSubmitting} style={{ padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", margin: 0, fontSize: "0.85rem", height: "auto", width: "auto" }}>Cancel</button>
                <button type="submit" className="dashboard-save-btn" disabled={calendarSubmitting} style={{ padding: "0.6rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", margin: 0, width: "auto" }}>
                  {calendarSubmitting ? "Saving..." : editingCalendarId ? "Save Changes" : "Create Occasion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SACRED MOMENTS (GALLERY) MODAL ── */}
      {showGalleryModal && (
        <div className="dashboard-modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 8, 4, 0.85)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "var(--bg-secondary, #151108)", border: "1px solid var(--glass-border, rgba(212,160,23,0.15))", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(212,160,23,0.02)" }}>
              <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1.05rem", color: "var(--accent-gold)", margin: 0 }}>
                {editingGalleryId ? "Edit Gallery Moment" : "Add Gallery Moment"}
              </h3>
              <button onClick={() => { setShowGalleryModal(false); resetGalleryForm(); }} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <form onSubmit={handleSaveGallery} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="dashboard-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Moment Title *</label>
                  <input type="text" className="dashboard-input" required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} disabled={gallerySubmitting} />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Date String * (e.g. 15 June 2026)</label>
                  <input type="text" className="dashboard-input" placeholder="e.g. 15 June 2026" required value={galleryDateStr} onChange={(e) => setGalleryDateStr(e.target.value)} disabled={gallerySubmitting} />
                </div>
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Moment Image {editingGalleryId ? "(Optional)" : "*"}</label>
                <input type="file" accept="image/*" onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} required={!editingGalleryId} disabled={gallerySubmitting} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Description *</label>
                <textarea className="dashboard-input" rows={4} required value={galleryDescription} onChange={(e) => setGalleryDescription(e.target.value)} disabled={gallerySubmitting} />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-label">Status</label>
                <select className="dashboard-input" value={galleryStatus} onChange={(e) => setGalleryStatus(e.target.value as any)} disabled={gallerySubmitting}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => { setShowGalleryModal(false); resetGalleryForm(); }} className="dashboard-logout-btn" disabled={gallerySubmitting} style={{ padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", margin: 0, fontSize: "0.85rem", height: "auto", width: "auto" }}>Cancel</button>
                <button type="submit" className="dashboard-save-btn" disabled={gallerySubmitting} style={{ padding: "0.6rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", margin: 0, width: "auto" }}>
                  {gallerySubmitting ? "Saving..." : editingGalleryId ? "Save Changes" : "Create Moment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
}

