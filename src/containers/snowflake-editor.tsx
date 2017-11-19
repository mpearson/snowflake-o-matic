import * as React from 'react';
// import { Link } from 'react-router';
// import { PageSection } from '../../components/page-section';
// import { PageHero } from '../../components/page-hero';
import * as THREE from "three";
import * as _ from "lodash";

import {ProceduralGeometry2D} from "../models/procedural2D";

// import Snowflake


export interface SnowflakeEditorProps {

}

export class SnowflakeEditor extends React.Component<SnowflakeEditorProps> {
  private container: HTMLDivElement;
  private updateTimer: number;
  private updateInterval = 20;

  // camera and rendering
  private width: number;
  private height: number;
  private renderer: THREE.Renderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  private snowflake: ProceduralGeometry2D;

  // private count: number;
  // private shapeSize: number;
  // private points: THREE.Vector3[];
  // private targets: THREE.Vector3[];
  // private geometry: THREE.Geometry;
  // private vertexDots: THREE.Points;
  // private material: THREE.LineBasicMaterial;
  // private outline: THREE.LineLoop;

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


    // this.count = 0;
    // this.points = [];
    // this.targets = [];

    // this.material = new THREE.LineBasicMaterial({
    //   color: 0xffffff,
    //   opacity: 0.5,
    //   alphaTest: 0.4,
    //   transparent: true,
    // });
    // this.shapeSize = 200;
    this.snowflake = this.nucleate(6, 200);


    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(50, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));

    // // Move the Sphere back in Z so we
    // // can see it.
    // sphere.position.z = -300;

    // // Finally, add the sphere to the scene.
    // scene.add(sphere);


    // for (var i = 0; i < this.count; i++) {
    //   this.points.push(new THREE.Vector3(0, 0, 0));
    //   this.targets.push(new THREE.Vector3(0, 0, 0));
    // }


    // this.outline = new THREE.Mesh(this.geometry, this.material);

    this.regenerate = this.regenerate.bind(this);
    // this.updateSimulation = this.updateSimulation.bind(this);
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
    // this.updateTimer = window.setInterval(this.updateSimulation, 20);
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateTimer);
    this.updateTimer = null;
  }

  public render() {
    return (
      <div>
        <button onClick={this.regenerate}>Regenerate</button>
        <div id="webgl-wrapper" ref={elem => {
          this.container = elem;
          elem.appendChild(this.renderer.domElement);
        }}></div>
      </div>
    );
  }


    // this.scene.add(this.vertexDots);

  private nucleate(sides: number, shapeSize: number): ProceduralGeometry2D {

    const snowflake = new ProceduralGeometry2D({
      vertexCount: 9000,
      verticesUsed: 6,
    });


    const verts = snowflake.vertices;

    const angleStep = Math.PI * 2 / sides;

    for (let i = 0, xIndex = 0, yIndex = 1, zIndex = 2; i < sides; i++, xIndex += 3, yIndex += 3, zIndex += 3) {


      // sin and cos swapped because we want it to start at the top
      const x = Math.sin(angleStep * i) * shapeSize * 0.5;
      const y = Math.cos(angleStep * i) * shapeSize * 0.5;

      verts[xIndex] = x;
      verts[yIndex] = y;
      verts[zIndex] = 0;
    }

    // this.createGeometry();

    return snowflake;
  }


/*

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
    this.geometry.computeVertexNormals();
    // this.geometry.norm

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
 */
  private regenerate() {
    // this.nucleate(Math.round(3 + Math.random() * 9));
    let { scene, snowflake } = this;
    if (snowflake) {
      scene.remove(snowflake.outline);
      scene.remove(snowflake.vertexDots);
    }

    this.snowflake = snowflake = this.nucleate(6, 200);
    scene.add(snowflake.outline);
    scene.add(snowflake.vertexDots);
    // for (var i = 0; i < this.count; i++) {
    //   var x = Math.random() * this.shapeSize - (0.5 * this.shapeSize);
    //   var y = Math.random() * this.shapeSize - (0.5 * this.shapeSize);

    //   this.targets[i].x = x;
    //   this.targets[i].y = y;
    // }
  }

}




// document.getElementById("regenerate-button").addEventListener("click", regenerate);
