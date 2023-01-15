export type Handlers = {
    up: () => void;
    right: () => void;
    down: () => void;
    left: () => void;
    reset: () => void;
}

let currentInputHandler: (e: KeyboardEvent) => void | undefined;
export function createInput(handlers: Handlers) {
    if (currentInputHandler) {
        document.removeEventListener("keydown", currentInputHandler);
    }

    currentInputHandler = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "w") {
            handlers.up();
        } else if (key === "arrowright" || key === "d") {
            handlers.right();
        } else if (key === "arrowdown" || key === "s") {
            handlers.down();
        } else if (key === "arrowleft" || key === "a") {
            handlers.left();
        } else if (key === "r") {
            handlers.reset();
        }
    };
    document.addEventListener("keydown", currentInputHandler);
}