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

  get x(): number {
    return this.position.position.x;
  }
  get y(): number {
    return this.position.position.y;
  }
  get vx(): number {
    return this.physics.velocity.x;
  }
  get vy(): number {
    return this.physics.velocity.y;
  }

  set x(x: number) {
    this.position.position.x = x;
  }
  set y(y: number) {
    this.position.position.y = y;
  }
  set vx(x: number) {
    this.physics.velocity.x = x;
  }
  set vy(y: number) {
    this.physics.velocity.y = y;
  }

  recalcMatrix() {
    this.render.worldMatrix.loadIdentity();
    this.render.worldMatrix.translate3(this.position.position);
    this.render.worldMatrix.rotate(this.position.angleInDegrees, 0.0, 0.0, 1.0);
    this.render.textureMatrix.loadIdentity();
    if (this.dead)
      this.position.scale.y = -1;
    else
      this.position.scale.y = 1;
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
const FishCount = 64
const FishBottom = -45;
const FishTop = -15;
const FishRange = FishTop - FishBottom;

const PlayerBottom = FishBottom - 5;
const PlayerTop = FishTop + 2;
const PlayerLeft = -9;
const PlayerRight = 8;

const BackdropStart = 200
const BackdropCount = 50;
const BackdropEnd = BackdropStart + BackdropCount;
const BackdropBlank1 = BackdropEnd + 1;
const BackdropBlank2 = BackdropEnd + 2;

const bgZDistance = -14;
const gmZDistance = 0;
const APKillDistance = 1.5;

class LevelInfo {
  playerPosition = GTE.vec3(0, FishBottom, gmZDistance + 0.1);
  plantoidPosition = Vector3.make(0, FishBottom - 5, gmZDistance);
  constructor(public numHeads: number, public storminess: number) {}
}

const levels =
    [new LevelInfo(1, 0.3), new LevelInfo(2, 0.5), new LevelInfo(3, 0.4)];

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
            index, armname, 'rect', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
      {
        const j = APArmSegments;
        const headname = 'aphead' + (i + 1).toString();
        let textures = ['plantoid1', 'plantoid2', 'plantoid3'];
        let texture = textures[(Math.random() * textures.length) | 0];
        let e = this.createPhysical(
            APHead1 + i, headname, 'rect', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
    }

    for (let i = 0; i < FishCount; i++) {
      let index = Fish1 + i;
      let textures = ['fish1', 'fish2', 'fish3', 'fish4'];
      let colors = [
        XOR.Color.RED, XOR.Color.GREEN, XOR.Color.GOLD, XOR.Color.YELLOW,
        XOR.Color.ORANGE
      ];
      let e = this.createPhysical(
          index, 'fish' + i.toString(), 'rect01',
          XOR.Color.CYAN,  // colors[(Math.random() * colors.length) | 0],
          'fish1');        // textures[(Math.random() * textures.length) | 0]);
      //   e.moveTo(
      //       GTE.vec3(
      //           Math.random() * this.width,
      //           Math.random() * FishRange + FishBottom, Math.random() * -6 +
      //           3),
      //       0);
      //   e.physics.velocity.x =
      //       (Math.random() * 0.25 + 0.75) * (Math.random() > 0.5 ? -1 : 1);
      this.spawnFish(e);
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
    let e = this.entities.get(Player1);
    if (!e) return;
    e.moveTo(this.levelInfo.playerPosition);
    e.dead = 0;
  }


  spawnFish(fe: GameEntity) {
    let textures = ['fish1', 'fish2', 'fish3', 'fish4'];
    let colors = [
      XOR.Color.RED, XOR.Color.GREEN, XOR.Color.GOLD, XOR.Color.YELLOW,
      XOR.Color.ORANGE
    ];
    fe.render.color = XOR.Colors[colors[(Math.random() * colors.length) | 0]];
    fe.render.texture = textures[(Math.random() * textures.length) | 0];
    fe.moveTo(
        GTE.vec3(
            Math.random() * this.width, Math.random() * FishRange + FishBottom,
            Math.random() * -6 + 3),
        0);
    fe.physics.velocity.x =
        (Math.random() * 0.25 + 0.75) * (Math.random() > 0.5 ? -1 : 1);
    fe.dead = 0;
    fe.active = 1;
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
    travel *= 2;
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
        let odd = j & 1;
        e.moveTo(Vector3.make(x, y, gmZDistance + (odd ? -0.05 : 0.05)));
        x += travel * v.x;
        y += travel * v.y;
      }

      {
        let e = this.entities.get(APHead1 + i);
        if (!e) continue;
        e.position.scale.x = dir ? -1 : 1;
        e.moveTo(Vector3.make(x, y, gmZDistance + 0.07 * i - 0.14));
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
    const MaxVelocityY = 3;
    const Gravity = 40;
    if (p1.physics.velocity.y >= -MaxVelocityY && p1.physics.velocity.y <= 0) {
      p1.physics.velocity.y -= this.xor.dt * Gravity;
    }

    p1.position.position.x =
        GTE.clamp(p1.position.position.x, PlayerLeft, PlayerRight);
    p1.position.position.y =
        GTE.clamp(p1.position.position.y, PlayerBottom, PlayerTop);

    if (p1.x <= PlayerLeft && p1.vx < 0) p1.vx = 0;
    if (p1.x >= PlayerRight && p1.vx > 0) p1.vx = 0;
    if (p1.y >= PlayerTop && p1.vy > 0) p1.vy = 0;
    if (p1.y <= PlayerBottom && p1.vy < 0) p1.vy = 0;

    p1.position.scale.y = p1.dead ? -1 : 1;
    if (p1.dead) {
      p1.vy = GTE.clamp(p1.vy, -1, 1);
      if (p1.y > PlayerBottom) p1.position.angleInDegrees += this.xor.dt * 10;
    }
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
    s1.x = p.x;
    // s1.x = GTE.clamp(
    //     offset.x + p1.x, p1.x + offset.x - 0.2, p1.x + offset.x - 0.2);
    s1.y = GTE.clamp(s1.y, p.y - 0.1, p.y + 0.1);
    // s1.moveTo(p, p1.position.angleInDegrees);
  }


  /**
   * Update the fishes that live under the sea
   */
  updateFishes() {
    for (let i = 0; i < FishCount; i++) {
      let theta = this.xor.t1 + i;
      let cos = 0.005 * Math.cos(theta + Math.sin(i));
      let index = Fish1 + i;
      let e = this.entities.get(index);
      if (!e) continue;
      if (e.dead) {
        e.y -= this.xor.dt;
        e.y = GTE.clamp(e.y, PlayerBottom, e.y);
        if (e.y == PlayerBottom) e.vx = 0;
      } else {
        const fix = 2 * (PlayerRight - PlayerLeft);
        if (e.position.position.x < -PlayerLeft * 2)
          e.position.position.x += fix;
        if (e.position.position.x > PlayerRight * 2)
          e.position.position.x -= fix;
        e.position.position.y =
            GTE.clamp(e.position.position.y + cos, FishBottom, FishTop);
        if (e.physics.velocity.x < 0) e.direction = -1;
        if (e.physics.velocity.x > 0) e.direction = 1;
        e.position.scale.x = e.direction;
        e.moveTo(e.position.position);
      }
    }
  }


  collideFishes() {
    let spearE = this.entities.get(Player1Spear);
    if (!spearE) return;
    let spear = GTE.vec3(spearE.x, spearE.y, 0);
    for (let i = 0; i < FishCount; i++) {
      let fe = this.entities.get(Fish1 + i);
      if (!fe) continue;
      let fep = GTE.vec3(fe.x, fe.y, 0);
      if (!fe.dead) {
        if (fep.distance(spear) < 1) {
          fe.dead = 1;
          fe.vx = 0.5 * fe.vx;
        }
      }
      if (fe.dead && fe.y > PlayerBottom) {
        for (let ap = 0; ap < APHeadCount; ap++) {
          let ape = this.entities.get(APHead1 + ap);
          if (!ape) continue;
          if (!ape.dead) {
            let apep = GTE.vec3(ape.x, ape.y, 0);
            if (fep.distance(apep) < APKillDistance) {
              fe.active = 0;
            }
          }
        }
      }
      if (!fe.active) {
        this.spawnFish(fe);
      }
    }
  }

  /**
   * perform collision events for game
   */
  collide() {
    this.collideFishes();
    let pe = this.entities.get(Player1);
    if (!pe) return;
    if (!pe.dead) {
      for (let ap = 0; ap < APHeadCount; ap++) {
        let ape = this.entities.get(APHead1 + ap);
        if (!ape) continue;
        if (!ape.dead) {
          let pep = GTE.vec3(pe.x, pe.y, 0);
          let apep = GTE.vec3(ape.x, ape.y, 0);
          if (pep.distance(apep) < APKillDistance) {
            pe.dead = 1;
          }
        }
      }
    }
  }


  /**
   * Update the game
   * @param dt elapsed time since last frame
   */
  update(dt: number) {
    this.updateBackground();
    this.updatePlantoid();
    this.updatePlayer();
    this.updateFishes();
    for (let e of this.entities) {
      e[1].update(dt)
    }
    this.updateSpears();
    this.collide();
  }


  /**
   * Draw the game
   * @param rc render config to draw with
   */
  draw(rc: Fluxions.FxRenderConfig) {
    for (let e of this.entities) {
      if (e[1].active) e[1].draw(this.xor, rc);
    }
  }
}
