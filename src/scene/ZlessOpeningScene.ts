import * as THREE from "three";

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};

const setOpacity = (object: THREE.Object3D, opacity: number) => {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
      entry.transparent = true;
      entry.opacity = opacity;
      entry.needsUpdate = true;
    });
  });
};

export class ZlessOpeningScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  private startedAt = performance.now();
  private frame = 0;
  private progress = 0;
  private logoGroup = new THREE.Group();
  private trailGroup = new THREE.Group();
  private earthGroup = new THREE.Group();
  private stars?: THREE.Points;
  private birthLight: THREE.PointLight;
  private keyLight: THREE.PointLight;
  private resizeObserver: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x010307, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.position.set(0, 0.8, 9);
    this.scene.fog = new THREE.FogExp2(0x020817, 0.055);

    this.birthLight = new THREE.PointLight(0x66b6ff, 0, 8);
    this.birthLight.position.set(-2.8, -1.3, 2);
    this.keyLight = new THREE.PointLight(0xffffff, 2.4, 12);
    this.keyLight.position.set(1.6, 1.2, 3);

    this.scene.add(new THREE.AmbientLight(0x7ea8ff, 0.28), this.birthLight, this.keyLight);
    this.scene.add(this.createStars(), this.createLogo(), this.createTrail(), this.createEarth());

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.render();
  }

  setProgress(progress: number) {
    this.progress = Math.min(1, Math.max(0, progress));

    const logo = smoothstep(0.14, 0.34, this.progress);
    const trail = smoothstep(0.42, 0.58, this.progress);
    const earth = smoothstep(0.52, 0.72, this.progress);
    const settle = smoothstep(0.78, 0.96, this.progress);

    setOpacity(this.logoGroup, Math.max(0, logo));
    setOpacity(this.trailGroup, Math.max(0, trail));
    setOpacity(this.earthGroup, Math.max(0, earth));

    this.birthLight.intensity = 0.4 + logo * 1.8 + trail * 2.2;
    this.keyLight.intensity = 1.2 + logo * 1.6;

    this.logoGroup.position.set(THREE.MathUtils.lerp(0, -2.95, settle), THREE.MathUtils.lerp(0.2, 1.58, settle), 0);
    this.logoGroup.scale.setScalar(THREE.MathUtils.lerp(1, 0.32, settle));
    this.logoGroup.rotation.z = THREE.MathUtils.lerp(-0.16, -0.34, trail);

    this.camera.position.x = THREE.MathUtils.lerp(0.4, -1.35, settle);
    this.camera.position.y = THREE.MathUtils.lerp(0.85, 1.1, smoothstep(0.3, 1, this.progress));
    this.camera.position.z = THREE.MathUtils.lerp(9.2, 7.1, this.progress);
    this.camera.lookAt(0, 0.15, 0);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
      else material?.dispose();
    });
    this.renderer.dispose();
  }

  private resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private render = () => {
    const elapsed = (performance.now() - this.startedAt) / 1000;

    this.logoGroup.rotation.y = Math.sin(elapsed * 0.45) * 0.08;
    this.logoGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.035;
    this.trailGroup.rotation.z = -0.2 + Math.sin(elapsed * 0.22) * 0.02;
    this.earthGroup.rotation.y = elapsed * 0.018;

    if (this.stars) {
      this.stars.rotation.y = elapsed * 0.008;
      this.stars.rotation.x = Math.sin(elapsed * 0.08) * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.render);
  };

  private createStars() {
    const geometry = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 16 + Math.random() * 52;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + THREE.MathUtils.randFloatSpread(2);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 12;

      const blue = 0.62 + Math.random() * 0.38;
      colors[i * 3] = 0.65 * blue;
      colors[i * 3 + 1] = 0.78 * blue;
      colors[i * 3 + 2] = blue;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });

    this.stars = new THREE.Points(geometry, material);
    return this.stars;
  }

  private createLogo() {
    const metal = new THREE.MeshStandardMaterial({
      color: 0xbfc8d6,
      metalness: 0.92,
      roughness: 0.18,
      transparent: true,
      opacity: 0,
      emissive: 0x0b1a2f,
      emissiveIntensity: 0.25,
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.045, 18, 120, Math.PI * 1.48), metal);
    ringA.rotation.z = 0.08;

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.045, 18, 120, Math.PI * 1.48), metal);
    ringB.rotation.z = Math.PI + 0.08;

    const slash = new THREE.Mesh(new THREE.BoxGeometry(2.78, 0.16, 0.08), metal);
    slash.rotation.z = -0.52;

    const slashCore = new THREE.Mesh(
      new THREE.BoxGeometry(2.26, 0.035, 0.095),
      new THREE.MeshBasicMaterial({ color: 0x9dd7ff, transparent: true, opacity: 0 })
    );
    slashCore.rotation.z = -0.52;
    slashCore.position.z = 0.055;

    this.logoGroup.add(ringA, ringB, slash, slashCore);
    this.logoGroup.position.y = 0.2;
    setOpacity(this.logoGroup, 0);
    return this.logoGroup;
  }

  private createTrail() {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, -2.5, -0.7),
      new THREE.Vector3(-2.2, -1.5, -0.2),
      new THREE.Vector3(-0.4, -0.08, 0.25),
      new THREE.Vector3(2.6, 1.55, -0.15),
      new THREE.Vector3(5.4, 3.2, -1.5),
    ]);

    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 160, 0.018, 10, false),
      new THREE.MeshBasicMaterial({ color: 0x4bb5ff, transparent: true, opacity: 0 })
    );
    tube.renderOrder = 2;

    const glow = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 160, 0.075, 10, false),
      new THREE.MeshBasicMaterial({
        color: 0x1379ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );

    const orbitPoints = Array.from({ length: 180 }, (_, index) => {
      const angle = (index / 179) * Math.PI * 1.18 + Math.PI * 1.03;
      return new THREE.Vector3(Math.cos(angle) * 4.8, Math.sin(angle) * 1.35 - 2.15, -0.55);
    });
    const orbit = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPoints),
      new THREE.LineBasicMaterial({
        color: 0x67c0ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );

    this.trailGroup.add(glow, tube, orbit);
    setOpacity(this.trailGroup, 0);
    return this.trailGroup;
  }

  private createEarth() {
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(8.4, 96, 48),
      new THREE.MeshPhongMaterial({
        color: 0x071122,
        emissive: 0x061d48,
        emissiveIntensity: 0.42,
        shininess: 18,
        transparent: true,
        opacity: 0,
      })
    );
    earth.position.set(0, -8.1, -2.4);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(8.42, 0.018, 8, 160, Math.PI),
      new THREE.MeshBasicMaterial({
        color: 0x8ed8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    rim.position.set(0, -1.12, -2.34);
    rim.rotation.x = Math.PI / 2;

    const sunrise = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    sunrise.position.set(0.15, -1.08, -1.78);
    sunrise.scale.set(1, 0.18, 1);

    const city = new THREE.Group();
    for (let i = 0; i < 34; i += 1) {
      const height = 0.04 + Math.random() * 0.18;
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, height, 0.035),
        new THREE.MeshBasicMaterial({ color: 0xb9dcff, transparent: true, opacity: 0 })
      );
      tower.position.set(-1.15 + i * 0.07, -1.2 + height / 2, -1.72 + Math.random() * 0.08);
      city.add(tower);
    }

    this.earthGroup.add(earth, rim, sunrise, city);
    setOpacity(this.earthGroup, 0);
    return this.earthGroup;
  }
}
