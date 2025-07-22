import React, {useRef, useState} from "react";
import getStroke from "perfect-freehand";
import {Tools} from "@enums/tools.enum"
import {ShapeTypes} from "@enums/shapes.enum"
import {drawShape} from "@components/drawingShape";

function getSvgPathFromStroke(points: number[][]): string {
    if (points.length === 0) return "";
    const [firstX, firstY] = points[0];
    const path = points.reduce(
        (acc, [x, y]) => acc + `L${x.toFixed(2)} ${y.toFixed(2)} `,
        `M${firstX.toFixed(2)} ${firstY.toFixed(2)} `
    );
    return path + "Z"; // Close the path
}

interface BoardProps {
    selectedTool: Tools
    paths: string[]
    setPaths: React.Dispatch<React.SetStateAction<string[]>>;
    shapes: shape[];
    setShapes:  React.Dispatch<React.SetStateAction<shape[]>>;
}

export type shape = {
    kind: ShapeTypes
    x1: number
    y1: number
    x2: number
    y2: number
}

type point = {
    x: number;
    y: number;
}

function createShape(selectedTool: Tools, shapeStartingPoint: point, currX: number, currY: number) {
    return {
        kind: selectedTool as unknown as ShapeTypes,
        x1: shapeStartingPoint?.x,
        y1: shapeStartingPoint?.y,
        x2: currX,
        y2: currY,
    };
}

const Board: React.FC<BoardProps> = ({ selectedTool, paths, setPaths, shapes, setShapes }) => {

    const [rawPoints, setRawPoints] = useState<number[][]>([]);
    const [shapeStartingPoint, setShapeStartingPoint] = useState<point>({x:0, y:0})
    const [shapeCurrPoint, setShapeCurrPoint] = useState<point>({x:0, y:0})
    const isDrawingWithPen = useRef(false);
    const isDrawingWithShape = useRef(false);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current!;
        const rect = svg.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };

    // Shape collision detection functions
    const isPointInShape = (x: number, y: number, shape: shape): boolean => {
        const { kind, x1, y1, x2, y2 } = shape;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        switch (kind) {
            case ShapeTypes.Square:
                return x >= minX && x <= maxX && y >= minY && y <= maxY;

            case ShapeTypes.Circle:
                { const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                return distance <= radius; }

            case ShapeTypes.Triangle:
                // Simplified triangle collision - using bounding box
                return x >= minX && x <= maxX && y >= minY && y <= maxY;

            default:
                return false;
        }
    };

    const findShapeAtPoint = (x: number, y: number): number => {
        // Search from last to first to prioritize top shapes
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (isPointInShape(x, y, shapes[i])) {
                return i;
            }
        }
        return -1; // No shape found
    };

    const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const [x, y] = getSvgCoords(e);
        const shapeIndex = findShapeAtPoint(x, y);

        if (shapeIndex !== -1) {
            // Remove shape from array
            setShapes(prev => prev.filter((_, index) => index !== shapeIndex));
            console.log(`Shape at index ${shapeIndex} removed`);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        console.log(`here we are ${selectedTool}`)
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseDownPen(e);
                break;
            case Tools.Square:
            case Tools.Triangle:
            case Tools.Circle:
                handleMouseDownShape(e)
                break;
        }
    }

    const handleMouseMove =  (e: React.MouseEvent<SVGSVGElement>) => {
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseMovePen(e);
                break;
            case Tools.Square:
            case Tools.Triangle:
            case Tools.Circle:
                handleMouseMoveShape(e)
                break;
        }
    };

    const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseUpPen();
                break;
            case Tools.Square:
            case Tools.Triangle:
            case Tools.Circle:
                handleMouseUpShape(e)
                break;
        }
    };

    const handleMouseDownShape = (e: React.MouseEvent<SVGSVGElement>) => {
        isDrawingWithShape.current = true;
        console.log("we are drawing with shape");
        const [x, y] = getSvgCoords(e);
        setShapeStartingPoint({x: x, y: y});
    }

    const handleMouseMoveShape = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawingWithShape) return;
        const [currX, currY] = getSvgCoords(e);
        setShapeCurrPoint({x: currX, y: currY});
    }

    const handleMouseUpShape = (e: React.MouseEvent<SVGSVGElement>) => {
        const [currX, currY] = getSvgCoords(e);
        const startX = shapeStartingPoint.x
        const startY = shapeStartingPoint.y
        if ((currX - startX)*(currX - startX) + (currY - startY)*(currY - startY) > 16) {
            setShapes(prev => [...prev,
                createShape(selectedTool, shapeStartingPoint, currX, currY)])
        }
        isDrawingWithShape.current = false;
    }

    const handleMouseDownPen = (e: React.MouseEvent<SVGSVGElement>) => {
        isDrawingWithPen.current = true;
        const [x, y] = getSvgCoords(e);
        setRawPoints([[x, y, 1]]);
    };

    const handleMouseMovePen = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawingWithPen.current) return;
        const [x, y] = getSvgCoords(e);
        setRawPoints(prev => [...prev, [x, y, 1]]);
    };

    const handleMouseUpPen = () => {
        isDrawingWithPen.current = false;
        setPaths(prev => [...prev, getSvgPathFromStroke(getStroke(rawPoints, { size: 4 }))]);
        setRawPoints([])
    };

    return (
        <svg
            ref={svgRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            width="100%"
            height="100%"
            style={{ border: "1px solid #ccc", background: "#fafafa"}}
        >
            {paths.map((d, index) => (<path key={index} d={d} fill="black"/>))}
            <path key="path-in-progress" d={getSvgPathFromStroke(getStroke(rawPoints, { size: 4 }))}/>
            {shapes.map((d, index) => (drawShape(d, `key-${index}`)))}
            {isDrawingWithShape.current ?
                drawShape(
                    createShape(selectedTool,
                        shapeStartingPoint,
                        shapeCurrPoint.x,
                        shapeCurrPoint.y
                    ), "shape-in-progress") :
                null}
        </svg>
    );
};

export default Board;
