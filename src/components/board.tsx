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
}

type shape = {
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

const Board: React.FC<BoardProps> = ({ selectedTool }) => {
    const [paths, setPaths] = useState<string[]>([]);
    const [shapes, setShapes] = useState<shape[]>([]);
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
        setShapes(prev => [...prev,
            createShape(selectedTool, shapeStartingPoint, currX, currY)])
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
            width="100%"
            height="100%"
            style={{ border: "1px solid #ccc", background: "#fafafa" }}
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
