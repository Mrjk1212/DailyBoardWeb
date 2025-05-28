// src/components/canvas/Grid.jsx

import React from "react";
import { Line } from "react-konva";

const Grid = ({ spacing = 50, width = window.innerWidth * 10, height = window.innerHeight * 10, color = "#ddd" }) => {
    const lines = [];

    // Vertical lines
    for (let x = 0; x < width; x += spacing) {
        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, 0, x, height]}
                stroke={color}
                strokeWidth={1}
            />
        );
    }

    // Horizontal lines
    for (let y = 0; y < height; y += spacing) {
        lines.push(
            <Line
                key={`h-${y}`}
                points={[0, y, width, y]}
                stroke={color}
                strokeWidth={1}
            />
        );
    }

    return <>{lines}</>;
};

export default Grid;
