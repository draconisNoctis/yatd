import {
    CameraInputsManager,
    ICameraInput,
    Scene,
    TargetCamera,
    Vector2,
    Vector3,
    Engine,
    Observer,
    KeyboardInfo,
    Nullable,
    KeyboardEventTypes
} from '@babylonjs/core';

// export abstract class BirdViewCameraInput implements ICameraInput<BirdViewCamera> {
//     abstract getClassName(): string;
//     abstract getSimpleName(): string;
//     abstract attachControl(noPreventDefault?: boolean): void;
//     abstract detachControl(): void;

//     camera!: BirdViewCamera;

//     movement: Record<'x' | 'z', -1 | 0 | 1> = {
//         x: 0,
//         z: 0
//     };
// }

// export class BirdViewCameraKeyboardInput extends BirdViewCameraInput {
//     mapping: { axis: 'x' | 'z'; value: -1 | 0 | 1; keys: Set<string> }[] = [
//         { axis: 'z', value: 1, keys: new Set(['KeyW', 'ArrowUp']) },
//         { axis: 'z', value: -1, keys: new Set(['KeyS', 'ArrowDown']) },
//         { axis: 'x', value: -1, keys: new Set(['KeyA', 'ArrowLeft']) },
//         { axis: 'x', value: 1, keys: new Set(['KeyD', 'ArrowRight']) }
//     ];

//     private scene?: Scene;
//     private engine?: Engine;

//     private canvasBlurObserver: Nullable<Observer<Engine>> = null;
//     private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;

//     getClassName(): string {
//         return 'BirdViewCameraKeyboardInput';
//     }

//     getSimpleName(): string {
//         return 'keyboard';
//     }

//     attachControl(noPreventDefault?: boolean): void {
//         if (this.canvasBlurObserver) return;

//         this.scene = this.camera.getScene();
//         this.engine = this.scene.getEngine();

//         this.canvasBlurObserver = this.engine.onCanvasBlurObservable.add(() => {
//             this.movement.x = 0;
//             this.movement.z = 0;
//         });

//         this.keyboardObserver = this.scene.onKeyboardObservable.add(({ type, event }) => {
//             for (const { axis, value, keys } of this.mapping) {
//                 if (keys.has(event.code)) {
//                     switch (type) {
//                         case KeyboardEventTypes.KEYDOWN:
//                             this.movement[axis] = value;
//                             break;
//                         case KeyboardEventTypes.KEYUP:
//                             this.movement[axis] = 0;
//                             break;
//                     }
//                     if (!noPreventDefault) {
//                         event.preventDefault();
//                     }
//                     break;
//                 }
//             }
//         });
//     }

//     detachControl(): void {
//         this.scene?.onKeyboardObservable.remove(this.keyboardObserver);
//         this.engine?.onCanvasBlurObservable.remove(this.canvasBlurObserver);
//         this.keyboardObserver = null;
//         this.canvasBlurObserver = null;
//         this.movement.x = 0;
//         this.movement.z = 0;
//     }

//     checkInputs() {}
// }

export class BirdViewCamera extends TargetCamera {
    // readonly inputs: CameraInputsManager<BirdViewCamera> = new CameraInputsManager(this);

    movement: Record<'x' | 'z', -1 | 0 | 1> = {
        x: 0,
        z: 0
    };

    constructor(name: string, position: Vector3, rotation: Vector3, scene: Scene, setActiveOnSceneIfNonActive = true) {
        super(name, position, scene, setActiveOnSceneIfNonActive);
        this.rotation.copyFrom(rotation);
    }

    // attachControl(noPreventDefault?: boolean): void {
    //     this.inputs.attachElement(noPreventDefault);
    // }

    // detachControl(): void {
    //     this.inputs.detachElement();

    //     this.cameraDirection = Vector3.Zero();
    //     this.cameraRotation = Vector2.Zero();
    // }

    _checkInputs(): void {
        // this.inputs.checkInputs();

        const speed = this._computeLocalCameraSpeed();
        // const keyboard = this.inputs.attached.keyboard as BirdViewCameraInput;
        this.position.addInPlaceFromFloats(this.movement.x * speed, 0, this.movement.z * speed);

        super._checkInputs();
    }
}
