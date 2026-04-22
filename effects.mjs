/**
 * effects.js
 * Async visual effects library for the fourth-wall-breaking clicker game.
 * Every function returns a Promise that resolves when the effect is DONE.
 * Compose them with await, Promise.all, or chain them however you want.
 *
 * Usage:
 *   await shake(element);
 *   await fadeOut(element);
 *   await Promise.all([shake(el1), flash(el2)]);
 *   await typewriter(el, "hello world");
 */

// ─────────────────────────────────────────────
// CORE UTILITY
// ─────────────────────────────────────────────

/**
 * Wait for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run an animation on an element using the Web Animations API.
 * Resolves when the animation finishes.
 * @param {Element} el
 * @param {Keyframe[]} keyframes
 * @param {KeyframeAnimationOptions} options
 * @returns {Promise<void>}
 */
export function animate(el, keyframes, options) {
  return new Promise((resolve) => {
    const anim = el.animate(keyframes, options);
    anim.onfinish = () => resolve();
    anim.oncancel = () => resolve();
  });
}

// ─────────────────────────────────────────────
// TRANSFORM EFFECTS
// ─────────────────────────────────────────────

/**
 * Shake an element horizontally. Like when Badeline shows up uninvited.
 * @param {Element} el
 * @param {{ intensity?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function shake(el, { intensity = 8, duration = 400 } = {}) {
  const i = intensity;
  return animate(
    el,
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${i}px)` },
      { transform: `translateX(${i}px)` },
      { transform: `translateX(-${Math.round(i * 0.75)}px)` },
      { transform: `translateX(${Math.round(i * 0.75)}px)` },
      { transform: `translateX(-${Math.round(i * 0.4)}px)` },
      { transform: "translateX(0)" },
    ],
    { duration, easing: "ease-out" },
  );
}

/**
 * Bounce an element (pop up and back). Good for satisfying clicks.
 * @param {Element} el
 * @param {{ scale?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function bounce(el, { scale = 1.2, duration = 300 } = {}) {
  return animate(
    el,
    [
      { transform: "scale(1)" },
      { transform: `scale(${scale})`, offset: 0.4 },
      { transform: "scale(0.95)", offset: 0.7 },
      { transform: "scale(1)" },
    ],
    { duration, easing: "ease-out" },
  );
}

/**
 * Wobble an element (rotation shake). For when things feel WRONG.
 * @param {Element} el
 * @param {{ angle?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function wobble(el, { angle = 8, duration = 500 } = {}) {
  const a = angle;
  return animate(
    el,
    [
      { transform: "rotate(0deg)" },
      { transform: `rotate(-${a}deg)` },
      { transform: `rotate(${a}deg)` },
      { transform: `rotate(-${Math.round(a * 0.6)}deg)` },
      { transform: `rotate(${Math.round(a * 0.6)}deg)` },
      { transform: "rotate(0deg)" },
    ],
    { duration, easing: "ease-in-out" },
  );
}

/**
 * Slam an element down (scale punch effect). Like hitting a jump pad in GD.
 * @param {Element} el
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function slam(el, { duration = 350 } = {}) {
  return animate(
    el,
    [
      { transform: "scale(1.4)", opacity: "0.7" },
      { transform: "scale(0.92)", opacity: "1", offset: 0.6 },
      { transform: "scale(1)", opacity: "1" },
    ],
    { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
}

// ─────────────────────────────────────────────
// OPACITY / VISIBILITY EFFECTS
// ─────────────────────────────────────────────

/**
 * Fade an element out. It won't actually set display:none — that's your job.
 * @param {Element} el
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function fadeOut(el, { duration = 400 } = {}) {
  return animate(
    el,
    [{ opacity: getComputedStyle(el).opacity }, { opacity: "0" }],
    { duration, easing: "ease-out", fill: "forwards" },
  );
}

/**
 * Fade an element in. Make sure it's visible first (opacity:0 is fine).
 * @param {Element} el
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function fadeIn(el, { duration = 400 } = {}) {
  return animate(el, [{ opacity: "0" }, { opacity: "1" }], {
    duration,
    easing: "ease-in",
    fill: "forwards",
  });
}

/**
 * Flash an element on and off. Like a corrupted pixel in Celeste's mirror temple.
 * @param {Element} el
 * @param {{ times?: number, interval?: number }} options
 * @returns {Promise<void>}
 */
export function flash(el, { times = 3, interval = 120 } = {}) {
  return animate(
    el,
    [
      { opacity: "1" },
      ...Array.from({ length: times * 2 }, (_, i) => ({
        opacity: i % 2 === 0 ? "0" : "1",
        offset: (i + 1) / (times * 2),
      })),
      { opacity: "1" },
    ],
    { duration: interval * times * 2, easing: "steps(1)" },
  );
}

/**
 * Glitch flicker — rapid chaotic opacity flicker. For spooky narrative moments.
 * @param {Element} el
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function glitchFlicker(el, { duration = 600 } = {}) {
  const frames = Array.from({ length: 20 }, (_, i) => ({
    opacity: Math.random() > 0.4 ? "1" : "0",
    offset: i / 20,
  }));
  frames.push({ opacity: "1" });
  return animate(el, frames, { duration, easing: "steps(1)" });
}

// ─────────────────────────────────────────────
// COLOR / BACKGROUND EFFECTS
// ─────────────────────────────────────────────

/**
 * Flash the background of an element to a color, then restore it.
 * Great for "you got hit" or "something happened" feedback.
 * @param {Element} el
 * @param {{ color?: string, duration?: number }} options
 * @returns {Promise<void>}
 */
export function colorFlash(
  el,
  { color = "rgba(242,95,95,0.35)", duration = 400 } = {},
) {
  const original = el.style.backgroundColor;
  return animate(
    el,
    [
      { backgroundColor: color },
      { backgroundColor: original || "transparent" },
    ],
    { duration, easing: "ease-out" },
  );
}

/**
 * Pulse the background — a soft breathing glow effect.
 * @param {Element} el
 * @param {{ color?: string, duration?: number, times?: number }} options
 * @returns {Promise<void>}
 */
export function pulse(
  el,
  { color = "rgba(29,158,117,0.3)", duration = 800, times = 2 } = {},
) {
  return animate(
    el,
    [
      { backgroundColor: "transparent" },
      { backgroundColor: color },
      { backgroundColor: "transparent" },
    ],
    { duration, iterations: times, easing: "ease-in-out" },
  );
}

// ─────────────────────────────────────────────
// POSITION / ENTRANCE EFFECTS
// ─────────────────────────────────────────────

/**
 * Slide an element in from a direction.
 * @param {Element} el
 * @param {{ from?: 'left'|'right'|'top'|'bottom', distance?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function slideIn(
  el,
  { from = "bottom", distance = 40, duration = 450 } = {},
) {
  const axis = from === "left" || from === "right" ? "X" : "Y";
  const sign = from === "right" || from === "bottom" ? 1 : -1;
  return animate(
    el,
    [
      { transform: `translate${axis}(${sign * distance}px)`, opacity: "0" },
      { transform: "translate(0)", opacity: "1" },
    ],
    { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
  );
}

/**
 * Slide an element out to a direction.
 * @param {Element} el
 * @param {{ to?: 'left'|'right'|'top'|'bottom', distance?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function slideOut(
  el,
  { to = "bottom", distance = 40, duration = 350 } = {},
) {
  const axis = to === "left" || to === "right" ? "X" : "Y";
  const sign = to === "right" || to === "bottom" ? 1 : -1;
  return animate(
    el,
    [
      { transform: "translate(0)", opacity: "1" },
      { transform: `translate${axis}(${sign * distance}px)`, opacity: "0" },
    ],
    { duration, easing: "ease-in", fill: "forwards" },
  );
}

/**
 * Pop an element in from scale 0 — very Celeste crystal shard energy.
 * @param {Element} el
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function popIn(el, { duration = 400 } = {}) {
  return animate(
    el,
    [
      { transform: "scale(0)", opacity: "0" },
      { transform: "scale(1.12)", opacity: "1", offset: 0.7 },
      { transform: "scale(1)", opacity: "1" },
    ],
    { duration, easing: "ease-out", fill: "forwards" },
  );
}

// ─────────────────────────────────────────────
// TEXT EFFECTS
// ─────────────────────────────────────────────

/**
 * Typewriter effect — writes text into an element one character at a time.
 * Resolves when the full string is rendered.
 * @param {Element} el
 * @param {string} text
 * @param {{ speed?: number, clearFirst?: boolean }} options
 * @returns {Promise<void>}
 */
export function typewriter(el, text, { speed = 35, clearFirst = true } = {}) {
  return new Promise((resolve) => {
    if (clearFirst) el.textContent = "";
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

/**
 * Scramble text effect — letters randomize before settling into the final string.
 * Very "this is not what it seems" energy. 👁️
 * @param {Element} el
 * @param {string} finalText
 * @param {{ duration?: number, chars?: string }} options
 * @returns {Promise<void>}
 */
export function scrambleText(
  el,
  finalText,
  {
    duration = 800,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
  } = {},
) {
  return new Promise((resolve) => {
    const steps = Math.ceil(duration / 50);
    let step = 0;
    const tick = () => {
      const progress = step / steps;
      const resolved = Math.floor(progress * finalText.length);
      el.textContent =
        finalText.slice(0, resolved) +
        finalText
          .slice(resolved)
          .replace(/./g, () => chars[Math.floor(Math.random() * chars.length)]);
      step++;
      if (step <= steps) {
        setTimeout(tick, 50);
      } else {
        el.textContent = finalText;
        resolve();
      }
    };
    tick();
  });
}

/**
 * Count up a number displayed in an element.
 * @param {Element} el
 * @param {{ from?: number, to: number, duration?: number, format?: (n: number) => string }} options
 * @returns {Promise<void>}
 */
export function countUp(
  el,
  {
    from = 0,
    to,
    duration = 800,
    format = (n) => Math.round(n).toLocaleString(),
  } = {},
) {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(from + (to - from) * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = format(to);
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

// ─────────────────────────────────────────────
// SCREEN / OVERLAY EFFECTS
// ─────────────────────────────────────────────

/**
 * Screen shake — shakes the whole container element.
 * Geometry Dash death screen vibes. 💀
 * @param {Element} el  (usually document.body or a root container)
 * @param {{ intensity?: number, duration?: number }} options
 * @returns {Promise<void>}
 */
export function screenShake(el, { intensity = 12, duration = 500 } = {}) {
  const frames = Array.from({ length: 20 }, (_, i) => {
    const t = i / 20;
    const decay = 1 - t;
    const x = (Math.random() - 0.5) * 2 * intensity * decay;
    const y = (Math.random() - 0.5) * 2 * intensity * decay;
    return {
      transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`,
      offset: t,
    };
  });
  frames.push({ transform: "translate(0, 0)" });
  return animate(el, frames, { duration, easing: "linear" });
}

/**
 * Fade in a full-screen dark overlay (must be an element covering the screen).
 * @param {Element} overlayEl
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export function overlayShow(overlayEl, { duration = 400 } = {}) {
  overlayEl.style.opacity = "0";
  overlayEl.style.display = "flex";
  return fadeIn(overlayEl, { duration });
}

/**
 * Fade out and hide a full-screen overlay.
 * @param {Element} overlayEl
 * @param {{ duration?: number }} options
 * @returns {Promise<void>}
 */
export async function overlayHide(overlayEl, { duration = 300 } = {}) {
  await fadeOut(overlayEl, { duration });
  overlayEl.style.display = "none";
}

// ─────────────────────────────────────────────
// COMPOSITE / NARRATIVE EFFECTS
// ─────────────────────────────────────────────

/**
 * "Something is wrong" effect — combines glitch flicker + shake + color flash.
 * For when the game starts talking back. 👁️
 * @param {Element} el
 * @returns {Promise<void>}
 */
export async function somethingIsWrong(el) {
  await Promise.all([
    glitchFlicker(el, { duration: 400 }),
    colorFlash(el, { color: "rgba(242,95,95,0.2)", duration: 400 }),
  ]);
  await shake(el, { intensity: 6, duration: 300 });
}

/**
 * "Achievement unlocked" effect — bounce + pulse + countUp-friendly.
 * Like hitting a strawberry in Celeste. 🍓
 * @param {Element} el
 * @returns {Promise<void>}
 */
export async function achievement(el) {
  await Promise.all([
    bounce(el, { scale: 1.3, duration: 350 }),
    pulse(el, { color: "rgba(29,158,117,0.4)", duration: 350, times: 1 }),
  ]);
}

/**
 * "Dramatic reveal" — element slides in, then text scrambles into place.
 * @param {Element} containerEl  element to slide in
 * @param {Element} textEl       child element to scramble text into
 * @param {string} text          final text to display
 * @returns {Promise<void>}
 */
export async function dramaticReveal(containerEl, textEl, text) {
  await slideIn(containerEl, { from: "bottom", duration: 500 });
  await wait(200);
  await scrambleText(textEl, text, { duration: 900 });
}
