/// <reference path="../../LibXOR/LibXOR.d.ts" />


class PositionComponent {
  angleInDegrees = 0;
  scale = Vector3.make(1, 1, 1);
  size = 1;

  /**
   * Creates data for positionable entity
   * @param {Vector3} p position of entity
   * @param {GTE.BoundingBox} bbox bounding box of entity
   */
  constructor(public position: Vector3, public bbox: GTE.BoundingBox) {}
}


class PhysicsComponent {
  /**
   * Creates data for physics component
   * @param {Vector3} v velocity of entity
   * @param {number} mass mass of entity in KG
   */
  constructor(public velocity: Vector3, public mass: number) {}
}


class RenderComponent {
  textureMatrix = Matrix4.makeIdentity();

  /**
   * Creates data for render component
   * @param {string} meshName name of mesh to render
   * @param {Matrix4} worldMatrix scaling matrix
   * @param {Vector3} color color of mesh to render
   */
  constructor(
      public meshName: string, public worldMatrix: Matrix4,
      public color: Vector3, public texture: string) {}
}


class ComponentIDs {
  positionID = 0;
  physicsID = 0;
  renderID = 0;
}


class AssemblageIDs {
  physicalID = 0;
}
