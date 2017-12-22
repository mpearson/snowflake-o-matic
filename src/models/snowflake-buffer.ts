import * as THREE from "three";

export class SnowflakeRenderBuffer {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  public bufferTexture: THREE.WebGLRenderTarget;
  public readonly width: number;
  public readonly height: number;
  public readonly renderer: THREE.WebGLBufferRenderer;

  constructor(width: number, height: number, renderer: THREE.WebGLBufferRenderer) {
    this.width = width;
    this.height = height;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 5000);

    this.bufferTexture = new THREE.WebGLRenderTarget(
      width,
      height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
      },
    );
  }
}
