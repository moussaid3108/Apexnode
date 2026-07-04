import { useEffect, useRef } from "react";
import * as THREE from "three";

const apps = [
  { name:"PrivateTalk",  tag:"VOIX",    green:false },
  { name:"BetVision AI", tag:"IA",      green:true  },
  { name:"IncoInfo",     tag:"OSINT",   green:false },
  { name:"VisionX",      tag:"FINANCE", green:false },
  { name:"SARI",         tag:"IA",      green:true  },
];

const CSS = `
:root{
  --bg:#0D0A1A;
  --bg-card:rgba(28,22,52,.55);
  --edge:rgba(139,92,246,.28);
  --ink:#EDEAFB;
  --ink-dim:#9E93C9;
  --violet:#8B5CF6;
  --blue:#4F9CF9;
  --lav:#B7A8F5;
  --live:#3DDC97;
  --scan:rgba(139,92,246,.9);
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:'Space Grotesk',sans-serif;overflow-x:hidden;min-height:100vh}
#scene{position:fixed;inset:0;z-index:0;pointer-events:none}
#scanline{
  position:fixed;left:0;right:0;top:0;height:2px;z-index:6;pointer-events:none;
  background:linear-gradient(90deg,transparent,var(--scan) 30%,#C4B5FD 50%,var(--scan) 70%,transparent);
  box-shadow:0 0 18px 3px rgba(139,92,246,.55),0 0 70px 12px rgba(79,156,249,.22);
}
#scanline::after{content:'';position:absolute;left:0;right:0;top:2px;height:90px;background:linear-gradient(to bottom,rgba(139,92,246,.16),transparent)}
header{position:relative;z-index:1;text-align:center;padding:clamp(34px,7vh,70px) 0 26px}
.eyebrow{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.55em;color:var(--lav);text-indent:.55em}
h1{margin-top:10px;font-weight:700;font-size:clamp(42px,11.5vw,88px);letter-spacing:.08em;line-height:1;background:linear-gradient(100deg,var(--lav) 15%,var(--blue) 85%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 14px rgba(13,10,26,.9))}
.hub{margin-top:8px;font-weight:500;font-size:clamp(20px,5vw,34px);letter-spacing:.6em;text-indent:.6em;color:var(--violet);text-shadow:0 2px 12px rgba(13,10,26,.9)}
.tagline{margin:22px auto 0;max-width:640px;padding:0 24px;font-family:'Space Mono',monospace;font-size:clamp(10px,2.8vw,13px);letter-spacing:.3em;line-height:2;color:var(--ink-dim);text-transform:uppercase;text-shadow:0 1px 8px rgba(13,10,26,.95)}
.divider{margin:30px auto 0;width:min(86%,760px);height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,.55),rgba(79,156,249,.55),transparent);box-shadow:0 0 24px rgba(139,92,246,.35)}
main{position:relative;z-index:1;max-width:820px;margin:0 auto;padding:40px 20px 30px;display:flex;flex-direction:column;gap:18px}
.app{display:flex;align-items:center;gap:18px;padding:22px;background:var(--bg-card);border:1px solid var(--edge);border-radius:18px;backdrop-filter:blur(10px);text-decoration:none;color:inherit;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s}
.app:active{transform:scale(.99)}
.app:hover{border-color:rgba(139,92,246,.6);transform:translateY(-2px)}
.app.scanned{border-color:#C4B5FD;box-shadow:0 0 0 1px rgba(196,181,253,.7),0 0 34px rgba(139,92,246,.35)}
.body{flex:1;min-width:0;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.name{font-weight:700;font-size:clamp(17px,4.4vw,22px);letter-spacing:.06em;text-transform:uppercase;color:var(--lav)}
.chip{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.16em;padding:4px 9px;border:1px solid var(--edge);border-radius:8px;color:var(--violet);text-transform:uppercase}
.chip.green{color:var(--live);border-color:rgba(61,220,151,.4)}
.right{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
@keyframes spin{to{transform:rotate(360deg)}}
.share-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid rgba(139,92,246,.35);background:rgba(139,92,246,.08);cursor:pointer;flex-shrink:0;animation:spin 5s linear infinite}
footer{position:relative;z-index:1;text-align:center;padding:26px 20px 44px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.28em;color:var(--ink-dim);text-transform:uppercase}
footer b{color:var(--violet)}
@media(prefers-reduced-motion:reduce){#scanline{display:none}.app,.app:hover{transition:none;transform:none}}
`;

export default function ApexNodeLink() {
  const sceneRef = useRef(null);
  const scanlineRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = sceneRef.current;
    const scanEl = scanlineRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0D0A1A, 10, 34);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x4A3E7A, 1.2));
    const l1 = new THREE.PointLight(0x8B5CF6, 1.8, 30); l1.position.set(5, 5, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0x4F9CF9, 1.5, 30); l2.position.set(-5, -2, 5); scene.add(l2);

    const core = new THREE.Group();
    scene.add(core);

    const hexGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.35, 6);
    const hexMat = new THREE.MeshStandardMaterial({ color:0x14102A, metalness:0.7, roughness:0.3, emissive:0x2A1E55, emissiveIntensity:0.4, transparent:true, opacity:0.55 });
    const hex = new THREE.Mesh(hexGeo, hexMat);
    hex.rotation.x = Math.PI / 2;
    core.add(hex);
    const hexEdges = new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo), new THREE.LineBasicMaterial({ color:0xB7A8F5, transparent:true, opacity:0.4 }));
    hexEdges.rotation.copy(hex.rotation);
    core.add(hexEdges);

    function makeRing(radius, tube, color, opacity) {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 12, 90),
        new THREE.MeshBasicMaterial({ color, transparent:true, opacity })
      );
      core.add(r);
      return r;
    }
    const ringA = makeRing(1.55, 0.035, 0x8B5CF6, 0.45);
    const ringB = makeRing(1.8,  0.018, 0x4F9CF9, 0.4);
    ringB.rotation.x = Math.PI / 3;
    const ringC = makeRing(2.05, 0.012, 0xC4B5FD, 0.3);
    ringC.rotation.y = Math.PI / 3;

    const satGroup = new THREE.Group();
    core.add(satGroup);
    const satColors = [0x3DDC97, 0x5AC8FA, 0x8B5CF6, 0x9E93C9, 0x5AC8FA];
    const sats = satColors.map((c, i) => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.09, 0),
        new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:0.75 })
      );
      satGroup.add(m);
      return { mesh:m, phase:i*(Math.PI*2/5), r:2.3, speed:0.35+i*0.06, tilt:(i%2?0.4:-0.25) };
    });

    const floaters = [];
    const miniGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 6);
    for (let i = 0; i < 20; i++) {
      const wire = Math.random() > 0.45;
      let m;
      if (wire) {
        m = new THREE.LineSegments(new THREE.EdgesGeometry(miniGeo), new THREE.LineBasicMaterial({ color:Math.random()>0.5?0x8B5CF6:0x4F9CF9, transparent:true, opacity:0.4 }));
      } else {
        m = new THREE.Mesh(miniGeo, new THREE.MeshStandardMaterial({ color:0x1C1634, metalness:0.6, roughness:0.4, emissive:0x2A1E55, emissiveIntensity:0.5 }));
      }
      m.position.set((Math.random()-0.5)*16, 3.5-Math.random()*16, -2-Math.random()*7);
      m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      m.scale.setScalar(0.5+Math.random()*1.2);
      m.userData = { spinX:(Math.random()-0.5)*0.01, spinY:(Math.random()-0.5)*0.01, baseY:m.position.y, amp:0.15+Math.random()*0.25, ph:Math.random()*Math.PI*2 };
      scene.add(m);
      floaters.push(m);
    }

    const grid = new THREE.GridHelper(60, 60, 0x8B5CF6, 0x2A1E55);
    const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
    mats.forEach(m => { m.transparent = true; m.opacity = 0.2; });
    grid.position.y = -7.5;
    scene.add(grid);

    function makeStars(count, spread, size, color, opacity) {
      const g = new THREE.BufferGeometry();
      const p = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) { p[i*3]=(Math.random()-0.5)*spread; p[i*3+1]=(Math.random()-0.5)*spread*0.8; p[i*3+2]=-2-Math.random()*20; }
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent:true, opacity }));
      scene.add(pts);
      return pts;
    }
    const starsFar  = makeStars(300, 40, 0.03, 0x8B7BC9, 0.5);
    const starsMid  = makeStars(150, 30, 0.05, 0xB7A8F5, 0.6);
    const starsNear = makeStars(60,  22, 0.08, 0x5AC8FA, 0.55);

    const h1El = document.querySelector('h1');
    function alignCore() {
      if (!h1El) return;
      const r = h1El.getBoundingClientRect();
      const cy = r.top + r.height * 0.5;
      const ndcY = -(cy / window.innerHeight) * 2 + 1;
      const vh = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * 9;
      core.position.y = ndcY * vh / 2 + camera.position.y;
    }

    let scrollFrac = 0;
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollFrac = max > 0 ? window.scrollY / max : 0;
      alignCore();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const SCAN_PERIOD = 7;
    function updateScan(t) {
      const y = -80 + ((t % SCAN_PERIOD) / SCAN_PERIOD) * (window.innerHeight + 180);
      scanEl.style.transform = 'translateY(' + y + 'px)';
      document.querySelectorAll('.app').forEach(c => {
        const r = c.getBoundingClientRect();
        c.classList.toggle('scanned', y > r.top && y < r.bottom);
      });
    }

    let visible = true;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    let t = 0;
    const clock = new THREE.Clock();
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!visible) return;
      const dt = clock.getDelta();
      t += dt;

      camera.position.y = -scrollFrac * 3.5;
      camera.position.x = Math.sin(t * 0.15) * 0.3;
      camera.lookAt(0, camera.position.y, 0);
      alignCore();

      if (!reduced) {
        core.rotation.y += dt * 0.25;
        hex.rotation.z += dt * 0.15;
        hexEdges.rotation.copy(hex.rotation);
        ringA.rotation.z += dt * 0.3;
        ringB.rotation.z -= dt * 0.22;
        ringC.rotation.x += dt * 0.18;

        sats.forEach(s => {
          const a = t * s.speed + s.phase;
          s.mesh.position.set(Math.cos(a)*s.r, Math.sin(a*2)*s.tilt, Math.sin(a)*s.r);
        });

        floaters.forEach(f => {
          f.rotation.x += f.userData.spinX;
          f.rotation.y += f.userData.spinY;
          f.position.y = f.userData.baseY + Math.sin(t*0.6 + f.userData.ph)*f.userData.amp;
        });

        starsFar.rotation.y  = t * 0.004;
        starsMid.rotation.y  = -t * 0.007;
        starsNear.rotation.y = t * 0.011;
        grid.position.z = (t * 0.6) % 1;
        updateScan(t);
      }

      renderer.render(scene, camera);
    }

    alignCore();
    onScroll();
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      alignCore();
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div id="scene" ref={sceneRef}></div>
      <div id="scanline" ref={scanlineRef}></div>

      <header>
        <div className="eyebrow">THE</div>
        <h1>APEX NODE</h1>
        <div className="hub">HUB</div>
        <p className="tagline">Arsenal numérique privé · Zéro trace · Total contrôle</p>
        <div className="divider"></div>
      </header>

      <main>
        {apps.map(app => (
          <a key={app.name} className="app" href="#">
            <div className="body">
              <span className="name">{app.name}</span>
              <span className={`chip${app.green ? ' green' : ''}`}>{app.tag}</span>
            </div>
            <div className="right">
              <div className="share-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="18" cy="5"  r="2.5" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <circle cx="18" cy="19" r="2.5" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <circle cx="6"  cy="12" r="2.5" stroke="#B7A8F5" strokeWidth="1.5"/>
                  <line x1="8.4"  y1="10.8" x2="15.6" y2="6.2"  stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="8.4"  y1="13.2" x2="15.6" y2="17.8" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </a>
        ))}
      </main>

      <footer>APEX NODE <b>●</b> 2026 — SOUVERAIN PAR DESIGN</footer>
    </>
  );
}
