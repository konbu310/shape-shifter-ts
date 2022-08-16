interface PointInit {
  x?: number;
  y?: number;
  z?: number;
  a?: number;
  h?: number;
}

export class Point implements PointInit {
  x: number;
  y: number;
  z: number;
  a: number;
  h: number;

  constructor(arg: PointInit) {
    this.x = arg.x; //?? Math.random() * window.innerWidth;
    this.y = arg.y; //?? Math.random() * window.innerHeight;
    this.z = arg.z; //?? 5;
    this.a = arg.a; //?? 1;
    this.h = arg.h; //?? 0;
  }
}
