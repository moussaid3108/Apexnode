import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const modules = [
  { id:"privatetalk",    icon:"📞", title:"PrivateTalk",      tag:"VOIX",       status:"LIVE",    desc:"Appels ultra-sécurisés, DIDs anonymes via Telnyx. Zéro log, brouilleur de voix.",       accentColor:"#ff0033" },
  { id:"voiceshield",   icon:"🛡️", title:"Voice Shield",     tag:"IA",         status:"BETA",    desc:"Filtre anti-spam intelligent sur vos appels entrants. IA Groq + Telnyx.",                accentColor:"#00ffff" },
  { id:"shadowbrowser", icon:"👁️", title:"Shadow Browser",   tag:"PRIVACY",    status:"BETA",    desc:"Navigateur éphémère à usage unique. KasmVNC + Docker. Fingerprinting randomisé.",      accentColor:"#a855f7" },
  { id:"leadqualifier", icon:"📈", title:"Lead Qualifier",   tag:"B2B",        status:"BIENTÔT", desc:"Prospection B2B automatisée, opt-in RGPD. IA de qualification de leads.",               accentColor:"#10b981" },
  { id:"betvision",     icon:"⚡", title:"BetVision AI",     tag:"IA",         status:"BETA",    desc:"Pronostics sportifs par IA. Algorithme Poisson, arbitrage, stratégies de paris.",        accentColor:"#f59e0b" },
  { id:"digitalev",     icon:"🔐", title:"Digital Evidence", tag:"BLOCKCHAIN", status:"LIVE",    desc:"Horodatage SHA-256 certifié. Preuve d'autorité infalsifiable. 5€/fichier.",              accentColor:"#ff0033" },
  { id:"ghostcinema",   icon:"🎬", title:"Ghost Cinema",     tag:"CLUB",       status:"BIENTÔT", desc:"Partage de films perso entre abonnés. Décentralisé, zéro censure. Invitation requise.",  accentColor:"#ec4899" },
  { id:"incoinfo",      icon:"🔍", title:"IncoInfo OSINT",   tag:"OSINT",      status:"BIENTÔT", desc:"Détection IA d'incohérences dans la presse mondiale. Analyse réputationnelle.",          accentColor:"#8b5cf6" },
  { id:"globalhealth",  icon:"🌍", title:"Global Health",    tag:"SANTÉ",      status:"BIENTÔT", desc:"Téléconsultation avec vrais médecins agréés. Plateforme internationale.",                accentColor:"#10b981" },
  { id:"credits",       icon:"💳", title:"Crédits Empire",   tag:"WALLET",     status:"WALLET",  desc:"Rechargez votre compte. Paiement par carte, crypto ou Apple Pay via Sellix.",            accentColor:"#00ffff" },
];

const badgeStyle = (status) => {
  const base = { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, letterSpacing:"0.12em", padding:"3px 8px", borderRadius:5, textTransform:"uppercase", position:"absolute", top:14, right:14 };
  const map = {
    LIVE:     { background:"#ff0033", color:"#fff" },
    BETA:     { background:"#111", color:"#00ffff", border:"1px solid #00ffff44" },
    "BIENTÔT":{ background:"#111", color:"#555", border:"1px solid #222" },
    WALLET:   { background:"#00ffff11", color:"#00ffff", border:"1px solid #00ffff44" },
  };
  return { ...base, ...(map[status] || {}) };
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;600&display=swap');
  @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(800%)} }
  @keyframes pulse-live { 0%,100%{opacity:1;box-shadow:0 0 6px #ff0033} 50%{opacity:0.6;box-shadow:0 0 14px #ff0033} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-16px);opacity:0.9} }
  .hub-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:14px; padding:24px; position:relative; overflow:hidden; display:flex; flex-direction:column; gap:14px; cursor:pointer; transition:border-color 0.25s,box-shadow 0.25s,transform 0.25s; animation:fadeUp 0.5s ease both; text-decoration:none; color:inherit; }
  .hub-card:hover { border-color:rgba(0,255,255,0.35); box-shadow:0 0 28px rgba(0,255,255,0.07); transform:translateY(-3px); }
  .hub-card.live { border-color:rgba(255,0,51,0.25); }
  .hub-card.live:hover { border-color:rgba(255,0,51,0.55); box-shadow:0 0 28px rgba(255,0,51,0.08); }
  .card-shimmer { position:absolute; inset:0; background:linear-gradient(120deg,transparent 40%,rgba(0,255,255,0.03) 50%,transparent 60%); opacity:0; transition:opacity 0.3s; pointer-events:none; }
  .hub-card:hover .card-shimmer { opacity:1; }
  .scan-line { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,255,255,0.4),transparent); top:0; animation:scan 3s linear infinite; pointer-events:none; }
  .badge-live { animation:pulse-live 1.8s ease-in-out infinite; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:900px){.grid-3{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:580px){.grid-3{grid-template-columns:1fr}.hub-title{font-size:28px!important}}
  .particle { position:fixed; width:2px; height:2px; border-radius:50%; background:rgba(0,255,255,0.5); pointer-events:none; animation:float var(--dur) ease-in-out infinite; animation-delay:var(--delay); }
`;

export default function ApexNodeHub() {
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) => `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;

  const particles = Array.from({ length:14 }, (_,i) => ({
    left:`${(i*7.3)%100}%`, top:`${(i*11.7)%100}%`,
    dur:`${4+(i%5)}s`, delay:`${(i*0.4)%3}s`,
  }));

  return (
    <>
      <style>{CSS}</style>
      {particles.map((p,i) => <div key={i} className="particle" style={{ left:p.left, top:p.top, "--dur":p.dur, "--delay":p.delay }} />)}

      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(0,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.025) 1px,transparent 1px)", backgroundSize:"50px 50px" }} />

      <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 20% 0%,#0a0014 0%,#050505 60%)", padding:"0 24px 80px", position:"relative", zIndex:1 }}>

        {/* Top bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid #111" }}>
          <button onClick={() => navigate("/")} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#444", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.15em" }}>← Linktree</button>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#333", letterSpacing:"0.2em" }}>SYS://APEX-NODE-HUB</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#00ffff55", letterSpacing:"0.1em" }}>{fmt(time)}</span>
        </div>

        {/* Header */}
        <header style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 0 48px", borderBottom:"1px solid #111", opacity:loaded?1:0, transition:"opacity 0.6s" }}>
          <div style={{ width:88, height:88, borderRadius:"50%", border:"2px solid #00ffff", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28, position:"relative", overflow:"hidden", boxShadow:"0 0 24px #00ffff33, inset 0 0 20px #00ffff11" }}>
            <span style={{ fontSize:34 }}>📡</span>
            <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#00ffff,transparent)", animation:"scan 2.5s linear infinite", opacity:0.7 }} />
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.5em", color:"#00ffff66", textTransform:"uppercase", marginBottom:10 }}>THE</div>
          <h1 className="hub-title" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:42, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.14em", color:"#00ffff", textShadow:"0 0 12px #00ffff66,0 0 40px #00ffff22", textAlign:"center", lineHeight:1.1 }}>APEX NODE</h1>
          <h2 style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, letterSpacing:"0.45em", color:"#00ffff55", textTransform:"uppercase", marginBottom:16 }}>HUB</h2>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#444", letterSpacing:"0.2em", textTransform:"uppercase", textAlign:"center" }}>Arsenal Numérique Privé · Zero-Trace · Total Contrôle</p>
          <div style={{ marginTop:28, width:160, height:1, background:"linear-gradient(90deg,transparent,#00ffff44,transparent)" }} />
        </header>

        {/* Stats */}
        <div style={{ display:"flex", justifyContent:"center", gap:48, padding:"20px 0", borderBottom:"1px solid #111", marginBottom:40 }}>
          {[["10","Modules"],["OPÉRATIONNEL","Statut"],["v1.0.0","Version"]].map(([v,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:800, color:"#00ffff", textShadow:"0 0 8px #00ffff44" }}>{v}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#333", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <main style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="grid-3">
            {modules.map((mod,i) => (
              <a key={mod.id} href="#" className={`hub-card ${mod.status==="LIVE"?"live":""}`} style={{ animationDelay:`${i*0.055+0.1}s` }}>
                <div className="card-shimmer" />
                <div className="scan-line" />
                <span className={mod.status==="LIVE"?"badge-live":""} style={badgeStyle(mod.status)}>{mod.status}</span>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:10, background:"#111", border:`1px solid ${mod.accentColor}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, boxShadow:`0 0 10px ${mod.accentColor}22` }}>{mod.icon}</div>
                  <div>
                    <h3 style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.08em" }}>{mod.title}</h3>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:mod.accentColor, letterSpacing:"0.15em", opacity:0.7 }}>[{mod.tag}]</span>
                  </div>
                </div>
                <p style={{ fontSize:12.5, color:"#777", lineHeight:1.65, fontFamily:"'Space Grotesk',sans-serif", fontWeight:300, flex:1 }}>{mod.desc}</p>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:mod.accentColor, opacity:0.5 }}>→</span>
                </div>
                <div style={{ position:"absolute", bottom:0, left:0, width:30, height:2, background:`linear-gradient(90deg,${mod.accentColor}66,transparent)`, borderRadius:"0 0 0 14px" }} />
              </a>
            ))}
          </div>
        </main>

        <footer style={{ marginTop:60, textAlign:"center", paddingTop:24, borderTop:"1px solid #111" }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#222", letterSpacing:"0.3em", textTransform:"uppercase" }}>© 2025 APEX NODE ARSENAL · TOUS DROITS RÉSERVÉS</p>
        </footer>
      </div>
    </>
  );
}
