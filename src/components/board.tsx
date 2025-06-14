import React, {useRef, useState} from "react";
import getStroke from "perfect-freehand";
import {Tools} from "@enums/tools.enum"

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

const Board: React.FC<BoardProps> = ({ selectedTool }) => {
    const [paths, setPaths] = useState<string[]>([]);
    const [rawPoints, setRawPoints] = useState<number[][]>([]);
    const isDrawingWithPen = useRef(false);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current!;
        const rect = svg.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseDownPen(e);
                break;
        }
    }

    const handleMouseMove =  (e: React.MouseEvent<SVGSVGElement>) => {
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseMovePen(e);
                break;
        }
    };

    const handleMouseUp = () => {
        switch (selectedTool) {
            case Tools.Pen:
                handleMouseUpPen();
                break;
        }
    };

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
        </svg>
    );
};

export default Board;
