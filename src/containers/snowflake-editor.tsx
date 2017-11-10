import * as React from 'react';
// import { Link } from 'react-router';
// import { PageSection } from '../../components/page-section';
// import { PageHero } from '../../components/page-hero';
import * as THREE from "three";


export interface SnowflakeEditorProps {

}

export class SnowflakeEditor extends React.Component<SnowflakeEditorProps> {
  private container: HTMLDivElement;

  public componentDidMount() {
    const geometry = new THREE.Geometry();

  }




  public render() {
    return (
      <div>
        <button id="regenerate-button">Regenerate</button>
        <div id="canvas-wrapper" ref={elem => this.container = elem}></div>
      </div>
    );
  }
}


// var width = 800;
// var height = 600;

// var shapeSize = 100;

// var app = new PIXI.Application(width, height, {backgroundColor : 0x5293bb});
// document.getElementById("canvas-wrapper").appendChild(app.view);
// var graphics = new PIXI.Graphics();
// app.stage.addChild(graphics);
// graphics.x = width / 2;
// graphics.y = height / 2;

// var count = 12;
// var points = [];
// var targets = [];
// for (var i = 0; i < count; i++) {
//   points.push([0, 0]);
//   targets.push([0, 0]);
// }


// var regenerate = function() {
//   for (var i = 0; i < count; i++) {
//     var x = Math.random() * shapeSize - (0.5 * shapeSize);
//     var y = Math.random() * shapeSize - (0.5 * shapeSize);

//     targets[i][0] = x;
//     targets[i][1] = y;
//   }
// };

// window.setInterval(function() {
//   // update positions
//   for (var i = 0; i < count; i++) {
//     var target = targets[i];
//     var point = points[i];
//     point[0] += (target[0] - point[0] / 5);
//     point[1] += (target[1] - point[1] / 5);
//   }

//   // render shape
//   graphics.clear();
//   graphics.beginFill(0xFFFFFF);
//   var lastPoint = points[count - 1];
//   graphics.moveTo(lastPoint[0], lastPoint[1]);
//   for (var i = 0; i < count; i++) {
//     var point = points[i];
//     graphics.lineTo(point[0], point[1]);
//   }
//   graphics.endFill();

// }, 20);

// document.getElementById("regenerate-button").addEventListener("click", regenerate);
