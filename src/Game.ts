import { createInput } from "./Input";
import { queueRender, registerRender, renderVictoryAnimation } from "./Renderer";
import { isOnTile } from "./Utils";

export enum TileType {
    ROAD,
    HOLE
}

export class Tile {
    type: TileType;
    active: boolean;

    constructor(type: TileType, active: boolean) {
        this.type = type;
        this.active = active;
    }
}

export class GameMap {
    map: Tile[][];
    tilesToBeCleared: Tile[];
    constructor(level: Level) {
        this.map = [];
        this.tilesToBeCleared = [];

        for (let row = 0; row < level.map.length; row++) {
            this.map[row] = [];
            for (let column = 0; column < level.map[row].length; column++) {
                const type = level.map[row][column];
                const isStartTile = isOnTile(row, column, level.start);

                const tile = new Tile(type, isStartTile);
                this.map[row][column] = tile;

                if (type === TileType.ROAD) {
                    this.tilesToBeCleared.push(tile);
                }
            }
        }
    }

    canStepOn(position: Position): boolean {
        const row = this.map[position.row];
        if (!row) {
            return false;
        }
        const tile = row[position.column];
        const type: TileType | undefined = tile?.type;
        return type !== undefined && tile?.active === false && type !== TileType.HOLE;
    }

    activateTile(position: Position) {
        const tile = this.map[position.row][position.column];
        if (tile) {
            tile.active = true;
        }
    }

    isCleared(): boolean {
        return !this.tilesToBeCleared.some(t => !t.active);
    }
}

export type Position = {
    row: number;
    column: number;
}

export type Level = {
    start: Position;
    end: Position;
    map: TileType[][];
}

export enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

export class Player {
    position: Position;
    constructor(position: Position) {
        this.position = position;
    }

    nextPosition(direction: Direction): Position {
        let row = this.position.row;
        let column = this.position.column;
        switch (direction) {
            case Direction.UP:
                row -= 1;
                break;
            case Direction.DOWN:
                row += 1;
                break;
            case Direction.RIGHT:
                column += 1;
                break;
            case Direction.LEFT: column -= 1;
                break;
        }
        return { row, column };
    }

}
export function createGame(element: Element, level: Level, gameEndCallback: () => void) {
    let map: GameMap | undefined;
    let player: Player | undefined;
    const { end } = level;
    const render = () => queueRender({ tiles: map!.map, player: player!, end });

    const createGame = () => {
        map = new GameMap(level);
        player = new Player(level.start);
        render();
    }

    const checkWinCondition = () => {
        if (map!.isCleared() && isOnTile(end.row, end.column, player!.position)) {
            renderVictoryAnimation();
            gameEndCallback();
        }
    }

    const move = (direction: Direction) => {
        const nextPosition = player!.nextPosition(direction);
        if (map!.canStepOn(nextPosition)) {
            player!.position = nextPosition;
            map!.activateTile(nextPosition);
            render();
            checkWinCondition();
        }
    }

    createInput({
        up: () => move(Direction.UP),
        right: () => move(Direction.RIGHT),
        down: () => move(Direction.DOWN),
        left: () => move(Direction.LEFT),
        reset: () => createGame()
    });

    registerRender(element, createGame);
    createGame();
}