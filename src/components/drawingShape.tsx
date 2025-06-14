import {type JSX} from "react";
import { ShapeTypes } from "@enums/shapes.enum";

type Shape = {
    kind: ShapeTypes;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export function drawShape(shape: Shape, key: string): JSX.Element | null {
    const { x1, y1, x2, y2 } = shape;

    switch (shape.kind) {
        case ShapeTypes.Square: {
            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);
            const x = Math.min(x1, x2);
            const y = Math.min(y1, y2);
            return <rect key={key} x={x} y={y} width={width} height={height} fill="black" />;
        }

        case ShapeTypes.Circle: {
            const radius =
                Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            return <circle key={key} cx={cx} cy={cy} r={radius} fill="black" />;
        }

        case ShapeTypes.Triangle: {
            // Draw an upward triangle from bounding box
            const topX = (x1 + x2) / 2;
            const topY = Math.min(y1, y2);
            const leftX = Math.min(x1, x2);
            const leftY = Math.max(y1, y2);
            const rightX = Math.max(x1, x2);
            const rightY = leftY;

            const points = `${topX},${topY} ${leftX},${leftY} ${rightX},${rightY}`;
            return <polygon key={key} points={points} fill="black" />;
        }

        default:
            return null;
    }
}
