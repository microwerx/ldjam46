///* global XOR Vector3 Matrix4 BoundingBox createButtonRow createRangeRow
/// setIdToHtml createCheckRow createDivRow setDivRowContents getCheckValue */
/// <reference path="../../LibXOR/LibXOR.d.ts" />
/// <reference path="htmlutils.ts" />
/// <reference path="ecs.ts" />
/// <reference path="components.ts" />
/// <reference path="game.ts" />

class Camera {
  eye = Vector3.make(0, 0, 10);
  target = Vector3.make(0, 0, 0);
  up = Vector3.make(0, 1, 0);

  update(p: Vector3) {
    this.target.x = GTE.clamp(this.target.x, p.x - 1, p.x + 1);
    this.target.y = GTE.clamp(this.target.y, p.y - 1, p.y + 1);
    this.eye.x =
        GTE.clamp(this.eye.x, this.target.x - 0.1, this.target.x + 0.1);
    this.eye.y =
        GTE.clamp(this.eye.y, this.target.y - 0.1, this.target.y + 0.1);
  }

  get matrix(): Matrix4 {
    return Matrix4.makeLookAt(this.eye, this.target, this.up);
  }
}

class App {
  parentID = 'game'
  xor = new LibXOR(this.parentID);
  readonly width = 640;
  readonly height = 512;
  hudCanvas = new OffscreenCanvas(this.width, this.height);
  hud2D: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D;
  theta = 0;
  mouse = Vector3.make(0, 0, 0);
  click = Vector3.make(0, 0, 0);
  euroKeys = 0;
  xmoveKeys = [['KeyA', 'KeyD'], ['KeyQ', 'KeyD']];
  zmoveKeys = [['KeyW', 'KeyS'], ['KeyZ', 'KeyS']];
  zturnKeys = [['KeyQ', 'KeyE'], ['KeyA', 'KeyE']];
  ymoveKeys = [['KeyC', 'KeyZ'], ['KeyC', 'KeyW']];
  yturnKeys = [['ArrowLeft', 'ArrowRight'], ['ArrowLeft', 'ArrowRight']];
  xturnKeys = [['ArrowUp', 'ArrowDown'], ['ArrowUp', 'ArrowDown']];
  p1x = 0;
  p2x = 0;
  p1y = 0;
  p2y = 0;
  ENTERbutton = 0;
  BACKbutton = 0;
  SPACEbutton = 0;
  TABbutton = 0;

  cameraZoom = 0;
  camera = new Camera();

  ecs = new XOR.ECS();
  // components = new ComponentIDs();
  // assemblages = new AssemblageIDs();
  // player1ID = 0;
  // player2ID = 0;

  game = new Game(this.xor, this.ecs, this.width, this.height);

  constructor() {
    // this.hudCanvas.style.position = 'absolute';
    // this.hudCanvas.style.zIndex = '5';
    let ctx = this.hudCanvas.getContext('2d');
    if (!ctx) throw 'Unable to create 2D Canvas';
    this.hud2D = ctx;

    setIdToHtml(
        this.parentID, '<p>This is a test of the LibXOR retro console.</p>');

    let self = this;
    let controls = document.getElementById('controls');
    if (!controls) throw 'controls element does not exist';

    createButtonRow(controls, 'bReset', 'Reset', () => {
      self.reset(1);
    });
    createButtonRow(controls, 'bNextLevel', 'Next Level', () => {
      self.reset(this.game.level + 1);
    });
    createButtonRow(controls, 'bZSDF', 'ZSDF/WASD', () => {
      self.euroKeys = 1 - self.euroKeys;
    });
    createRangeRow(controls, 'fZoom', 0.0, 0.0, 1.0, 0.01);
    createCheckRow(controls, 'zasdKeys', false);
    createRangeRow(controls, 'SOffsetX', 0, -8, 8);
    createRangeRow(controls, 'SOffsetY', 0, -8, 8);
    createRangeRow(controls, 'SZoomX', 1.0, 0.0, 4.0, 0.1);
    createRangeRow(controls, 'SZoomY', 1.0, 0.0, 4.0, 0.1);
    createRangeRow(controls, 'playTrack', 0, 0, 7);
    createRangeRow(controls, 'sfxTrack', 0, 0, 15);
    createButtonRow(controls, 'bPlayTrack', 'Play Track', () => {
      self.playMusic(getRangeValue('playTrack'));
    });
    createButtonRow(controls, 'bPlaySFX', 'Play SFX', () => {
      self.playSfx(getRangeValue('sfxTrack'));
    });

    this.xor.triggers.set('ESC', 60.0 / 120.0);
    this.xor.triggers.set('SPC', 0.033);
    this.xor.triggers.set('ENT', 0.033);
  }

  // /**
  //  *
  //  * @param {number} entityID which entityID
  //  * @returns {PositionComponent} returns position component for entityID
  //  */
  // getPositionComponent(entityID: number): PositionComponent {
  //   return this.ecs.getComponentData(entityID, this.components.positionID);
  // }

  // /**
  //  *
  //  * @param {number} entityID which entityID
  //  * @returns {PhysicsComponent} returns physics component for entityID
  //  */
  // getPhysicsComponent(entityID: number): PhysicsComponent {
  //   return this.ecs.getComponentData(entityID, this.components.physicsID);
  // }

  // /**
  //  *
  //  * @param {number} entityID which entityID
  //  * @returns {RenderComponent} returns render component for entityID
  //  */
  // getRenderComponent(entityID: number): RenderComponent {
  //   return this.ecs.getComponentData(entityID, this.components.renderID);
  // }

  /**
   * getAxis(keysToCheck)
   * @param {string[]} keysToCheck a two element string array
   */
  getAxis(keysToCheck: string[][]): number {
    let neg = this.xor.input.checkKeys([keysToCheck[this.euroKeys][0]]);
    let pos = this.xor.input.checkKeys([keysToCheck[this.euroKeys][1]]);
    return pos - neg;
  }

  /**
   * playMusic(index)
   * @param {number} index Which slot to start playing
   */
  playMusic(index: number) {
    this.xor.sound.jukebox.play(index | 0);
  }

  /**
   * playSfx(index)
   * @param {number} index Which slot to start playing
   */
  playSfx(index: number) {
    this.xor.sound.sampler.playSample(index & 0xF, false, 0);
  }

  /**
   * init()
   */
  init() {
    hflog.logElement = 'log';
    this.xor.input.init();
    this.xor.sound.init();
    this.xor.graphics.init();
    this.xor.graphics.setVideoMode(this.width, this.height);

    this.hudCanvas.width = this.width;
    this.hudCanvas.height = this.height;
    // let p = document.getElementById(this.parentID);
    // if (p) {
    //   p.appendChild(this.hudCanvas);
    // }

    this.reset();

    this.loadGraphics();
    this.loadSounds();
    this.loadMusic();
  }

  loadGraphics() {
    this.xor.renderconfigs.load(
        'default', 'shaders/basic.vert', 'shaders/libxor.frag');

    let bbox = new GTE.BoundingBox();
    bbox.add(Vector3.make(-0.5, -0.5, -0.5));
    bbox.add(Vector3.make(0.5, 0.5, 0.5));
    // this.xor.meshes.load('dragon', 'models/dragon.obj', bbox, null);
    // this.xor.meshes.load('bunny', 'models/bunny.obj', bbox, null);
    this.xor.meshes.load('box', 'models/box.obj', null, null);
    this.xor.meshes.load('bigrect', 'models/bigrect.obj', null, null);
    this.xor.meshes.load('rect', 'models/rect.obj', null, null);
    this.xor.meshes.load('rect01', 'models/rect01.obj', null, null);
    this.xor.meshes.load('spear', 'models/spear.obj', null, null);
    this.xor.meshes.load('seabackdrop', 'models/seabackdrop.obj', null, null);

    this.xor.meshes.load('seafloor', 'models/seafloor.obj', null, null);
    this.xor.meshes.load('seawall', 'models/seawall.obj', null, null);

    this.xor.fluxions.textures.defaultWrapS =
        WebGLRenderingContext.CLAMP_TO_EDGE;
    this.xor.fluxions.textures.defaultWrapT =
        WebGLRenderingContext.CLAMP_TO_EDGE;
    this.xor.fluxions.textures.load('seawall', 'images/seawall.png');
    this.xor.fluxions.textures.load('seafloor', 'images/seafloor.png');
    this.xor.fluxions.textures.load('spear1', 'images/spear1.png');
    this.xor.fluxions.textures.load('spear2', 'images/spear2.png');
    this.xor.fluxions.textures.load('water', 'images/water.png');
    this.xor.fluxions.textures.load('water21', 'images/water2_layer1.png');
    this.xor.fluxions.textures.load('water22', 'images/water2_layer2.png');
    for (let i = 1; i <= 3; i++) {
      this.xor.fluxions.textures.load(
          'stem' + i.toString(), 'images/stem' + i.toString() + '.png');
      this.xor.fluxions.textures.load(
          'plantoid' + i.toString(), 'images/plantoid' + i.toString() + '.png');
    }
    for (let i = 1; i <= 4; i++) {
      this.xor.fluxions.textures.load(
          'fish' + i.toString(), 'images/fishes_' + i.toString() + '.png');
    }
    this.xor.fluxions.textures.load('player1', 'images/player1.png');
    this.xor.fluxions.textures.load('player2', 'images/parrot.png');
  }

  loadSounds() {
    this.xor.sound.sampler.loadSample(0, 'sounds/BassDrum1.wav');
    this.xor.sound.sampler.loadSample(1, 'sounds/BassDrum2.wav');
  }

  /**
   * loadMusic using the sound jukebox
   */
  loadMusic() {
    this.xor.sound.jukebox.add(0, 'music/noise.mp3', true, false);
    this.xor.sound.jukebox.add(1, 'music/maintheme.mp3', true, false);
    this.xor.sound.jukebox.add(2, 'music/adventuretheme.mp3', true, false);
    this.xor.sound.jukebox.add(3, 'music/arcadetheme.mp3', true, false);
  }

  /**
   * reset game back to initial conditions
   */
  reset(level: number = 1) {
    let spr = this.xor.graphics.sprites[0];
    if (spr) {
      spr.enabled = true;
      spr.position.reset(50, 50, 0);
    }

    spr = this.xor.graphics.sprites[1];
    if (spr) {
      spr.enabled = true;
      spr.position.reset(58, 50, 0);
    }

    this.game.reset(level);
    this.game.pauseGame = false;
  }

  /**
   * start the main loop
   */
  start() {
    this.mainloop();
  }

  /**
   * update the game
   * @param dt time elapsed since last frame in seconds
   */
  update(dt: number) {
    let xor = this.xor;
    xor.input.poll();
    this.updateControls();

    if (xor.input.checkKeys([' ', 'Space'])) {
      this.reset();
    }

    if (xor.input.checkKeys(['Escape'])) {
      if (xor.triggers.get('ESC').tick(xor.t1)) {
        this.game.pauseGame = !this.game.pauseGame;
        hflog.info(this.game.pauseGame ? 'paused' : 'not paused');
      }
    }

    if (xor.input.checkKeys(['Space'])) {
      xor.input.resetKeys(['Space']);
      if (xor.triggers.get('SPC').tick(xor.t1)) {
        hflog.info('pew!');
      }
    }

    this.p1x = this.getAxis(this.xmoveKeys);
    this.p1y = this.getAxis(this.zmoveKeys);
    this.p2x = this.getAxis(this.yturnKeys);
    this.p2y = this.getAxis(this.xturnKeys);
    xor.graphics.sprites[0].position.x += this.p1x * dt * 10;
    xor.graphics.sprites[0].position.y += this.p1y * dt * 10;
    xor.graphics.sprites[1].position.x += this.p2x * dt * 10;
    xor.graphics.sprites[1].position.y += this.p2y * dt * 10;

    let p1 = this.game.entities.get(Player1)?.physics
    let p2 = this.game.entities.get(Player2)?.physics

    if (p1) {
      p1.velocity.reset(this.p1x, -this.p1y, 0);
    }

    for (let i = 0; i < 4; i++) {
      let spr = xor.graphics.sprites[2 + i];
      let gp = xor.input.gamepads.get(i);
      if (gp && gp.enabled) {
        spr.enabled = true;
        spr.position.x += gp.axe(0) * dt * 10;
        spr.position.y += gp.axe(1) * dt * 10;
        if (p1) p1.velocity.reset(gp.axe(0), gp.axe(1), 0);
      } else {
        spr.enabled = false;
      }
    }

    this.click.reset(this.p2x, -this.p2y, 0);
    if (xor.input.mouseOver) {
      let w = xor.graphics.width;
      let h = xor.graphics.height;
      let x = xor.input.mouse.position.x;
      let y = xor.input.mouse.position.y;
      this.mouse.x = x / w;
      this.mouse.y = y / h;
      if (xor.input.mouseButtons.get(0)) {
        this.click.reset(x - (w >> 1), -y + (h >> 1), 1);
        // this.click.x = x / w;
        // this.click.y = y / h;
      }
    } else if (xor.input.touches[0].pressed) {
      let w = xor.graphics.width >> 1;
      let h = xor.graphics.height >> 1;
      this.click.reset(
          xor.input.touches[0].x - w, -xor.input.touches[0].y + h, 0);
    } else {
      this.click.reset(this.p2x, -this.p2y, 0)
    }

    if (p2) {
      p2.velocity = Vector3.makeUnit(this.click.x, this.click.y, 0);
    }

    this.game.update(dt);

    this.theta += dt;
  }

  /**
   * update the controls from the web page
   */
  updateControls() {
    let xor = this.xor;
    xor.graphics.setOffset(
        getRangeValue('SOffsetX'), getRangeValue('SOffsetY'));
    xor.graphics.setZoom(getRangeValue('SZoomX'), getRangeValue('SZoomY'));
    this.cameraZoom = getRangeValue('fZoom');
  }


  /**
   * render the 3D graphics for the game
   */
  render() {
    let xor = this.xor;
    xor.graphics.clear(XOR.Color.AZURE, XOR.Color.WHITE, 5);

    if (!this.game.pauseGame) {
      xor.graphics.render();
    }

    let pmatrix = Matrix4.makePerspectiveY(45.0, 1.5, 1.0, 120.0);
    this.camera.update(this.game.playerPosition);
    let cmatrix = this.camera.matrix;
    let rc = xor.renderconfigs.use('default');

    if (rc) {
      let gl = this.xor.fluxions.gl;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      rc.uniformMatrix4f('ProjectionMatrix', pmatrix);
      rc.uniformMatrix4f('CameraMatrix', cmatrix);
      rc.uniformMatrix4f('TextureMatrix', Matrix4.makeIdentity());
      rc.uniformMatrix4f('WorldMatrix', Matrix4.makeTranslation(0, 0, -20));
      rc.uniform3f('Kd', Vector3.make(1.0, 1.0, 1.0));
      rc.uniform1f('MapKdMix', 1.0);
      this.xor.fluxions.textures.get('seawall')?.bindUnit(0);
      rc.uniformMatrix4f('WorldMatrix', Matrix4.makeScale(0.5, 0.5, 0.5));
      this.xor.meshes.render('seawall', rc);
      this.xor.fluxions.textures.get('seafloor')?.bindUnit(0);
      this.xor.meshes.render('seafloor', rc);

      this.game.draw(rc);

      rc.restore();
    }
  }

  drawText(text: string, y: number, color: string, shadowOffset: number) {
    let tm = this.hud2D.measureText(text);
    let cx = ((this.width - tm.width) >> 1);
    this.hud2D.fillStyle = '#000000';
    this.hud2D.fillText(text, cx + 4, y + 4);
    this.hud2D.fillStyle = color;
    this.hud2D.fillText(text, cx + shadowOffset, y + shadowOffset);
  }

  /**
   * Render the 2D overlay for the game
   */
  renderHUD() {
    // this.hudCanvas.style.position = '0 0';
    let xor = this.xor;
    let gl = this.xor.fluxions.gl;
    let ox = 2 + 2 * (0.5 + 0.5 * Math.cos(this.xor.t1));

    this.hud2D.clearRect(0, 0, this.width, this.height);
    this.hud2D.font = '64px Pedrita';

    this.drawText('Atlantoid', 64, '#ff0000', ox);
    this.drawText('Plantoid', 128, '#00ff00', ox);

    let image = this.hud2D.getImageData(0, 0, 640, 512);

    let rc = xor.renderconfigs.use('default');

    let texture = gl.createTexture();
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    if (rc) {
      rc.uniformMatrix4f('ProjectionMatrix', Matrix4.makeIdentity());
      rc.uniformMatrix4f('CameraMatrix', Matrix4.makeIdentity());
      rc.uniformMatrix4f('WorldMatrix', Matrix4.makeTranslation(0, 0, 0));
      rc.uniformMatrix4f('TextureMatrix', Matrix4.makeIdentity());
      rc.uniform1f('MapKdMix', 1.0);
      rc.uniform3f('Kd', Vector3.make(1.0, 1.0, 1.0));
      rc.uniform1i('MapKd', 0);
      // this.xor.fluxions.textures.get('player1')?.bindUnit(0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      xor.meshes.render('rect', rc);
      rc.restore();
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(texture);
  }

  /**
   * delay the main thread by zero or more milliseconds
   * @param ms time in milliseconds
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * repeatedly poll input, update game logic, render graphics, and render the
   * HUD
   */
  mainloop() {
    let self = this;
    window.requestAnimationFrame(async (t) => {
      self.xor.startFrame(t);
      self.xor.input.poll();
      self.xor.sound.update();
      self.update(self.xor.dt);
      self.render();
      // self.renderHUD();
      await self.delay(1);
      self.mainloop();
    });
  }
}

/**
 * Called by the web page to start the game. If we do not do this, then we don't
 * get an active event to use sound.
 */
function startGame() {
  let app = new App();
  app.init();
  app.start();
}