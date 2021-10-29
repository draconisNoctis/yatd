import { Mesh, Scene, VertexData } from '@babylonjs/core';

export function create(scene: Scene) {
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

        const wall = new Mesh(`tower01_${name}_wall`, scene);
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

        const under = new Mesh(`tower01_${name}_under`, scene);
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

        const railSide = new Mesh(`tower01_${name}_railSide`, scene);
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

        const railTop = new Mesh(`tower01_${name}_railTop`, scene);
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

        const railInner = new Mesh(`tower01_${name}_railInner`, scene);
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

    const meshes = [front, left, right, back, floor];

    const merged = Mesh.MergeMeshes(meshes, true, undefined, undefined, true, true)!;

    for (const mesh of meshes) {
        scene.removeMesh(mesh);
        mesh.dispose();
    }

    merged.name = 'tower01';
    merged.id = 'tower01';

    return merged;
}
