// src/ReactBits/Aurora.jsx
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useState } from "react";

/**
 * Final Aurora (dark-theme friendly)
 * - blends correctly on dark backgrounds
 * - accepts hex colorStops
 * - transparent canvas behind children
 */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

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

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  // DARK-THEME FRIENDLY: do not premultiply color by alpha (prevents white flash)
  fragColor = vec4(auroraColor, auroraAlpha);
}
`;

// helper: convert "#rrggbb" to [r,g,b] 0..1
function hexToRgbArray(hex) {
  if (!hex) return [1, 1, 1];
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b];
}

export default function Aurora(props) {
  const {
    colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
    amplitude = 1.8,
    blend = 0.9,
    speed = 1.0,
    style = {},
  } = props;

  const ctnDom = useRef(null);
  const programRef = useRef(null);
  const rafRef = useRef(null);
  const rendererRef = useRef(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // quick WebGL2 check
    const testCanvas = document.createElement("canvas");
    const gl2 = testCanvas.getContext && testCanvas.getContext("webgl2");
    if (!gl2) {
      console.warn("Aurora: WebGL2 not available in this browser. Falling back to CSS blobs.");
      setWebglOk(false);
      return;
    }

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false, // ensure correct blending for dark bg
      antialias: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Use standard alpha blending (good for dark backgrounds)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // create geometry
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    // prepare initial color stops as vec3 arrays
    const colorStopsArray = colorStops.slice(0, 3).map((hex) => hexToRgbArray(hex));

    let program;
    try {
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth || window.innerWidth, ctn.offsetHeight || window.innerHeight] },
          uBlend: { value: blend },
        },
      });
      programRef.current = program;
    } catch (err) {
      console.error("Aurora: Program init failed", err);
      setWebglOk(false);
      return;
    }

    const mesh = new Mesh(gl, { geometry, program });

    // append canvas inside container and style it to sit behind children
    const canvas = renderer.gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.inset = "0px";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    canvas.style.background = "transparent";

    // ensure container has position relative so absolute canvas fits
    const prevPos = window.getComputedStyle(ctn).position;
    if (prevPos === "static" || !prevPos) {
      ctn.style.position = "relative";
    }

    if (!ctn.contains(canvas)) ctn.insertBefore(canvas, ctn.firstChild);

    function resize() {
      const w = ctn.offsetWidth || window.innerWidth;
      const h = ctn.offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      if (programRef.current) programRef.current.uniforms.uResolution.value = [w, h];
    }
    window.addEventListener("resize", resize);
    resize();

    let start = performance.now();
    function update(now) {
      rafRef.current = requestAnimationFrame(update);
      const t = (now - start) * 0.001 * (speed || 1.0);
      if (!programRef.current) return;
      programRef.current.uniforms.uTime.value = t * 0.1;
      // sync dynamic props (amplitude/blend/colorStops) from props
      programRef.current.uniforms.uAmplitude.value = props.amplitude ?? amplitude;
      programRef.current.uniforms.uBlend.value = props.blend ?? blend;
      const stops = (props.colorStops ?? colorStops).slice(0,3).map(hex => hexToRgbArray(hex));
      programRef.current.uniforms.uColorStops.value = stops;
      renderer.render({ scene: mesh });
    }
    rafRef.current = requestAnimationFrame(update);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      try {
        if (ctn && canvas && canvas.parentNode === ctn) ctn.removeChild(canvas);
      } catch (e) {}
      try {
        renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (e) {}
      try {
        rendererRef.current && (rendererRef.current.gl = null);
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // If webgl not available, set simple CSS background so user content still visible
  if (!webglOk) {
    return (
      <div ref={ctnDom} style={{ position: "relative", minHeight: "100vh", ...style }}>
        {/* simple blurred CSS blobs fallback */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute",
            width: 700,
            height: 420,
            left: -120,
            top: -80,
            background: `radial-gradient(circle at 30% 30%, ${colorStops[0]}, transparent 40%)`,
            filter: "blur(80px) saturate(120%)",
            animation: "auroraBlob1 12s ease-in-out infinite",
            opacity: 0.9
          }} />
          <div style={{
            position: "absolute",
            width: 900,
            height: 500,
            right: -200,
            top: "18%",
            background: `radial-gradient(circle at 70% 40%, ${colorStops[1]}, transparent 45%)`,
            filter: "blur(100px) saturate(120%)",
            animation: "auroraBlob2 14s ease-in-out infinite",
            opacity: 0.85
          }} />
          <div style={{
            position: "absolute",
            width: 600,
            height: 360,
            left: "10%",
            bottom: -80,
            background: `radial-gradient(circle at 40% 60%, ${colorStops[2]}, transparent 45%)`,
            filter: "blur(80px) saturate(110%)",
            animation: "auroraBlob3 16s ease-in-out infinite",
            opacity: 0.82
          }} />
          <style>{`
            @keyframes auroraBlob1 { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(30px,-30px,0) } 100% { transform: translate3d(0,0,0) } }
            @keyframes auroraBlob2 { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(-50px,20px,0) } 100% { transform: translate3d(0,0,0) } }
            @keyframes auroraBlob3 { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(20px,40px,0) } 100% { transform: translate3d(0,0,0) } }
          `}</style>
        </div>

        {/* content wrapper above background */}
        <div style={{ position: "relative", zIndex: 10 }}>
          {props.children}
        </div>
      </div>
    );
  }

  // normal case: webgl canvas will be inserted; render children wrapper
  return (
    <div ref={ctnDom} style={{ position: "relative", minHeight: "100vh", ...style }}>
      <div style={{ position: "relative", zIndex: 10 }}>
        {props.children}
      </div>
    </div>
  );
}
