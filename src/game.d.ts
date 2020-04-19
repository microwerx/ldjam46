/// <reference path="../../LibXOR/LibXOR.d.ts" />
/**
 * Creates a row div with a left and right column. It expects CSS class row,
 * column, left, and right.
 * @param {string} leftContent
 * @param {string} rightContent
 */
declare function createRow(leftContent?: string, rightContent?: string): HTMLDivElement;
/**
 * createRangeRow creates a row with a range control
 * @param {HTMLElement} parent The element that should be appended to
 * @param {string} id The name of the range variable
 * @param {number} curValue The current value of the range
 * @param {number} minValue The minimum value of the range
 * @param {number} maxValue The maximum value of the range
 * @param {number} stepValue The step of the range control (default 1)
 * @returns {HTMLElement} The created HTMLElement div
 */
declare function createRangeRow(parent: HTMLElement, id: string, curValue: number, minValue: number, maxValue: number, stepValue?: number, isvector?: boolean): void;
/**
 * createRowButton adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} caption The caption of the button
 * @param {string} id The name of the button's id
 * @param {function} callback A callback function if this gets clicked
 */
declare function createButtonRow(parent: HTMLElement, id: string, caption: string, callback: () => void): void;
/**
 * createCheckButton adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the button's id
 * @param {boolean} checked Is it checked or not
 */
declare function createCheckRow(parent: HTMLElement, id: string, checked: boolean): void;
/**
 * createTextRow adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the button's id
 * @param {string} value The initial value of the string
 */
declare function createTextRow(parent: HTMLElement, id: string, value: string): void;
/**
 * createTextRow adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the label's id
 * @param {string} value The initial value of the string
 */
declare function createLabelRow(parent: HTMLElement, id: string, value: string): void;
/**
 * createDivRow adds a row to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the row's id
 */
declare function createDivRow(parent: HTMLElement, id: string): void;
/**
 * setDivRowContents
 * @param {string} id
 * @param {string} content
 */
declare function setDivRowContents(id: string, content: string): void;
declare function setDivRowButtonCaption(id: string, caption: string): void;
/**
 * setDivRowValue
 * @param id the id of the input element
 * @param content the new value the control should have
 */
declare function setDivRowValue(id: string, content: string): void;
/**
 * setDivLabelValue
 * @param id the id of the input element
 * @param content the new value the control should have
 */
declare function setDivLabelValue(id: string, content: string): void;
/**
 * getRangeValue returns the number of a range control
 * @param {string} id
 * @returns the value of the range control or 0
 */
declare function getRangeValue(id: string): number;
/**
 * Returns if control is checked or not
 * @param {string} id
 * @returns {boolean}
 */
declare function getCheckValue(id: string): boolean;
/**
 * getRangeVector3
 * @param {string} id The id of the range controls ending with 1, 2, 3. Example:
 *     id="sky", we get "sky1", "sky2", etc.
 * @returns {Vector3} A Vector3 with the values from controls id1, id2, and id3.
 */
declare function getRangeVector3(id: string): Vector3;
/**
 * setIdToHtml
 * @param {string} id
 * @param {string} html
 */
declare function setIdToHtml(id: string, html: string): void;
declare namespace XOR {
    class ComponentInfo {
        readonly id: number;
        name: string;
        desc: string;
        constructor(id: number, name: string, desc: string);
    }
    class EntityInfo {
        readonly id: number;
        name: string;
        desc: string;
        components: Set<number>;
        constructor(id: number, name: string, desc: string);
    }
    class ECS {
        entities: Map<number, EntityInfo>;
        newEntityIndex: number;
        components: Map<number, ComponentInfo>;
        newComponentIndex: number;
        assemblages: Map<number, Set<number>>;
        assemblagesEntities: Map<number, Set<number>>;
        newAssemblageIndex: number;
        componentEntityData: Map<number, Map<number, any>>;
        /**
         * @constructor
         */
        constructor();
        /**
         *
         * @param name name of the entity
         * @param desc a helpful debugging description
         */
        addEntity(name: string, desc: string): number;
        /**
         *
         * @param entityID the index of the entity
         * @param assemblageID the assembly to use to create the components
         * @returns number of components added to entity
         */
        addAssemblageToEntity(entityID: number, assemblageID: number): number;
        /**
         *
         * @param assemblageID the index of the assembly
         * @returns {Iterable<number} an iterable of entityIDs
         */
        getEntitiesWithAssemblage(assemblageID: number): Iterable<number>;
        /**
         *
         * @param name the name of the component
         * @param desc a helpful debugging description
         */
        addComponent(name: string, desc: string): number;
        getEntitiesWithComponent(componentID: number): IterableIterator<number>;
        getEntitiesWithComponents(componentIDs: number[]): IterableIterator<number>;
        addEntityComponent(entityID: number, componentID: number): boolean;
        deleteEntityComponent(entityID: number, componentID: number): boolean;
        setComponentData(entityID: number, componentID: number, componentData: any): boolean;
        getComponentData(entityID: number, componentID: number): any;
        addAssemblage(): number;
        deleteAssemblage(assemblageID: number): boolean;
        addComponentToAssemblage(assemblageID: number, componentID: number): boolean;
    }
}
declare class PositionComponent {
    position: Vector3;
    bbox: GTE.BoundingBox;
    angleInDegrees: number;
    scale: Vector3;
    /**
     * Creates data for positionable entity
     * @param {Vector3} p position of entity
     * @param {GTE.BoundingBox} bbox bounding box of entity
     */
    constructor(position: Vector3, bbox: GTE.BoundingBox);
}
declare class PhysicsComponent {
    velocity: Vector3;
    mass: number;
    /**
     * Creates data for physics component
     * @param {Vector3} v velocity of entity
     * @param {number} mass mass of entity in KG
     */
    constructor(velocity: Vector3, mass: number);
}
declare class RenderComponent {
    meshName: string;
    worldMatrix: Matrix4;
    color: Vector3;
    texture: string;
    textureMatrix: Matrix4;
    /**
     * Creates data for render component
     * @param {string} meshName name of mesh to render
     * @param {Matrix4} worldMatrix scaling matrix
     * @param {Vector3} color color of mesh to render
     */
    constructor(meshName: string, worldMatrix: Matrix4, color: Vector3, texture: string);
}
declare class ComponentIDs {
    positionID: number;
    physicsID: number;
    renderID: number;
}
declare class AssemblageIDs {
    physicalID: number;
}
declare function noise2(x: number, y: number): number;
declare function mix(x: number, y: number, a: number): number;
declare class GameEntity {
    ecs: XOR.ECS;
    componentIDs: ComponentIDs;
    entityID: number;
    position: PositionComponent;
    physics: PhysicsComponent;
    render: RenderComponent;
    active: number;
    dead: number;
    direction: number;
    wrap: number;
    constructor(ecs: XOR.ECS, componentIDs: ComponentIDs, entityID: number, position: PositionComponent, physics: PhysicsComponent, render: RenderComponent);
    recalcMatrix(): void;
    moveTo(p: Vector3, angleInDegrees?: number): void;
    update(dt: number): void;
    draw(xor: LibXOR, rc: Fluxions.FxRenderConfig): void;
}
declare const Player1 = 1;
declare const Player2 = 2;
declare const Player1Spear = 3;
declare const Player2Spear = 4;
declare const APHead1 = 20;
declare const APHead2 = 21;
declare const APHead3 = 22;
declare const APHead4 = 23;
declare const APHeadCount = 4;
declare const APArm1 = 30;
declare const APArm2 = 31;
declare const APArm3 = 32;
declare const APArm4 = 33;
declare const APArmCount = 4;
declare const APArmSegments = 3;
declare const Fish1 = 100;
declare const FishCount = 100;
declare const BackdropStart = 200;
declare const BackdropCount = 50;
declare const BackdropEnd: number;
declare const BackdropBlank1: number;
declare const BackdropBlank2: number;
declare const bgZDistance = -14;
declare const gmZDistance = -4;
declare class LevelInfo {
    numHeads: number;
    storminess: number;
    playerPosition: Vector3;
    plantoidPosition: Vector3;
    constructor(numHeads: number, storminess: number);
}
declare const levels: LevelInfo[];
declare class Game {
    xor: LibXOR;
    ecs: XOR.ECS;
    readonly width: number;
    readonly height: number;
    readonly bboxSizeOne: GTE.BoundingBox;
    components: ComponentIDs;
    assemblages: AssemblageIDs;
    entities: Map<number, GameEntity>;
    level: number;
    levelInfo: LevelInfo;
    pauseGame: boolean;
    constructor(xor: LibXOR, ecs: XOR.ECS, width: number, height: number);
    get playerPosition(): Vector3;
    /**
     * create a new physical entity with position, velocity, and render components
     * @param name name of the entity
     * @param meshName name of the mesh to use for rendering
     * @param colorIndex color of the mesh to use for rendering
     */
    createPhysical(index: number, name: string, meshName: string, colorIndex: XOR.Color, textureName: string): GameEntity;
    /**
     * @returns {PositionComponents[]} array of position components
     */
    get positionComponents(): any[];
    /**
     * @returns {PhysicsComponent[]} array of physics components
     */
    get physicsComponents(): any[];
    /**
     * @returns {RenderComponent[]} array of render components
     */
    get renderComponents(): any[];
    /**
     * initialize the game from nothing
     */
    init(): void;
    /**
     * Reset the game to start at a certain level
     * @param level which level to begin at
     */
    reset(level: number): void;
    /**
     * update background elements such as the waves
     */
    updateBackground(): void;
    /**
     * Update the Atlantoid Plantoid that lives on the bottom of the sea
     */
    updatePlantoid(): void;
    /**
     * Update the player that lives in the air bubble under the sea
     */
    updatePlayer(): void;
    /**
     * Update the spear that the player holds
     */
    updateSpears(): void;
    /**
     * Update the fishes that live under the sea
     */
    updateFishes(): void;
    /**
     * Update the game
     * @param dt elapsed time since last frame
     */
    update(dt: number): void;
    /**
     * Draw the game
     * @param rc render config to draw with
     */
    draw(rc: Fluxions.FxRenderConfig): void;
}
declare class Camera {
    eye: Vector3;
    target: Vector3;
    up: Vector3;
    update(p: Vector3): void;
    get matrix(): Matrix4;
}
declare class App {
    parentID: string;
    xor: LibXOR;
    readonly width = 640;
    readonly height = 512;
    hudCanvas: OffscreenCanvas;
    hud2D: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    theta: number;
    mouse: Vector3;
    click: Vector3;
    euroKeys: number;
    xmoveKeys: string[][];
    zmoveKeys: string[][];
    zturnKeys: string[][];
    ymoveKeys: string[][];
    yturnKeys: string[][];
    xturnKeys: string[][];
    p1x: number;
    p2x: number;
    p1y: number;
    p2y: number;
    ENTERbutton: number;
    BACKbutton: number;
    SPACEbutton: number;
    TABbutton: number;
    cameraZoom: number;
    camera: Camera;
    ecs: XOR.ECS;
    game: Game;
    constructor();
    /**
     * getAxis(keysToCheck)
     * @param {string[]} keysToCheck a two element string array
     */
    getAxis(keysToCheck: string[][]): number;
    /**
     * playMusic(index)
     * @param {number} index Which slot to start playing
     */
    playMusic(index: number): void;
    /**
     * playSfx(index)
     * @param {number} index Which slot to start playing
     */
    playSfx(index: number): void;
    /**
     * init()
     */
    init(): void;
    loadGraphics(): void;
    loadSounds(): void;
    /**
     * loadMusic using the sound jukebox
     */
    loadMusic(): void;
    /**
     * reset game back to initial conditions
     */
    reset(level?: number): void;
    /**
     * start the main loop
     */
    start(): void;
    /**
     * update the game
     * @param dt time elapsed since last frame in seconds
     */
    update(dt: number): void;
    /**
     * update the controls from the web page
     */
    updateControls(): void;
    /**
     * render the 3D graphics for the game
     */
    render(): void;
    drawText(text: string, y: number, color: string, shadowOffset: number): void;
    /**
     * Render the 2D overlay for the game
     */
    renderHUD(): void;
    /**
     * delay the main thread by zero or more milliseconds
     * @param ms time in milliseconds
     */
    delay(ms: number): Promise<unknown>;
    /**
     * repeatedly poll input, update game logic, render graphics, and render the
     * HUD
     */
    mainloop(): void;
}
/**
 * Called by the web page to start the game. If we do not do this, then we don't
 * get an active event to use sound.
 */
declare function startGame(): void;
