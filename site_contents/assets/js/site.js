import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// ------ Navigation/Hamburger ------ //
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", (e) => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      e.preventDefault();
    });
  }
  nav?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav.classList.remove("open");
  });
});

// ------ THREE.js Animation ------ //
const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.querySelector("#bg");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
renderer.setPixelRatio(dpr);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const jewel = new THREE.Mesh(
  new THREE.TorusKnotGeometry(8, 1.4, 120, 18),
  new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 1, roughness: .12 })
);
jewel.position.x = 18;
scene.add(jewel);

const pointLight = new THREE.PointLight(0xffffff, 1.3);
pointLight.position.set(18, 10, 20);

const rimLight = new THREE.PointLight(0xFFD27A, .6);
rimLight.position.set(-20, -10, -10);

scene.add(pointLight, rimLight, new THREE.AmbientLight(0xffffff, .1));

const particlesCount = prefersReduce ? 1500 : 4500;
const ptsGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < posArray.length; i++) posArray[i] = (Math.random() - .5) * 120;
ptsGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
const particles = new THREE.Points(
  ptsGeo,
  new THREE.PointsMaterial({ size: .02, color: 0xD4AF37, blending: THREE.AdditiveBlending })
);
scene.add(particles);

let mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", e => {
  mouseX = e.clientX, mouseY = e.clientY;
}, { passive: true });

const clock = new THREE.Clock();
let animId, isActive = true;

function animate() {
  if (!isActive) return;
  const t = clock.getElapsedTime();
  jewel.rotation.y = .12 * t;
  jewel.rotation.x = .10 * t;
  particles.rotation.y = -.015 * t;
  camera.position.x += (((mouseX / innerWidth) * 6 - 3) - camera.position.x) * .02;
  camera.position.y += (((-mouseY / innerHeight) * 6 + 3) - camera.position.y) * .02;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  animId = requestAnimationFrame(animate);
}
if (!prefersReduce) animate();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    isActive = false;
    cancelAnimationFrame(animId);
  } else {
    isActive = true;
    clock.start();
    animate();
  }
});
window.addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

// ------ Google Tag Manager ------ //
(function(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-MT456CP8');
