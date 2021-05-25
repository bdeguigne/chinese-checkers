import React, { useRef, useEffect, FC, useCallback } from "react";
// import { getBoard } from "./draw-functions";

interface Props {
  onClick?(event: MouseEvent): void;
}

export const Canvas: FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    // drawBoard(context);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        draw(context);
      }

      canvas.addEventListener("click", function (event) {
        console.log(event.clientX);
        console.log(event.clientY);
        // if (props.onClick) {
        //   props.onClick(event);
        // }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw]);

  return <canvas width="800" height="800" ref={canvasRef} />;
};
