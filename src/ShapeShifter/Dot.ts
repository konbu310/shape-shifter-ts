import { Drawer } from "./Drawer";
import { Color } from "./Color";
import { Point } from "./Point";

export class Dot {
  p: Point;
  e = 0.07;
  s = true;
  c: Color;
  t = this.clone();
  queue: Point[] = [];
  drawer: Drawer;

  constructor(x: number, y: number, drawer: Drawer, color?: Color) {
    this.p = new Point({ x, y, z: 5, a: 1, h: 0 });
    this.c = color
      ? new Color(color.r, color.g, color.b, this.p.a)
      : new Color(255, 255, 255, this.p.a);
    this.drawer = drawer;
  }

  clone() {
    return new Point({
      ...this.p,
    });
  }

  #draw() {
    this.c.a = this.p.a;
    this.drawer.drawCircle(this.p, this.c);
  }

  #moveTowards(n: Point) {
    const [dx, dy, d] = this.distanceTo(n, true);
    const e = this.e * d;

    if (this.p.h === -1) {
      this.p.x = n.x;
      this.p.y = n.y;
      return true;
    }

    if (d > 1) {
      this.p.x -= (dx / d) * e;
      this.p.y -= (dy / d) * e;
    } else {
      if (this.p.h && this.p.h > 0) {
        this.p.h--;
      } else {
        return true;
      }
    }

    return false;
  }

  #update() {
    let p: Point | undefined, d: number;
    if (this.#moveTowards(this.t)) {
      p = this.queue.shift();
      if (p) {
        this.t.x = p.x || this.p.x;
        this.t.y = p.y || this.p.y;
        this.t.z = p.z || this.p.z;
        this.t.a = p.a || this.p.a;
        this.p.h = p.h || 0;
      } else {
        if (this.s) {
          this.p.x -= Math.sin(Math.random() * 3.142);
          this.p.y -= Math.sin(Math.random() * 3.142);
        } else {
          this.move(
            new Point({
              x: this.p.x + Math.random() * 50 - 25,
              y: this.p.y + Math.random() * 50 - 25,
            })
          );
        }
      }
    }
    d = this.p.a - this.t.a;
    this.p.a = Math.max(0.1, this.p.a - d * 0.05);
    d = this.p.z - this.t.z;
    this.p.z = Math.max(1, this.p.z - d * 0.05);
  }

  distanceTo<T extends boolean>(
    n: Point,
    details?: T
  ): T extends true ? [number, number, number] : number {
    const dx = this.p.x - n.x;
    const dy = this.p.y - n.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    return (details ? [dx, dy, d] : d) as T extends true
      ? [number, number, number]
      : number;
  }

  move(p: Point, avoidStatic = false) {
    if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
      this.queue.push(p);
    }
  }

  render() {
    this.#update();
    this.#draw();
  }
}
