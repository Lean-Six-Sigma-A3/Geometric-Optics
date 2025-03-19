import { createCircle } from "../utils/ShapeGenerator";
export const presetData = {
    paperPlane: {
        coordinates: [
            [5, -40, 55, 40],
            [-15, -20, 55, 40],
            [-35, 0, 55, 40],
            [-55, 20, 55, 40],
            [5, -40, -15, -20],
            [-15, -20, -30, -35],
            [-30, -35, -10, -25],
            [-30, -35, -35, 0],
            [-35, 0, -55, 20],
        ],
        defaultScale: 1,
        defaultX: -100,
        defaultY: 50
    },
    cyberTruck: {
        coordinates: [
            // Main body outline - converting to Cartesian with (0,0) in center
            [-22, 63, -165, 16],           // Top diagonal line
            [-142, 9, -157, -21],          // Left front section
            [-157, -21, -165, 16],         // Front connection
            [-142, 9, -105, 9],            // Lower front section
            [-105, 9, -90, -14],           // Front wheel arch
            [-90, -14, -90, -34],          // Front side
            [-90, -34, 67, -34],           // Bottom base line
            [67, -34, 67, -7],             // Rear wheel well start
            [87, 8, 67, -7],               // Rear wheel curve
            [87, 8, 122, 8],               // Rear bottom section
            [122, 8, 157, -27],            // Rear angle
            [165, 31, 157, -27],           // Rear top corner
            [165, 31, -22, 63],            // Top line

            // Windows and details
            [-14, 63, -22, 23],            // Front window
            [-22, 23, -22, -27],           // Front corner detail

            // Door and panel lines
            [45, 47, 45, 23],              // Middle panel line
            [45, 23, 45, -27],             // Middle detail
            [-165, 16, 165, 31],           // Top contour

            // Additional details
            [-67, 46, -75, 9],             // Side panel detail
            [-75, 9, -75, -27],            // Side detail extension
            [-75, -27, 45, -27],           // Bottom detail

            //wheel as circle
            ...createCircle(-123, -34, 30, 40),  // Left/front wheel
            ...createCircle(102, -34, 30, 100),
        ],

        defaultScale: 0.6,
        defaultX: -100,
        defaultY: 40,
    },
};

export const presetCoordinates = Object.fromEntries(
    Object.entries(presetData).map(([key, data]) => [key, data.coordinates])
);

export type PresetKey = keyof typeof presetData;
