export function createCircle(centerX: number, centerY: number, radius: number, segments: number = 24): number[][] {
    const coordinates: number[][] = [];
    
    for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * Math.PI * 2;
        const angle2 = ((i + 1) / segments) * Math.PI * 2;
        
        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;
        
        coordinates.push([x1, y1, x2, y2]);
    }
    
    return coordinates;
}