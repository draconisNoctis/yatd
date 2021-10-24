import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Engine, Scene } from '@babylonjs/core';

import {
    EngineComponent,
    EngineObservable,
    SceneObservable,
} from './engine.component';

describe('EngineComponent', () => {
    let component: EngineComponent;
    let fixture: ComponentFixture<EngineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EngineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a canvas element', () => {
        const canvas: HTMLCanvasElement =
            fixture.nativeElement.querySelector('canvas');
        expect(canvas).toBeDefined();
        expect(canvas.style.width).toBe('100%');
        expect(canvas.style.height).toBe('100%');
    });

    it('should provide Engine to EngineObservable', () => {
        expect(
            fixture.debugElement.injector.get(EngineObservable).value
        ).toBeInstanceOf(Engine);
    });

    it('should provide Scene to SceneObservable', () => {
        expect(
            fixture.debugElement.injector.get(SceneObservable).value
        ).toBeInstanceOf(Scene);
    });
});
