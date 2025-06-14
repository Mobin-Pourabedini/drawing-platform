import React, {useState} from "react";
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

const Board: React.FC<BoardProps> = ({selectedTool}) => {
    const [rawPoints, setRawPoints] = useState<number[][]>([
        [10, 10, 0.5],
        [15, 15, 0.6],
        [20, 25, 0.7],
        [25, 30, 0.8],
        [30, 35, 1],
    ]);

    function handleAction(e: React.MouseEvent<SVGSVGElement, MouseEvent>){
        setRawPoints((prev) => [...prev, [e.pageX, e.pageY, 1]]);
        console.log("handleAction: ", e);
    }

    // Generate stroke outline points from perfect-freehand
    const strokeOutlinePoints = getStroke(rawPoints, {
        size: 2,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
    });

    // Convert outline points to SVG path string
    const pathData = getSvgPathFromStroke(strokeOutlinePoints);

    return (
        <svg onClick={handleAction}
            width="90%"
            height="90%"
            style={{ border: "1px solid #ccc", background: "#fafafa", margin: "auto"}}
        >
            <path d={pathData} fill="black" />
        </svg>
    );
};

export default Board;
