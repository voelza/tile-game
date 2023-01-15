import { Position } from "./Game";

export function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isOnTile(row: number, column: number, position: Position | undefined): boolean {
    return position?.column === column && position?.row === row;
};
