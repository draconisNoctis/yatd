import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    ArcRotateCamera,
    Color3,
    DynamicTexture,
    Engine,
    HemisphericLight,
    Light,
    Mesh,
    MeshBuilder,
    Node,
    Scene,
    StandardMaterial,
    TargetCamera,
    TransformNode,
    Vector3,
    VertexData
} from '@babylonjs/core';
import { Store } from '@ngrx/store';
import { ObjectRegistryService } from '@yatd/engine';
import { assert } from '@yatd/utils';
import { Subject } from 'rxjs';
import { ModelViewerState } from '../../reducers';
import { selectZoom } from './../../selectors/ui.selectors';

@Component({
    selector: 'yatd-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnDestroy, OnInit, AfterViewInit {
    @ViewChild('3d', { static: true })
    canvas3D?: ElementRef<HTMLCanvasElement>;
    @ViewChild('x', { static: true })
    canvasX?: ElementRef<HTMLCanvasElement>;
    @ViewChild('y', { static: true })
    canvasY?: ElementRef<HTMLCanvasElement>;
    @ViewChild('z', { static: true })
    canvasZ?: ElementRef<HTMLCanvasElement>;

    fps?: number;
    frameTime?: number;

    protected readonly destroyed$ = new Subject<void>();
    readonly zoom$ = this.store.select(selectZoom);

    constructor(
        protected readonly ngZone: NgZone,
        protected readonly cdr: ChangeDetectorRef,
        protected readonly store: Store<ModelViewerState>,
        protected readonly objectRegistry: ObjectRegistryService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {}

    async ngAfterViewInit(): Promise<void> {
        assert(this.canvas3D, 'canvas3D need to be provieded');
        assert(this.canvasX, 'canvasX need to be provieded');
        assert(this.canvasY, 'canvasY need to be provieded');
        assert(this.canvasZ, 'canvasZ need to be provieded');
        const canvas = document.createElement('canvas');
        const engine = new Engine(canvas, true);
        engine.inputElement = this.canvas3D.nativeElement;
        const scene = new Scene(engine);

        const camera = this.initCamera(scene, this.canvas3D.nativeElement);
        engine.registerView(this.canvas3D.nativeElement);

        const camX = this.initAxisCamera(scene, 'x');
        engine.registerView(this.canvasX.nativeElement, camX);
        const camY = this.initAxisCamera(scene, 'y');
        engine.registerView(this.canvasY.nativeElement, camY);
        const camZ = this.initAxisCamera(scene, 'z');
        engine.registerView(this.canvasZ.nativeElement, camZ);

        this.initLightning(scene);
        const model = await this.objectRegistry.create('mesh', 'tower01', scene);
        const axis = await this.objectRegistry.create('transformNode', 'axis_indicator', scene);

        this.ngZone.runOutsideAngular(() => {
            let counter = 0;
            engine.runRenderLoop(() => {
                const start = performance.now();
                scene.render();
                this.fps = engine.getFps();
                this.frameTime = performance.now() - start;
                if (counter++ % 30 === 0) {
                    this.cdr.detectChanges();
                }
            });
        });
    }

    protected initCamera(scene: Scene, canvas: HTMLCanvasElement): ArcRotateCamera {
        const camera = new ArcRotateCamera('camera', -Math.PI / 3, Math.PI / 3, 25, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        return camera;
    }

    protected initAxisCamera(scene: Scene, axis: 'x' | 'y' | 'z') {
        const pos = Vector3.Zero();
        pos[axis] = axis === 'y' ? 10 : -10;
        const cam = new TargetCamera(`camera-${axis}-axis`, pos, scene);
        cam.target = Vector3.Zero();
        return cam;
    }

    protected initLightning(scene: Scene): Light {
        return new HemisphericLight('light', new Vector3(5, 10, 0), scene);
    }
}
