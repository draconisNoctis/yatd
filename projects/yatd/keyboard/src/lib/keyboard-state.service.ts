import { EventManager } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable, fromEventPattern, NEVER } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { KeyboardEventService } from './keyboard-events.service';

export type Keys = string;
export type KeyboardState = Partial<Record<Keys, true>>;

@Injectable({
    providedIn: 'root'
})
export class KeyboardStateService extends Observable<Readonly<KeyboardState>> {
    readonly state: KeyboardState = {};

    constructor(keyboard: KeyboardEventService, eventManager: EventManager) {
        super(observer => {
            const windowBlur$ =
                typeof window === 'undefined'
                    ? NEVER
                    : fromEventPattern(
                          handler => eventManager.addEventListener(window as any, 'blur', handler),
                          (_, dispose) => dispose()
                      );

            keyboard
                .pipe(
                    map(event => {
                        if ('keydown' === event.type) {
                            this.state[event.code] = true;
                        } else if ('keyup' === event.type) {
                            delete this.state[event.code];
                        }
                        return { ...this.state };
                    })
                )
                .subscribe(observer);

            windowBlur$
                .pipe(
                    map(() => {
                        (this as { state: KeyboardState }).state = {};
                        return { ...this.state };
                    })
                )
                .subscribe(observer);
        });
    }
}
