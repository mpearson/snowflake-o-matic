import * as THREE from "three";

import { ProceduralGeometry2D, Procedural2DOptions } from "./procedural2D";

export interface SnowflakeOptions extends Procedural2DOptions {

}

export class Snowflake extends ProceduralGeometry2D {
  public edgeLength: Float32Array;
  public cornerType: Int8Array;

  constructor(options: Partial<SnowflakeOptions>) {
    super(options);

    this.edgeLength = new Float32Array(this.options.maxVerts);
    this.cornerType = new Int8Array(this.options.maxVerts);
  }


  public branch(verts: number[]) {
    const lastVert = verts.length - 1;
    const sequentialVerts = new Array<Boolean>(verts.length);
    // TODO: call subdivide(vert, 1) or subdivide(vert, 2) depending
    // on whether we're branching at both ends of an edge simultaneously
    for (let i = 1; i < verts.length; i++) {
      if (verts[i - 1] === verts[i] - 1) {

      } else {

      }

    }
    // this.subdivide(
  }
}
