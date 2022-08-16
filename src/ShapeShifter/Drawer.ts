import { Color } from "./Color";
import { Point } from "./Point";

export type ElmSelector = Parameters<typeof document.querySelector>[0];

export type Area = {
  w: number;
  h: number;
};

export interface IDrawer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  loop(fn: Function): void;
  adjustCanvas(): void;
  clearFrame(): void;
  getArea(): Area;
  drawCircle(p: Point, c: Color): void;
}

export class Drawer implements IDrawer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(elmSelector: ElmSelector) {
    this.canvas = document.querySelector(elmSelector)!;
    this.context = this.canvas?.getContext("2d")!;
    this.adjustCanvas();

    window.addEventListener("resize", () => {
      this.adjustCanvas();
    });
  }

  loop(fn: Function) {
    this.clearFrame();
    fn();
    window.requestAnimationFrame(() => {
      this.loop(fn);
    });
  }

  adjustCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clearFrame() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getArea() {
    return {
      w: this.canvas.width,
      h: this.canvas.height,
    };
  }

  drawCircle(p: Point, c: Color) {
    if (p.x && p.y && p.z) {
      this.context.fillStyle = c.getColor();
      this.context.beginPath();
      this.context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
      this.context.closePath();
      this.context.fill();
    }
  }
}
