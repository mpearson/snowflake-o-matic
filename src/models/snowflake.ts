import * as THREE from "three";

import { ProceduralGeometry2D, Procedural2DOptions } from "./procedural2D";

export interface SnowflakeOptions extends Procedural2DOptions {

}

export class Snowflake extends ProceduralGeometry2D {
  constructor(options: Partial<SnowflakeOptions>) {
    super(options);

  }


}
