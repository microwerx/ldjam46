/// <reference path="../../LibXOR/LibXOR.d.ts" />
/// <reference path="htmlutils.ts" />
/// <reference path="ecs.ts" />
/// <reference path="app.ts" />


function noise2(x: number, y: number) {
  let dot = x * 12.9898 + y * 78.233;
  let f = Math.sin(dot * 43758.5453);
  return f - Math.floor(f);
};

function mix(x: number, y: number, a: number) {
  return (1 - a) * x + a * y;
}


class GameEntity {
  active = 1
  dead = 0
  direction = 1
  wrap = 1

  constructor(
      public ecs: XOR.ECS, public componentIDs: ComponentIDs,
      public entityID: number, public position: PositionComponent,
      public physics: PhysicsComponent, public render: RenderComponent) {
    ecs.setComponentData(entityID, componentIDs.positionID, position);
    ecs.setComponentData(entityID, componentIDs.physicsID, physics);
    ecs.setComponentData(entityID, componentIDs.renderID, render);
  }

  recalcMatrix() {
    this.render.worldMatrix.loadIdentity();
    this.render.worldMatrix.translate3(this.position.position);
    this.render.worldMatrix.rotate(this.position.angleInDegrees, 0.0, 0.0, 1.0);
    this.render.textureMatrix.loadIdentity();
    this.render.textureMatrix.scale3(this.position.scale);
  }

  moveTo(p: Vector3, angleInDegrees: number = 0) {
    this.position.position.copy(p);
    this.position.angleInDegrees = angleInDegrees;
    this.recalcMatrix();
  }

  update(dt: number) {
    this.position.position.accum(this.physics.velocity, dt);
    this.recalcMatrix();
  }

  draw(xor: LibXOR, rc: Fluxions.FxRenderConfig) {
    rc.uniformMatrix4f('WorldMatrix', this.render.worldMatrix);
    rc.uniformMatrix4f('TextureMatrix', this.render.textureMatrix);
    rc.uniform3f('Kd', this.render.color);
    let mix = 0
    if (this.render.texture.length > 0) {
      let texture = xor.fluxions.textures.get(this.render.texture);
      if (texture) {
        texture.bindUnit(0);
        if (this.wrap) {
          texture.setWrapST(
              WebGLRenderingContext.REPEAT, WebGLRenderingContext.REPEAT);
        } else {
          texture.setWrapST(
              WebGLRenderingContext.CLAMP_TO_EDGE,
              WebGLRenderingContext.CLAMP_TO_EDGE);
        }
        texture.setMinMagFilter(
            WebGLRenderingContext.NEAREST,
            WebGLRenderingContext.NEAREST_MIPMAP_NEAREST);
        mix = 1
      }
    }
    rc.uniform1f('MapKdMix', mix);
    xor.meshes.render(this.render.meshName, rc);
  }
}

const Player1 = 1
const Player2 = 2
const Player1Spear = 3
const Player2Spear = 4

const APHead1 = 20
const APHead2 = 21
const APHead3 = 22
const APHead4 = 23
const APHeadCount = 4

const APArm1 = 30
const APArm2 = 31
const APArm3 = 32
const APArm4 = 33
const APArmCount = 4
const APArmSegments = 3

const Fish1 = 100
const FishCount = 100

const BackdropStart = 200
const BackdropCount = 50;
const BackdropEnd = BackdropStart + BackdropCount;
const BackdropBlank1 = BackdropEnd + 1;
const BackdropBlank2 = BackdropEnd + 2;

const bgZDistance = -14;
const gmZDistance = -4;

class LevelInfo {
  plantoidPosition = Vector3.make(0, -8, gmZDistance);
  constructor(public numHeads: number, public storminess: number) {}
}

const levels =
    [new LevelInfo(1, 0.1), new LevelInfo(2, 1.0), new LevelInfo(3, 0.5)];

class Game {
  readonly bboxSizeOne = new GTE.BoundingBox(
      Vector3.make(-0.5, -0.5, -0.5), Vector3.make(0.5, 0.5, 0.5));

  components = new ComponentIDs();
  assemblages = new AssemblageIDs();
  entities = new Map<number, GameEntity>()

  level = 1;
  levelInfo = levels[this.level];
  pauseGame = false;

  constructor(
      public xor: LibXOR, public ecs: XOR.ECS, readonly width: number,
      readonly height: number) {
    // Set up Assemblage for Physical Entities
    this.components.positionID =
        this.ecs.addComponent('position', 'Location of entity');
    this.components.physicsID =
        this.ecs.addComponent('physics', 'physics info of entity');
    this.components.renderID =
        this.ecs.addComponent('render', 'renderable info of entity');
    this.assemblages.physicalID = this.ecs.addAssemblage();
    this.ecs.addComponentToAssemblage(
        this.assemblages.physicalID, this.components.positionID);
    this.ecs.addComponentToAssemblage(
        this.assemblages.physicalID, this.components.physicsID);
    this.ecs.addComponentToAssemblage(
        this.assemblages.physicalID, this.components.renderID);

    // Create Player Entity
    this.createPhysical(
        Player1, 'player1', 'rect01', XOR.Color.WHITE, 'player1');
    // this.createPhysical(
    //     Player2, 'player2', 'rect01', XOR.Color.WHITE, 'player2');
    this.createPhysical(
        Player1Spear, 'player1spear', 'spear', XOR.Color.WHITE, 'spear1');
    // this.createPhysical(
    //     Player2Spear, 'player2spear', 'rect01', XOR.Color.WHITE, 'spear2');

    for (let i = BackdropStart; i < BackdropEnd; i++) {
      let e = this.createPhysical(
          i, 'backdrop' + i.toString(), 'bigrect', XOR.Color.WHITE, 'water');
      e.wrap = 0;
    }

    let b1 = this.entities.get(BackdropBlank1);
    let b2 = this.entities.get(BackdropBlank2);
    if (b1) b1.render.texture = 'water21';
    if (b2) b2.render.texture = 'water22';

    // Create Atlantoid Plantoid Entity
    for (let i = 0; i < APHeadCount; i++) {
      for (let j = 0; j < APArmSegments; j++) {
        let index = APArm1 + i * APArmCount + j;
        const armname = 'aparm' + (i + 1).toString() + (j + 1).toString();
        let textures = ['stem1', 'stem2', 'stem3'];
        let texture = textures[(Math.random() * textures.length) | 0];
        let e = this.createPhysical(
            index, armname, 'rect01', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
      {
        const j = APArmSegments;
        const headname = 'aphead' + (i + 1).toString();
        let textures = ['plantoid1', 'plantoid2', 'plantoid3'];
        let texture = textures[(Math.random() * textures.length) | 0];
        let e = this.createPhysical(
            APHead1 + i, headname, 'rect01', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
    }
  }


  get playerPosition(): Vector3 {
    let e = this.entities.get(Player1);
    if (e) return e.position.position;
    return Vector3.make(0, 0, 0);
  }


  /**
   * create a new physical entity with position, velocity, and render components
   * @param name name of the entity
   * @param meshName name of the mesh to use for rendering
   * @param colorIndex color of the mesh to use for rendering
   */
  createPhysical(
      index: number, name: string, meshName: string, colorIndex: XOR.Color,
      textureName: string): GameEntity {
    // Create entity and add assemblage
    let id = this.ecs.addEntity(name, 'player 1');
    this.ecs.addAssemblageToEntity(id, this.assemblages.physicalID);

    let ge = new GameEntity(
        this.ecs, this.components, id,
        new PositionComponent(Vector3.make(0, 0, 0), this.bboxSizeOne.clone()),
        new PhysicsComponent(Vector3.make(0, 0, 0), 1.0),
        new RenderComponent(
            meshName, Matrix4.makeIdentity(), XOR.Colors[colorIndex],
            textureName));
    this.entities.set(index, ge);
    return ge;
  }


  /**
   * @returns {PositionComponents[]} array of position components
   */
  get positionComponents() {
    let cID = this.components.positionID;
    let components = [];
    let entities = this.ecs.getEntitiesWithComponent(cID);
    for (let eID of entities) {
      let data = this.ecs.getComponentData(eID, cID);
      if (data) components.push(data);
    }
    return components;
  }


  /**
   * @returns {PhysicsComponent[]} array of physics components
   */
  get physicsComponents() {
    let cID = this.components.physicsID;
    let components = [];
    let entities = this.ecs.getEntitiesWithComponent(cID);
    for (let eID of entities) {
      let data = this.ecs.getComponentData(eID, cID);
      if (data) components.push(data);
    }
    return components;
  }


  /**
   * @returns {RenderComponent[]} array of render components
   */
  get renderComponents() {
    let cID = this.components.renderID;
    let components = [];
    let entities = this.ecs.getEntitiesWithComponent(cID);
    for (let eID of entities) {
      let data = this.ecs.getComponentData(eID, cID);
      if (data) components.push(data);
    }
    return components;
  }


  /**
   * initialize the game from nothing
   */
  init() {}


  /**
   * Reset the game to start at a certain level
   * @param level which level to begin at
   */
  reset(level: number) {
    if (level > levels.length) level = 1;
    this.level = level;
    this.levelInfo = levels[this.level - 1];
  }


  /**
   * update background elements such as the waves
   */
  updateBackground() {
    let theta = this.xor.t1 * 10 * this.levelInfo.storminess;
    for (let i = BackdropStart; i < BackdropEnd; i++) {
      let e = this.entities.get(i);
      if (!e) continue;
      let x = 5.5 * (i - BackdropStart - BackdropCount * 0.5);
      let n = 0.2 * noise2(x, 0);
      let p = Vector3.make(
          x + n + 0.25 * Math.sin(theta),
          this.levelInfo.storminess * Math.sin(i + theta + n),
          -35);  // bgZDistance);
      e.moveTo(p);
    }

    let p1 = this.entities.get(Player1);
    let b1 = this.entities.get(BackdropBlank1);
    if (b1 && p1) {
      //   let p = p1.position.position.add(
      //       Vector3.make(Math.cos(0.1234 * theta), Math.sin(0.3456 * theta),
      //       -1))
      let p =
          Vector3.make(Math.cos(0.1234 * theta), Math.sin(0.3456 * theta), -75);
      b1.moveTo(p);
    }
    let b2 = this.entities.get(BackdropBlank2);
    if (b2 && p1) {
      //   let p = p1.position.position.add(Vector3.make(
      //       Math.cos(1 + 0.1234 * theta), Math.sin(1 + 0.3456 * theta), -1));
      let p = Vector3.make(
          Math.cos(1 + 0.1234 * theta), Math.sin(1 + 0.3456 * theta), -75);
      b2.moveTo(p);
    }
  }

  /**
   * Update the Atlantoid Plantoid that lives on the bottom of the sea
   */
  updatePlantoid() {
    let theta = this.xor.t1;
    let dir = theta & 1;
    let cos = Math.cos(theta);
    let sin = Math.sin(theta * 2.234);
    let angles = [230, 190, 70, 25];
    let angles1 = [-10, -10, -10, -10];
    let angles2 = [10, 10, 10, 10];

    let travel = 0.8 + 0.1 * cos;
    const DegToRad = Math.PI / 180.0;

    for (let i = 0; i < APHeadCount; i++) {
      let x = this.levelInfo.plantoidPosition.x + 2 * (i - 0.5 * APHeadCount);
      let y = this.levelInfo.plantoidPosition.y;
      for (let j = 0; j < APArmSegments; j++) {
        let sway = angles[i] + mix(angles1[i], angles2[i], sin);
        let v = Vector3.makeUnit(Math.cos(sway * DegToRad), 1.0, 0.0);

        let index = APArm1 + i * APArmCount + j;
        let e = this.entities.get(index);
        if (!e) continue;

        e.moveTo(Vector3.make(x, y, gmZDistance));
        x += travel * v.x;
        y += travel * v.y;
      }

      {
        let e = this.entities.get(APHead1 + i);
        if (!e) continue;
        e.position.scale.x = dir ? -1 : 1;
        e.moveTo(Vector3.make(x, y, gmZDistance));
      }
    }
  }


  /**
   * Update the player that lives in the air bubble under the sea
   */
  updatePlayer() {
    let p1 = this.entities.get(Player1);
    if (!p1) return;
    if (p1.physics.velocity.x != 0) {
      p1.direction = p1.physics.velocity.x < 0 ? -1 : 1;
      p1.position.scale.x = p1.direction;
    }

    p1.position.scale.y = p1.dead ? -1 : 1;
  }


  /**
   * Update the spear that the player holds
   */
  updateSpears() {
    let p1 = this.entities.get(Player1);
    if (!p1) return;
    let s1 = this.entities.get(Player1Spear);
    if (!s1) return;
    let offset =
        p1.direction > 0 ? Vector3.make(1.0, 0, 0) : Vector3.make(-0.5, 0, 0);
    let p = p1.position.position.add(offset);
    s1.position.scale.copy(Vector3.make(p1.direction, 1, 1));
    s1.moveTo(p, p1.position.angleInDegrees);
  }


  /**
   * Update the fishes that live under the sea
   */
  updateFishes() {}


  /**
   * Update the game
   * @param dt elapsed time since last frame
   */
  update(dt: number) {
    this.updateBackground();
    this.updatePlantoid();
    this.updatePlayer();
    this.updateSpears();
    for (let e of this.entities) {
      e[1].update(dt)
    }
  }


  /**
   * Draw the game
   * @param rc render config to draw with
   */
  draw(rc: Fluxions.FxRenderConfig) {
    for (let e of this.entities) {
      e[1].draw(this.xor, rc);
    }
  }
}
