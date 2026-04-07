"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GalleryItem {
  caption: string;
  image: string | null;
}

interface ContentData {
  message: { quote: string; author: string };
  gallery: GalleryItem[];
  galleryQuotes: string[];
}

interface Horse {
  name: string;
  year: string;
  image: string | null;
  actionImage: string | null;
}

interface Stat {
  value: number;
  label: string;
}

interface Partner {
  name: string;
  logo: string | null;
}

interface GalleryPhoto {
  image: string;
  caption: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function authHeaders(password: string) {
  return { Authorization: `Bearer ${password}` };
}

async function uploadFile(file: File, password: string): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: authHeaders(password),
    body: form,
  });
  if (!res.ok) return null;
  const { url } = await res.json();
  return url;
}

/* ------------------------------------------------------------------ */
/*  Small reusable components                                          */
/* ------------------------------------------------------------------ */

function ImageUpload({
  current,
  onUpload,
  label,
}: {
  current: string | null;
  onUpload: (file: File) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      {current ? (
        <img
          src={current}
          alt=""
          className="w-16 h-16 object-cover rounded border border-white/10"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-800 rounded border border-white/10 flex items-center justify-center text-gray-500 text-xs">
          none
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 transition"
      >
        {label || "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Section({
  title,
  children,
  onSave,
  saving,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium tracking-wider uppercase text-accent-light">
          {title}
        </h2>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-accent/20 border border-accent/30 rounded hover:bg-accent/30 transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin page                                                         */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");

  // Data states
  const [content, setContent] = useState<ContentData | null>(null);
  const [horses, setHorses] = useState<Horse[] | null>(null);
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [gallery, setGallery] = useState<GalleryPhoto[] | null>(null);

  /* ---------- Auth ---------- */

  const handleLogin = async () => {
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setAuthError("Wrong password");
    }
  };

  /* ---------- Load data ---------- */

  const loadAll = useCallback(async () => {
    const [c, h, s, p, g] = await Promise.all([
      fetch("/api/content").then((r) => r.json()),
      fetch("/api/horses").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/partners").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
    ]);
    setContent(c);
    setHorses(h);
    setStats(s);
    setPartners(p);
    setGallery(g);
  }, []);

  useEffect(() => {
    if (authed) loadAll();
  }, [authed, loadAll]);

  /* ---------- Save helpers ---------- */

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const save = async (key: string, endpoint: string, data: unknown) => {
    setSaving((p) => ({ ...p, [key]: true }));
    const res = await fetch(`/api/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(password),
      },
      body: JSON.stringify(data),
    });
    setSaving((p) => ({ ...p, [key]: false }));
    if (res.ok) showToast(`${key} saved!`);
    else showToast(`Error saving ${key}`);
  };

  /* ---------- File upload wrapper ---------- */

  const handleUpload = async (
    file: File,
    callback: (url: string) => void
  ) => {
    const url = await uploadFile(file, password);
    if (url) callback(url);
    else showToast("Upload failed");
  };

  /* ---------- Login screen ---------- */

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="metallic text-3xl font-light tracking-[0.3em] uppercase mb-2">
              Admin
            </h1>
            <p className="text-text-secondary text-sm">Eclipse Dressage Team</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent/50"
              autoFocus
            />
            {authError && (
              <p className="text-red-400 text-sm text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 metallic-bg text-surface text-sm font-medium tracking-wider uppercase rounded hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------- Loading ---------- */

  if (!content || !horses || !stats || !partners || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  /* ---------- Admin dashboard ---------- */

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="metallic text-2xl font-light tracking-[0.3em] uppercase">
          Admin Panel
        </h1>
        <button
          onClick={() => {
            setAuthed(false);
            setPassword("");
          }}
          className="text-sm text-text-secondary hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-[200] bg-accent/20 border border-accent/40 rounded px-4 py-2 text-sm animate-pulse">
          {toast}
        </div>
      )}

      {/* ============== Message / Quote ============== */}
      <Section
        title="Message / Quote"
        saving={!!saving.content}
        onSave={() => save("content", "content", content)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">
              Quote
            </label>
            <textarea
              value={content.message.quote}
              onChange={(e) =>
                setContent({
                  ...content,
                  message: { ...content.message, quote: e.target.value },
                })
              }
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm resize-y focus:outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">
              Author
            </label>
            <input
              value={content.message.author}
              onChange={(e) =>
                setContent({
                  ...content,
                  message: { ...content.message, author: e.target.value },
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
      </Section>

      {/* ============== Gallery ============== */}
      <Section
        title="Photo Gallery"
        saving={!!saving.content}
        onSave={() => save("content", "content", content)}
      >
        <div className="space-y-4">
          {content.gallery.map((item, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-4 p-3 bg-white/[0.02] rounded border border-white/5"
            >
              <span className="text-xs text-accent w-6">{i + 1}</span>
              <ImageUpload
                current={item.image}
                label="Photo"
                onUpload={(file) =>
                  handleUpload(file, (url) => {
                    const g = [...content.gallery];
                    g[i] = { ...g[i], image: url };
                    setContent({ ...content, gallery: g });
                  })
                }
              />
              <input
                value={item.caption}
                onChange={(e) => {
                  const g = [...content.gallery];
                  g[i] = { ...g[i], caption: e.target.value };
                  setContent({ ...content, gallery: g });
                }}
                placeholder="Caption"
                className="flex-1 min-w-[150px] bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => {
                  const g = content.gallery.filter((_, j) => j !== i);
                  setContent({ ...content, gallery: g });
                }}
                className="text-red-400/60 hover:text-red-400 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setContent({
                ...content,
                gallery: [...content.gallery, { caption: "City, Year", image: null }],
              })
            }
            className="text-sm text-accent/60 hover:text-accent transition"
          >
            + Add photo
          </button>
        </div>

        {/* Gallery quotes */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs text-text-secondary uppercase tracking-wider">
            Gallery Quotes
          </h3>
          {content.galleryQuotes.map((q, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={q}
                onChange={(e) => {
                  const gq = [...content.galleryQuotes];
                  gq[i] = e.target.value;
                  setContent({ ...content, galleryQuotes: gq });
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => {
                  const gq = content.galleryQuotes.filter((_, j) => j !== i);
                  setContent({ ...content, galleryQuotes: gq });
                }}
                className="text-red-400/60 hover:text-red-400 text-xs px-2"
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setContent({
                ...content,
                galleryQuotes: [...content.galleryQuotes, "New quote..."],
              })
            }
            className="text-sm text-accent/60 hover:text-accent transition"
          >
            + Add quote
          </button>
        </div>
      </Section>

      {/* ============== Gallery Page ============== */}
      <Section
        title="Gallery Page Photos"
        saving={!!saving.gallery}
        onSave={() => save("gallery", "gallery", gallery)}
      >
        <p className="text-text-secondary/60 text-xs mb-4">
          Photos displayed on the /gallery page. Upload images and add captions.
        </p>
        <div className="space-y-4">
          {gallery.map((photo, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-4 p-3 bg-white/[0.02] rounded border border-white/5"
            >
              <span className="text-xs text-accent w-6">{i + 1}</span>
              <ImageUpload
                current={photo.image}
                label="Photo"
                onUpload={(file) =>
                  handleUpload(file, (url) => {
                    const g = [...gallery];
                    g[i] = { ...g[i], image: url };
                    setGallery(g);
                  })
                }
              />
              <input
                value={photo.caption}
                onChange={(e) => {
                  const g = [...gallery];
                  g[i] = { ...g[i], caption: e.target.value };
                  setGallery(g);
                }}
                placeholder="Caption (e.g. Kyiv, 2025)"
                className="flex-1 min-w-[150px] bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                className="text-red-400/60 hover:text-red-400 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setGallery([...gallery, { image: "", caption: "" }])
            }
            className="text-sm text-accent/60 hover:text-accent transition"
          >
            + Add photo
          </button>
        </div>
      </Section>

      {/* ============== Horses ============== */}
      <Section
        title="Horses Hall of Fame"
        saving={!!saving.horses}
        onSave={() => save("horses", "horses", horses)}
      >
        <div className="space-y-4">
          {horses.map((horse, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-4 p-3 bg-white/[0.02] rounded border border-white/5"
            >
              <span className="text-xs text-accent w-6">{i + 1}</span>
              <input
                value={horse.name}
                onChange={(e) => {
                  const h = [...horses];
                  h[i] = { ...h[i], name: e.target.value };
                  setHorses(h);
                }}
                placeholder="Name"
                className="w-40 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <input
                value={horse.year}
                onChange={(e) => {
                  const h = [...horses];
                  h[i] = { ...h[i], year: e.target.value };
                  setHorses(h);
                }}
                placeholder="Year"
                className="w-20 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <ImageUpload
                current={horse.image}
                label="Photo"
                onUpload={(file) =>
                  handleUpload(file, (url) => {
                    const h = [...horses];
                    h[i] = { ...h[i], image: url };
                    setHorses(h);
                  })
                }
              />
              <ImageUpload
                current={horse.actionImage}
                label="Hover"
                onUpload={(file) =>
                  handleUpload(file, (url) => {
                    const h = [...horses];
                    h[i] = { ...h[i], actionImage: url };
                    setHorses(h);
                  })
                }
              />
              <button
                onClick={() => setHorses(horses.filter((_, j) => j !== i))}
                className="text-red-400/60 hover:text-red-400 text-xs ml-auto"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setHorses([
                ...horses,
                { name: "New Horse", year: "2025", image: null, actionImage: null },
              ])
            }
            className="text-sm text-accent/60 hover:text-accent transition"
          >
            + Add horse
          </button>
        </div>
      </Section>

      {/* ============== Stats ============== */}
      <Section
        title="Statistics"
        saving={!!saving.stats}
        onSave={() => save("stats", "stats", stats)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white/[0.02] rounded border border-white/5"
            >
              <input
                type="number"
                value={stat.value}
                onChange={(e) => {
                  const s = [...stats];
                  s[i] = { ...s[i], value: parseInt(e.target.value) || 0 };
                  setStats(s);
                }}
                className="w-24 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <input
                value={stat.label}
                onChange={(e) => {
                  const s = [...stats];
                  s[i] = { ...s[i], label: e.target.value };
                  setStats(s);
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => setStats(stats.filter((_, j) => j !== i))}
                className="text-red-400/60 hover:text-red-400 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setStats([...stats, { value: 0, label: "New Stat" }])
          }
          className="text-sm text-accent/60 hover:text-accent transition mt-2"
        >
          + Add stat
        </button>
      </Section>

      {/* ============== Partners ============== */}
      <Section
        title="Partners & Sponsors"
        saving={!!saving.partners}
        onSave={() => save("partners", "partners", partners)}
      >
        <div className="space-y-3">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-white/[0.02] rounded border border-white/5"
            >
              <span className="text-xs text-accent w-6">{i + 1}</span>
              <ImageUpload
                current={partner.logo}
                label="Logo"
                onUpload={(file) =>
                  handleUpload(file, (url) => {
                    const p = [...partners];
                    p[i] = { ...p[i], logo: url };
                    setPartners(p);
                  })
                }
              />
              <input
                value={partner.name}
                onChange={(e) => {
                  const p = [...partners];
                  p[i] = { ...p[i], name: e.target.value };
                  setPartners(p);
                }}
                placeholder="Partner name"
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => setPartners(partners.filter((_, j) => j !== i))}
                className="text-red-400/60 hover:text-red-400 text-xs"
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setPartners([...partners, { name: "New Partner", logo: null }])
            }
            className="text-sm text-accent/60 hover:text-accent transition"
          >
            + Add partner
          </button>
        </div>
      </Section>
    </div>
  );
}
