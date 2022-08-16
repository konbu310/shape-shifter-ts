import React, { FC, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Color } from "./ShapeShifter/Color";
import { ShapeShifter } from "./ShapeShifter/ShapeShifter";
import "./style.css";

const OverlayCanvas: FC<{ id: string }> = ({ id }) => {
  return (
    <canvas
      id={id}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        background: "transparent",
        pointerEvents: "none",
        userSelect: "none",
      }}
    ></canvas>
  );
};

const App: FC<{}> = ({}) => {
  const shifter = useRef<ShapeShifter | null>(null);

  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    let color: Color | undefined = undefined;
    if (text === "正解") color = new Color(81, 191, 36, 1);
    if (text === "不正解") color = new Color(244, 30, 40, 1);
    shifter.current?.render(text, color);
    setText(" ");
    inputRef.current?.focus();
  };

  useEffect(() => {
    shifter.current = new ShapeShifter("#canvas");
  }, []);

  return (
    <div>
      <OverlayCanvas id="canvas" />
      <input
        autoFocus
        ref={inputRef}
        type="text"
        value={text}
        onChange={(ev) => setText(ev.currentTarget.value)}
      />
      <button onClick={send}>send</button>
    </div>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root")!;
  const root = createRoot(container);
  root.render(<App />);
});
