/* PACELINE 3D showroom — Three.js scene + tilt cards */
(function () {
  'use strict';

  /* ---------- CSS 3D tilt on product cards ---------- */
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateZ(8px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'rotateY(0) rotateX(0)';
    });
  });

  if (!window.THREE) return; // Three.js failed to load — keep static fallback

  var canvas = document.getElementById('scene');
  if (!canvas) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (err) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe8d9b8, 14, 46);

  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 2.2, 9);

  /* Lights */
  scene.add(new THREE.AmbientLight(0xfff4e0, 0.75));
  var sun = new THREE.DirectionalLight(0xffe0b0, 1.1);
  sun.position.set(5, 10, 6);
  scene.add(sun);
  var rim = new THREE.DirectionalLight(0x9fd8ff, 0.5);
  rim.position.set(-6, 4, -6);
  scene.add(rim);

  /* Animated desert dunes (the design's hero backdrop, in low-poly 3D) */
  var geo = new THREE.PlaneGeometry(90, 90, 70, 70);
  geo.rotateX(-Math.PI / 2);
  var base = geo.attributes.position.array.slice();
  var duneMat = new THREE.MeshLambertMaterial({ color: 0xd9a06b, flatShading: true });
  var dunes = new THREE.Mesh(geo, duneMat);
  dunes.position.y = -1.4;
  scene.add(dunes);

  var t = 0;
  function wave(x, z) {
    return Math.sin(x * 0.16) * 1.1 + Math.cos(z * 0.13) * 0.9 + Math.sin((x + z) * 0.07) * 1.4;
  }

  /* Stylized running shoe built from primitives */
  var shoe = new THREE.Group();
  var white = new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.6 });
  var black = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.5, metalness: 0.3 });
  var lime = new THREE.MeshStandardMaterial({ color: 0xd9f651, roughness: 0.4 });
  var orange = new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.5 });

  /* sole */
  var sole = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.42, 1.35), white);
  sole.position.y = 0;
  sole.geometry = new THREE.BoxGeometry(3.4, 0.42, 1.35);
  shoe.add(sole);
  /* midsole accent */
  var mid = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.16, 1.3), lime);
  mid.position.y = -0.05;
  shoe.add(mid);
  /* heel counter */
  var heel = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.6, 0.5, 24), black);
  heel.rotation.z = Math.PI / 2;
  heel.scale.set(1, 1, 1.85);
  heel.position.set(-1.25, 0.45, 0);
  shoe.add(heel);
  /* upper toe/body */
  var upper = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), black);
  upper.scale.set(1.7, 0.62, 0.68);
  upper.position.set(0.15, 0.55, 0);
  shoe.add(upper);
  /* ankle collar */
  var collar = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.16, 12, 24), orange);
  collar.rotation.y = Math.PI / 2;
  collar.position.set(-1.05, 0.85, 0);
  shoe.add(collar);
  /* laces */
  for (var i = 0; i < 4; i++) {
    var lace = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.05, 8, 20), white);
    lace.rotation.x = Math.PI / 2;
    lace.rotation.z = 0.15;
    lace.position.set(-0.35 + i * 0.42, 0.95 - i * 0.05, 0);
    shoe.add(lace);
  }
  /* swoosh-ish stripe */
  var stripe = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.09, 8, 32, Math.PI * 0.9), lime);
  stripe.rotation.z = Math.PI * 1.1;
  stripe.position.set(0.2, 0.45, 0.66);
  shoe.add(stripe);
  var stripe2 = stripe.clone();
  stripe2.position.z = -0.66;
  shoe.add(stripe2);

  shoe.position.set(2.4, 1.6, 0);
  shoe.rotation.z = 0.12;
  scene.add(shoe);

  /* Dust particles */
  var pCount = 180;
  var pPos = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = Math.random() * 8;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var points = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xfff3d6, size: 0.08, transparent: true, opacity: 0.7 }));
  scene.add(points);

  /* Interaction state */
  var targetYaw = 0.5, yaw = 0.5;
  var targetPitch = 0, pitch = 0;
  var dragging = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', function (e) { dragging = true; px = e.clientX; py = e.clientY; });
  window.addEventListener('pointerup', function () { dragging = false; });
  window.addEventListener('pointermove', function (e) {
    if (dragging) {
      targetYaw += (e.clientX - px) * 0.006;
      targetPitch += (e.clientY - py) * 0.004;
      targetPitch = Math.max(-0.5, Math.min(0.6, targetPitch));
      px = e.clientX; py = e.clientY;
    }
  });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;

    /* dunes wave */
    var pos = geo.attributes.position.array;
    for (var i = 0; i < pos.length; i += 3) {
      var x = base[i], z = base[i + 2];
      pos[i + 1] = wave(x + t * 6, z) * 0.35;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    /* shoe float + slow spin (pausable while dragging for orbit feel) */
    shoe.position.y = 1.6 + Math.sin(t * 1.6) * 0.25;
    shoe.rotation.y += dragging ? 0 : 0.01;

    /* camera orbit from drag + scroll */
    var scroll = window.scrollY;
    var dive = Math.min(scroll / 900, 1);
    yaw += (targetYaw - yaw) * 0.06;
    pitch += (targetPitch - pitch) * 0.06;
    var radius = 9 - dive * 3.5;
    camera.position.x = Math.sin(yaw) * radius * 0.45;
    camera.position.z = Math.cos(yaw) * radius;
    camera.position.y = 2.2 - dive * 1.1 + pitch * 3;
    camera.lookAt(1.2, 1.1, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
