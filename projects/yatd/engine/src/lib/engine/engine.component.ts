import { isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';
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

@Component({
    selector: 'yatd-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['./engine.component.scss'],
    providers: [EngineObservable, SceneObservable],
})
export class EngineComponent implements OnInit {
    protected readonly engine?: Engine;
    protected readonly scene?: Scene;

    @Input()
    set antialiasing(antialiasing: boolean | '' | undefined) {
        this._antialiasing =
            antialiasing !== undefined && antialiasing !== false;
    }
    private _antialiasing = false;

    constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly renderer: Renderer2,
        protected readonly engineObservable: EngineObservable,
        protected readonly sceneObservable: SceneObservable,
        @Inject(PLATFORM_ID) protected readonly platform: Object
    ) {}

    ngOnInit(): void {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setStyle(canvas, 'width', '100%');
        this.renderer.setStyle(canvas, 'height', '100%');

        this.renderer.appendChild(this.elementRef.nativeElement, canvas);

        const engine = new Engine(canvas, this._antialiasing);
        const scene = new Scene(engine);

        this.engineObservable.next(engine);
        this.sceneObservable.next(scene);
    }
}
