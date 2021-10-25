import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KeyboardEventService extends Observable<KeyboardEvent> {
    constructor(@Inject(DOCUMENT) document: any, eventManager: EventManager) {
        super(observer => {
            const handler = observer.next.bind(observer);

            const disposeKeydown = eventManager.addEventListener(document, 'keydown', handler);
            const disposeKeyup = eventManager.addEventListener(document, 'keyup', handler);

            return () => {
                disposeKeydown();
                disposeKeyup();
            };
        });
    }
}
