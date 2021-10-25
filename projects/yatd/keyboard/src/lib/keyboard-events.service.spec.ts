import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { KeyboardEventService } from './keyboard-events.service';

describe('KeyboardEventService', () => {
    let service: KeyboardEventService;
    let document: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(KeyboardEventService);
        document = TestBed.inject(DOCUMENT);
    });

    it('should be an Observable', () => {
        expect(service).toBeInstanceOf(Observable);
    });

    it('should trigger keydown event', () => {
        service.pipe(first()).subscribe(event => {
            expect(event).toBeInstanceOf(KeyboardEvent);
            expect(event.type).toBe('keydown');
            expect(event.code).toBe('KeyA');
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
    });

    it('should trigger keyup event', () => {
        service.pipe(first()).subscribe(event => {
            expect(event).toBeInstanceOf(KeyboardEvent);
            expect(event.type).toBe('keyup');
            expect(event.code).toBe('KeyA');
        });

        document.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));
    });
});
