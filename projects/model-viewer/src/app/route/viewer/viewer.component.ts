import { selectZoom } from './../../selectors/ui.selectors';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import {
    ArcRotateCamera,
    Camera,
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
import { EngineComponent } from '@yatd/engine';
import { assert } from '@yatd/utils';
import { ModelViewerState } from '../../reducers';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'yatd-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnDestroy, OnInit, AfterViewInit {
    @ViewChild('x', { static: true })
    canvasX?: ElementRef<HTMLCanvasElement>;
    @ViewChild('3d', { static: true })
    canvas3D?: ElementRef<HTMLCanvasElement>;
    @ViewChild('y', { static: true })
    canvasY?: ElementRef<HTMLCanvasElement>;
    @ViewChild('z', { static: true })
    canvasZ?: ElementRef<HTMLCanvasElement>;

    fps?: number;
    frameTime?: number;

    protected readonly destroyed$ = new Subject<void>();
    readonly zoom$ = this.store.select(selectZoom);

    constructor(protected readonly ngZone: NgZone, protected readonly cdr: ChangeDetectorRef, protected readonly store: Store<ModelViewerState>) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
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
        const model = this.initModel(scene);
        model.scaling.x = 0.5;
        model.scaling.y = 0.5;
        model.scaling.z = 0.5;
        this.initAxis(scene);

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

    protected initModel(scene: Scene): Mesh {
        // const tower01 = new TransformNode('tower01', scene);
        const meshes: Mesh[] = [];

        function createSide(name: string): Mesh {
            const wallVertex = new VertexData();
            // prettier-ignore
            wallVertex.positions = [
                -2,     0,  -2,
                2,      0,  -2,
                1.5,    5,  -1.5,
                -1.5,   5,  -1.5
            ];
            wallVertex.indices = [0, 1, 2, 0, 2, 3];

            // const side = new TransformNode(`tower01_${name}`, scene);
            // side.parent = tower01;

            const wall = new Mesh(`tower01_${name}_wall`, scene /*, side*/);
            wallVertex.applyToMesh(wall);

            const underVertex = new VertexData();
            // prettier-ignore
            underVertex.positions = [
                1.5,      5,  -1.5,
                -1.5,     5,  -1.5,
                -1.75,    5.5, -1.75,
                1.75,    5.5, -1.75,
            ];
            underVertex.indices = [2, 1, 0, 3, 2, 0];

            const under = new Mesh(`tower01_${name}_under`, scene /*, side*/);
            underVertex.applyToMesh(under);

            const railSideVertex = new VertexData();
            // prettier-ignore
            railSideVertex.positions = [
                -1.75,    5.5, -1.75,
                1.75,    5.5, -1.75,
                -1.75,    6.25, -1.75,
                1.75,    6.25, -1.75,
            ];
            railSideVertex.indices = [0, 1, 3, 3, 2, 0];

            const railSide = new Mesh(`tower01_${name}_railSide`, scene /*, side*/);
            railSideVertex.applyToMesh(railSide);

            const railTopVertex = new VertexData();
            // prettier-ignore
            railTopVertex.positions = [
                -1.75,    6.25, -1.75,
                1.75,    6.25, -1.75,
                1.5, 6.25, -1.5,
                -1.5, 6.25, -1.5,
            ];
            railTopVertex.indices = [0, 1, 2, 0, 2, 3];

            const railTop = new Mesh(`tower01_${name}_railTop`, scene /*, side*/);
            railTopVertex.applyToMesh(railTop);

            const railInnerVertex = new VertexData();
            // prettier-ignore
            railInnerVertex.positions = [
                1.5, 6.25, -1.5,
                -1.5, 6.25, -1.5,
                -1.5, 5.5, -1.5,
                1.5, 5.5, -1.5,
            ];
            railInnerVertex.indices = [2, 1, 0, 0, 3, 2];

            const railInner = new Mesh(`tower01_${name}_railInner`, scene /*, side*/);
            railInnerVertex.applyToMesh(railInner);

            return Mesh.MergeMeshes([wall, under, railSide, railTop, railInner], true, undefined, undefined, true, true)!;
        }

        const front = createSide('front');
        const left = createSide('left');
        left.rotation.y = Math.PI / 2;
        const right = createSide('right');
        right.rotation.y = -Math.PI / 2;
        const back = createSide('back');
        back.rotation.y = Math.PI;

        const floorVertex = new VertexData();
        // prettier-ignore
        floorVertex.positions = [
            -1.5, 5.5, -1.5,
            1.5, 5.5, -1.5,
            -1.5, 5.5, 1.5,
            1.5, 5.5, 1.5,
        ];
        floorVertex.indices = [0, 1, 3, 3, 2, 0];

        const floor = new Mesh(`tower01_floor`, scene);
        floorVertex.applyToMesh(floor);

        const merged = Mesh.MergeMeshes([front, left, right, back, floor], true, undefined, undefined, true, true)!;
        merged.name = 'tower01';
        merged.id = 'tower01';

        return merged;

        // return tower01;
    }

    protected initAxis(scene: Scene): Node {
        const axis = new TransformNode('axis', scene);

        const size = 5;

        const black = new Color3(0, 0, 0);

        function makeTextPlane(text: string, color: string, size: number) {
            const texture = new DynamicTexture('dyn-texture', 50, scene, true);
            texture.hasAlpha = true;
            texture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
            const plane = MeshBuilder.CreatePlane('text-plane', { size, updatable: true }, scene);
            plane.parent = axis;
            const mat = (plane.material = new StandardMaterial('text-plane-material', scene));
            mat.backFaceCulling = false;
            mat.specularColor = black;
            mat.diffuseTexture = texture;

            return plane;
        }

        const axisX = MeshBuilder.CreateLines(
            'axis-x',
            {
                points: [new Vector3(0, 0, 0), new Vector3(size, 0, 0)]
            },
            scene
        );
        axisX.parent = axis;
        axisX.color = new Color3(1, 0, 0);
        const xChar = makeTextPlane('X', 'red', size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
        xChar.parent = axis;

        const axisY = MeshBuilder.CreateLines(
            'axis-y',
            {
                points: [new Vector3(0, 0, 0), new Vector3(0, size, 0)]
            },
            scene
        );
        axisY.parent = axis;
        axisY.color = new Color3(0, 1, 0);
        const yChar = makeTextPlane('Y', 'green', size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        yChar.parent = axis;

        const axisZ = MeshBuilder.CreateLines(
            'axis-y',
            {
                points: [new Vector3(0, 0, 0), new Vector3(0, 0, size)]
            },
            scene
        );
        axisZ.parent = axis;
        axisZ.color = new Color3(0, 0, 1);
        const zChar = makeTextPlane('Z', 'blue', size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
        zChar.parent = axis;

        axis.position.x -= size / 2;
        axis.position.y -= size / 2;
        axis.position.z -= size / 2;

        return axis;
    }
}
