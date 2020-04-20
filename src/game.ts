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


function randBetween(a: number, b: number) {
  return (Math.random() * (b - a) + a) | 0;
}


function randRange(count: number) {
  return (Math.random() * count) | 0;
}


class GameEntity {
  active = 1
  dead = 0
  direction = 1
  wrap = 1
  landed = 0
  eating = 0
  eatingTime = 0

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
    this.render.worldMatrix.scale(this.position.size, this.position.size, 1.0);
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
const APCount = 10

const APArm1 = 30
const APArmSegments = 10

const APBubble1 = 300;

const Fish1 = 500
const FishCount = 128;
const FishBottom = -45;
const FishTop = -15;
const FishRange = FishTop - FishBottom;

const PlayerBottom = FishBottom - 5;
const PlayerTop = FishTop + 2;
const PlayerLeft = -9;
const PlayerRight = 8;

const BackdropStart = 900
const BackdropCount = 50;
const BackdropEnd = BackdropStart + BackdropCount;
const BackdropBlank1 = BackdropEnd + 1;
const BackdropBlank2 = BackdropEnd + 2;

const MaxPlayerBreath = 20;
const FishPointsPerArm = 5;
const MaxPlantoidHealth = APCount * APArmSegments * FishPointsPerArm;

const SFX_BEEP = 0;
const SFX_DOOP = 1;
const SFX_POOF = 2;
const SFX_ERCK = 3;
const SFX_DEAD = 4;

const SFX_EATEN1 = 5;
const SFX_EATEN2 = 6;
const SFX_EATEN3 = 7;
const SFX_EATEN4 = 8;
const SFX_EatenCount = 4;

const SFX_FishDead1 = 9;
const SFX_FishDead2 = 10;
const SFX_FishDead3 = 11;
const SFX_FishDead4 = 12;
const SFX_FishDeadCount = 4;

const SFX_BUBBLE1 = 13;
const SFX_BUBBLE2 = 14;

const MUS_WAVE = 0;
const MUS_GAME = 1;
const MUS_DEAD = 2;

const bgZDistance = -14;
const gmZDistance = 0;
let APKillDistance = 1.5;
let PlayerBreathRate = 0.25;
let PlantoidEatRate = 0.05;

class LevelInfo {
  playerPosition = GTE.vec3(0, FishBottom + 5, gmZDistance + 0.1);
  plantoidPosition = Vector3.make(0, FishBottom - 5, gmZDistance);
  angles = [230, 190, 70, 25, 80, 10, 260, 100, 120, 160];
  angles1 = [-10, -10, -10, -10, -10, -10, -10, -10, -10, -10];
  angles2 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

  plantoidHealths: number[] = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  plantoidHungers: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  constructor(
      public numHeads: number, public numSegments: number,
      public storminess: number) {
    for (let i = 0; i < this.angles.length; i++) {
      this.angles[i] += randBetween(this.angles1[i], this.angles2[i]);
    }
    for (let i = 0; i < numSegments; i++) {
      this.plantoidHealths[i] = (Math.random() * numSegments) | 0;
    }
  }

  sway(i: number, sin: number) {
    return this.angles[i] + mix(this.angles1[i], this.angles2[i], sin);
  }
}

const levels = [
  new LevelInfo(3, 3, 0.3), new LevelInfo(4, 4, 0.5), new LevelInfo(5, 5, 0.4),
  new LevelInfo(6, 5, 0.4), new LevelInfo(6, 6, 0.4), new LevelInfo(6, 10, 0.4)
];

class Game {
  readonly bboxSizeOne = new GTE.BoundingBox(
      Vector3.make(-0.5, -0.5, -0.5), Vector3.make(0.5, 0.5, 0.5));

  components = new ComponentIDs();
  assemblages = new AssemblageIDs();
  entities = new Map<number, GameEntity>()

  level = 1;
  levelInfo = levels[this.level];
  pauseGame = false;
  gameStarted = false;
  gameOver = false;
  gameOverTime = 0;

  plantoidHealths: number[] = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  plantoidHungers: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  playerHealth = 20;
  playerBreath = 20;
  highestPlantY = FishBottom;

  numLives = 0;

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
    for (let i = 0; i < APCount; i++) {
      // segments
      for (let j = 0; j < APArmSegments; j++) {
        let index = APArm1 + i * APCount + j;
        const armname = 'aparm' + (i + 1).toString() + (j + 1).toString();
        let textures = ['stem1', 'stem2', 'stem3'];
        let texture = textures[(Math.random() * textures.length) | 0];
        let e = this.createPhysical(
            index, armname, 'rect', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
      // heads
      {
        const j = APArmSegments;
        const headname = 'aphead' + (i + 1).toString();
        let textures = ['plantoid1', 'plantoid2', 'plantoid3', 'plantoid4'];
        let texture = textures[(Math.random() * textures.length) | 0];
        let e = this.createPhysical(
            APHead1 + i, headname, 'rect', XOR.Color.WHITE, texture);
        let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
        e.moveTo(p);
      }
      // bubbles
      {
        const j = APArmSegments + 2;
        let e = this.createPhysical(
            APBubble1 + i, 'bubble' + i.toString(), 'rect', XOR.Color.WHITE,
            'bubble');
        let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
        e.moveTo(p)
      }
    }

    for (let i = 0; i < FishCount; i++) {
      let index = Fish1 + i;
      let e = this.createPhysical(
          index, 'fish' + i.toString(), 'rect01', XOR.Color.CYAN, 'fish1');
      this.spawnFish(e);
    }
  }


  get playerPosition(): Vector3 {
    let e = this.entities.get(Player1);
    if (e) return e.position.position;
    return Vector3.make(0, 0, 0);
  }


  get plantoidHealth(): number {
    let health = 0;
    for (let i = 0; i < this.levelInfo.numHeads; i++) {
      health += this.plantoidHealths[i] + this.plantoidHungers[i] - 1;
    }
    return health / (this.levelInfo.numHeads * this.levelInfo.numSegments);
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
   * plays a sound effect
   * @param id which sample id to play
   */
  playSound(id: number) {
    this.xor.sound.sampler.playSample(id, false);
  }


  /**
   * plays a music file
   * @param id which music track to play
   */
  playMusic(id: number) {
    this.xor.sound.jukebox.volume = 0.5;
    this.xor.sound.jukebox.play(id);
  }


  /**
   * Reset the game to start at a certain level
   * @param level which level to begin at
   */
  reset(level: number) {
    if (this.numLives == 0) {
      if (level > levels.length) level = 1;
      this.level = level;
      this.levelInfo = levels[this.level - 1];
      this.numLives = 5;
      this.playMusic(MUS_GAME);
    }

    for (let i = 0; i < FishCount; i += 2) {
      let e = this.entities.get(Fish1 + i);
      if (e) this.spawnFish(e);
    }

    let e = this.player;
    e.moveTo(GTE.vec3(0, this.highestPlantY + 4, 0));
    e.dead = 0;
    this.gameOver = false;
    this.gameStarted = true;
  }

  get player(): GameEntity {
    let e = this.entities.get(Player1);
    if (!e) throw 'No player!';
    return e;
  }

  /**
   * event triggered when game is lost
   */
  loseGame() {
    this.numLives--;
    if (this.numLives == 0) {
      this.gameOver = true;
      this.gameOverTime = this.xor.t1;
      this.playMusic(MUS_WAVE);
    } else {
      this.gameStarted = false;
    }
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
    fe.eating = 0;
    fe.position.scale.reset(1, 1, 1);
    fe.position.angleInDegrees = 0;
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
      let p =
          Vector3.make(Math.cos(0.1234 * theta), Math.sin(0.3456 * theta), -75);
      b1.moveTo(p);
    }
    let b2 = this.entities.get(BackdropBlank2);
    if (b2 && p1) {
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

    let travel = 0.8 + 0.1 * cos;
    travel *= 2;
    const DegToRad = Math.PI / 180.0;

    this.highestPlantY = PlayerBottom;

    const APCount = this.levelInfo.numHeads;

    for (let i = 0; i < APCount; i++) {
      // Plants die if they are not fed
      this.plantoidHungers[i] -= PlantoidEatRate * this.xor.dt;
      // if too hungry, die a little
      if (this.plantoidHungers[i] < 0) {
        this.plantoidHealths[i]--;
        this.plantoidHungers[i] = 1;
      }
      // if too full, grow a little
      if (this.plantoidHungers[i] > 1) {
        this.plantoidHealths[i]++;
        this.plantoidHungers[i] = 1;
      }
      // make sure we never go out of range
      this.plantoidHealths[i] =
          GTE.clamp(this.plantoidHealths[i], 0, this.levelInfo.numSegments);
      let phunger = this.plantoidHungers[i];

      let x = this.levelInfo.plantoidPosition.x + 2 * (i - 0.5 * APCount);
      let y = this.levelInfo.plantoidPosition.y;
      let sway = this.levelInfo.sway(i, sin);
      let v = Vector3.makeUnit(Math.cos(sway * DegToRad), 1.0, 0.0);

      const numArmSegments = this.plantoidHealths[i];

      for (let j = 0; j < numArmSegments; j++) {
        let index = APArm1 + i * APCount + j;
        let e = this.entities.get(index);
        if (!e) continue;
        e.active = this.plantoidHealths[i] >= j ? 1 : 0;
      }

      for (let j = 0; j < numArmSegments; j++) {
        let index = APArm1 + i * APCount + j;
        let e = this.entities.get(index);
        if (!e) continue;
        let odd = j & 1;
        e.moveTo(Vector3.make(x, y, gmZDistance + (odd ? -0.05 : 0.05)));
        if (j == numArmSegments - 1) {
          x += phunger * travel * v.x;
          y += phunger * travel * v.y;
        } else {
          x += travel * v.x;
          y += travel * v.y;
        }
      }

      // heads
      let he = this.entities.get(APHead1 + i);
      if (!he) continue;
      if (this.plantoidHealths[i] < 0) he.dead = 1;
      he.position.scale.x = dir ? -1 : 1;
      he.moveTo(Vector3.make(x, y, gmZDistance + 0.07 * i - 0.14));
      let droop = 0 + phunger * (this.levelInfo.angles[i] < 90 ? -10 : 10);
      he.position.angleInDegrees = droop;

      this.highestPlantY = Math.max(he.y, this.highestPlantY);

      // bubbles
      {
        x = he.x + Math.cos(theta + 0.1234);
        y = he.y + Math.sin(theta / 2.123) + 2 * v.y;
        let e = this.entities.get(APBubble1 + i);
        if (!e) continue;
        e.moveTo(GTE.vec3(x, y, gmZDistance));
        if (he.dead) e.dead = 1;
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

    this.playerBreath = GTE.clamp(
        this.playerBreath - PlayerBreathRate * this.xor.dt, 0, MaxPlayerBreath);
    if (this.playerBreath == 0 && !p1.dead) {
      this.loseGame();
      this.playSound(SFX_DEAD);
      p1.dead = 1;
    }

    p1.position.scale.y = p1.dead ? -1 : 1;
    if (p1.dead) {
      p1.vy = GTE.clamp(p1.vy, -1, 1);
      if (p1.y > PlayerBottom) p1.position.angleInDegrees += this.xor.dt * 10;
      if (!p1.landed && p1.y == PlayerBottom) {
        this.playSound(SFX_DOOP);
        p1.landed = 1;
      }
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
          this.playSound(SFX_FishDead1 + randRange(SFX_FishDeadCount));
        }
      }

      if (!fe.eating && fe.dead && fe.y > PlayerBottom) {
        for (let ap = 0; ap < APCount; ap++) {
          let ape = this.entities.get(APHead1 + ap);
          if (!ape) continue;
          if (!ape.dead) {
            let apep = GTE.vec3(ape.x, ape.y, 0);
            if (fep.distance(apep) < APKillDistance) {
              this.plantoidHungers[ap] += PlantoidEatRate * 10;
              fe.eating = 1;
              fe.eatingTime = this.xor.t1 + 1;
              this.playSound(SFX_EATEN1 + randRange(SFX_EatenCount));
              let be = this.entities.get(APBubble1 + ap);
              if (be) {
                be.dead = 0;
                be.active = 1;
              }
            }
          }
        }
      }
      if (fe.eating) {
        fe.position.angleInDegrees += 40 * this.xor.dt;
        fe.position.size = GTE.clamp(fe.position.size - this.xor.dt, 0, 1);
        if (fe.eatingTime < this.xor.t1) fe.active = 0;
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
      let pep = GTE.vec3(pe.x, pe.y, 0);

      for (let ap = 0; ap < APCount; ap++) {
        let ape = this.entities.get(APHead1 + ap);
        if (!ape) continue;
        if (!ape.dead) {
          let apep = GTE.vec3(ape.x, ape.y, 0);
          if (pep.distance(apep) < APKillDistance) {
            pe.dead = 1;
            this.loseGame();
            this.playSound(SFX_DEAD);
            this.playSound(SFX_EATEN1 + randRange(SFX_EatenCount));
          }
        }

        let be = this.entities.get(APBubble1 + ap);
        if (be && !be.dead &&
            pep.distance(GTE.vec3(be.x, be.y, 0)) < APKillDistance) {
          this.playerBreath =
              GTE.clamp(this.playerBreath + 10, 0, MaxPlayerBreath);
          this.playSound(SFX_BUBBLE1 + (Math.random() > 0.5 ? 1 : 0))
          be.dead = 1;
          be.active = 0;
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
      if (!e[1].landed && e[1].y == PlayerBottom) {
        this.playSound(SFX_DOOP);
        e[1].landed = 1;
      }
      else if (e[1].y > PlayerBottom) e[1].landed = 0;
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
