import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { KeyboardStateService } from './keyboard-state.service';

describe('KeyboardStateService', () => {
    let service: KeyboardStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(KeyboardStateService);
    });

    it('should be an Observable', () => {
        expect(service).toBeInstanceOf(Observable);
    });

    it('should emit keyboard state', () => {
        service.pipe(take(4), toArray()).subscribe(events => {
            expect(events).toEqual([{ KeyA: true }, { KeyA: true, KeyB: true }, { KeyB: true }, {}]);
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyB' }));
    });

    it('should reset keyboard state on window blur', () => {
        service.pipe(take(3), toArray()).subscribe(events => {
            expect(events).toEqual([{ KeyA: true }, { KeyA: true, KeyB: true }, {}]);
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));
        window.dispatchEvent(new FocusEvent('blur'));
    });
});
