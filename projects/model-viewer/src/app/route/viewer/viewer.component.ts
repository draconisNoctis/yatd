import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { ArcRotateCamera, Camera, HemisphericLight, Light, Scene, Vector3, MeshBuilder, Node } from '@babylonjs/core';
import { EngineComponent } from '@yatd/engine';
import { assert } from '@yatd/utils';

@Component({
    selector: 'yatd-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements AfterViewInit {
    @ViewChild(EngineComponent, { static: true })
    engineComponent?: EngineComponent;

    fps?: number;
    frameTime?: number;

    constructor(protected readonly ngZone: NgZone, protected readonly cdr: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        const engine = this.engineComponent?.engine.value;
        const scene = this.engineComponent?.scene.value;
        const canvas = this.engineComponent?.canvas.value;

        assert(engine, 'Engine needs to be provided');
        assert(scene, 'Scene needs to be provided');
        assert(canvas, 'Canvas needs to be provided');

        this.initCamera(scene, canvas);
        this.initLightning(scene);
        this.initModel(scene);

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

    protected initCamera(scene: Scene, canvas: HTMLCanvasElement): Camera {
        const camera = new ArcRotateCamera('camera', 0, Math.PI / 4, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas);

        return camera;
    }

    protected initLightning(scene: Scene): Light {
        return new HemisphericLight('light', new Vector3(5, 10, 0), scene);
    }

    protected initModel(scene: Scene): Node {
        const model = MeshBuilder.CreateBox('default-model', { size: 4 }, scene);

        return model;
    }
}
