import { useEffect, useRef } from "react";

// Authored manifesto copy, grouped into paragraphs. Each paragraph is one block
// that the lens centres as a unit, so the screen shows a whole paragraph at a
// time. Lines inside a paragraph are explicit; long lines wrap as a safety net
// on narrow viewports. Spacing between paragraphs is driven by LINE_GAP_VH.
const PARAGRAPHS: string[][] = [
  [
    "There is work you take because it pays.",
    "There is work you take because it interests you.",
    "And then there is the other kind.",
    "The kind that keeps you up.",
  ],
  ["That work deserves more."],
  [
    "Some work is bigger than any one pair of hands.",
    "So independent practices came together,",
    "each with its own craft,",
    "drawn by the work and by each other,",
    "until it could finally be carried the way it deserved.",
  ],
  [
    "It became a cooperative.",
    "One member, one vote. Every voice weighs the same.",
    "The work flows to whoever can carry it best.",
    "And the credit stays with the work,",
    "because how it is built is part of what it stands for.",
  ],
  [
    "The work is carried long after the launch,",
    "when the applause has faded and the making goes on.",
    "Devotion outlasts attention.",
  ],
  [
    "If what you are building matters to the people you serve,",
    "there is a place for it here,",
    "people who carry it with you and stay.",
  ],
];

// Lens distortion, per axis. 0 = none; distortion is ~zero at the centre and
// grows outward.
// LENS_STRENGTH_X compresses the text horizontally toward the left/right edges
//   (centre stays 1:1). Kept at 0 so horizontal stays undistorted.
// LENS_STRENGTH_Y is a vertical magnifier: the centre row stays 1:1 and the
//   text grows larger toward the top and bottom edges. Keep < 1 to stay
//   monotonic (no folding); larger = stronger top/bottom bulge.
const LENS_STRENGTH_X = 0;
const LENS_STRENGTH_Y = 1;

// Friction strip: a band across the middle of the viewport where the text
// scrolls slower (and squeezes slightly), easing back to normal above/below.
const FRICTION_STRENGTH = 1; // peak slowdown; 0 = off
const FRICTION_BAND = 1; // half-height of the band (fraction of viewport)

// Vertical pitch between consecutive paragraphs, as a fraction of the viewport
// height. 1.0 → when a paragraph is centred, the neighbours sit a full viewport
// away (off-screen), so one paragraph reads at a time. The top/centre/bottom
// anchors are preserved by the lens + friction warps, so this lands exactly.
const LINE_GAP_VH = 1.0;

// Upper bound on paragraphs, sizing the per-block uniform arrays in the shader.
const MAXLINES = 22;

// Carousel: line-stepping on scroll. A gentle flick advances one line; a faster
// or longer scroll accumulates distance and advances several (one more line per
// FAST_LINE_DELTA of wheel travel). Each step glides to dead-centre; at the
// section's ends the input is released to the page.
const SNAP_ENABLED = true;
const SNAP_DURATION = 1.2; // seconds for the glide (Lenis)
const SNAP_COOLDOWN = 120; // ms after a key/touch step before the next is allowed
const FAST_LINE_DELTA = 700; // accumulated wheel px that adds one extra line
const GESTURE_IDLE = 140; // ms without wheel events that ends a gesture
const TOUCH_THRESHOLD = 50; // px of swipe before a touch step fires

// Body-scale font for the lens. Small enough that a whole paragraph sits on
// screen at once: driven by viewport height (so paragraphs always fit) with a
// width guard and a hard cap.
function lensFontPx(viewportW: number, viewportH: number) {
  const byHeight = viewportH * 0.05;
  const byWidth = viewportW * 0.045;
  return Math.max(16, Math.min(byHeight, byWidth, 56));
}

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    // vUv.y = 0 at the top of the viewport (matches the text texture top).
    vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uKx;            // pincushion strength, horizontal
uniform float uKy;            // pincushion strength, vertical
uniform float uFricA;         // friction strip strength
uniform float uFricH;         // friction strip half-height
uniform float uScrollVH;      // viewports scrolled into the content
uniform float uGap;           // pitch between lines, in viewport heights
uniform float uVhOverCompact; // viewport px / compact-texture px
uniform int uN;               // number of lines
uniform float uCenterV[${MAXLINES}]; // each line's centre in the compact texture
uniform float uHalfV[${MAXLINES}];   // each line's half-height in the texture

const float PI = 3.14159265;

// Reparametrises the vertical axis so a band in the middle of the viewport is
// "slower": extra texture maps through the centre strip, so text decelerates
// (and squeezes a little) as it crosses the middle, then speeds back up. The
// area under the slope is preserved, so nothing is skipped -- not sticky, just
// slower. Outside the band motion is very slightly faster to compensate.
float frictionWarp(float y) {
    float d = y - 0.5;
    float bump;
    if (d <= -uFricH) {
        bump = 0.0;
    } else if (d >= uFricH) {
        bump = uFricA * uFricH;
    } else {
        bump = uFricA * 0.5 *
            ((d + uFricH) + (uFricH / PI) * sin(PI * d / uFricH));
    }
    return (y + bump) / (1.0 + uFricA * uFricH);
}

void main() {
    // Centred viewport coords, -1..1, reaching the edges of the screen.
    vec2 c = vUv * 2.0 - 1.0;

    // Horizontal: left undistorted (uKx = 0), centre at 1:1.
    // Vertical: magnifier along the y-axis. The centre row stays 1:1 and the
    // text grows larger toward the top and bottom edges (uKy controls how much).
    float xc = c.x * (1.0 + uKx * c.x * c.x);
    float yc = c.y / (1.0 + uKy * c.y * c.y);
    vec2 src = vec2(xc, yc);

    float u = src.x * 0.5 + 0.5;
    float yWarp = frictionWarp(src.y * 0.5 + 0.5);

    // Content position in viewport heights, then which line owns this pixel.
    float p = uScrollVH + yWarp;
    int li = int(floor(p / uGap));
    if (li < 0 || li >= uN || u < 0.0 || u > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // Distance from that line's centre, mapped from screen px to texture px.
    // The text lives in a compact, tightly-packed texture; the wide gaps
    // between lines are synthesised here rather than baked into the texture,
    // so glyphs stay at full resolution.
    float offsetVH = p - (float(li) + 0.5) * uGap;
    float dv = offsetVH * uVhOverCompact;

    // Fetch this line's centre / half-height. WebGL1 forbids indexing a uniform
    // array with a dynamic index, but a fixed-bound loop index is allowed, so we
    // select the matching line that way.
    float centerV = 0.0;
    float halfV = 0.0;
    for (int j = 0; j < ${MAXLINES}; j++) {
        if (j == li) {
            centerV = uCenterV[j];
            halfV = uHalfV[j];
            break;
        }
    }

    if (abs(dv) > halfV) {
        gl_FragColor = vec4(0.0); // in the gap between lines
        return;
    }

    gl_FragColor = texture2D(uTex, vec2(u, centerV + dv));
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return sh;
}

export default function ManifestoLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const srRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spacer = spacerRef.current;
    if (!canvas || !spacer) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) {
      // No WebGL: fall back to the plain accessible text.
      if (srRef.current) srRef.current.classList.remove("sr-only");
      return;
    }

    const color =
      (srRef.current && getComputedStyle(srRef.current).color) || "#000000";
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

    // --- Program -------------------------------------------------------
    const program = gl.createProgram();
    try {
      if (!program) throw new Error("createProgram failed");
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT_SRC));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link failed");
      }
      gl.useProgram(program);
    } catch (err) {
      // e.g. a driver that rejects dynamic array indexing: show the real text.
      console.error("ManifestoLens: shader setup failed, using text", err);
      if (program) gl.deleteProgram(program);
      if (srRef.current) srRef.current.classList.remove("sr-only");
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(program, "uTex");
    const uKx = gl.getUniformLocation(program, "uKx");
    const uKy = gl.getUniformLocation(program, "uKy");
    const uFricA = gl.getUniformLocation(program, "uFricA");
    const uFricH = gl.getUniformLocation(program, "uFricH");
    const uScrollVH = gl.getUniformLocation(program, "uScrollVH");
    const uGap = gl.getUniformLocation(program, "uGap");
    const uVhOverCompact = gl.getUniformLocation(program, "uVhOverCompact");
    const uN = gl.getUniformLocation(program, "uN");
    const uCenterV = gl.getUniformLocation(program, "uCenterV[0]");
    const uHalfV = gl.getUniformLocation(program, "uHalfV[0]");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // Constant settings: upload once (they never change per frame).
    gl.uniform1i(uTex, 0);
    gl.uniform1f(uKx, LENS_STRENGTH_X);
    gl.uniform1f(uKy, LENS_STRENGTH_Y);
    gl.uniform1f(uFricA, FRICTION_STRENGTH);
    gl.uniform1f(uFricH, FRICTION_BAND);

    const textCanvas = document.createElement("canvas");
    const tctx = textCanvas.getContext("2d")!;

    let lineCount = 0; // number of laid-out lines
    let compactHeightCss = 1; // height of the packed text texture, in CSS px

    // --- Rasterize the text into the offscreen canvas / texture --------
    const rasterize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fontPx = lensFontPx(vw, vh);
      const colWidth = vw * 1;
      const letterSpacing = -0.04 * fontPx; // tracking-[-0.04em]
      const font = `700 ${fontPx}px "ABC Favorit", sans-serif`;

      // Build one tight block per paragraph. Each authored line becomes a row,
      // wrapping by width only as a safety net on narrow viewports.
      tctx.font = font;
      tctx.letterSpacing = `${letterSpacing}px`;
      const blocks: string[][] = [];
      for (const paragraph of PARAGRAPHS) {
        const rows: string[] = [];
        for (const raw of paragraph) {
          const words = raw.toUpperCase().split(" ");
          let line = "";
          for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (tctx.measureText(test).width > colWidth && line) {
              rows.push(line);
              line = word;
            } else {
              line = test;
            }
          }
          if (line) rows.push(line);
        }
        blocks.push(rows);
      }

      // Spread each paragraph's rows vertically (small glyphs, generous leading)
      // so its outer lines reach far enough up/down that the vertical lens
      // visibly enlarges them. The tallest paragraph spans ~0.62 of a viewport.
      const maxRows = blocks.reduce((m, b) => Math.max(m, b.length), 1);
      const lineHeight = Math.max(fontPx * 1.2, (vh * 0.62) / maxRows);

      // Pack the blocks (almost) tightly so the texture stays small and crisp;
      // the on-screen gaps are synthesised in the shader. A small transparent
      // gutter separates blocks so LINEAR filtering at a block's edge fades to
      // nothing instead of bleeding the neighbouring block's glyphs.
      const n = Math.min(blocks.length, MAXLINES);
      const gutter = lineHeight * 0.5;
      const totalRows = blocks.reduce((s, b) => s + b.length, 0);
      compactHeightCss = totalRows * lineHeight + blocks.length * gutter;

      const rs = Math.min(dpr, maxTex / compactHeightCss, maxTex / vw);
      textCanvas.width = Math.max(1, Math.floor(vw * rs));
      textCanvas.height = Math.max(1, Math.floor(compactHeightCss * rs));

      tctx.setTransform(rs, 0, 0, rs, 0, 0);
      tctx.clearRect(0, 0, vw, compactHeightCss);
      tctx.font = font;
      tctx.letterSpacing = `${letterSpacing}px`;
      tctx.fillStyle = color;
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      const cx = vw / 2;

      const centers = new Float32Array(MAXLINES);
      const halves = new Float32Array(MAXLINES);
      let yCursor = 0; // CSS px down the packed texture
      blocks.forEach((rows, i) => {
        const blockH = rows.length * lineHeight;
        rows.forEach((row, k) => {
          tctx.fillText(row, cx, yCursor + (k + 0.5) * lineHeight);
        });
        if (i < MAXLINES) {
          centers[i] = (yCursor + blockH / 2) / compactHeightCss;
          halves[i] = blockH / 2 / compactHeightCss;
        }
        yCursor += blockH + gutter;
      });

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textCanvas,
      );

      // Static (per-layout) uniforms.
      lineCount = n;
      gl.uniform1i(uN, n);
      gl.uniform1f(uGap, LINE_GAP_VH);
      gl.uniform1fv(uCenterV, centers);
      gl.uniform1fv(uHalfV, halves);

      // Scroll length: one pitch (LINE_GAP_VH of a viewport) per line.
      spacer.style.height = `${n * LINE_GAP_VH * vh}px`;
    };

    // --- Sizing of the visible GL canvas (one viewport) ----------------
    const resizeGL = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // --- Render loop ---------------------------------------------------
    // The lens itself is static; redraw only when the scroll position (and
    // therefore which slice of text sits under the lens) actually changes.
    let raf = 0;
    let lastTop = NaN;
    let dirty = true;

    const frame = () => {
      const rect = spacer.getBoundingClientRect();
      if (rect.top !== lastTop || dirty) {
        lastTop = rect.top;
        dirty = false;

        const vh = window.innerHeight;
        const scrollVH = -rect.top / vh; // viewports scrolled into the content

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Only draw when some text is on screen.
        if (scrollVH + 1 > 0 && scrollVH < lineCount * LINE_GAP_VH) {
          gl.uniform1f(uScrollVH, scrollVH);
          gl.uniform1f(uVhOverCompact, vh / compactHeightCss);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    // --- Boot ----------------------------------------------------------
    let resizeT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resizeGL();
        rasterize();
        dirty = true;
      }, 150);
    };

    const start = () => {
      resizeGL();
      rasterize();
      raf = requestAnimationFrame(frame);
    };

    // --- Carousel: line-stepping on scroll -----------------------------
    // A line i is centred when scrollY = docTop + vh * ((i + 0.5) * gap - 0.5),
    // exactly where the lens places it (the centre column is warp-invariant).
    const idxFNow = () => {
      // window.scrollY cancels out: scrollY - docTop === -rect.top.
      const rect = spacer.getBoundingClientRect();
      return (-rect.top / window.innerHeight + 0.5) / LINE_GAP_VH - 0.5;
    };
    const inSection = (f: number) => f >= -0.5 && f <= lineCount - 0.5;
    const glideToLine = (idx: number) => {
      const vh = window.innerHeight;
      const rect = spacer.getBoundingClientRect();
      const docTop = rect.top + window.scrollY;
      const target = docTop + vh * ((idx + 0.5) * LINE_GAP_VH - 0.5);
      const lenis = (
        window as unknown as {
          lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void };
        }
      ).lenis;
      if (lenis?.scrollTo) lenis.scrollTo(target, { duration: SNAP_DURATION });
      else window.scrollTo({ top: target, behavior: "smooth" });
    };

    // Wheel / trackpad: accumulate one gesture's travel and step by it, so a
    // gentle flick moves one line and a fast/long scroll moves several. Capture
    // phase runs before Lenis's own wheel handler.
    let gActive = false; // a gesture is in progress
    let gDir = 0; // its direction
    let gBase = 0; // line index it started from
    let gIdx = 0; // line index it has reached so far
    let gAcc = 0; // accumulated |deltaY| this gesture
    let gIdleT: ReturnType<typeof setTimeout>;
    const endGesture = () => {
      gActive = false;
      clearTimeout(gIdleT);
    };
    const onWheel = (e: WheelEvent) => {
      if (lineCount === 0 || Math.abs(e.deltaY) < 1) return;
      const idxF = idxFNow();
      if (!inSection(idxF)) {
        endGesture();
        return; // outside the section: let the page scroll
      }
      const dir = e.deltaY > 0 ? 1 : -1;
      if (!gActive || dir !== gDir) {
        // Start a gesture from the line we're resting on (snap sub-pixel drift).
        let f = idxF;
        if (Math.abs(f - Math.round(f)) < 0.05) f = Math.round(f);
        gBase = dir > 0 ? Math.floor(f) : Math.ceil(f);
        gIdx = gBase;
        gDir = dir;
        gAcc = 0;
        gActive = true;
      }
      gAcc += Math.min(Math.abs(e.deltaY), 200); // clamp outliers
      const want = 1 + Math.floor(gAcc / FAST_LINE_DELTA);
      const raw = gBase + dir * want;
      const desired = Math.max(0, Math.min(lineCount - 1, raw));
      if (desired === gIdx && (raw < 0 || raw > lineCount - 1)) {
        endGesture();
        return; // pushing past an end: release to the page
      }
      if (desired !== gIdx) {
        gIdx = desired;
        glideToLine(gIdx);
      }
      clearTimeout(gIdleT);
      gIdleT = setTimeout(endGesture, GESTURE_IDLE);
      e.preventDefault();
      e.stopPropagation();
    };

    // Keyboard / touch: one line per press or swipe.
    let stepLocked = false;
    let stepLockT: ReturnType<typeof setTimeout>;
    const singleStep = (dir: number) => {
      if (lineCount === 0) return false;
      const idxF = idxFNow();
      if (!inSection(idxF)) return false;
      if (stepLocked) return true;
      let f = idxF;
      if (Math.abs(f - Math.round(f)) < 0.05) f = Math.round(f);
      const next = dir > 0 ? Math.floor(f) + 1 : Math.ceil(f) - 1;
      if (next < 0 || next > lineCount - 1) return false;
      glideToLine(next);
      stepLocked = true;
      clearTimeout(stepLockT);
      stepLockT = setTimeout(
        () => (stepLocked = false),
        SNAP_DURATION * 1000 + SNAP_COOLDOWN,
      );
      return true;
    };
    const onKey = (e: KeyboardEvent) => {
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;
      if (dir && singleStep(dir)) e.preventDefault();
    };
    let touchY: number | null = null;
    let touchStepped = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      touchStepped = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      if (touchStepped) {
        if (inSection(idxFNow())) e.preventDefault(); // absorb rest of the swipe
        return;
      }
      const dy = touchY - e.touches[0].clientY; // swipe up (dy>0) → next line
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      if (singleStep(dy > 0 ? 1 : -1)) {
        touchStepped = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onTouchEnd = () => (touchY = null);

    if (SNAP_ENABLED) {
      window.addEventListener("wheel", onWheel, {
        capture: true,
        passive: false,
      });
      window.addEventListener("keydown", onKey);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, {
        capture: true,
        passive: false,
      });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    // Wait for the custom font so glyphs rasterize correctly.
    if (document.fonts) {
      document.fonts
        .load(`700 90px "ABC Favorit"`)
        .catch(() => {})
        .finally(() => {
          start();
          // Re-rasterize once all fonts are settled.
          document.fonts.ready.then(() => {
            rasterize();
            dirty = true;
          });
        });
    } else {
      start();
    }

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      clearTimeout(gIdleT);
      clearTimeout(stepLockT);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd);
      gl.deleteTexture(texture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <>
      {/* Accessible / fallback copy. Revealed if WebGL is unavailable. */}
      <div ref={srRef} className="sr-only">
        {PARAGRAPHS.map((paragraph, i) => (
          <p key={i}>
            {paragraph.map((line, j) => (
              <span key={j}>
                {line}
                <br />
              </span>
            ))}
          </p>
        ))}
      </div>

      {/* Reserves the scroll height the text occupies. */}
      <div
        ref={spacerRef}
        data-manifesto-spacer
        aria-hidden
        className="mt-[98vh] pb-2 pointer-events-none"
      />

      {/* The lens: a fixed pane the text scrolls beneath. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[60]"
      />
    </>
  );
}
