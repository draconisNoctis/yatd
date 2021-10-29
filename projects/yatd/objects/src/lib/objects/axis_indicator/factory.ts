import { Color3, DynamicTexture, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';

export function create(scene: Scene) {
    const parent = new TransformNode('axis_indicator');

    const size = 5;

    const black = new Color3(0, 0, 0);
    const center = new Vector3(-size / 2, -size / 2, -size / 2);

    function makeTextPlane(text: string, color: string, size: number) {
        const texture = new DynamicTexture('dyn-texture', 50, scene, true);
        texture.hasAlpha = true;
        texture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
        const plane = MeshBuilder.CreatePlane('text-plane', { size, updatable: true });
        const mat = (plane.material = new StandardMaterial('text-plane-material', scene));
        mat.backFaceCulling = false;
        mat.specularColor = black;
        mat.diffuseTexture = texture;

        return plane;
    }

    const axisX = MeshBuilder.CreateLines(
        'axis-x',
        {
            points: [center, center.add(new Vector3(size, 0, 0))]
        },
        scene
    );
    axisX.color = new Color3(1, 0, 0);
    axisX.parent = parent;
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.parent = parent;
    xChar.position = center.add(new Vector3(0.9 * size, -0.05 * size, 0));

    const axisY = MeshBuilder.CreateLines(
        'axis-y',
        {
            points: [center, center.add(new Vector3(0, size, 0))]
        },
        scene
    );
    axisY.color = new Color3(0, 1, 0);
    axisY.parent = parent;
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.parent = parent;
    yChar.position = center.add(new Vector3(0, 0.9 * size, -0.05 * size));

    const axisZ = MeshBuilder.CreateLines(
        'axis-y',
        {
            points: [center, center.add(new Vector3(0, 0, size))]
        },
        scene
    );
    axisZ.color = new Color3(0, 0, 1);
    axisZ.parent = parent;
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.parent = parent;
    zChar.position = center.add(new Vector3(0, 0.05 * size, 0.9 * size));

    return parent;
}
