import * as React from 'react';
// import { Link } from 'react-router';
// import { PageSection } from '../../components/page-section';
// import { PageHero } from '../../components/page-hero';
import * as THREE from "three";
import * as _ from "lodash";

// import Snowflake


export interface SnowflakeEditorProps {

}

export class SnowflakeEditor extends React.Component<SnowflakeEditorProps> {
  private container: HTMLDivElement;
  private updateTimer: number;
  private updateInterval = 20;
  private count: number;
  private shapeSize: number;
  private points: THREE.Vector3[];
  private targets: THREE.Vector3[];

  private width: number;
  private height: number;

  private renderer: THREE.Renderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private geometry: THREE.Geometry;
  private material: THREE.LineBasicMaterial;
  private outline: THREE.Line;

  constructor(props: SnowflakeEditorProps) {
    super(props);

    this.width = 800;
    this.height = 600;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x234674);

    // camera
    const camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 1000);
    camera.position.set(0, 0, 500);
    scene.add(camera);

    // lighting
    // const light = new THREE.PointLight(0xffffff, 0.8);
    // camera.add(light);

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.width, this.height);

    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    this.count = 120;
    this.shapeSize = 400;

    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(50, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));

    // // Move the Sphere back in Z so we
    // // can see it.
    // sphere.position.z = -300;

    // // Finally, add the sphere to the scene.
    // scene.add(sphere);

    this.points = [];
    this.targets = [];
    for (var i = 0; i < this.count; i++) {
      this.points.push(new THREE.Vector3(0, 0, 0));
      this.targets.push(new THREE.Vector3(0, 0, 0));
    }

    // initialize 3D object
    this.geometry = new THREE.Geometry();
    this.geometry.vertices = this.points;
    this.material = new THREE.LineBasicMaterial({color: 0xffffff});
    // this.outline = new THREE.Mesh(this.geometry, this.material);
    this.outline = new THREE.Line(this.geometry, this.material);
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);
    this.scene.add(this.outline);


    this.updateSimulation = this.updateSimulation.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    requestAnimationFrame(this.renderFrame);
  }

  private renderFrame () {
    // Draw!
    this.renderer.render(this.scene, this.camera);

    // Schedule the next frame.
    requestAnimationFrame(this.renderFrame);
  }

  public componentDidMount() {
    this.updateTimer = window.setInterval(this.updateSimulation, 20);
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateTimer);
    this.updateTimer = null;
  }

  public render() {
    return (
      <div>
        <button onClick={this.regenerate.bind(this)}>Regenerate</button>
        <div id="webgl-wrapper" ref={elem => {
          this.container = elem;
          elem.appendChild(this.renderer.domElement);
        }}></div>
      </div>
    );
  }

  private updateSimulation() {

    // update positions
    // for (var i = 0; i < count; i++) {
    for (let i = 0; i < this.count; i++) {
      const target = this.targets[i];
      const point = this.points[i];
      point.x += (target.x - point.x) * 0.2;
      point.y += (target.y - point.y) * 0.2;
    }

    this.geometry.verticesNeedUpdate = true;

    // render shape

    // const shape = new THREE.Shape(this.points);
    // const geometry = new THREE.ShapeGeometry(shape);



      // new THREE.MeshBasicMaterial({color: 0xffffff}));
    // const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   side: THREE.DoubleSide
    // }));

    // mesh.position.set(x, y, z - 125);
    // mesh.rotation.set(rx, ry, rz);




    // addShape(roundedRectShape, extrudeSettings, 0x008000, -150, 150, 0, 0, 0, 0, 1);
  }

  private regenerate() {
    for (var i = 0; i < this.count; i++) {
      var x = Math.random() * this.shapeSize - (0.5 * this.shapeSize);
      var y = Math.random() * this.shapeSize - (0.5 * this.shapeSize);

      this.targets[i].x = x;
      this.targets[i].y = y;
    }

  }

}




// document.getElementById("regenerate-button").addEventListener("click", regenerate);
