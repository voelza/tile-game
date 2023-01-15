import { Player, Position, Tile, TileType } from "./Game";
import { Handlers } from "./Input";
import { smallDevice as IS_SMALL_DEVICE } from "./main";
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
export function registerRender(element: Element, reset: () => void, handlers: Handlers | undefined) {
    clearInterval(id);
    id = setInterval(() => {
        if (renderQueue.length > 0) {
            console.log("Rendering UI");
            const render = renderQueue.shift()!;
            renderLevel(element, render, reset, handlers);
        }
    }, 100);
}

function renderLevel(element: Element, state: RenderState, reset: () => void, handlers: Handlers | undefined): void {
    element.innerHTML = "";
    const resetBtn = createElement("button", "margin-left: auto;");
    resetBtn.textContent = "Reset (or press 'r')";
    resetBtn.addEventListener("click", reset);
    element.appendChild(resetBtn);

    const mapElement = createElement("div");

    const size = IS_SMALL_DEVICE ? 25 : 40;
    for (let row = 0; row < state.tiles.length; row++) {
        const rowEle = createElement("div", "display: flex;");
        for (let column = 0; column < state.tiles[row].length; column++) {
            const tile = state.tiles[row][column];
            const tileElement = renderTile(tile, size);

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

    if (!IS_SMALL_DEVICE) {
        const info = createElement("pre", "text-align: left;");
        info.textContent = "To win fill all brown tiles with plants 🌾\nand end on the golden tile with the tree🌳.\nUse arrow keys or 'wasd' to move.";
        element.appendChild(info);
    } else if (handlers) {
        element.appendChild(createVisualInput(handlers));
    }
}

function renderTile(tile: Tile, size: number): Element {
    const tileElement = createElement("div", `display: flex; flex-direction: column; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;`);
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

function createVisualInput(handlers: Handlers): Element {
    const container = createElement("div", "margin: auto; margin-top: 15px;");
    container.appendChild(createBtn("⬆️", handlers.up));

    const leftRightContainer = createElement("div");
    leftRightContainer.appendChild(createBtn("⬅️", handlers.left));
    leftRightContainer.appendChild(createBtn("➡️", handlers.right));
    container.appendChild(leftRightContainer);

    container.appendChild(createBtn("⬇️", handlers.down));
    return container;
}

function createBtn(text: string, handler: () => void, style: string | undefined = undefined): Element {
    const btn = createElement("button", style);
    btn.textContent = text;
    btn.addEventListener("click", handler);
    return btn;
}

export function renderVictoryAnimation(gameEndCallback: () => void, shareCallback: (() => void) | undefined) {
    for (let i = 0; i < 20; i++) {
        const confetti = createElement("span", `
            position: fixed;
            top: ${randomIntFromInterval(0, document.body.clientHeight)}px;
            
            left: ${randomIntFromInterval(0, document.body.clientWidth)}px;
            font-size: ${randomIntFromInterval(1, 3)}rem;
            animation: bigMe 2s;
        `);
        confetti.textContent = "🎉";
        document.body.appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }

    const dialog = createElement("dialog") as HTMLDialogElement;
    dialog.setAttribute("open", "");
    dialog.setAttribute("tabindex", "1");

    const form = createElement("form");
    form.setAttribute("method", "dialog");



    const body = createElement("div");
    body.textContent = `You did it!`;
    dialog.appendChild(body);

    if (shareCallback) {
        const shareBtn = createElement("button") as HTMLButtonElement;
        shareBtn.textContent = "Share ☍ (s)";
        shareBtn.addEventListener("click", shareCallback);
        dialog.appendChild(shareBtn);
    }

    const nextLevelBtn = createElement("button") as HTMLButtonElement;
    nextLevelBtn.textContent = "Next Level (n)";
    form.appendChild(nextLevelBtn);
    dialog.appendChild(form);
    document.body.appendChild(dialog);

    dialog.focus();

    const close = () => {
        dialog.remove();
        gameEndCallback();
    };
    dialog.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (key === "n") {
            close();
        } else if (key === "s" && shareCallback) {
            shareCallback();
        }
    });
    dialog.addEventListener('close', close);
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