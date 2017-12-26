import * as THREE from "three";

export interface Procedural2DOptions {
  showVertexDots: boolean;
  showNormals: boolean;
  initialVertices: number;
  maxVerts: number;
}

export class ProceduralGeometry2D extends THREE.Object3D {
  public options: Procedural2DOptions;
  public geometry: THREE.BufferGeometry;
  public vertices: Float32Array;
  public normals: Float32Array;
  public lengthSquared: Float32Array;
  public vertCount: number;
  private positionAttr: THREE.BufferAttribute;
  private normalAttr: THREE.BufferAttribute;

  private outline: THREE.LineLoop;
  private outlineMaterial: THREE.LineBasicMaterial;

  private vertexDots: THREE.Points;
  private vertexDotMaterial: THREE.PointsMaterial;

  private normalsHelper: THREE.VertexNormalsHelper;

  constructor(options: Partial<Procedural2DOptions>) {
    super();

    this.options = {
      showVertexDots: true,
      showNormals: false,
      initialVertices: 0,
      maxVerts: 9000,
      ...options,
    };

    this.vertCount = this.options.initialVertices;
    this.vertices = new Float32Array(this.options.maxVerts * 3);
    this.normals = new Float32Array(this.options.maxVerts * 3);
    this.lengthSquared = new Float32Array(this.options.maxVerts);
    this.geometry = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(this.vertices, 3);
    this.normalAttr = new THREE.BufferAttribute(this.normals, 3);
    this.geometry.addAttribute("position", this.positionAttr);
    this.geometry.addAttribute("normal", this.normalAttr);
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
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);

    this.add(this.outline);
    if (this.options.showNormals)
      this.showNormals();
    if (this.options.showVertexDots)
      this.showVertexDots();
  }

  public showVertexDots() {
    if (!this.vertexDots) {
      this.vertexDots = new THREE.Points(this.geometry, this.vertexDotMaterial);
      this.add(this.vertexDots);
    }
  }

  public hideVertexDots() {
    if (this.vertexDots) {
      this.remove(this.vertexDots);
      this.vertexDots = null;
    }
  }

  public showNormals() {
    if (!this.normalsHelper) {
      this.normalsHelper = new THREE.VertexNormalsHelper(this.outline, 20, 0x00ff00, 1);
      this.add(this.normalsHelper);
    }
  }

  public hideNormals() {
    if (this.normalsHelper) {
      this.remove(this.normalsHelper);
      this.normalsHelper = null;
    }
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

  public nextVert(index: number) {
    return (index + 1) % this.vertCount;
  }

  public prevVert(index: number) {
    return (this.vertCount + index - 1) % this.vertCount;
  }

  public subdivide(verts: number[], steps: number = 1) {
    this.insertVertices(verts, steps);

    const { vertCount } = this;
    let start: number;
    let end: number;
    let offset = 0;
    for (let i = 0; i < verts.length; i++) {
      start = verts[i] + offset;
      end = (start + steps + 1) % vertCount;
      this.distributeVertices(start, end, steps);
      offset += steps;
    }
    this.positionAttr.needsUpdate = true;
  }

  public insertVertices(verts: number[], count: number = 1) {
    const { vertices, vertCount } = this;
    const { maxVerts } = this.options;

    if (verts.length === 0)
      throw new Error("ya'll need to specify at least one vertex, dingus!");

    const newVertCount = verts.length * count;
    if (vertCount + newVertCount >= maxVerts ) {
      throw new Error(`Error: trying to insert ${newVertCount} new verts, but only ` +
      `${maxVerts - vertCount} / ${maxVerts} verts are free.`);
    }

    // to avoid copying anything more than once,
    // we work backwards from the end of the list of verts
    verts.sort((a, b) => a - b);

    const lastVertIndex = verts.length - 1;
    for (let i = lastVertIndex; i >= 0; i--) {
      const vert = verts[i];
      const vertOffsetX = vert * 3;
      const vertOffsetY = vertOffsetX + 1;
      const vertOffsetZ = vertOffsetX + 2;

      // unless this is the last vertex in the shape, we need to move all the
      // subsequent vertices to make room for the new ones we're creating
      // except not all of them, just up to the next vertex we're subdividing at
      if (i < vertCount - 1) {
        const copyStart = vert + 1;
        const dest = copyStart + (count * (i + 1));

        let copyEnd: number;
        if (i === lastVertIndex)
          copyEnd = vertCount;
        else
          copyEnd = verts[i + 1] + 1;
        vertices.copyWithin(dest * 3, copyStart * 3, copyEnd * 3);
      }

      // add new subdivision verts at even intervals between (A) and (B)
      // set their position to the same as (A)
      let newVertOffset = (vert + 1 + (count * i)) * 3;
      for (let j = 0; j < count; j++) {
        vertices[newVertOffset++] = vertices[vertOffsetX];
        vertices[newVertOffset++] = vertices[vertOffsetY];
        vertices[newVertOffset++] = vertices[vertOffsetZ];
      }
    }

    this.vertCount += count * verts.length;
    this.geometry.setDrawRange(0, this.vertCount);
  }

  public distributeVertices(start: number, end: number, steps?: number) {
    const { vertices, vertCount } = this;
    steps = steps || (end + vertCount - start - 1) % vertCount;
    const stepFactor = 1 / (steps + 1);

    const startOffsetX = start * 3;
    const startOffsetY = startOffsetX + 1;
    const startOffsetZ = startOffsetX + 2;

    const endOffsetX = end * 3;
    const endOffsetY = endOffsetX + 1;
    const endOffsetZ = endOffsetX + 2;

    // calculate the vector between this vert (A) and the next (B)
    const stepX = (vertices[endOffsetX] - vertices[startOffsetX]) * stepFactor;
    const stepY = (vertices[endOffsetY] - vertices[startOffsetY]) * stepFactor;
    const stepZ = (vertices[endOffsetZ] - vertices[startOffsetZ]) * stepFactor;

    // now add new subdivision verts at even intervals between (A) and (B)
    let dx = 0, dy = 0, dz = 0;
    let offset = startOffsetX + 3;
    for (let step = 0; step < steps; step++) {
      vertices[offset++] = vertices[startOffsetX] + (dx += stepX);
      vertices[offset++] = vertices[startOffsetY] + (dy += stepY);
      vertices[offset++] = vertices[startOffsetZ] + (dz += stepZ);
    }
  }

  public distanceSquared(vert1: number, vert2: number): number {
    const { vertices } = this;
    let dx = vertices[vert2] - vertices[vert1];
    let dy = vertices[vert2 + 1] - vertices[vert1 + 1];
    let dz = vertices[vert2 + 2] - vertices[vert1 + 2];
    return (dx * dx) + (dy * dy) + (dz * dz);
  }

  /**
   * For each vertex, calculate the squared distance to the next vertex.
   */
  public calculateSquaredLengths() {
    const { vertices, vertCount, lengthSquared } = this;
    const lastIndex = vertCount - 1;

    for (let i = 0; i < lastIndex; i++)
      lengthSquared[i] = this.distanceSquared(i, i + 1);

    lengthSquared[lastIndex] = this.distanceSquared(lastIndex, 0);
  }

  /**
   * For each edge, calculates a normalized, outward-facing vector normal to the edge.
   * For each vertex, calculates the normalized sum of the two surrounding edges' normals.
   */
  public calculateNormals() {
    const { vertCount, vertices, normals } = this;
    const length = vertCount * 3;

    let vertical = new THREE.Vector3(0, 0, -1);
    let normal = new THREE.Vector3();
    let crossProduct = new THREE.Vector3();
    // preload vectors from the end of the array, so we can start at
    // vertex 0 but still have the previous 2 available
    let lastVert = new THREE.Vector3(
      vertices[length - 6],
      vertices[length - 5],
      vertices[length - 4],
    );
    let currentVert = new THREE.Vector3(
      vertices[length - 3],
      vertices[length - 2],
      vertices[length - 1],
    );
    let currentNorm = new THREE.Vector3().subVectors(currentVert, lastVert).cross(vertical);
    currentNorm.normalize();
    let lastNorm = new THREE.Vector3();

    for (let offset = 0; offset < length; offset += 3) {
      lastNorm.copy(currentNorm);
      lastVert.copy(currentVert);
      currentVert.set(
        vertices[offset],
        vertices[offset + 1],
        vertices[offset + 2],
      );
      currentNorm.subVectors(currentVert, lastVert).cross(vertical);
      currentNorm.normalize();

      normal.addVectors(currentNorm, lastNorm);

      normal.normalize();
      // our offset is for point C, but the normal for point B, so we need to go back one vertex.
      // if the index goes into the negative it needs to loop around
      const normOffset = (offset + length - 3) % length;
      normals[normOffset] = normal.x;
      normals[normOffset + 1] = normal.y;
      normals[normOffset + 2] = normal.z;
    }

    this.normalAttr.needsUpdate = true;

    if (this.normalsHelper) {
      this.normalsHelper.update();
    }
  }
}
