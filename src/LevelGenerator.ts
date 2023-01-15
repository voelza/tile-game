import { Direction, Level, Player, Position, TileType, GameMap } from "./Game";
import { randomIntFromInterval } from "./Utils";

export function generateRandomLevel(rows: number, columns: number): Level {
    const tileMap: TileType[][] = [];

    for (let row = 0; row < rows; row++) {
        tileMap[row] = [];
        for (let column = 0; column < columns; column++) {
            tileMap[row][column] = TileType.ROAD;
        }
    }

    const start = randomPosition(rows, columns);
    const map = new GameMap({ map: tileMap, start: start, end: start });

    const generatorPlayer = new Player(start);
    const tileAmount = rows * columns;
    const minPathLength = Math.floor(tileAmount / randomIntFromInterval(2, 3)) + 3;
    const pathLength = randomIntFromInterval(minPathLength, tileAmount);
    const path: Position[] = [];
    for (let i = 0; i < pathLength; i++) {
        path.push(generatorPlayer.position);
        let nextPos;
        let attemps = 0;
        do {
            nextPos = nextRandomPosition(generatorPlayer);
            attemps++;
            if (attemps >= 5) {
                // try again
                return generateRandomLevel(rows, columns);
            }
        } while (!map.canStepOn(nextPos));
        generatorPlayer.position = nextPos;
        map.activateTile(nextPos);
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (!path.some(pos => pos.row === row && pos.column === column)) {
                tileMap[row][column] = TileType.HOLE;
            }
        }
    }

    // debugLog(path, tileMap);
    return { start: path[0], end: path[path.length - 1], map: tileMap };
}

// function debugLog(path: Position[], tileMap: TileType[][]) {
//     const l: string[][] = [];
//     for (let row = 0; row < tileMap.length; row++) {
//         const r = tileMap[row];
//         l[row] = [];
//         for (let column = 0; column < r.length; column++) {
//             let found = false;
//             for (let i = 0; i < path.length; i++) {
//                 if (isOnTile(row, column, path[i])) {
//                     l[row][column] = `${i}`;
//                     found = true;
//                     break;
//                 }
//             }
//             if (!found) {
//                 l[row][column] = ``;
//             }
//         }
//     }
//     console.log(path);
//     console.table(l);
// }

function randomPosition(rows: number, columns: number): Position {
    return { row: randomIntFromInterval(0, rows - 1), column: randomIntFromInterval(0, columns - 1) };
}

function nextRandomPosition(player: Player): Position {
    return player.nextPosition(randomEnum(Direction));
}

function randomEnum<T extends {}>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue;
}