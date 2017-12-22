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


}
