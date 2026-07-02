import { useEffect, useRef } from "react";
import * as THREE from "three";

const apps = [
  { name:"PrivateTalk",  tag:"VOIX",    icon:"📞", status:"live", green:false },
  { name:"BetVision AI", tag:"IA",      icon:"⚡", status:"beta", green:true  },
  { name:"IncoInfo",     tag:"OSINT",   icon:"🔍", status:"soon", green:false },
  { name:"VisionX",      tag:"FINANCE", icon:"📈", status:"soon", green:false },
  { name:"SARI",         tag:"IA",      icon:"🤖", status:"soon", green:true  },
];

const statusLabel = { live:"LIVE", beta:"BÊTA", soon:"BIENTÔT" };

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
  --beta:#5AC8FA;
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
header{position:relative;z-index:1;text-align:center;padding:min(40vh,380px) 0 26px}
.eyebrow{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.55em;color:var(--lav);text-indent:.55em}
h1{margin-top:10px;font-weight:700;font-size:clamp(40px,11vw,84px);letter-spacing:.08em;line-height:1;background:linear-gradient(100deg,var(--lav) 15%,var(--blue) 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
.hub{margin-top:8px;font-weight:500;font-size:clamp(20px,5vw,34px);letter-spacing:.6em;text-indent:.6em;color:var(--violet)}
.tagline{margin:22px auto 0;max-width:640px;padding:0 24px;font-family:'Space Mono',monospace;font-size:clamp(10px,2.8vw,13px);letter-spacing:.3em;line-height:2;color:var(--ink-dim);text-transform:uppercase}
.divider{margin:34px auto 0;width:min(86%,760px);height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,.55),rgba(79,156,249,.55),transparent);box-shadow:0 0 24px rgba(139,92,246,.35)}
main{position:relative;z-index:1;max-width:820px;margin:0 auto;padding:44px 20px 30px;display:flex;flex-direction:column;gap:18px}
.app{display:flex;align-items:center;gap:18px;padding:22px;background:var(--bg-card);border:1px solid var(--edge);border-radius:18px;backdrop-filter:blur(10px);text-decoration:none;color:inherit;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s}
.app:active{transform:scale(.99)}
.app:hover{border-color:rgba(139,92,246,.6);transform:translateY(-2px)}
.app.scanned{border-color:#C4B5FD;box-shadow:0 0 0 1px rgba(196,181,253,.7),0 0 34px rgba(139,92,246,.35)}
.app.scanned .icon{box-shadow:0 0 22px rgba(139,92,246,.6)}
.icon{width:56px;height:56px;flex:0 0 56px;display:grid;place-items:center;font-size:26px;background:rgba(139,92,246,.14);border:1px solid var(--edge);border-radius:14px;transition:box-shadow .3s}
.body{flex:1;min-width:0;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.name{font-weight:700;font-size:clamp(17px,4.4vw,22px);letter-spacing:.06em;text-transform:uppercase;color:var(--lav)}
.chip{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.16em;padding:4px 9px;border:1px solid var(--edge);border-radius:8px;color:var(--violet);text-transform:uppercase}
.chip.green{color:var(--live);border-color:rgba(61,220,151,.4)}
.right{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.status{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;padding:6px 14px;border-radius:10px;border:1px solid}
.status.live{color:var(--live);border-color:rgba(61,220,151,.5);background:rgba(61,220,151,.08)}
.status.beta{color:var(--beta);border-color:rgba(90,200,250,.5);background:rgba(90,200,250,.07)}
.status.soon{color:var(--ink-dim);border-color:rgba(158,147,201,.3)}
.arrow{color:var(--violet);font-size:18px}
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
    camera.position.set(0, 1.2, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x4A3E7A, 1.4));
    const l1 = new THREE.PointLight(0x8B5CF6, 2.4, 30); l1.position.set(5, 5, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0x4F9CF9, 2.0, 30); l2.position.set(-5, -2, 5); scene.add(l2);
    const l3 = new THREE.PointLight(0xC4B5FD, 1.0, 20); l3.position.set(0, -6, 3); scene.add(l3);

    const core = new THREE.Group();
    core.position.y = 2.4;
    scene.add(core);

    const hexGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.45, 6);
    const hexMat = new THREE.MeshStandardMaterial({ color:0x14102A, metalness:0.7, roughness:0.25, emissive:0x2A1E55, emissiveIntensity:0.5 });
    const hex = new THREE.Mesh(hexGeo, hexMat);
    hex.rotation.x = Math.PI / 2;
    core.add(hex);
    const hexEdges = new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo), new THREE.LineBasicMaterial({ color:0xB7A8F5, transparent:true, opacity:0.95 }));
    hexEdges.rotation.copy(hex.rotation);
    core.add(hexEdges);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.045, 16, 100), new THREE.MeshStandardMaterial({ color:0x8B5CF6, emissive:0x8B5CF6, emissiveIntensity:0.7, metalness:0.6, roughness:0.3 }));
    core.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.02, 16, 100), new THREE.MeshStandardMaterial({ color:0x4F9CF9, emissive:0x4F9CF9, emissiveIntensity:0.8, metalness:0.6, roughness:0.3 }));
    ringB.rotation.x = Math.PI / 3;
    core.add(ringB);
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.014, 12, 100), new THREE.MeshStandardMaterial({ color:0xC4B5FD, emissive:0xC4B5FD, emissiveIntensity:0.5, metalness:0.5, roughness:0.4 }));
    ringC.rotation.y = Math.PI / 3;
    core.add(ringC);

    const satGroup = new THREE.Group();
    core.add(satGroup);
    const satGeo = new THREE.OctahedronGeometry(0.16, 0);
    const satColors = [0x3DDC97, 0x5AC8FA, 0x8B5CF6, 0x9E93C9, 0x5AC8FA];
    const sats = [];
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color:satColors[i], emissive:satColors[i], emissiveIntensity:0.9, metalness:0.6, roughness:0.3 }));
      satGroup.add(m);
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color:satColors[i], transparent:true, opacity:0.25 }));
      satGroup.add(line);
      sats.push({ mesh:m, line, phase:i*(Math.PI*2/5), r:3.1, speed:0.35+i*0.06, tilt:(i%2?0.5:-0.3) });
    }

    const floaters = [];
    const miniGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 6);
    for (let i = 0; i < 26; i++) {
      const wire = Math.random() > 0.45;
      let m;
      if (wire) {
        m = new THREE.LineSegments(new THREE.EdgesGeometry(miniGeo), new THREE.LineBasicMaterial({ color:Math.random()>0.5?0x8B5CF6:0x4F9CF9, transparent:true, opacity:0.5 }));
      } else {
        m = new THREE.Mesh(miniGeo, new THREE.MeshStandardMaterial({ color:0x1C1634, metalness:0.6, roughness:0.4, emissive:0x2A1E55, emissiveIntensity:0.6 }));
      }
      m.position.set((Math.random()-0.5)*16, 3.5-Math.random()*16, -1-Math.random()*7);
      m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      m.scale.setScalar(0.5+Math.random()*1.4);
      m.userData = { spinX:(Math.random()-0.5)*0.01, spinY:(Math.random()-0.5)*0.01, baseY:m.position.y, amp:0.15+Math.random()*0.25, ph:Math.random()*Math.PI*2 };
      scene.add(m);
      floaters.push(m);
    }

    const grid = new THREE.GridHelper(60, 60, 0x8B5CF6, 0x2A1E55);
    const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
    mats.forEach(m => { m.transparent = true; m.opacity = 0.22; });
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

    let scrollFrac = 0;
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollFrac = max > 0 ? window.scrollY / max : 0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const SCAN_PERIOD = 7;
    function updateScan(t) {
      const y = -80 + ((t % SCAN_PERIOD) / SCAN_PERIOD) * (window.innerHeight + 180);
      scanEl.style.transform = 'translateY(' + y + 'px)';
      document.querySelectorAll('.app').forEach(c => {
        const r = c.getBoundingClientRect();
        c.classList.toggle('scanned', y > r.top && y < r.bottom);
      });
      const v = new THREE.Vector3();
      core.getWorldPosition(v);
      v.project(camera);
      const near = Math.max(0, 1 - Math.abs(y - (-v.y*0.5+0.5)*window.innerHeight) / 220);
      hexMat.emissiveIntensity = 0.5 + near*1.5;
      ringA.material.emissiveIntensity = 0.7 + near*1.0;
      ringB.material.emissiveIntensity = 0.8 + near*0.8;
    }

    let t = 0;
    const clock = new THREE.Clock();
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      t += dt;

      camera.position.y += (1.2 - scrollFrac*4.5 - camera.position.y) * 0.08;
      camera.position.x = Math.sin(t*0.15) * 0.4;
      camera.lookAt(0, camera.position.y + 1, 0);

      if (!reduced) {
        core.rotation.y += dt*0.25;
        hex.rotation.z += dt*0.15;
        hexEdges.rotation.copy(hex.rotation);
        ringA.rotation.z += dt*0.3;
        ringB.rotation.z -= dt*0.22;
        ringC.rotation.x += dt*0.18;
        core.position.y = 2.4 + Math.sin(t*0.8)*0.1;

        sats.forEach(s => {
          const a = t*s.speed + s.phase;
          const x = Math.cos(a)*s.r, z = Math.sin(a)*s.r, y = Math.sin(a*2)*s.tilt;
          s.mesh.position.set(x, y, z);
          s.mesh.rotation.y += dt*2;
          const pos = s.line.geometry.attributes.position.array;
          pos[0]=x*0.35; pos[1]=y*0.35; pos[2]=z*0.35; pos[3]=x; pos[4]=y; pos[5]=z;
          s.line.geometry.attributes.position.needsUpdate = true;
        });

        floaters.forEach(f => {
          f.rotation.x += f.userData.spinX;
          f.rotation.y += f.userData.spinY;
          f.position.y = f.userData.baseY + Math.sin(t*0.6 + f.userData.ph)*f.userData.amp;
        });

        starsFar.rotation.y  = t*0.004;
        starsMid.rotation.y  = -t*0.007;
        starsNear.rotation.y = t*0.011;
        grid.position.z = (t*0.6) % 1;
        updateScan(t);
      }

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
              <span className={`status ${app.status}`}>{statusLabel[app.status]}</span>
              <span className="arrow">→</span>
            </div>
          </a>
        ))}
      </main>

      <footer>APEX NODE <b>●</b> 2026 — SOUVERAIN PAR DESIGN</footer>
    </>
  );
}
