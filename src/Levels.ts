import { Level, TileType } from "./Game";

export const LEVELS: Level[] = [
    {
        start: { row: 0, column: 0 },
        end: { row: 0, column: 4 },
        map: [
            [TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD],
        ]
    },
    {
        start: { row: 0, column: 0 },
        end: { row: 0, column: 2 },
        map: [
            [TileType.ROAD, TileType.HOLE, TileType.ROAD],
            [TileType.ROAD, TileType.HOLE, TileType.ROAD],
            [TileType.ROAD, TileType.ROAD, TileType.ROAD]
        ]
    },
    {
        start: { row: 0, column: 0 },
        end: { row: 0, column: 2 },
        map: [
            [TileType.ROAD, TileType.ROAD, TileType.ROAD],
            [TileType.ROAD, TileType.ROAD, TileType.ROAD],
            [TileType.ROAD, TileType.ROAD, TileType.ROAD]
        ]
    },
    {
        start: { row: 0, column: 0 },
        end: { row: 2, column: 8 },
        map: [
            [TileType.ROAD, TileType.HOLE, TileType.HOLE, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD],
            [TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.HOLE, TileType.HOLE, TileType.ROAD, TileType.ROAD, TileType.ROAD],
            [TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.ROAD, TileType.HOLE, TileType.HOLE, TileType.ROAD, TileType.ROAD, TileType.ROAD],
            [TileType.HOLE, TileType.HOLE, TileType.HOLE, TileType.HOLE, TileType.HOLE, TileType.HOLE, TileType.ROAD, TileType.ROAD, TileType.HOLE],
        ]
    }
];