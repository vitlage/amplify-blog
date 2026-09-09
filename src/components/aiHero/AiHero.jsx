"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef, useState } from "react";
import styles from "./aiHero.module.css";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Static recreation of the Stitch aurora frame: two soft wings on the left
// and right that follow a U-shaped peak curve, with a dim purple wash
// underneath. No animation.
const FRAG = `#version 300 es
precision highp float;

uniform vec2 uResolution;

out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute(i.y + vec3(0.0, i1.y, 1.0))
                  + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++){
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float xn = uv.x * 2.0 - 1.0;

  // STATIC composition — no time, no animation.

  // --- Bowl curve ---
  // Wide, gentle U: baseline sits low in the centre, wings rise off the top
  // corners.
  float bowlBase = 0.42 + 0.55 * xn * xn;
  // Tiny stationary noise so the dome edge isn't a perfect parabola.
  bowlBase += fbm(vec2(uv.x * 1.0, 7.0)) * 0.04;

  // Depth below the bowl edge: positive inside the aurora band.
  float dEdge = bowlBase - uv.y;

  // --- Band envelope ---
  // Soft cutoff at the bowl edge.
  float topAlpha = smoothstep(0.0, 0.03, dEdge);

  // Strong side-bias: aurora lives on the outer ~60% of each side. Centre dark.
  float sideMask = pow(clamp(abs(xn), 0.0, 1.0), 0.55);

  // Depth falloff: wings stay bright far below the edge; the centre fades
  // quickly away from the bowl edge.
  float depthAlpha = mix(exp(-dEdge * 3.5), 1.0, sideMask * 0.85);

  // --- Stationary striation field ---
  // Domain warp uses only spatial coords (no uTime) so the result is static.
  vec2 warpUV = vec2(
    uv.x + fbm(vec2(uv.y * 1.6, uv.x * 0.7 + 3.0)) * 0.18,
    dEdge + fbm(vec2(uv.x * 1.8, dEdge * 1.1 + 5.0)) * 0.05
  );
  float s1 = fbm(vec2(warpUV.x * 3.5,        warpUV.y * 1.2));
  float s2 = fbm(vec2(warpUV.x * 5.5 + 11.0, warpUV.y * 1.8));
  float s3 = fbm(vec2(warpUV.x * 4.2 + 23.0, warpUV.y * 1.5));

  // Palette sampled from the target frame.
  vec3 deepIndigo = vec3(0.10, 0.08, 0.30);
  vec3 violet     = vec3(0.42, 0.32, 0.84);
  vec3 lavender   = vec3(0.55, 0.48, 0.94);
  vec3 cyan       = vec3(0.435, 0.729, 0.875); // #6FBADA — left-wing cast
  vec3 magenta    = vec3(0.62,  0.45,  0.92);  // soft pink lip

  // Body: indigo at the bowl edge, brightening to violet/lavender below.
  vec3 col = mix(deepIndigo, violet, smoothstep(-0.01, 0.08, dEdge));
  col = mix(col, lavender, smoothstep(0.05, 0.4, dEdge) * 0.55);
  col = mix(col, lavender, smoothstep(0.1, 0.9, s1) * 0.30);

  // Concentrate accents near the bowl edge.
  float edgeFavor = exp(-pow((dEdge - 0.04) / 0.08, 2.0));

  // Left wing tilts cyan, right wing tilts magenta — colour the streak by xn.
  float cyanStreak = smoothstep(0.30, 0.80, s2);
  vec3  cyanLeft   = mix(cyan, lavender, smoothstep(0.0, 1.0, xn + 0.5));
  col = mix(col, cyanLeft, cyanStreak * edgeFavor * 0.95);

  float magStreak = smoothstep(0.32, 0.78, s3);
  col = mix(col, magenta, magStreak * edgeFavor * 0.55);

  // Thin bright lip at the bowl boundary.
  float edgeLip = exp(-pow((dEdge - 0.008) / 0.015, 2.0)) * smoothstep(0.0, 0.02, dEdge);
  vec3 lipColor = mix(magenta, cyan, smoothstep(0.30, 0.70, s2));
  col += lipColor * edgeLip * 0.80;

  // Apply dome mask, depth envelope, and side-bias (floor 0.08 so centre
  // truly darkens out).
  col *= topAlpha * depthAlpha * mix(0.08, 1.0, sideMask);

  // Faint halo just above the bowl edge so the cutoff isn't hard.
  float glow = exp(-pow(-dEdge / 0.04, 2.0)) * step(dEdge, 0.0);
  col += mix(violet, magenta, 0.4) * glow * 0.18;

  // Soft bottom-of-screen fade.
  float bottomFade = smoothstep(0.0, 0.10, uv.y);
  col *= mix(0.15, 1.0, bottomFade);

  // Hash grain to prevent banding.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.012;

  // Tone shaping.
  col = col / (col + vec3(0.85));
  col *= 1.70;

  fragColor = vec4(col, 1.0);
}
`;

const EXAMPLES = [
  { label: "Welcome flow for a coffee subscription brand", type: "Welcome" },
  { label: "Abandoned cart with a one-tap re-add", type: "Cart" },
  { label: "Post-purchase review with a 1-5 star rating", type: "Review" },
  { label: "Back in stock with an inline size picker", type: "Restock" },
];

const TOGGLE_OPTIONS = ["Welcome", "Promo", "Cart"];

export default function AiHero() {
  const canvasHostRef = useRef(null);
  const [activeType, setActiveType] = useState("Welcome");
  const [activePrompt, setActivePrompt] = useState(EXAMPLES[0].label);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: false, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uResolution: { value: [host.offsetWidth, host.offsetHeight] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    host.appendChild(gl.canvas);

    function render() {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
      renderer.render({ scene: mesh });
    }
    render();
    window.addEventListener("resize", render);

    return () => {
      window.removeEventListener("resize", render);
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <section className={styles.aiHero} aria-label="Try Convertic">
      <div className={styles.canvasHost} ref={canvasHostRef} aria-hidden="true" />
      <div className={styles.fadeBottom} aria-hidden="true" />
      <div className={styles.content}>
        <h2 className={styles.headline}>Try it. Type an email idea.</h2>
        <p className={styles.subtitle}>
          See how a plain prompt becomes a working AMP email a customer can interact with. No template, no dev work.
        </p>

        <div className={styles.promptBox}>
          <div
            className={styles.promptInput}
            role="textbox"
            aria-readonly="true"
            tabIndex={0}
          >
            {activePrompt || (
              <span className={styles.placeholder}>What email campaign shall we build?</span>
            )}
          </div>

          <div className={styles.promptBottom}>
            <div className={styles.leftControls}>
              <button type="button" className={styles.iconButton} aria-label="Add attachment">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <div className={styles.toggle} role="radiogroup" aria-label="Email type">
                {TOGGLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={activeType === opt}
                    className={`${styles.toggleOption} ${activeType === opt ? styles.toggleOptionActive : ""}`}
                    onClick={() => setActiveType(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rightControls}>
              <div className={styles.modelPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.39 6.96L21 10l-5.5 4.16L17.5 22 12 18l-5.5 4 2-7.84L3 10l6.61-1.04Z" />
                </svg>
                <span>Convertic 1.5</span>
              </div>
              <a
                href="https://app.convertic.ai/users/register"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
                aria-label="Generate my email"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.chipsRow}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              className={styles.chip}
              onClick={() => {
                setActivePrompt(ex.label);
                setActiveType(ex.type === "Cart" ? "Cart" : "Welcome");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.chipIcon}>
                <path d="M12 2l1.7 5.3H19l-4.3 3.1L16.3 16 12 12.9 7.7 16l1.6-5.6L5 7.3h5.3z" />
              </svg>
              <span>{ex.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
