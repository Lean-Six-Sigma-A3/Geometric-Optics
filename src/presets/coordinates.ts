import {createCircle} from "../utils/ShapeGenerator";
export const presetCoordinates = {
    paperPlane: [
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
     cyberTruck: [
        // Main body outline - converting to Cartesian with (0,0) in center
        [-22, 48, -165, 1],     // Top diagonal line
        [-142, -6, -157, -36],  // Left front section
        [-157, -36, -165, 1],   // Front connection
        [-142, -6, -105, -6],   // Lower front section
        [-105, -6, -90, -29],   // Front wheel arch
        [-90, -29, -90, -49],   // Front side
        [-90, -49, 67, -49],    // Bottom base line
        [67, -49, 67, -22],     // Rear wheel well start
        [87, -7, 67, -22],      // Rear wheel curve
        [87, -7, 122, -7],      // Rear bottom section
        [122, -7, 157, -42],    // Rear angle
        [165, 16, 157, -42],    // Rear top corner
        [165, 16, -22, 48],     // Top line
        
        // Windows and details
        [-14, 48, -22, 8],      // Front window 
        [-22, 8, -22, -42],     // Front corner detail
        
        // Door and panel lines
        [45, 32, 45, 8],        // Middle panel line
        [45, 8, 45, -42],       // Middle detail
        [-165, 1, 165, 16],     // Top contour
        
        // Additional details
        [-67, 31, -75, -6],     // Side panel detail
        [-75, -6, -75, -42],    // Side detail extension
        [-75, -42, 45, -42],   // Bottom detail

        //wheel as circle
        ...createCircle(-123, -49, 30, 40),  // Left/front wheel
        ...createCircle(102, -49, 30, 100),  
    ],
} as const;

export type PresetKey = keyof typeof presetCoordinates;

