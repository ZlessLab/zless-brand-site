import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

const bell = (center: number, width: number, value: number) => {
  const distance = Math.abs(value - center) / width;
  return clamp01(1 - distance) ** 2;
};

const setOpacity = (object: THREE.Object3D, opacity: number) => {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite;
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
      const baseOpacity =
        typeof entry.userData.baseOpacity === "number"
          ? entry.userData.baseOpacity
          : entry.opacity > 0
            ? entry.opacity
            : 1;
      entry.userData.baseOpacity = baseOpacity;
      entry.transparent = true;
      entry.opacity = opacity * baseOpacity;
      if (entry instanceof THREE.ShaderMaterial && entry.uniforms.uOpacity) {
        entry.uniforms.uOpacity.value = opacity * baseOpacity;
      }
      entry.needsUpdate = true;
    });
  });
};

export class ZlessOpeningScene {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
  private startedAt = performance.now();
  private frame = 0;
  private progress = 0;
  private aspect = 1;
  private textures: THREE.Texture[] = [];
  private starField?: THREE.Points;
  private seedGroup = new THREE.Group();
  private logoGroup = new THREE.Group();
  private energyGroup = new THREE.Group();
  private particleGroup = new THREE.Group();
  private earthGroup = new THREE.Group();
  private impactLight: THREE.PointLight;
  private rimLight: THREE.PointLight;
  private keyLight: THREE.DirectionalLight;
  private resizeObserver: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;

    this.camera.position.set(0, 0.2, 9.2);
    this.scene.fog = new THREE.FogExp2(0x020712, 0.045);
    this.scene.environment = this.createEnvironmentTexture();

    this.impactLight = new THREE.PointLight(0x9fdcff, 0, 12);
    this.impactLight.position.set(0, 0, 2.2);
    this.rimLight = new THREE.PointLight(0x5fb9ff, 0, 18);
    this.rimLight.position.set(-3.2, -1.8, 2.4);
    this.keyLight = new THREE.DirectionalLight(0xffffff, 0.15);
    this.keyLight.position.set(2.6, 3.2, 4);

    this.scene.add(
      new THREE.AmbientLight(0x99b8ff, 0.04),
      this.keyLight,
      this.impactLight,
      this.rimLight,
      this.createStars(),
      this.createDistantLight(),
      this.createLogo(),
      this.createEnergyLine(),
      this.createEnergyParticles(),
      this.createEarthHorizon()
    );

    const renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.74, 0.58, 0.18);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.setProgress(0);
    this.render();
  }

  setProgress(progress: number) {
    this.progress = clamp01(progress);

    const seed = smoothstep(0.12, 0.27, this.progress) * (1 - smoothstep(0.42, 0.58, this.progress) * 0.72);
    const formation = smoothstep(0.24, 0.52, this.progress);
    const quiet = smoothstep(0.52, 0.66, this.progress);
    const logo = smoothstep(0.56, 0.76, this.progress);
    const energy = formation * (1 - quiet * 0.56) * (1 - smoothstep(0.76, 0.92, this.progress) * 0.58);
    const impact = bell(0.49, 0.11, this.progress) * 0.55;
    const earth = smoothstep(0.44, 0.72, this.progress);
    const finalSettle = smoothstep(0.62, 0.84, this.progress);
    const textSpace = smoothstep(0.70, 0.9, this.progress);

    setOpacity(this.seedGroup, seed);
    setOpacity(this.logoGroup, Math.min(0.98, (formation * 0.38 + logo * 0.72) * (1 - textSpace * 0.08)));
    setOpacity(this.energyGroup, energy * 0.68);
    setOpacity(this.particleGroup, energy * (0.22 + impact * 0.42));
    setOpacity(this.earthGroup, earth);

    if (this.starField) {
      const material = this.starField.material as THREE.PointsMaterial;
      material.opacity = smoothstep(0.18, 0.38, this.progress) * 0.22;
    }

    this.impactLight.intensity = seed * 0.42 + logo * 1.2 + energy * 1.15 + impact * 3.4;
    this.rimLight.intensity = earth * 1.25 + impact * 1.4;
    this.keyLight.intensity = 0.05 + logo * 0.72 + impact * 0.12;
    this.bloomPass.strength = 0.42 + seed * 0.24 + energy * 0.32 + impact * 0.42 + earth * 0.08;
    this.bloomPass.radius = 0.44 + impact * 0.08;
    this.bloomPass.threshold = THREE.MathUtils.lerp(0.34, 0.18, energy + impact);

    const mobileScale = this.aspect < 0.8 ? 0.78 : 1;
    this.logoGroup.scale.setScalar(THREE.MathUtils.lerp(0.82, 1.56 * mobileScale, formation * 0.55 + logo * 0.45) * (1 - textSpace * 0.16));
    this.logoGroup.position.set(THREE.MathUtils.lerp(0, -0.56, textSpace), THREE.MathUtils.lerp(0.08, 1.12, finalSettle), 0);
    this.logoGroup.rotation.z = THREE.MathUtils.lerp(-0.1, -0.2, formation);

    this.energyGroup.scale.setScalar(THREE.MathUtils.lerp(0.96, 1.08, impact));
    this.energyGroup.position.y = THREE.MathUtils.lerp(-0.16, 0.08, finalSettle);
    this.particleGroup.position.copy(this.energyGroup.position);

    this.earthGroup.position.y = THREE.MathUtils.lerp(-0.35, -0.1, earth);
    this.earthGroup.scale.setScalar(THREE.MathUtils.lerp(0.94, 1.06, earth));

    this.camera.position.x = THREE.MathUtils.lerp(0.08, -0.08, finalSettle);
    this.camera.position.y = THREE.MathUtils.lerp(0.04, 0.18, finalSettle);
    this.camera.position.z = THREE.MathUtils.lerp(this.aspect < 0.8 ? 11.2 : 9.6, this.aspect < 0.8 ? 11.8 : 10.3, textSpace);
    this.camera.lookAt(0, 0.34, 0);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
      else material?.dispose();
    });
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
    this.composer.dispose();
  }

  private resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.aspect = width / height;
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.setProgress(this.progress);
  }

  private render = () => {
    const elapsed = (performance.now() - this.startedAt) / 1000;
    const energyMotion = smoothstep(0.34, 0.72, this.progress);

    this.logoGroup.rotation.y = Math.sin(elapsed * 0.28) * 0.055;
    this.logoGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.028;
    this.energyGroup.rotation.z = -0.07 + Math.sin(elapsed * 0.18) * 0.014;
    this.particleGroup.rotation.z = this.energyGroup.rotation.z;
    this.earthGroup.rotation.y = elapsed * 0.012;
    this.seedGroup.scale.setScalar(1 + Math.sin(elapsed * 1.1) * 0.035);

    this.particleGroup.children.forEach((child, index) => {
      const sprite = child as THREE.Sprite;
      const pulse = 0.72 + Math.sin(elapsed * (1.1 + (index % 7) * 0.08) + index) * 0.28;
      sprite.scale.setScalar((0.025 + (index % 5) * 0.005) * pulse * (0.6 + energyMotion));
    });

    if (this.starField) {
      this.starField.rotation.y = elapsed * 0.006;
      this.starField.rotation.x = Math.sin(elapsed * 0.06) * 0.01;
    }

    this.composer.render();
    this.frame = requestAnimationFrame(this.render);
  };

  private createEnvironmentTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#02050b");
      gradient.addColorStop(0.24, "#0b1220");
      gradient.addColorStop(0.5, "#dcefff");
      gradient.addColorStop(0.56, "#275fbd");
      gradient.addColorStop(1, "#000000");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const glow = context.createRadialGradient(560, 214, 0, 560, 214, 280);
      glow.addColorStop(0, "rgba(255,255,255,.85)");
      glow.addColorStop(0.18, "rgba(148,214,255,.42)");
      glow.addColorStop(0.52, "rgba(26,87,204,.14)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.textures.push(texture);
    return texture;
  }

  private makeGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.18, "rgba(174,224,255,.92)");
      gradient.addColorStop(0.42, "rgba(47,139,255,.34)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.textures.push(texture);
    return texture;
  }

  private createGlowSprite(size: number, color = 0x9fddff) {
    const material = new THREE.SpriteMaterial({
      map: this.makeGlowTexture(),
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    return sprite;
  }

  private createStars() {
    const geometry = new THREE.BufferGeometry();
    const count = 620;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 18 + Math.random() * 58;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + THREE.MathUtils.randFloatSpread(1.4);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 18;

      const tone = 0.42 + Math.random() * 0.42;
      colors[i * 3] = tone * 0.68;
      colors[i * 3 + 1] = tone * 0.78;
      colors[i * 3 + 2] = tone;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.starField = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    return this.starField;
  }

  private createDistantLight() {
    const core = this.createGlowSprite(0.7, 0xd8f2ff);
    core.position.set(0, 0.18, -1.6);

    const haze = this.createGlowSprite(2.6, 0x5bbcff);
    haze.position.copy(core.position);
    haze.position.z -= 0.4;

    const flare = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, 0.012),
      new THREE.MeshBasicMaterial({
        color: 0x9fdcff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    flare.position.copy(core.position);
    flare.rotation.z = -0.45;

    this.seedGroup.add(haze, core, flare);
    setOpacity(this.seedGroup, 0);
    return this.seedGroup;
  }

  private createLogo() {
    const metal = new THREE.MeshPhysicalMaterial({
      color: 0xcfd6de,
      metalness: 0.9,
      roughness: 0.16,
      clearcoat: 0.7,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 0,
      emissive: 0x07121f,
      emissiveIntensity: 0.12,
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xc8f1ff,
      metalness: 0.2,
      roughness: 0.06,
      transmission: 0.3,
      transparent: true,
      opacity: 0,
      emissive: 0x1c7bff,
      emissiveIntensity: 0.36,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ringGeometry = new THREE.TorusGeometry(1.32, 0.052, 22, 150, Math.PI * 1.45);
    const ringA = new THREE.Mesh(ringGeometry, metal);
    ringA.rotation.z = 0.08;
    const ringB = new THREE.Mesh(ringGeometry.clone(), metal);
    ringB.rotation.z = Math.PI + 0.08;

    const haloA = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.012, 12, 150, Math.PI * 1.38), glass);
    haloA.rotation.z = 0.08;
    haloA.position.z = 0.045;
    const haloB = haloA.clone();
    haloB.rotation.z = Math.PI + 0.08;

    const slashShape = new THREE.Shape();
    slashShape.moveTo(-1.55, -0.03);
    slashShape.lineTo(1.22, 0.22);
    slashShape.lineTo(1.54, 0.08);
    slashShape.lineTo(-1.23, -0.22);
    slashShape.lineTo(-1.55, -0.03);

    const slash = new THREE.Mesh(
      new THREE.ExtrudeGeometry(slashShape, { depth: 0.085, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3 }),
      metal
    );
    slash.rotation.z = -0.52;
    slash.position.z = -0.035;

    const slashGlow = new THREE.Mesh(
      new THREE.ExtrudeGeometry(slashShape, { depth: 0.018, bevelEnabled: false }),
      glass
    );
    slashGlow.rotation.copy(slash.rotation);
    slashGlow.position.z = 0.075;

    const centerGlow = this.createGlowSprite(1.35, 0xbfeaff);
    centerGlow.position.set(0, 0, 0.12);

    this.logoGroup.add(ringA, ringB, haloA, haloB, slash, slashGlow, centerGlow);
    setOpacity(this.logoGroup, 0);
    return this.logoGroup;
  }

  private createEnergyCurve() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.8, -1.9, -0.78),
      new THREE.Vector3(-3.55, -1.28, -0.48),
      new THREE.Vector3(-1.18, -0.28, 0.12),
      new THREE.Vector3(0.06, 0.05, 0.42),
      new THREE.Vector3(1.58, 0.48, 0.08),
      new THREE.Vector3(3.55, 1.28, -0.5),
      new THREE.Vector3(6.1, 2.42, -1.4),
    ]);
  }

  private createEnergyLine() {
    const curve = this.createEnergyCurve();
    const layers = [
      { radius: 0.034, color: 0xe4f8ff, opacity: 0.92 },
      { radius: 0.09, color: 0x70caff, opacity: 0.58 },
      { radius: 0.21, color: 0x137fff, opacity: 0.22 },
      { radius: 0.42, color: 0x0a42bc, opacity: 0.1 },
    ];

    layers.forEach((layer) => {
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 220, layer.radius, 14, false),
        new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      this.energyGroup.add(mesh);
    });

    for (let i = 0; i < 5; i += 1) {
      const offset = (i - 2) * 0.08;
      const drift = i % 2 === 0 ? 0.18 : -0.14;
      const tendril = new THREE.CatmullRomCurve3(
        curve.getPoints(90).map((point, index) => {
          const wave = Math.sin(index * 0.17 + i * 1.4) * 0.16;
          return point.clone().add(new THREE.Vector3(offset + wave, drift * Math.sin(index * 0.05), -0.04 * i));
        })
      );
      const tendrilMesh = new THREE.Mesh(
        new THREE.TubeGeometry(tendril, 140, 0.012 + i * 0.003, 8, false),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xffffff : 0x76caff,
          transparent: true,
          opacity: i % 2 === 0 ? 0.22 : 0.12,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      this.energyGroup.add(tendrilMesh);
    }

    const afterImageCurve = new THREE.CatmullRomCurve3(
      curve.getPoints(120).map((point) => point.clone().add(new THREE.Vector3(-0.22, -0.1, -0.05)))
    );
    const afterImage = new THREE.Mesh(
      new THREE.TubeGeometry(afterImageCurve, 180, 0.15, 10, false),
      new THREE.MeshBasicMaterial({
        color: 0x3fa6ff,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );

    const impactGlow = this.createGlowSprite(2.8, 0xcdf4ff);
    impactGlow.position.set(0.04, 0.05, 0.55);

    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 0.018),
      new THREE.MeshBasicMaterial({
        color: 0xd8f4ff,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    lens.position.set(0.05, 0.07, 0.7);
    lens.rotation.z = -0.5;

    const broadFlare = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.045),
      new THREE.MeshBasicMaterial({
        color: 0x6cc9ff,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    broadFlare.position.set(0.08, 0.06, 0.62);
    broadFlare.rotation.z = -0.5;

    this.energyGroup.add(afterImage, impactGlow, broadFlare, lens);
    setOpacity(this.energyGroup, 0);
    return this.energyGroup;
  }

  private createEnergyParticles() {
    const curve = this.createEnergyCurve();
    const glowTexture = this.makeGlowTexture();

    for (let i = 0; i < 140; i += 1) {
      const t = THREE.MathUtils.clamp(Math.random() * 0.95 + 0.025, 0, 1);
      const point = curve.getPoint(t);
      point.x += THREE.MathUtils.randFloatSpread(0.42);
      point.y += THREE.MathUtils.randFloatSpread(0.28);
      point.z += THREE.MathUtils.randFloatSpread(0.38);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: Math.random() > 0.22 ? 0x9fdcff : 0xffffff,
          transparent: true,
          opacity: 0.42 + Math.random() * 0.38,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      sprite.position.copy(point);
      sprite.scale.setScalar(0.018 + Math.random() * 0.032);
      this.particleGroup.add(sprite);
    }

    setOpacity(this.particleGroup, 0);
    return this.particleGroup;
  }

  private createEarthHorizon() {
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(8.8, 128, 48),
      new THREE.MeshPhongMaterial({
        color: 0x030812,
        emissive: 0x061434,
        emissiveIntensity: 0.34,
        shininess: 12,
        transparent: true,
        opacity: 0,
      })
    );
    planet.position.set(0, -8.32, -2.75);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(8.84, 0.018, 8, 220, Math.PI),
      new THREE.MeshBasicMaterial({
        color: 0xbbeaff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    rim.position.set(0, -1.06, -2.68);
    rim.rotation.x = Math.PI / 2;

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(8.96, 128, 48),
      new THREE.ShaderMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          glowColor: { value: new THREE.Color(0x3e9cff) },
          coefficient: { value: 0.56 },
          power: { value: 2.55 },
          uOpacity: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float coefficient;
          uniform float power;
          uniform float uOpacity;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float intensity = pow(coefficient + dot(vNormal, viewDirection), power);
            gl_FragColor = vec4(glowColor, intensity * 0.42 * uOpacity);
          }
        `,
      })
    );
    atmosphere.position.copy(planet.position);

    const sunrise = this.createGlowSprite(1.95, 0xffffff);
    sunrise.position.set(0.18, -1.08, -1.92);
    sunrise.scale.y = 0.34;

    const cityLights = this.createCityLights();

    this.earthGroup.add(planet, atmosphere, cityLights, rim, sunrise);
    setOpacity(this.earthGroup, 0);
    return this.earthGroup;
  }

  private createCityLights() {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const x = THREE.MathUtils.randFloatSpread(6.2);
      const y = -1.2 + Math.random() * 0.3;
      const z = -1.98 + Math.random() * 0.2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y + Math.sin(x * 1.7) * 0.03;
      positions[i * 3 + 2] = z;

      const warmth = Math.random();
      colors[i * 3] = warmth > 0.62 ? 1 : 0.58;
      colors[i * 3 + 1] = warmth > 0.62 ? 0.72 : 0.86;
      colors[i * 3 + 2] = warmth > 0.62 ? 0.38 : 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
  }
}
