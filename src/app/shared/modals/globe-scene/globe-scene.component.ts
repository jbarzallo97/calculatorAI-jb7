import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawThreeGeo } from '../../../globe/threeGeoJSON';
import getStarfield from '../../../globe/getStarfield';

@Component({
  selector: 'app-globe-scene',
  standalone: true,
  templateUrl: './globe-scene.component.html',
  styleUrls: ['./globe-scene.component.sass']
})
export class GlobeSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private group!: THREE.Group;
  private animationId!: number;
  private isInitialized = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initThree(), 100);
  }

  ngOnDestroy(): void {
    this.disposeGlobe();
  }

  private initThree(): void {
    if (!this.canvasContainer?.nativeElement || this.isInitialized) {
      return;
    }

    const container = this.canvasContainer.nativeElement;

    const getDimensions = () => {
      let width = container.clientWidth;
      let height = container.clientHeight;

      if (width === 0 || height === 0) {
        const parent = container.parentElement;
        if (parent) {
          width = parent.clientWidth || 520;
          height = parent.clientHeight || 360;
        } else {
          width = 520;
          height = 360;
        }
      }

      return { width, height };
    };

    const { width, height } = getDimensions();

    if (width === 0 || height === 0) {
      setTimeout(() => this.initThree(), 50);
      return;
    }

    // Escena
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.3);

    // Cámara
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    container.appendChild(this.renderer.domElement);

    // Controles orbitales
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    // Grupo principal
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Configurar el globo
    this.setupGlobe();

    // Estrellas adicionales
    this.addExtraStars();

    // Manejar redimensionamiento
    window.addEventListener('resize', () => this.onWindowResize());

    this.isInitialized = true;
    this.animate();
  }

  private setupGlobe(): void {
    // 🌐 Borde del globo
    const geometry = new THREE.SphereGeometry(1.99, 128, 128);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
    });
    const edges = new THREE.EdgesGeometry(geometry);
    this.group.add(new THREE.LineSegments(edges, lineMat));

    // 🩶 Globo base relleno (gris oscuro mate)
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x52525c,
      roughness: 1.0,
      metalness: 0.0,
    });
    const globeMesh = new THREE.Mesh(new THREE.SphereGeometry(1.99, 128, 128), globeMaterial);
    this.group.add(globeMesh);

    // ✨ Campo estelar
    const stars = getStarfield({ numStars: 800, fog: false });
    this.group.add(stars);

    // 🌍 Archivos a cargar
    const files = [
      { path: 'assets/geojson/ne-110m/ne_110m_physical/ne_110m_land.json', color: 0xf54a00 },
      { path: 'assets/geojson/ne-110m/ne_110m_countries.json', color: 0xf54a00 },
    ];

    // ⚡ Cargar y añadir cada dataset
    files.forEach((file) => {
      this.http.get(file.path).subscribe({
        next: (data: any) => {
          if (!this.group) return;

          const layer = drawThreeGeo({
            json: data,
            radius: 2,
            materialOptions: {
              color: file.color,
              transparent: true,
              opacity: 0.7,
              linewidth: 2,
            } as any,
          });
          this.group.add(layer);
        },
        error: (err) => {
          console.warn(`❌ Error cargando ${file.path}`, err);
        }
      });
    });
  }

  private addExtraStars(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices: number[] = [];
    const numStars = 2000;

    for (let i = 0; i < numStars; i++) {
      const radius = 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsPoints = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(starsPoints);
  }

  private animate(): void {
    if (!this.isInitialized) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.group) {
      this.group.rotation.y += 0.0008;
    }

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onWindowResize(): void {
    if (!this.canvasContainer || !this.camera || !this.renderer || !this.isInitialized) return;

    const container = this.canvasContainer.nativeElement;
    const parent = container.parentElement;

    const width = container.clientWidth || parent?.clientWidth || 520;
    const height = container.clientHeight || parent?.clientHeight || 360;

    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  private disposeGlobe(): void {
    this.isInitialized = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }

    if (this.controls) {
      this.controls.dispose();
      this.controls = undefined as any;
    }

    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }

      this.scene?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });

      this.renderer.dispose();
      this.renderer = undefined as any;
    }

    this.scene = undefined as any;
    this.camera = undefined as any;
    this.group = undefined as any;

    window.removeEventListener('resize', () => this.onWindowResize());
  }
}
