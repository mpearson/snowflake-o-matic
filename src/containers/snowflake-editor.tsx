import * as React from "react";
// import { Link } from 'react-router';
// import { PageSection } from '../../components/page-section';
// import { PageHero } from '../../components/page-hero';
import * as THREE from "three";
const OrbitControls = require("three-orbitcontrols");

import * as _ from "lodash";

import { SnowflakeControls, ButtonProps, SliderProps } from "../components/snowflake-controls";
import { ProceduralGeometry2D } from "../models/procedural2D";
import { ChangeEvent } from "react";

// import Snowflake


export interface SnowflakeEditorProps {

}

export interface SnowflakeEditorState {
  symmetry: number;
  size: number;
  subdivisions: number;
}

const defaultState: SnowflakeEditorState = {
  symmetry: 6,
  size: 200,
  subdivisions: 1,
};

export class SnowflakeEditor extends React.Component<SnowflakeEditorProps, SnowflakeEditorState> {
  private container: HTMLDivElement;
  private updateTimer: number;
  private updateInterval = 20;
  private symmetryInput: HTMLInputElement;
  // private symmetry: number;

  // camera and rendering
  private width: number;
  private height: number;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private orbitControls: THREE.OrbitControls;
  // private light: THREE.PointLight;

  private snowflake: ProceduralGeometry2D;

  constructor(props: SnowflakeEditorProps) {
    super(props);
    this.state = {...defaultState};

    this.width = 800;
    this.height = 600;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x234674);

    // camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 500);
    this.scene.add(this.camera);

    // lighting
    // this.light = new THREE.PointLight(0xffffff, 0.8);
    // this.camera.add(this.light);

    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    // orbit controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.enableRotate = true;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableZoom = true;
    this.orbitControls.minDistance = 200;
    this.orbitControls.maxDistance = 600;
    this.orbitControls.minAzimuthAngle = Math.PI * -0.35;
    this.orbitControls.maxAzimuthAngle = Math.PI * 0.35;
    this.orbitControls.minPolarAngle = Math.PI * 0.15;
    this.orbitControls.maxPolarAngle = Math.PI * 0.85;
    this.orbitControls.rotateSpeed = 0.25;
    this.orbitControls.dampingFactor = 0.2;

    // action!
    this.regenerate();

    this.regenerate = this.regenerate.bind(this);
    // this.updateSimulation = this.updateSimulation.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    requestAnimationFrame(this.renderFrame);
  }

  private renderFrame () {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderFrame);
  }

  public componentDidMount() {
    // this.updateTimer = window.setInterval(this.updateSimulation, 20);
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateTimer);
    this.updateTimer = null;
  }

  private needsRegenerate: boolean = true;

  public componentDidUpdate() {
    if (this.needsRegenerate)
      this.regenerate();
    this.needsRegenerate = false;
  }

  private update(field: any, value: any) {
    if (field !== "subdivisions")
      this.needsRegenerate = true;
    this.setState({[field]: value});
  }


  public render() {
    const { symmetry, size, subdivisions } = this.state;
    (window as any).snowflake = this.snowflake;

    const buttons: ButtonProps[] = [
      { label: "Reset", onClick: () => {
        this.orbitControls.reset();
        this.needsRegenerate = true;
        this.setState({...defaultState});
      } },
      // { label: "Regenerate", onClick: this.regenerate.bind(this) },
      { label: "Subdivide", onClick: this.subdivide.bind(this) },
    ];
    const controls: SliderProps[] = [
      { label: "Symmetry", value: symmetry, min: 3, max: 12, onChange: x => this.update("symmetry", x) },
      { label: "Size", value: size, min: 10, max: 200, onChange: x => this.update("size", x) },
      { label: "Subdivisions", value: subdivisions, min: 1, max: 16, onChange: x => this.update("subdivisions", x) },
    ];

    return (
      <div>
        <SnowflakeControls buttons={buttons} controls={controls} />
        <div id="webgl-wrapper" ref={elem => {
          if (elem !== null) {
            this.container = elem;
            elem.appendChild(this.renderer.domElement);
          }
        }}></div>
      </div>
    );
  }

  private nucleate(sides: number, shapeSize: number): ProceduralGeometry2D {
    const snowflake = new ProceduralGeometry2D({
      maxVerts: 65536,
      initialVertices: sides,
    });

    const verts = snowflake.vertices;
    const angleStep = Math.PI * 2 / sides;

    for (let i = 0, xIndex = 0; i < sides; i++, xIndex += 3) {
      // sin and cos swapped because we want it to start at the top
      const x = Math.sin(angleStep * i) * shapeSize * 0.5;
      const y = Math.cos(angleStep * i) * shapeSize * 0.5;
      verts[xIndex] = x;
      verts[xIndex + 1] = y;
      verts[xIndex + 2] = 0;
    }
    return snowflake;
  }

  private regenerate() {
    let { scene, snowflake } = this;
    if (snowflake) {
      scene.remove(snowflake.outline);
      scene.remove(snowflake.vertexDots);
      snowflake.geometry.dispose();
    }

    this.snowflake = snowflake = this.nucleate(this.state.symmetry, this.state.size);
    (window as any).snowflake = snowflake;
    // this.snowflake = this.nucleate(Math.round(3 + Math.random() * 9), 50 + Math.random() * 250);
    scene.add(snowflake.outline);
    scene.add(snowflake.vertexDots);
  }

  private subdivide() {
    const { snowflake } = this;
    if (snowflake) {
      const verts = _.range(snowflake.vertCount);
      snowflake.subdivide(verts, this.state.subdivisions);
    }
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
}
