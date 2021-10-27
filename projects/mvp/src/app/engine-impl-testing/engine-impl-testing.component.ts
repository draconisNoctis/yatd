import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Color3, Color4, HemisphericLight, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core';
import { BirdViewCamera, EngineComponent } from '@yatd/engine';
import { KeyboardStateService } from '@yatd/keyboard';
import { assert, Field2D, Map2D, PathfinderFactory, SortedLinkedList } from '@yatd/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const BLOCK_SIZE = 1;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const MIN_DIFF = 0.1 ** 3;

@Component({
    selector: 'yatd-engine-impl-testing',
    templateUrl: './engine-impl-testing.component.html',
    styleUrls: ['./engine-impl-testing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EngineImplTestingComponent implements OnInit, OnDestroy, AfterViewInit {
    readonly destroyed$ = new Subject<void>();

    @ViewChild(EngineComponent, { static: true })
    engineComponent?: EngineComponent;

    fps?: number;
    frameTime?: number;

    constructor(protected readonly ngZone: NgZone, protected readonly keyboardState: KeyboardStateService, protected readonly cdr: ChangeDetectorRef) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

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

        const mapping: { axis: 'x' | 'z'; value: -1 | 0 | 1; keys: string[] }[] = [
            { axis: 'z', value: 1, keys: ['KeyW', 'ArrowUp'] },
            { axis: 'z', value: -1, keys: ['KeyS', 'ArrowDown'] },
            { axis: 'x', value: -1, keys: ['KeyA', 'ArrowLeft'] },
            { axis: 'x', value: 1, keys: ['KeyD', 'ArrowRight'] }
        ];

        this.keyboardState.pipe(takeUntil(this.destroyed$)).subscribe(state => {
            cam.movement.x = 0;
            cam.movement.z = 0;

            for (const { axis, value, keys } of mapping) {
                if (keys.some(key => state[key])) {
                    cam.movement[axis] = value;
                }
            }
        });

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

        scene.onPointerMove = (_event, pickResult) => {
            if (!pickResult.pickedPoint) {
                return;
            }

            const x = pickResult.pickedPoint!.x | 0;
            const z = pickResult.pickedPoint!.z | 0;

            if (x < 0 || x >= MAP_WIDTH || z < 0 || z >= MAP_HEIGHT) {
                marker.position.y = -1;
            } else {
                marker.position.y = MIN_DIFF;
                marker.position.x = x + BLOCK_SIZE / 2;
                marker.position.z = z + BLOCK_SIZE / 2;
            }
        };

        const light0 = new HemisphericLight('light0', new Vector3(1, 0, 0), scene);

        const ground = MeshBuilder.CreateGround('ground', { width: MAP_WIDTH + 1, height: MAP_HEIGHT + 1 }, scene);
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

        const map = Map2D.create(MAP_WIDTH, MAP_HEIGHT);

        const pathfinder = PathfinderFactory.create<Field2D>(map);

        for (let i = 0; i < 150; ++i) {
            const z = (Math.random() * MAP_HEIGHT) | 0;
            const x = (Math.random() * MAP_WIDTH) | 0;
            map.get(x, z)!.blocked = true;
        }

        const start = performance.now();
        const path = pathfinder.findShortestPath(map.get(0, 0)!, map.get(MAP_WIDTH - 1, MAP_HEIGHT - 1)!);
        console.log('Found path in', performance.now() - start, 'ms');

        const points: Vector3[] = [];

        for (const field of path?.path ?? []) {
            points.push(new Vector3(field.x + 0.5, MIN_DIFF * 2, field.z + 0.5));
        }

        const line = MeshBuilder.CreateLines('path', { points, colors: Array.from({ length: points.length }, () => new Color4(0, 1, 0, 1)) }, scene);
        const pathMat = new StandardMaterial('pathMat', scene);

        const blockerMat = new StandardMaterial('blockerMat', scene);
        blockerMat.diffuseColor = new Color3(1, 1, 0);

        for (const field of map.fields()) {
            if (field.blocked) {
                const blocker = MeshBuilder.CreatePlane(`field-blocker-${field.x}-${field.z}`, { size: 1 }, scene);
                blocker.material = blockerMat;
                blocker.position.y = MIN_DIFF;
                blocker.position.x = field.x + 0.5;
                blocker.position.z = field.z + 0.5;
                blocker.rotation.x = Math.PI / 2;
            }
        }

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
}
