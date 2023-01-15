import { Player, Position, Tile, TileType } from "./Game";
import { isOnTile, randomIntFromInterval } from "./Utils";

export type RenderState = {
    tiles: Tile[][],
    end: Position,
    player: Player
}

const renderQueue: RenderState[] = [];

export function queueRender(state: RenderState) {
    renderQueue.push(state);
}

let id: number | undefined = undefined;
export function registerRender(element: Element, reset: () => void) {
    clearInterval(id);
    id = setInterval(() => {
        if (renderQueue.length > 0) {
            console.log("Rendering UI");
            const render = renderQueue.shift()!;
            renderLevel(element, render, reset);
        }
    }, 100);
}

function renderLevel(element: Element, state: RenderState, reset: () => void): void {
    element.innerHTML = "";
    const resetBtn = createElement("button", "margin-left: auto;");
    resetBtn.textContent = "Reset (or press 'r')";
    resetBtn.addEventListener("click", reset);
    element.appendChild(resetBtn);

    const mapElement = createElement("div");
    for (let row = 0; row < state.tiles.length; row++) {
        const rowEle = createElement("div", "display: flex;");
        for (let column = 0; column < state.tiles[row].length; column++) {
            const tile = state.tiles[row][column];
            const tileElement = renderTile(tile);

            if (isOnTile(row, column, state.player.position)) {
                addPlayer(tileElement);
            }

            if (isOnTile(row, column, state.end)) {
                addEndTile(tileElement, tile);
            }

            rowEle.appendChild(tileElement);
        }
        mapElement.appendChild(rowEle);
    }
    element.appendChild(mapElement);

    const info = createElement("pre");
    info.textContent = `To win fill all brown tiles with plants 🌾 
    and end your journey on the golden tile with the tree 🌳.
    Use arrow keys or 'wasd' to move.
    
    `;
    element.appendChild(info);
}

function renderTile(tile: Tile): Element {
    const tileElement = createElement("div", "display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50px; height: 50px;");
    if (tile.type === TileType.ROAD) {
        appendStyle(tileElement, `
        background-color: goldenrod; 
        box-shadow: rgb(184, 134, 11) 5px 5px, rgb(184, 134, 11, 0.5) 10px 10px, rgb(184, 134, 11, 0.25) 15px 15px, rgb(184, 134, 11, 0.1) 20px 20px, rgb(184, 134, 11, 0.05) 25px 25px;
        `);
        if (tile.active) {
            appendStyle(tileElement, "background-color: forestgreen;");
            const plant = createElement("div", "font-size: 1.25rem;");
            plant.textContent = "🌾";
            tileElement.appendChild(plant);
        }
    }
    return tileElement;
}

function addPlayer(tileElement: Element): void {
    const sprite = createElement("div", "font-size: 2rem; position: absolute;");
    sprite.textContent = "👩‍🌾";
    tileElement.appendChild(sprite);
}

function addEndTile(tileElement: Element, tile: Tile): void {
    appendStyle(tileElement, `
        ${tile.active ?
            `
            background-image: linear-gradient(45deg, gold 25%, forestgreen 25%, forestgreen 50%, gold 50%, gold 75%, forestgreen 75%, forestgreen 100%);
            background-size: 56.57px 56.57px;
            `
            : "background-color: gold;"
        }
    `);
    const tree = createElement("span", "font-size: 3rem; position: absolute; z-index: 5; margin-bottom: 45px; margin-left: 15px;");
    tree.textContent = "🌳";
    tileElement.appendChild(tree);
}


export function renderVictoryAnimation(gameEndCallback: () => void) {
    for (let i = 0; i < 20; i++) {
        const confetti = createElement("span", `
            position: fixed;
            top: ${randomIntFromInterval(0, document.body.clientHeight)}px;
            
            left: ${randomIntFromInterval(0, document.body.clientWidth)}px;
            font-size: ${randomIntFromInterval(1, 3)}rem;
            animation: bigMe 1s;
        `);
        confetti.textContent = "🎉";
        document.body.appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }

    const dialog = createElement("dialog");
    dialog.setAttribute("open", "");

    const form = createElement("form");
    form.setAttribute("method", "dialog");
    const nextLevelBtn = createElement("button") as HTMLButtonElement;
    nextLevelBtn.textContent = "Next Level";

    const body = createElement("div");
    body.textContent = `You did it!`;

    form.appendChild(nextLevelBtn);
    dialog.appendChild(body);
    dialog.appendChild(form);
    document.body.appendChild(dialog);

    nextLevelBtn.focus();

    dialog.addEventListener('close', () => {
        dialog.remove();
        gameEndCallback();
    });
}

function createElement(tag: string, style: string | undefined = undefined): Element {
    const element = document.createElement(tag);
    if (style) {
        element.setAttribute("style", style);
    }
    return element;
}

function appendStyle(element: Element, style: string): void {
    element.setAttribute("style", (element.getAttribute("style") ?? "") + style);
}