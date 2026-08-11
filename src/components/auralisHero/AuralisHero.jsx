"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import styles from "./auralisHero.module.css";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  float n  = snoise(uv * 2.5 + vec2(uTime * 0.4, uTime * 0.5));
  float n2 = snoise(uv * 1.5 - vec2(uTime * 0.3, uTime * 0.2));

  vec3 colorIndigo = vec3(0.31, 0.27, 0.90);
  vec3 colorCyan   = vec3(0.02, 0.71, 0.83);
  vec3 colorDeep   = vec3(0.15, 0.10, 0.50);

  float mixVal  = smoothstep(-0.6, 0.8, n);
  vec3  finalCl = mix(colorDeep, colorIndigo, mixVal);

  float mixVal2 = smoothstep(-0.4, 0.9, n2);
  finalCl = mix(finalCl, colorCyan, mixVal2 * 0.8);

  float alphaFade = smoothstep(-0.2, 0.6, uv.x);

  fragColor = vec4(finalCl, alphaFade);
}
`;

export default function AuralisHero({ onGetStarted, onRequestDemo }) {
  const canvasHostRef = useRef(null);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: true, antialias: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [host.offsetWidth, host.offsetHeight] },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });
    host.appendChild(gl.canvas);

    const resize = () => {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf;
    const tick = (t) => {
      program.uniforms.uTime.value = (t - start) * 0.0005;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.bgWrap} aria-hidden="true">
        <div className={styles.bgInner}>
          <div className={styles.canvasHost} ref={canvasHostRef} />
          <div className={styles.slices}>
            <div className={styles.slice1}></div>
            <div className={styles.slice2}></div>
            <div className={styles.slice3}></div>
            <div className={styles.slice4}></div>
            <div className={styles.slice5}></div>
          </div>
        </div>
      </div>

      <div className={styles.topFade} aria-hidden="true" />

      <div className={styles.container}>
        <main className={styles.hero}>
          <div className={styles.badge}>
            <iconify-icon icon="solar:letter-opened-linear" class={styles.badgeIcon}></iconify-icon>
            Interactive AMP email
          </div>

          <h1 className={styles.headline}>
            Interactive emails<br />
            that turn opens<br />
            <span className={styles.headlineAccent}>into orders.</span>
          </h1>

          <p className={styles.subhead}>
            Convertic builds AMP email programs that let shoppers browse, customize, and check out without leaving the inbox. It plugs straight into Klaviyo, renders live at open time, and needs no new ESP.
          </p>

          <div className={styles.ctaRow}>
            <a
              href="https://app.convertic.ai/users/register"
              className={styles.ctaPrimary}
              onClick={onGetStarted}
            >
              Get started
            </a>
            {/* Hidden for now (kept for later use), popup wiring left intact. */}
            <button
              type="button"
              className={styles.ctaSecondary}
              onClick={onRequestDemo}
              style={{ display: "none" }}
            >
              Request a demo
            </button>
          </div>
        </main>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <iconify-icon icon="solar:letter-opened-linear"></iconify-icon>
            </div>
            <div>
              <h3 className={styles.featureTitle}>In-email shopping</h3>
              <p className={styles.featureDesc}>Browse and buy at open time</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <iconify-icon icon="solar:soundwave-linear"></iconify-icon>
            </div>
            <div>
              <h3 className={styles.featureTitle}>Reviews and NPS</h3>
              <p className={styles.featureDesc}>Collected inside the inbox</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
            </div>
            <div>
              <h3 className={styles.featureTitle}>Klaviyo-native</h3>
              <p className={styles.featureDesc}>No new ESP needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
