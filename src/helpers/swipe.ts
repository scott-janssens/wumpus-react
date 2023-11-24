export default class Swipe {
    private _element: HTMLElement;
    private _firstTouch: Touch | null;
    private _lastTouchTime: number | null;
    private _xDown: number | null;
    private _yDown: number | null;

    public constructor(element: HTMLElement) {
        this._element = element;
        document.addEventListener('touchstart', e => this.handleTouchStart(e), false);
        document.addEventListener('touchmove', e => this.handleTouchMove(e), false);
    }

    private handleTouchStart(evt: TouchEvent): void {
        if (this._lastTouchTime !== null && evt.timeStamp - this._lastTouchTime < 250) {
            this._lastTouchTime = null;
            this._element.dispatchEvent(new KeyboardEvent("keyup", { "code": "Space" }));
        }
        else {
            this._lastTouchTime = evt.timeStamp;

            const firstTouch = evt.touches[0];
            this._xDown = firstTouch.clientX;
            this._yDown = firstTouch.clientY;
            this._firstTouch = evt.touches[0];
        }
    }

    private handleTouchMove(evt: TouchEvent) {
        if (!this._xDown || !this._yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        const xDiff = this._xDown - xUp;
        const xDiffAbs = Math.abs(xDiff);
        const yDiff = this._yDown - yUp;
        const yDiffAbs = Math.abs(yDiff);

        if (xDiffAbs > 5 || yDiffAbs > 5) {
            if (xDiffAbs > yDiffAbs) {
                if (xDiff > 0) {
                    this._element.dispatchEvent(new KeyboardEvent("keyup", { "code": "ArrowLeft" }));
                }
                else {
                    this._element.dispatchEvent(new KeyboardEvent("keyup", { "code": "ArrowRight" }));
                }
            }
            else {
                if (yDiff > 0) {
                    this._element.dispatchEvent(new KeyboardEvent("keyup", { "code": "ArrowUp" }));
                }
                else {
                    this._element.dispatchEvent(new KeyboardEvent("keyup", { "code": "ArrowDown" }));
                }
            }
        }

        this._xDown = null;
        this._yDown = null;
    };
}