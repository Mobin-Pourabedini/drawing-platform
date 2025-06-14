import React from "react";
import getStroke from "perfect-freehand";

function getSvgPathFromStroke(points: number[][]): string {
    if (points.length === 0) return "";
    const [firstX, firstY] = points[0];
    const path = points.reduce(
        (acc, [x, y]) => acc + `L${x.toFixed(2)} ${y.toFixed(2)} `,
        `M${firstX.toFixed(2)} ${firstY.toFixed(2)} `
    );
    return path + "Z"; // Close the path
}

const Board: React.FC = () => {
    // Example raw points: an array of [x, y, pressure]
    const rawPoints = [
        [10, 10, 0.5],
        [15, 15, 0.6],
        [20, 25, 0.7],
        [25, 30, 0.8],
        [30, 35, 1],
    ];

    // Generate stroke outline points from perfect-freehand
    const strokeOutlinePoints = getStroke(rawPoints, {
        size: 8,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
    });

    // Convert outline points to SVG path string
    const pathData = getSvgPathFromStroke(strokeOutlinePoints);

    return (
        <svg
            width="90%"
            height="90%"
            style={{ border: "1px solid #ccc", background: "#fafafa", margin: "auto"}}
        >
            <path d={pathData} fill="black" />
        </svg>
    );
};

export default Board;
