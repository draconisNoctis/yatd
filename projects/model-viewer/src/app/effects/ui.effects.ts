import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { KeyboardEventService } from '@yatd/keyboard';
import { filter, map } from 'rxjs/operators';
import { toggleZoom } from './../actions/ui.actions';

@Injectable()
export class UiEffects {
    toggleZoom$ = createEffect(() =>
        this.keyboard.pipe(
            filter(event => event.type === 'keyup' && event.code === 'KeyZ'),
            filter(() => !['input', 'textarea'].includes(this.document.activeElement?.tagName?.toLowerCase())),
            map(() => toggleZoom())
        )
    );

    constructor(protected readonly actions$: Actions, protected readonly keyboard: KeyboardEventService, @Inject(DOCUMENT) protected readonly document: any) {}
}
