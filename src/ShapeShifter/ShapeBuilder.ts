import { Color } from "./Color";
import { Dot } from "./Dot";
import { Point } from "./Point";

export class ShapeBuilder {
  shapeCanvas: HTMLCanvasElement;
  shapeContext: CanvasRenderingContext2D;
  gap = 13;
  fontSize = 1000;
  fontFamily = "Avenir, Helvetica Neue, Helvetica, Arial, sans-serif";

  constructor() {
    this.shapeCanvas = document.createElement("canvas")!;
    this.shapeContext = this.shapeCanvas.getContext("2d")!;
    this.fit();
    window.addEventListener("resize", this.fit);
  }

  getShapeCanvas() {
    return { cvs: this.shapeCanvas, ctx: this.shapeContext };
  }

  fit() {
    const { cvs, ctx } = this.getShapeCanvas();
    // gapの値で丁度割り切れる値に変換する？
    cvs.width = Math.floor(window.innerWidth / this.gap) * this.gap;
    cvs.height = Math.floor(window.innerHeight / this.gap) * this.gap;
    ctx.fillStyle = "red";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
  }

  processCanvas(color?: Color) {
    const { cvs, ctx } = this.getShapeCanvas();
    const pixels = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    let dots: Point[] = [],
      x = 0,
      y = 0,
      fx = cvs.width,
      fy = cvs.height,
      w = 0,
      h = 0;

    // rgbaの1次元配列になっているので4つずつ取り出して処理する
    for (let p = 0; p < pixels.length; p += 4 * this.gap) {
      if (pixels[p + 3] > 0) {
        dots.push(new Point({ x, y }));
        w = x > w ? x : w;
        h = y > h ? y : h;
        fx = x < fx ? x : fx;
        fy = y < fy ? y : fy;
      }
      x += this.gap;
      if (x >= cvs.width) {
        x = 0;
        y += this.gap;
        p += this.gap * 4 * cvs.width;
      }
    }

    // fx, fy は多分padding、上下左右で等しいpaddingを持った四角(w,h)を計算する
    return { dots, w: w + fx, h: h + fy, color };
  }

  setFontSize(s: number) {
    this.shapeContext.font = `bold ${s}px ${this.fontFamily}`;
  }

  isNumber(x: any): x is number {
    return !isNaN(parseFloat(x)) && isFinite(x);
  }

  letter(l: string, color?: Color) {
    const { cvs, ctx } = this.getShapeCanvas();
    let s = 0;
    this.setFontSize(this.fontSize);
    s = Math.min(
      this.fontSize,
      (cvs.width / ctx.measureText(l).width) * 0.8 * this.fontSize,
      (cvs.height / this.fontSize) *
        (this.isNumber(l) ? 1 : 0.45) *
        this.fontSize
    );
    this.setFontSize(s);

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillText(l, cvs.width / 2, cvs.height / 2);
    return this.processCanvas(color);
  }
}
