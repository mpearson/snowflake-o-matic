import * as THREE from "three";

export interface Procedural2DOptions {
  showVertexDots: boolean;
  initialVertices: number;
  maxVerts: number;
}

export class ProceduralGeometry2D {
  public options: Procedural2DOptions;
  public geometry: THREE.BufferGeometry;
  public vertices: Float32Array;
  public vertCount: number;
  private positionAttr: THREE.BufferAttribute;

  public outline: THREE.LineLoop;
  public outlineMaterial: THREE.LineBasicMaterial;

  public vertexDots: THREE.Points;
  public vertexDotMaterial: THREE.PointsMaterial;

  constructor(options: Partial<Procedural2DOptions>) {
    this.options = {
      showVertexDots: true,
      initialVertices: 0,
      maxVerts: 9000,
      ...options,
    };

    this.vertCount = this.options.initialVertices;
    this.vertices = new Float32Array(this.options.maxVerts * 3);
    this.geometry = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(this.vertices, 3);
    this.geometry.addAttribute("position", this.positionAttr);
    this.geometry.setDrawRange(0, this.vertCount);

    this.outlineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      alphaTest: 0.4,
      transparent: true,
    });
    this.outline = new THREE.LineLoop(this.geometry, this.outlineMaterial);
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);

    this.vertexDotMaterial = new THREE.PointsMaterial({
      size: 5,
      // opacity: 0.4,
      // alphaTest: 0.4,
      // transparent: true
    });
    this.vertexDots = new THREE.Points(this.geometry, this.vertexDotMaterial);
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);
  }

  public printAngles(verts: Float32Array) {
    if (typeof verts === "undefined")
      verts = this.vertices.slice(0, this.vertCount * 3);
    const rad2deg = 180 / Math.PI;
    const angles = [];
    for (let i = 0; i < verts.length; i += 3)
      angles.push(Math.round(rad2deg * Math.atan2(verts[i + 1], verts[i])));

    console.log(angles);
  }

  public printVerts(verts: Float32Array) {
    const entries: string[] = [];
    for (let i = 0; i < verts.length; i += 3)
      entries.push(`[${Math.round(verts[i])},${Math.round(verts[i + 1])}]`);
    console.log(entries.join(" "));
  }

  public subdivide(verts: Int32Array, steps: number = 1) {
    const { vertices, vertCount } = this;
    const { maxVerts } = this.options;

    if (verts.length === 0)
      throw new Error("ya'll need to specify at least one vertex, dingus!");

    const newVertCount = verts.length * steps;
    if (vertCount + newVertCount >= maxVerts ) {
      throw new Error(`Error: subdivision creates ${newVertCount} new verts, but only ` +
      `${maxVerts - vertCount} / ${maxVerts} verts are free.`);
    }

    const factor = 1 / (steps + 1);

    // to avoid copying anything more than once,
    // we work backwards from the end of the list of verts
    verts.sort();

    const lastVertIndex = verts.length - 1;
    for (let i = lastVertIndex; i >= 0; i--) {
      const vert = verts[i];
      const nextVert = (vert + 1) % vertCount; // the vertex immediately after this one (loops around)
      const vertOffsetX = vert * 3;
      const vertOffsetY = vertOffsetX + 1;
      const vertOffsetZ = vertOffsetX + 2;

      // unless this is the last vertex in the shape, we need to move all the
      // subsequent vertices to make room for the new ones we're creating
      // except not all of them, just up to the next vertex we're subdividing at
      if (i < vertCount - 1) {
        const copyStart = vert + 1;
        const dest = copyStart + (steps * (i + 1));

        let copyEnd: number;
        if (i === lastVertIndex)
          copyEnd = vertCount;
        else
          copyEnd = verts[i + 1] + 1;
        vertices.copyWithin(dest * 3, copyStart * 3, copyEnd * 3);
      }

      // calculate the vector between this vert (A) and the next (B)
      let nextVertOffset = nextVert * 3;
      const stepX = (vertices[nextVertOffset++] - vertices[vertOffsetX]) * factor;
      const stepY = (vertices[nextVertOffset++] - vertices[vertOffsetY]) * factor;
      const stepZ = (vertices[nextVertOffset++] - vertices[vertOffsetZ]) * factor;

      // now add new subdivision verts at even intervals between (A) and (B)
      let dx = 0, dy = 0, dz = 0;
      let newVertOffset = (vert + 1 + (steps * i)) * 3;
      for (let step = 0; step < steps; step++) {
        vertices[newVertOffset++] = vertices[vertOffsetX] + (dx += stepX);
        vertices[newVertOffset++] = vertices[vertOffsetY] + (dy += stepY);
        vertices[newVertOffset++] = vertices[vertOffsetZ] + (dz += stepZ);
      }
    }

    this.vertCount += steps * verts.length;
    // this.printAngles(vertices.slice(0, this.vertCount * 3));
    // this.printVerts(vertices.slice(0, (this.vertCount + 1) * 3));
    this.geometry.setDrawRange(0, this.vertCount);
    this.positionAttr.needsUpdate = true;
  }

  public subdivideFace(vert: number, newVerts: number = 1) {
    const { vertices, vertCount } = this;
    const { maxVerts } = this.options;

    if (vertCount + newVerts >= maxVerts )
      throw new Error(`unable to subdivide! Already using ${vertCount} / ${maxVerts} verts.`);

    // calculate the delta between this vert and the next
    const nextVert = (vert + 1) % vertCount;
    const vertOffset = vert * 3;
    const nextVertOffset = nextVert * 3;
    const factor = 1 / (newVerts + 1);
    const dx = (vertices[nextVertOffset] - vertices[vertOffset]) * factor;
    const dy = (vertices[nextVertOffset + 1] - vertices[vertOffset + 1]) * factor;
    const dz = (vertices[nextVertOffset + 2] - vertices[vertOffset + 2]) * factor;

    // shift all the vertices ahead to make room for the new ones
    const target = (vert + newVerts + 1) * 3;
    vertices.copyWithin(target, nextVertOffset, vertCount * 3);

    for (let offset = vertOffset; offset < target; offset += 3) {
      vertices[offset + 3] = vertices[offset] + dx;
      vertices[offset + 4] = vertices[offset + 1] + dy;
      vertices[offset + 5] = 0; // this is a 2D geometry, ignore Z
    }

    this.vertCount += newVerts;
    this.geometry.setDrawRange(0, this.vertCount);
    this.positionAttr.needsUpdate = true;
  }

}
