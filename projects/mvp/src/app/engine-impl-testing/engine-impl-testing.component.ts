import { AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Color3, HemisphericLight, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core';
import { BirdViewCamera, BirdViewCameraKeyboardInput, EngineComponent } from '@yatd/engine';
import { assert } from '@yatd/utils';

const BLOCK_SIZE = 1;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 40;
const MIN_DIFF = 0.1 ** 3;

@Component({
    selector: 'yatd-engine-impl-testing',
    templateUrl: './engine-impl-testing.component.html',
    styleUrls: ['./engine-impl-testing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EngineImplTestingComponent implements OnInit, AfterViewInit {
    @ViewChild(EngineComponent, { static: true })
    engineComponent?: EngineComponent;

    constructor(protected readonly ngZone: NgZone) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const engine = this.engineComponent?.engine.value;
        const scene = this.engineComponent?.scene.value;
        const canvas = this.engineComponent?.canvas.value;

        assert(engine, 'Engine needs to be provided');
        assert(scene, 'Scene needs to be provided');
        assert(canvas, 'Canvas needs to be provided');

        const cam = new BirdViewCamera(
            'cam0',
            new Vector3((MAP_WIDTH * BLOCK_SIZE) / 2, 30, (MAP_HEIGHT * BLOCK_SIZE) / 2),
            new Vector3(Math.PI / 2.5, 0, 0),
            scene
        );
        cam.speed = 3;
        cam.inputs.add(new BirdViewCameraKeyboardInput());
        cam.attachControl();

        const marker = MeshBuilder.CreateBox(
            'marker',
            {
                height: MIN_DIFF,
                width: BLOCK_SIZE,
                depth: BLOCK_SIZE
            },
            scene
        );

        marker.position.y = -1;

        const markerMat = new StandardMaterial('markerMat', scene);
        markerMat.diffuseColor = new Color3(1, 0, 0);

        marker.material = markerMat;

        scene.onPointerMove = (event, pickResult) => {
            if (!pickResult.pickedPoint) {
                return;
            }

            const x = pickResult.pickedPoint!.x | 0;
            const z = pickResult.pickedPoint!.z | 0;

            if (x < 0 || x > MAP_WIDTH || z < 0 || z > MAP_HEIGHT) {
                marker.position.y = -1;
            } else {
                marker.position.y = MIN_DIFF;
                marker.position.x = x + BLOCK_SIZE / 2;
                marker.position.z = z + BLOCK_SIZE / 2;
            }
        };

        const light0 = new HemisphericLight('light0', new Vector3(1, 0, 0), scene);

        const ground = MeshBuilder.CreateGround('ground', { width: MAP_WIDTH, height: MAP_HEIGHT }, scene);
        ground.position.x = MAP_WIDTH / 2;
        ground.position.z = MAP_HEIGHT / 2;

        ground.enablePointerMoveEvents = true;

        for (let x = 0; x <= MAP_WIDTH; ++x) {
            MeshBuilder.CreateLines(
                `grid-x-${x}`,
                {
                    points: [new Vector3(x * BLOCK_SIZE, MIN_DIFF * 2, 0), new Vector3(x * BLOCK_SIZE, MIN_DIFF * 2, BLOCK_SIZE * MAP_HEIGHT)]
                },
                scene
            );
        }

        for (let z = 0; z <= MAP_HEIGHT; ++z) {
            MeshBuilder.CreateLines(
                `grid-z-${z}`,
                {
                    points: [new Vector3(0, MIN_DIFF * 2, z * BLOCK_SIZE), new Vector3(BLOCK_SIZE * MAP_WIDTH, MIN_DIFF * 2, z * BLOCK_SIZE)]
                },
                scene
            );
        }

        this.ngZone.runOutsideAngular(() => {
            engine.runRenderLoop(() => {
                scene.render();
            });
        });
    }
}
