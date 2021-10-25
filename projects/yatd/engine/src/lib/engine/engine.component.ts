import { isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    Output,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';
import { inject } from '@angular/core';
import { Engine, Scene } from '@babylonjs/core';
import { BehaviorSubject } from 'rxjs';

export class EngineObservable extends BehaviorSubject<Engine | null> {
    constructor() {
        super(null);
    }
}

export class SceneObservable extends BehaviorSubject<Scene | null> {
    constructor() {
        super(null);
    }
}
export class CanvasObservable extends BehaviorSubject<HTMLCanvasElement | null> {
    constructor() {
        super(null);
    }
}

@Component({
    selector: 'yatd-engine',
    template: ``,
    styleUrls: ['./engine.component.scss'],
    providers: [EngineObservable, SceneObservable, CanvasObservable],
})
export class EngineComponent implements OnInit {
    @Input()
    set antialiasing(antialiasing: boolean | '' | undefined) {
        this._antialiasing =
            antialiasing !== undefined && antialiasing !== false;
    }
    private _antialiasing = false;

    @Output()
    get engine(): EngineObservable {
        return this.engine$;
    }

    @Output()
    get scene(): SceneObservable {
        return this.scene$;
    }

    @Output()
    get canvas(): CanvasObservable {
        return this.canvas$;
    }

    constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly renderer: Renderer2,
        protected readonly engine$: EngineObservable,
        protected readonly scene$: SceneObservable,
        protected readonly canvas$: CanvasObservable,
        @Inject(PLATFORM_ID) protected readonly platform: Object
    ) {}

    ngOnInit(): void {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setStyle(canvas, 'width', '100%');
        this.renderer.setStyle(canvas, 'height', '100%');

        this.renderer.appendChild(this.elementRef.nativeElement, canvas);

        const engine = new Engine(canvas, this._antialiasing);
        const scene = new Scene(engine);

        this.engine.next(engine);
        this.scene.next(scene);
        this.canvas.next(canvas);
    }
}
