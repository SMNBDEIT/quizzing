import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════
//  STORAGE  (shared across all users via window.storage)
// ══════════════════════════════════════════════════════════
const DB = {
  async get(k) {
    try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async put(k, v) {
    try { await window.storage.set(k, JSON.stringify(v), true); return true; }
    catch { return false; }
  },
};
const UKEY = "qzng_users_v1";
const QKEY = "qzng_quizzes_v1";

// ══════════════════════════════════════════════════════════
//  THEME TOKENS
// ══════════════════════════════════════════════════════════
const T = {
  bg:        "#09090b",
  surface:   "#111113",
  surfaceEl: "#1c1c20",
  border:    "#27272a",
  borderHi:  "#3f3f46",
  lime:      "#d4f74a",
  limeD:     "#9abe20",
  coral:     "#ff6b4a",
  violet:    "#a78bfa",
  orange:    "#fb923c",
  emerald:   "#4ade80",
  text:      "#f4f4f5",
  muted:     "#71717a",
  muted2:    "#3f3f46",
};

const ANS = [
  { num: "01", color: T.lime,    dark: "#09090b" },
  { num: "02", color: T.violet,  dark: "#fff"    },
  { num: "03", color: T.orange,  dark: "#fff"    },
  { num: "04", color: "#f472b6", dark: "#fff"    },
];

const Q_SECS = 20;

// ══════════════════════════════════════════════════════════
//  GLOBAL CSS
// ══════════════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; }
  button, input, textarea, select { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pop      { from { opacity:0; transform:scale(.93);        } to { opacity:1; transform:scale(1);      } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0);  } }
  @keyframes spin     { to   { transform: rotate(360deg); } }
  @keyframes glow     { 0%,100% { box-shadow:0 0 0 0 ${T.lime}44; } 50% { box-shadow:0 0 20px 4px ${T.lime}22; } }

  .fade-up  { animation: fadeUp  .38s cubic-bezier(.16,1,.3,1) both; }
  .pop      { animation: pop     .28s cubic-bezier(.16,1,.3,1) both; }

  /* ── Inputs ── */
  .field {
    width:100%; background:${T.surfaceEl}; border:1px solid ${T.border};
    border-radius:10px; padding:11px 14px; color:${T.text}; font-size:14px;
    transition:border-color .15s;
  }
  .field:focus   { outline:none; border-color:${T.lime}55; }
  .field::placeholder { color:${T.muted2}; }

  /* ── Buttons ── */
  .btn-primary {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    background:${T.lime}; color:${T.bg}; border:none;
    padding:11px 22px; border-radius:10px; font-size:14px; font-weight:600;
    cursor:pointer; font-family:'Syne',sans-serif; letter-spacing:-.01em;
    transition:background .14s, transform .12s;
  }
  .btn-primary:hover   { background:${T.limeD}; }
  .btn-primary:active  { transform:scale(.97); }
  .btn-primary:disabled { opacity:.5; cursor:not-allowed; }

  .btn-ghost {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:transparent; color:${T.muted}; border:1px solid ${T.border};
    padding:9px 18px; border-radius:10px; font-size:13px; font-weight:500;
    cursor:pointer; transition:border-color .14s, color .14s, background .14s;
  }
  .btn-ghost:hover { border-color:${T.borderHi}; color:${T.text}; background:${T.surfaceEl}; }

  .btn-nav {
    background:transparent; color:${T.muted}; border:1px solid ${T.border};
    padding:7px 15px; border-radius:8px; font-size:13px; font-weight:500;
    cursor:pointer; transition:border-color .14s, color .14s;
  }
  .btn-nav:hover  { border-color:${T.borderHi}; color:${T.text}; }
  .btn-nav.hi     { background:${T.lime}; border-color:${T.lime}; color:${T.bg}; font-weight:600; }
  .btn-nav.hi:hover { background:${T.limeD}; border-color:${T.limeD}; }

  /* ── Tabs ── */
  .tab-row   { display:flex; background:${T.bg}; border-radius:10px; padding:3px; }
  .tab-item  { flex:1; padding:8px 0; border:none; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; background:transparent; color:${T.muted}; transition:all .15s; font-family:'DM Sans',sans-serif; }
  .tab-item.on { background:${T.surfaceEl}; color:${T.text}; }

  /* ── Cards ── */
  .card {
    background:${T.surface}; border:1px solid ${T.border}; border-radius:16px;
    transition:border-color .18s, transform .18s;
  }
  .card:hover { border-color:${T.borderHi}; }

  /* ── Answer buttons ── */
  .ans {
    display:flex; align-items:stretch; width:100%;
    background:${T.surface}; border:1px solid ${T.border};
    border-radius:13px; overflow:hidden; cursor:pointer; text-align:left;
    transition:border-color .16s, transform .14s, background .16s;
    animation: slideIn .3s cubic-bezier(.16,1,.3,1) both;
  }
  .ans:hover:not([disabled]) { border-color:${T.borderHi}; transform:translateX(3px); }
  .ans:active:not([disabled]) { transform:translateX(1px); }
  .ans[disabled] { cursor:default; }
  .ans.correct   { border-color:${T.emerald}; background:${T.emerald}0d; animation:glow .5s ease; }
  .ans.wrong     { border-color:${T.coral};   background:${T.coral}0d; }
  .ans.dim       { opacity:.3; }

  /* ── Alert ── */
  .alert-err  { background:${T.coral}12; border:1px solid ${T.coral}35; border-radius:9px; padding:9px 13px; font-size:13px; color:${T.coral}; }
  .alert-ok   { background:${T.lime}12;  border:1px solid ${T.lime}35;  border-radius:9px; padding:9px 13px; font-size:13px; color:${T.lime}; }

  /* ── Misc ── */
  .mono { font-family:'Syne',sans-serif; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:2px; }
`;

// ══════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen,    setScreen]    = useState("home");
  const [user,      setUser]      = useState(null);
  const [quizzes,   setQuizzes]   = useState([]);
  const [ready,     setReady]     = useState(false);
  const [activeQ,   setActiveQ]   = useState(null); // quiz being played
  const [editQ,     setEditQ]     = useState(null); // quiz being edited
  const [result,    setResult]    = useState(null); // game result

  useEffect(() => {
    DB.get(QKEY).then(q => { setQuizzes(q || []); setReady(true); });
  }, []);

  const reload  = async () => { const q = await DB.get(QKEY); setQuizzes(q || []); };
  const go      = s  => setScreen(s);
  const logout  = () => { setUser(null); go("home"); };
  const play    = q  => { setActiveQ(q); go("play"); };
  const edit    = q  => { setEditQ(q);   go("create"); };
  const newQuiz = () => { setEditQ(null); go("create"); };
  const finish  = r  => { setResult(r);  go("results"); };

  const ctx = { go, user, setUser, quizzes, reload, play, edit, newQuiz, finish, activeQ, editQ, result, logout };

  if (!ready) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:30, height:30, border:`2px solid ${T.lime}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite", margin:"0 auto 10px" }} />
        <span style={{ color:T.muted, fontSize:13 }}>Loading Quizzing…</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans', sans-serif" }}>
      <style>{CSS}</style>
      {screen === "home"    && <Home      {...ctx} />}
      {screen === "auth"    && <Auth      {...ctx} />}
      {screen === "dash"    && <Dash      {...ctx} />}
      {screen === "create"  && <CreateQ   {...ctx} />}
      {screen === "play"    && <Play      {...ctx} />}
      {screen === "results" && <Results   {...ctx} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════
function Nav({ user, go, logout }) {
  return (
    <header style={{ borderBottom:`1px solid ${T.border}`, padding:"0 20px" }}>
      <div style={{ maxWidth:960, margin:"0 auto", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={() => go("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, background:T.lime, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:T.bg }}>Q</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:T.text, letterSpacing:"-.02em" }}>Quizzing</span>
        </button>
        <div style={{ display:"flex", gap:7 }}>
          {user ? (
            <>
              <button className="btn-nav" onClick={() => go("dash")}>{user.username}</button>
              <button className="btn-nav" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <button className="btn-nav"    onClick={() => go("auth")}>Log in</button>
              <button className="btn-nav hi" onClick={() => go("auth")}>Register</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ══════════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════════
function Home({ go, user, logout, quizzes, play }) {
  return (
    <div>
      <Nav user={user} go={go} logout={logout} />

      {/* Hero */}
      <section style={{ maxWidth:960, margin:"0 auto", padding:"64px 24px 48px" }} className="fade-up">
        {/* dot-grid background decoration */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${T.border} 1px, transparent 1px)`, backgroundSize:"24px 24px", opacity:.5, pointerEvents:"none", borderRadius:16 }} />
        <div style={{ maxWidth:580, position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, border:`1px solid ${T.border}`, borderRadius:100, padding:"4px 12px 4px 8px", marginBottom:22 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:T.lime, boxShadow:`0 0 8px ${T.lime}` }} />
            <span style={{ fontSize:12, color:T.muted, fontWeight:500 }}>{quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} live</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(34px,5.5vw,56px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-.035em", marginBottom:18 }}>
            Challenge your mind.<br />
            <span style={{ color:T.lime }}>Share your knowledge.</span>
          </h1>
          <p style={{ color:T.muted, fontSize:16, lineHeight:1.65, marginBottom:28, maxWidth:440 }}>
            Play community quizzes freely, or register as a{" "}
            <strong style={{ color:T.text, fontWeight:600 }}>Quizzer</strong> to create and publish your own.
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {user
              ? <button className="btn-primary" onClick={() => go("dash")}>Go to Dashboard →</button>
              : <>
                  <button className="btn-primary" onClick={() => go("auth")}>Become a Quizzer →</button>
                  <button className="btn-ghost"   onClick={() => go("auth")}>Log in</button>
                </>
            }
          </div>
        </div>
      </section>

      <div style={{ borderTop:`1px solid ${T.border}`, maxWidth:960, margin:"0 auto" }} />

      {/* Quiz grid */}
      <section style={{ maxWidth:960, margin:"0 auto", padding:"36px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:22 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, letterSpacing:"-.02em" }}>All Quizzes</h2>
          {quizzes.length > 0 && <span style={{ fontSize:13, color:T.muted }}>{quizzes.length} total</span>}
        </div>
        {quizzes.length === 0
          ? <Empty label="No quizzes yet" sub="Register and create the first one!" />
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))", gap:14 }}>
              {quizzes.map((q, i) => <QuizCard key={q.id} quiz={q} idx={i} onPlay={() => play(q)} />)}
            </div>
        }
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  QUIZ CARD
// ══════════════════════════════════════════════════════════
function QuizCard({ quiz, idx, onPlay, onEdit, onDelete }) {
  const accent = [T.lime, T.violet, T.orange, "#f472b6"][idx % 4];
  return (
    <div className="card" style={{ overflow:"hidden" }}>
      <div style={{ height:3, background:accent }} />
      <div style={{ padding:"18px 20px 20px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.text, lineHeight:1.3, flex:1 }}>{quiz.title}</h3>
          <span style={{ fontSize:11, color:T.muted, background:T.surfaceEl, padding:"3px 8px", borderRadius:100, whiteSpace:"nowrap", border:`1px solid ${T.border}` }}>{quiz.questions.length}Q</span>
        </div>
        {quiz.description && (
          <p style={{ color:T.muted, fontSize:13, lineHeight:1.5, marginBottom:10, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {quiz.description}
          </p>
        )}
        <p style={{ fontSize:12, color:T.muted2, marginBottom:16 }}>@{quiz.creatorName}</p>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-primary" onClick={onPlay} style={{ flex:1, background:accent, color: accent === T.lime ? T.bg : "#fff", padding:"9px 14px", fontSize:13 }}>
            ▶ Play
          </button>
          {onEdit   && <button className="btn-ghost" onClick={onEdit}   style={{ padding:"9px 13px" }}>Edit</button>}
          {onDelete && <button className="btn-ghost" onClick={onDelete} style={{ padding:"9px 13px", color:T.coral, borderColor:`${T.coral}40` }}>✕</button>}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  AUTH (login + register)
// ══════════════════════════════════════════════════════════
function Auth({ go, setUser }) {
  const [tab,  setTab]  = useState("login");
  const [form, setForm] = useState({ username:"", password:"", confirm:"" });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const f = (k, v) => { setErr(""); setForm(p => ({ ...p, [k]: v })); };

  const submit = async () => {
    setErr("");
    const u = form.username.trim();
    if (!u || !form.password) return setErr("Please fill in all fields.");
    setBusy(true);
    const users = (await DB.get(UKEY)) || [];

    if (tab === "register") {
      if (form.password.length < 4)       { setErr("Password must be at least 4 characters."); return setBusy(false); }
      if (form.password !== form.confirm)  { setErr("Passwords do not match.");                 return setBusy(false); }
      if (users.find(x => x.username.toLowerCase() === u.toLowerCase())) {
        setErr("Username already taken."); return setBusy(false);
      }
      const nu = { id: Date.now(), username: u, password: form.password, createdAt: new Date().toISOString() };
      await DB.put(UKEY, [...users, nu]);
      setUser(nu); go("dash");
    } else {
      const found = users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === form.password);
      if (!found) { setErr("Incorrect username or password."); setBusy(false); return; }
      setUser(found); go("dash");
    }
    setBusy(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <button onClick={() => go("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, marginBottom:30 }}>
        <div style={{ width:34, height:34, background:T.lime, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.bg }}>Q</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:T.text }}>Quizzing</span>
      </button>

      <div className="card pop" style={{ width:"100%", maxWidth:400, padding:"30px 28px" }}>
        <div className="tab-row" style={{ marginBottom:22 }}>
          {["login","register"].map(t => (
            <button key={t} className={`tab-item ${tab === t ? "on" : ""}`} onClick={() => { setTab(t); setErr(""); }}>
              {t === "login" ? "Log In" : "Register"}
            </button>
          ))}
        </div>

        {tab === "register" && (
          <div style={{ background:`${T.lime}0f`, border:`1px solid ${T.lime}30`, borderRadius:9, padding:"9px 13px", marginBottom:18, fontSize:13, color:T.lime }}>
            ✦ You'll join as a <strong>Quizzer</strong> — create & publish quizzes freely.
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            ["Username", "username", "text",     "your_username"],
            ["Password", "password", "password", "••••••••"],
            ...(tab === "register" ? [["Confirm password", "confirm", "password", "••••••••"]] : []),
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label style={{ display:"block", fontSize:11, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>{label}</label>
              <input className="field" type={type} placeholder={ph} value={form[key]} onChange={e => f(key, e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
          ))}

          {err && <p className="alert-err">{err}</p>}

          <button className="btn-primary" onClick={submit} disabled={busy} style={{ width:"100%", padding:"12px", marginTop:2, opacity: busy ? .6 : 1 }}>
            {busy ? "Please wait…" : tab === "login" ? "Log In" : "Create Account"}
          </button>
        </div>

        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.muted }}>
          {tab === "login" ? "No account? " : "Already have one? "}
          <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setErr(""); }}
            style={{ background:"none", border:"none", color:T.lime, fontWeight:500, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            {tab === "login" ? "Register as Quizzer" : "Log in"}
          </button>
        </p>
      </div>

      <button onClick={() => go("home")} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", marginTop:16, fontFamily:"'DM Sans',sans-serif" }}>
        ← Back to home
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════
function Dash({ go, user, logout, quizzes, reload, play, edit, newQuiz }) {
  const mine   = quizzes.filter(q => q.creatorId === user.id);
  const others = quizzes.filter(q => q.creatorId !== user.id);

  const del = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    await DB.put(QKEY, quizzes.filter(q => q.id !== id));
    reload();
  };

  return (
    <div>
      <Nav user={user} go={go} logout={logout} />
      <div style={{ maxWidth:960, margin:"0 auto", padding:"32px 24px 80px" }}>

        {/* Header */}
        <div className="fade-up" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:14, marginBottom:32 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, letterSpacing:"-.03em", marginBottom:3 }}>
              {user.username}'s Studio
            </h2>
            <p style={{ color:T.muted, fontSize:13 }}>{mine.length} quiz{mine.length !== 1 ? "zes" : ""} created</p>
          </div>
          <button className="btn-primary" onClick={newQuiz}>+ New Quiz</button>
        </div>

        {/* My quizzes */}
        <SectionLabel>My Quizzes</SectionLabel>
        {mine.length === 0
          ? <div style={{ marginBottom:32 }}><Empty label="No quizzes yet" sub="Create your first quiz and share it with everyone!">
              <button className="btn-primary" onClick={newQuiz} style={{ marginTop:16 }}>Create a Quiz</button>
            </Empty></div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))", gap:14, marginBottom:32 }}>
              {mine.map((q, i) => <QuizCard key={q.id} quiz={q} idx={i} onPlay={() => play(q)} onEdit={() => edit(q)} onDelete={() => del(q.id)} />)}
            </div>
        }

        {/* Community */}
        {others.length > 0 && (
          <>
            <SectionLabel>Community Quizzes</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))", gap:14 }}>
              {others.map((q, i) => <QuizCard key={q.id} quiz={q} idx={i + mine.length} onPlay={() => play(q)} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  CREATE / EDIT QUIZ
// ══════════════════════════════════════════════════════════
const freshQ = () => ({ id: Date.now() + Math.random(), text:"", options:["","","",""], correct:0 });

function CreateQ({ go, user, quizzes, reload, editQ, logout }) {
  const isEdit = !!editQ;
  const [title, setTitle] = useState(editQ?.title || "");
  const [desc,  setDesc]  = useState(editQ?.description || "");
  const [qs, setQs]       = useState(editQ?.questions?.length ? editQ.questions : [freshQ()]);
  const [err, setErr]     = useState("");
  const [ok,  setOk]      = useState(false);
  const [busy, setBusy]   = useState(false);

  const updQ   = (i, k, v) => setQs(p => p.map((q, j) => j === i ? { ...q, [k]: v } : q));
  const updOpt = (qi, oi, v) => setQs(p => p.map((q, j) => j === qi ? { ...q, options: q.options.map((o, k) => k === oi ? v : o) } : q));
  const addQ   = () => setQs(p => [...p, freshQ()]);
  const removeQ = i => setQs(p => p.filter((_, j) => j !== i));

  const publish = async () => {
    setErr("");
    if (!title.trim()) return setErr("Quiz title is required.");
    for (let i = 0; i < qs.length; i++) {
      if (!qs[i].text.trim())               return setErr(`Question ${i + 1} needs text.`);
      if (qs[i].options.some(o => !o.trim())) return setErr(`Question ${i + 1} has an empty answer option.`);
    }
    setBusy(true);
    const all = (await DB.get(QKEY)) || [];
    const updated = isEdit
      ? all.map(q => q.id === editQ.id ? { ...q, title:title.trim(), description:desc.trim(), questions:qs } : q)
      : [...all, { id:Date.now(), title:title.trim(), description:desc.trim(), questions:qs, creatorId:user.id, creatorName:user.username, createdAt:new Date().toISOString() }];
    await DB.put(QKEY, updated);
    await reload();
    setOk(true); setBusy(false);
    setTimeout(() => go("dash"), 1200);
  };

  return (
    <div>
      <Nav user={user} go={go} logout={logout} />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"30px 24px 80px" }}>

        <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:26 }}>
          <button className="btn-ghost" onClick={() => go("dash")} style={{ padding:"8px 14px", fontSize:13 }}>← Back</button>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, letterSpacing:"-.02em" }}>
            {isEdit ? "Edit Quiz" : "New Quiz"}
          </h2>
        </div>

        {/* Metadata */}
        <div className="card" style={{ padding:"22px 24px", marginBottom:14 }}>
          <SectionLabel style={{ marginBottom:16 }}>Quiz Details</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={lbl}>Title *</label>
              <input className="field" placeholder="e.g. World Capitals" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Description <span style={{ color:T.muted2, fontWeight:400 }}>(optional)</span></label>
              <input className="field" placeholder="Brief description of your quiz" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Questions */}
        {qs.map((q, qi) => (
          <div key={q.id} className="card" style={{ padding:"20px 22px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ fontSize:11, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".08em" }}>Question {qi + 1}</span>
              {qs.length > 1 && (
                <button onClick={() => removeQ(qi)} className="btn-ghost" style={{ padding:"5px 11px", fontSize:12, color:T.coral, borderColor:`${T.coral}35` }}>Remove</button>
              )}
            </div>

            <input className="field" placeholder="Enter your question…" value={q.text} onChange={e => updQ(qi, "text", e.target.value)} style={{ marginBottom:14 }} />

            <p style={{ fontSize:11, color:T.muted, marginBottom:10 }}>
              Click the number badge to mark the correct answer
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {q.options.map((opt, oi) => {
                const a = ANS[oi], isC = q.correct === oi;
                return (
                  <div key={oi} style={{ display:"flex", alignItems:"center", gap:10, background: isC ? `${a.color}0f` : T.surfaceEl, border:`1px solid ${isC ? a.color + "44" : T.border}`, borderRadius:10, padding:"3px 12px 3px 3px", transition:"all .15s" }}>
                    <button onClick={() => updQ(qi, "correct", oi)} style={{ width:34, height:34, minWidth:34, borderRadius:8, background: isC ? a.color : T.bg, border:"none", color: isC ? a.dark : T.muted, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .15s", fontFamily:"'Syne',sans-serif" }}>
                      {a.num}
                    </button>
                    <input style={{ background:"transparent", border:"none", color:T.text, fontSize:13, flex:1, padding:"8px 0", fontFamily:"'DM Sans',sans-serif", outline:"none" }}
                      placeholder={`Option ${a.num}`} value={opt} onChange={e => updOpt(qi, oi, e.target.value)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button className="btn-ghost" onClick={addQ} style={{ width:"100%", marginBottom:16, padding:"12px" }}>+ Add Question</button>

        {err && <p className="alert-err" style={{ marginBottom:12 }}>{err}</p>}
        {ok  && <p className="alert-ok"  style={{ marginBottom:12 }}>✓ Quiz {isEdit ? "updated" : "published"}! Redirecting…</p>}

        <button className="btn-primary" onClick={publish} disabled={busy} style={{ width:"100%", padding:"13px", fontSize:15, opacity: busy ? .6 : 1 }}>
          {busy ? "Saving…" : isEdit ? "Save Changes" : "Publish Quiz"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PLAY
// ══════════════════════════════════════════════════════════
function Play({ go, activeQ: quiz, finish }) {
  const [phase, setPhase] = useState("intro"); // intro | q | reveal
  const [qi,    setQi]    = useState(0);
  const [sel,   setSel]   = useState(null);
  const [time,  setTime]  = useState(Q_SECS);
  const timerRef = useRef(null);
  const selRef   = useRef(null);
  const cntRef   = useRef(0);

  if (!quiz) { go("home"); return null; }
  const q = quiz.questions[qi];

  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => {
    if (phase !== "q") return;
    selRef.current = null;
    setTime(Q_SECS);
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          stopTimer();
          if (!selRef.current) {
            selRef.current = "timeout";
            setSel("timeout");
            setPhase("reveal");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qi, phase]);

  const choose = oi => {
    if (selRef.current !== null) return;
    stopTimer();
    selRef.current = oi;
    setSel(oi);
    if (oi === q.correct) cntRef.current++;
    setPhase("reveal");
  };

  const next = () => {
    const nqi = qi + 1;
    if (nqi >= quiz.questions.length) {
      finish({ correct: cntRef.current, total: quiz.questions.length, quiz });
    } else {
      setQi(nqi); setSel(null); setPhase("q");
    }
  };

  const timerPct   = (time / Q_SECS) * 100;
  const timerColor = time > 10 ? T.lime : time > 5 ? T.orange : T.coral;

  // ── Intro ──────────────────────────────────────────────
  if (phase === "intro") return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div className="card pop" style={{ maxWidth:440, width:"100%", padding:"40px 34px", textAlign:"center" }}>
        <div style={{ width:56, height:56, background:`${T.lime}15`, border:`1px solid ${T.lime}30`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:26 }}>🎯</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, letterSpacing:"-.02em", marginBottom:7 }}>{quiz.title}</h2>
        {quiz.description && <p style={{ color:T.muted, fontSize:14, lineHeight:1.6, marginBottom:14 }}>{quiz.description}</p>}
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:26 }}>
          <Chip>{quiz.questions.length} questions</Chip>
          <Chip>{Q_SECS}s per question</Chip>
        </div>
        <button className="btn-primary" onClick={() => setPhase("q")} style={{ width:"100%", padding:"13px", fontSize:15 }}>Start Quiz →</button>
        <button onClick={() => go("home")} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", marginTop:14, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
      </div>
    </div>
  );

  // ── Question ───────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Top bar + timer */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ height:3, background:T.surfaceEl }}>
          <div style={{ height:"100%", width:`${timerPct}%`, background:timerColor, transition:"width 1s linear, background .5s" }} />
        </div>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"11px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, color:T.muted }}>{quiz.title}</span>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:13, color:T.muted }}>{qi + 1} / {quiz.questions.length}</span>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`${timerColor}14`, border:`2px solid ${timerColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:timerColor, minWidth:40, transition:"all .5s" }}>
              {time}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, maxWidth:680, margin:"0 auto", width:"100%", padding:"26px 20px 40px", display:"flex", flexDirection:"column" }}>

        {/* Question card */}
        <div className="card fade-up" style={{ padding:"22px 26px", marginBottom:16, textAlign:"center" }}>
          <span style={{ fontSize:11, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:9 }}>Question {qi + 1}</span>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(16px,2.8vw,21px)", fontWeight:700, lineHeight:1.4, letterSpacing:"-.01em" }}>
            {q.text}
          </p>
        </div>

        {/* Answers */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
          {q.options.map((opt, oi) => {
            const a = ANS[oi];
            let cls = "ans";
            let numBg = T.surfaceEl, numColor = T.muted, textColor = T.text;

            if (phase === "reveal") {
              if (oi === q.correct)                   { cls += " correct"; numBg = T.emerald; numColor = T.bg; textColor = T.emerald; }
              else if (oi === sel && oi !== q.correct) { cls += " wrong";   numBg = T.coral;   numColor = "#fff"; textColor = T.coral;   }
              else                                     { cls += " dim"; }
            }

            return (
              <button key={oi} className={cls} onClick={() => phase === "q" && choose(oi)} disabled={phase === "reveal"}
                style={{ animationDelay:`${oi * .06}s` }}>
                {/* Number badge */}
                <div style={{ width:50, minWidth:50, alignSelf:"stretch", background:numBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:numColor, transition:"all .2s", borderRight:`1px solid ${T.border}` }}>
                  {a.num}
                </div>
                <span style={{ padding:"15px 16px", fontSize:14, fontWeight:400, color:textColor, flex:1, transition:"color .2s" }}>
                  {opt}
                </span>
                {phase === "reveal" && oi === q.correct && <span style={{ paddingRight:16, color:T.emerald, fontSize:18 }}>✓</span>}
                {phase === "reveal" && oi === sel && oi !== q.correct && <span style={{ paddingRight:16, color:T.coral, fontSize:18 }}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Reveal feedback */}
        {phase === "reveal" && (
          <div className="pop" style={{ marginTop:22, textAlign:"center" }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:16,
              color: sel === q.correct ? T.emerald : sel === "timeout" ? T.orange : T.coral }}>
              {sel === q.correct ? "Correct!" : sel === "timeout" ? "Time's up!" : "Wrong answer"}
            </p>
            <button className="btn-primary" onClick={next}>
              {qi + 1 < quiz.questions.length ? "Next Question →" : "See Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  RESULTS
// ══════════════════════════════════════════════════════════
function Results({ go, result, play }) {
  if (!result) { go("home"); return null; }
  const { correct, total, quiz } = result;
  const pct = Math.round((correct / total) * 100);
  const [label, color] =
      pct === 100 ? ["Perfect score!", T.lime]
    : pct >= 70   ? ["Great job!",     T.violet]
    : pct >= 40   ? ["Keep going!",    T.orange]
    :               ["Keep practicing", T.coral];

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="card pop" style={{ maxWidth:400, width:"100%", padding:"38px 32px", textAlign:"center" }}>

        {/* Score ring */}
        <div style={{ width:108, height:108, borderRadius:"50%", background:`conic-gradient(${color} ${pct * 3.6}deg, ${T.surfaceEl} 0)`, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:78, height:78, borderRadius:"50%", background:T.surface, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color, lineHeight:1 }}>{pct}%</span>
          </div>
        </div>

        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, letterSpacing:"-.02em", marginBottom:5 }}>{label}</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:22 }}>Finished: <em style={{ color:T.text }}>{quiz.title}</em></p>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {[["Correct", correct, T.emerald], ["Wrong", total - correct, T.coral], ["Total", total, T.muted]].map(([l, v, c]) => (
            <div key={l} style={{ background:T.surfaceEl, borderRadius:10, padding:"12px 8px", border:`1px solid ${T.border}` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:c }}>{v}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:3, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-primary" onClick={() => play(quiz)} style={{ flex:1 }}>↺ Play Again</button>
          <button className="btn-ghost"   onClick={() => go("home")} style={{ flex:1 }}>Home</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  TINY HELPERS
// ══════════════════════════════════════════════════════════
const lbl = { display:"block", fontSize:11, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 };

function SectionLabel({ children, style = {} }) {
  return <p style={{ fontSize:11, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:14, ...style }}>{children}</p>;
}

function Chip({ children }) {
  return <span style={{ fontSize:12, color:T.muted, background:T.surfaceEl, padding:"4px 12px", borderRadius:100, border:`1px solid ${T.border}` }}>{children}</span>;
}

function Empty({ label, sub, children }) {
  return (
    <div style={{ border:`1px dashed ${T.border}`, borderRadius:16, padding:"52px 24px", textAlign:"center" }}>
      <p style={{ fontWeight:500, color:T.text,  fontSize:15, marginBottom:6  }}>{label}</p>
      <p style={{ color:T.muted,  fontSize:13,   marginBottom:0, lineHeight:1.5 }}>{sub}</p>
      {children}
    </div>
  );
}
