import { Color } from "./Color";
import { Drawer, ElmSelector } from "./Drawer";
import { Shape } from "./Shape";
import { ShapeBuilder } from "./ShapeBuilder";

export class ShapeShifter {
  drawer: Drawer;
  builder: ShapeBuilder;
  shape: Shape;

  constructor(elmSelector: ElmSelector) {
    this.drawer = new Drawer(elmSelector);
    this.builder = new ShapeBuilder();
    this.shape = new Shape(this.drawer);
    this.drawer.loop(() => {
      this.shape.render();
    });
  }

  render(letter: string, color?: Color) {
    this.shape.switchShape(this.builder.letter(letter, color));
  }
}
