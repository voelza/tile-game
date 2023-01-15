import { Level, Position, TileType } from "./Game";

export function stringifyLevel(level: Level): string {
    return btoa(`${positionToStr(level.start)}~${positionToStr(level.end)}~${mapToStr(level.map)}`);
}

function positionToStr(position: Position): string {
    return `${position.row}-${position.column}`;
}

function mapToStr(map: TileType[][]): string {
    let str = '';
    for (const row of map) {
        for (const col of row) {
            str += col;
        }
        str += "-";
    }
    return str;
}

export function parseLevel(levelBase64: string): Level {
    const levelStr = atob(levelBase64);
    const [startPosStr, endPosStr, mapStr] = levelStr.split("~");
    return {
        start: strToPosition(startPosStr),
        end: strToPosition(endPosStr),
        map: strToMap(mapStr)
    }
}

function strToPosition(startPosStr: string): Position {
    const [row, column] = startPosStr.split("-");
    return { row: parseInt(row), column: parseInt(column) };
}
function strToMap(mapStr: string): TileType[][] {
    const map: TileType[][] = [];
    const rows = mapStr.split("-");
    for (let row = 0; row < rows.length; row++) {
        map[row] = [];
        const r = rows[row];
        for (let column = 0; column < r.length; column++) {
            map[row][column] = parseInt(r[column]);
        }
    }
    return map;
}

