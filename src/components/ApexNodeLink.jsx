import { useState, useEffect } from "react";

const apps = [
  { id:1, name:"PrivateTalk",  tag:"VOIX",    color:"#7C3AED", desc:"Appels anonymes avec numéros jetables. Zéro log, zéro trace." },
  { id:2, name:"BetVision AI", tag:"IA",      color:"#F59E0B", desc:"Pronostics sportifs générés par algorithme IA. Maximise tes gains, minimise le hasard." },
  { id:3, name:"IncoInfo",     tag:"OSINT",   color:"#8B5CF6", desc:"Détecte les incohérences dans la presse mondiale. L'info vérifiée, en temps réel." },
  { id:4, name:"VisionX",      tag:"FINANCE", color:"#10B981", desc:"Scrute les marchés financiers 24h/24. Signaux d'entrée et de sortie générés par IA." },
  { id:5, name:"SARI",         tag:"IA",      color:"#06B6D4", desc:"Réseau social conçu pour les intelligences artificielles. Connexion, échange, évolution." },
];


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Space+Mono:wght@400;700&family=Exo+2:wght@300;400;600;800&display=swap');
  @keyframes float { 0%,100%{transform:translateY(0) scale(1);opacity:0.3} 50%{transform:translateY(-20px) scale(1.5);opacity:0.8} }
  @keyframes pulse-ring { 0%{transform:scale(0.9);opacity:1} 100%{transform:scale(1.4);opacity:0} }
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes glitch { 0%,90%,100%{clip-path:none;transform:none} 91%{clip-path:inset(20% 0 60% 0);transform:translate(-4px,0)} 93%{clip-path:inset(60% 0 10% 0);transform:translate(4px,0)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  .app-card { transition:all 0.25s cubic-bezier(0.4,0,0.2,1); text-decoration:none; display:block; }
  .app-card:hover { transform:translateX(6px) scale(1.01); }
  .grid-bg { background-image:linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px); background-size:40px 40px; }
`;

export default function ApexNodeLink() {
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 5.3) % 100}%`, top: `${(i * 7.7) % 100}%`,
    duration: 4 + (i % 6), delay: (i * 0.3) % 4,
  }));

  return (
    <>
      <style>{CSS}</style>
      <div className="grid-bg" style={{ minHeight:"100vh", background:"linear-gradient(135deg,#050510 0%,#0A0520 50%,#050510 100%)", display:"flex", justifyContent:"center", padding:"40px 16px 80px", position:"relative", overflow:"hidden" }}>

        {particles.map((p,i) => (
          <div key={i} style={{ position:"absolute", width:2, height:2, borderRadius:"50%", background:"rgba(124,58,237,0.6)", animation:`float ${p.duration}s ease-in-out infinite`, animationDelay:`${p.delay}s`, left:p.left, top:p.top, pointerEvents:"none" }} />
        ))}

        <div style={{ position:"fixed", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.4),transparent)", animation:"scanline 8s linear infinite", pointerEvents:"none", zIndex:100 }} />

        <div style={{ width:"100%", maxWidth:480, position:"relative", zIndex:1 }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:40, opacity:loaded?1:0, animation:loaded?"fadeSlideUp 0.6s ease forwards":"none" }}>
            <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#06B6D4)", marginBottom:20, position:"relative", boxShadow:"0 0 40px rgba(124,58,237,0.5)" }}>
              <div style={{ position:"absolute", inset:2, borderRadius:"50%", background:"#050510", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:28 }}>⬡</span>
              </div>
              <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:"1px solid rgba(124,58,237,0.4)", animation:"pulse-ring 2s ease-out infinite" }} />
            </div>

            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, letterSpacing:"0.4em", color:"#7C3AED", marginBottom:8, textTransform:"uppercase" }}>THE</div>

            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:38, fontWeight:700, letterSpacing:"0.12em", lineHeight:1, color:"transparent", background:"linear-gradient(135deg,#E0D7FF 0%,#A78BFA 40%,#06B6D4 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"glitch 8s infinite", textTransform:"uppercase" }}>
              APEX NODE
            </h1>

            <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:20, fontWeight:600, letterSpacing:"0.35em", color:"#7C3AED", textTransform:"uppercase", marginBottom:12 }}>HUB</h2>

            <p style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:"rgba(167,139,250,0.6)", letterSpacing:"0.15em", textTransform:"uppercase" }}>
              Arsenal numérique privé · Zéro trace · Total contrôle
            </p>

            <div style={{ margin:"24px auto 0", width:120, height:1, background:"linear-gradient(90deg,transparent,#7C3AED,#06B6D4,transparent)" }} />
          </div>

          {/* Cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {apps.map((app, i) => {
              const isHovered = hovered === app.id;
              return (
                <div key={app.id} className="app-card"
                  onMouseEnter={() => setHovered(app.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ opacity:loaded?1:0, animation:loaded?`fadeSlideUp 0.5s ease forwards ${0.05*i+0.3}s`:"none",
                    background: isHovered ? `rgba(${parseInt(app.color.slice(1,3),16)},${parseInt(app.color.slice(3,5),16)},${parseInt(app.color.slice(5,7),16)},0.12)` : "rgba(255,255,255,0.03)",
                    border:`1px solid ${isHovered ? app.color+"66" : app.highlight ? "rgba(245,158,11,0.3)" : "rgba(124,58,237,0.15)"}`,
                    borderRadius:12, padding:"14px 16px",
                    boxShadow: isHovered ? `0 0 24px ${app.color}22` : "none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:16, fontWeight:700, color:isHovered?"#E0D7FF":"#C4B5FD", letterSpacing:"0.05em", textTransform:"uppercase" }}>{app.name}</span>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:app.color, border:`1px solid ${app.color}55`, borderRadius:4, padding:"1px 5px", letterSpacing:"0.1em" }}>{app.tag}</span>
                      </div>
                      <p style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:"rgba(167,139,250,0.45)", lineHeight:1.6, margin:0 }}>{app.desc}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
                      <span style={{ color:isHovered?app.color:"rgba(124,58,237,0.4)", fontSize:14, transition:"all 0.2s", transform:isHovered?"translateX(4px)":"none" }}>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop:40, textAlign:"center" }}>
            <div style={{ width:80, height:1, background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.4),transparent)", margin:"0 auto 16px" }} />
            <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:"rgba(124,58,237,0.35)", letterSpacing:"0.2em", textTransform:"uppercase" }}>© 2025 Apex Node Hub · All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}
