"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-unused-vars */
/// <reference path="../../LibXOR/LibXOR.d.ts" />
// START HELPFUL HTML5 FUNCTIONS
/**
 * Creates a row div with a left and right column. It expects CSS class row,
 * column, left, and right.
 * @param {string} leftContent
 * @param {string} rightContent
 */
function createRow(leftContent = '', rightContent = '') {
    let row = document.createElement('div');
    row.className = 'row';
    let left = document.createElement('div');
    left.className = 'column left';
    left.innerHTML = leftContent;
    let right = document.createElement('div');
    right.className = 'column right';
    right.innerHTML = rightContent;
    row.appendChild(left);
    row.appendChild(right);
    return row;
}
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
function createRangeRow(parent, id, curValue, minValue, maxValue, stepValue = 1, isvector = false) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column\'>';
    if (!isvector) {
        rContent += '<input type=\'range\' id=\'' + id + '\' value=\'' + curValue +
            '\' min=\'' + minValue + '\' max=\'' + maxValue + '\' step=\'' +
            stepValue + '\' />';
        rContent += '</div><div class=\'column left\'>';
        rContent += '<label id=\'' + id + '_value\'>0</label>';
    }
    else {
        rContent += '<input type=\'range\' id=\'' + id + '1\' value=\'' + curValue +
            '\' min=\'' + minValue + '\' max=\'' + maxValue + '\' step=\'' +
            stepValue + '\' />';
        rContent += '<input type=\'range\' id=\'' + id + '2\' value=\'' + curValue +
            '\' min=\'' + minValue + '\' max=\'' + maxValue + '\' step=\'' +
            stepValue + '\' />';
        rContent += '<input type=\'range\' id=\'' + id + '3\' value=\'' + curValue +
            '\' min=\'' + minValue + '\' max=\'' + maxValue + '\' step=\'' +
            stepValue + '\' />';
    }
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
}
/**
 * createRowButton adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} caption The caption of the button
 * @param {string} id The name of the button's id
 * @param {function} callback A callback function if this gets clicked
 */
function createButtonRow(parent, id, caption, callback) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column right\'>';
    rContent += '<button id=\'' + id + '\'>' + caption + '</button>';
    rContent += '</div><div class=\'column left\'>';
    rContent += '<label id=\'' + id + '_value\'>0</label>';
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
    let b = document.getElementById(id);
    if (b) {
        b.onclick = callback;
    }
}
/**
 * createCheckButton adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the button's id
 * @param {boolean} checked Is it checked or not
 */
function createCheckRow(parent, id, checked) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column right\'>';
    let c = checked ? ' checked' : '';
    rContent += '<input type=\'checkbox\' id=\'' + id + '\' ' + c + '/>';
    rContent += '</div><div class=\'column left\'>';
    rContent += '<label id=\'' + id + '_value\'>0</label>';
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
}
/**
 * createTextRow adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the button's id
 * @param {string} value The initial value of the string
 */
function createTextRow(parent, id, value) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column right\'>';
    rContent += '<input type=\'text\' style=\'width: 8em\' id=\'' + id +
        ' value=\'' + value + '\' />';
    rContent += '</div><div class=\'column left\'>';
    rContent += '<label id=\'' + id + '_value\'>' + value + '</label>';
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
}
/**
 * createTextRow adds a button to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the label's id
 * @param {string} value The initial value of the string
 */
function createLabelRow(parent, id, value) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column right\'>';
    rContent += '<label id=\'' + id + '_value\'>' + value + '</label>';
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
}
/**
 * createDivRow adds a row to the control list
 * @param {HTMLElement} parent The parent HTMLElement
 * @param {string} id The name of the row's id
 */
function createDivRow(parent, id) {
    let lContent = '<div class=\'column left\'><label for=\'' + id + '\'>' + id +
        '<label></div>';
    let rContent = '<div class=\'column right\' id=\'' + id + '\'>';
    rContent += '</div>';
    let row = createRow(lContent, rContent);
    row.id = 'row' + id;
    row.className = 'row';
    parent.appendChild(row);
}
/**
 * setDivRowContents
 * @param {string} id
 * @param {string} content
 */
function setDivRowContents(id, content) {
    let e = document.getElementById(id);
    if (!e)
        return;
    e.innerHTML = content;
}
function setDivRowButtonCaption(id, caption) {
    let e = document.getElementById(id);
    if (!e)
        return;
    e.innerHTML = caption;
}
/**
 * setDivRowValue
 * @param id the id of the input element
 * @param content the new value the control should have
 */
function setDivRowValue(id, content) {
    let e = document.getElementById(id);
    if (!e)
        return;
    e.value = content;
    let l = document.getElementById(id + '_value');
    if (l)
        l.innerHTML = e.value.toString();
}
/**
 * setDivLabelValue
 * @param id the id of the input element
 * @param content the new value the control should have
 */
function setDivLabelValue(id, content) {
    let l = document.getElementById(id + '_value');
    if (l)
        l.innerHTML = content;
}
/**
 * getRangeValue returns the number of a range control
 * @param {string} id
 * @returns the value of the range control or 0
 */
function getRangeValue(id) {
    let e = document.getElementById(id);
    if (!e)
        return 0;
    let l = document.getElementById(id + '_value');
    if (l)
        l.innerHTML = e.value.toString();
    return parseFloat(e.value) * 1.0;
}
/**
 * Returns if control is checked or not
 * @param {string} id
 * @returns {boolean}
 */
function getCheckValue(id) {
    let e = document.getElementById(id);
    if (!e)
        return false;
    let l = document.getElementById(id + '_value');
    if (l)
        l.innerHTML = e.value.toString();
    return e.checked;
}
/**
 * getRangeVector3
 * @param {string} id The id of the range controls ending with 1, 2, 3. Example:
 *     id="sky", we get "sky1", "sky2", etc.
 * @returns {Vector3} A Vector3 with the values from controls id1, id2, and id3.
 */
function getRangeVector3(id) {
    return Vector3.make(getRangeValue(id + '1'), getRangeValue(id + '2'), getRangeValue(id + '3'));
}
/**
 * setIdToHtml
 * @param {string} id
 * @param {string} html
 */
function setIdToHtml(id, html) {
    let el = document.getElementById(id);
    if (el) {
        el.innerHTML = html;
    }
}
// END HELPFUL HTML5 CODE
/// <reference path="../../LibXOR/LibXOR.d.ts" />
var XOR;
(function (XOR) {
    class ComponentInfo {
        constructor(id, name, desc) {
            this.id = id;
            this.name = name;
            this.desc = desc;
        }
    }
    XOR.ComponentInfo = ComponentInfo;
    class EntityInfo {
        constructor(id, name, desc) {
            this.id = id;
            this.name = name;
            this.desc = desc;
            this.components = new Set();
        }
    }
    XOR.EntityInfo = EntityInfo;
    class ECS {
        /**
         * @constructor
         */
        constructor() {
            this.entities = new Map();
            this.newEntityIndex = 0;
            this.components = new Map();
            this.newComponentIndex = 0;
            this.assemblages = new Map();
            this.assemblagesEntities = new Map();
            this.newAssemblageIndex = 0;
            this.componentEntityData = new Map();
        }
        /**
         *
         * @param name name of the entity
         * @param desc a helpful debugging description
         */
        addEntity(name, desc) {
            let id = this.newEntityIndex++;
            this.entities.set(id, new EntityInfo(id, name, desc));
            return id;
        }
        /**
         *
         * @param entityID the index of the entity
         * @param assemblageID the assembly to use to create the components
         * @returns number of components added to entity
         */
        addAssemblageToEntity(entityID, assemblageID) {
            let assemblage = this.assemblages.get(assemblageID);
            if (!assemblage)
                return 0;
            let addedCount = 0;
            for (let componentID of assemblage) {
                this.addEntityComponent(entityID, componentID);
                addedCount++;
            }
            let entities = this.assemblagesEntities.get(assemblageID);
            if (entities)
                entities.add(entityID);
            return addedCount;
        }
        /**
         *
         * @param assemblageID the index of the assembly
         * @returns {Iterable<number} an iterable of entityIDs
         */
        getEntitiesWithAssemblage(assemblageID) {
            let entities = this.assemblagesEntities.get(assemblageID);
            if (!entities)
                return new Set().keys();
            return entities.keys();
        }
        /**
         *
         * @param name the name of the component
         * @param desc a helpful debugging description
         */
        addComponent(name, desc) {
            let id = ++this.newComponentIndex;
            this.components.set(id, new ComponentInfo(id, name, desc));
            // create a set for entities
            this.componentEntityData.set(id, new Map());
            return id;
        }
        getEntitiesWithComponent(componentID) {
            let entities = this.componentEntityData.get(componentID);
            if (!entities)
                return new Set().keys();
            return entities.keys();
        }
        getEntitiesWithComponents(componentIDs) {
            let C = [];
            for (let cID of componentIDs) {
                let component = this.componentEntityData.get(cID);
                if (!component)
                    return new Set().keys();
                C.push(component);
            }
            let c = this.componentEntityData.get(componentIDs[0]);
            if (!c)
                return new Set().keys();
            let srckeys = c.keys();
            let entities = new Set();
            for (let k of srckeys) {
                let i = 0;
                for (; i < C.length; i++) {
                    if (!C[i].has(k)) {
                        break;
                    }
                }
                if (i != componentIDs.length)
                    continue;
                entities.add(k);
            }
            return entities.keys();
        }
        addEntityComponent(entityID, componentID) {
            let entity = this.entities.get(entityID);
            if (!entity)
                return false;
            entity.components.add(componentID);
            return this.setComponentData(entityID, componentID, null);
        }
        deleteEntityComponent(entityID, componentID) {
            let entity = this.entities.get(entityID);
            if (!entity)
                return false;
            if (!entity.components.has(componentID))
                return false;
            let ced = this.componentEntityData.get(componentID);
            if (ced)
                ced.delete(entityID);
            entity.components.delete(componentID);
            return true;
        }
        setComponentData(entityID, componentID, componentData) {
            let entity = this.entities.get(entityID);
            if (!entity)
                return false;
            // entity has component, is it empty?
            let entityData = this.componentEntityData.get(componentID);
            if (!entityData) {
                return false;
            }
            entityData.set(entityID, componentData);
            return true;
        }
        getComponentData(entityID, componentID) {
            let ced = this.componentEntityData.get(componentID);
            if (!ced)
                return null;
            let entityData = ced.get(entityID);
            if (!entityData)
                return null;
            return entityData;
        }
        addAssemblage() {
            let id = ++this.newAssemblageIndex;
            this.assemblages.set(id, new Set());
            this.assemblagesEntities.set(id, new Set());
            return id;
        }
        deleteAssemblage(assemblageID) {
            let a = this.assemblages.get(assemblageID);
            if (!a)
                return false;
            this.assemblages.delete(assemblageID);
            return true;
        }
        addComponentToAssemblage(assemblageID, componentID) {
            let a = this.assemblages.get(assemblageID);
            if (!a)
                return false;
            a.add(componentID);
            return true;
        }
    }
    XOR.ECS = ECS;
})(XOR || (XOR = {}));
/// <reference path="../../LibXOR/LibXOR.d.ts" />
class PositionComponent {
    /**
     * Creates data for positionable entity
     * @param {Vector3} p position of entity
     * @param {GTE.BoundingBox} bbox bounding box of entity
     */
    constructor(position, bbox) {
        this.position = position;
        this.bbox = bbox;
        this.angleInDegrees = 0;
        this.scale = Vector3.make(1, 1, 1);
        this.size = 1;
    }
}
class PhysicsComponent {
    /**
     * Creates data for physics component
     * @param {Vector3} v velocity of entity
     * @param {number} mass mass of entity in KG
     */
    constructor(velocity, mass) {
        this.velocity = velocity;
        this.mass = mass;
    }
}
class RenderComponent {
    /**
     * Creates data for render component
     * @param {string} meshName name of mesh to render
     * @param {Matrix4} worldMatrix scaling matrix
     * @param {Vector3} color color of mesh to render
     */
    constructor(meshName, worldMatrix, color, texture) {
        this.meshName = meshName;
        this.worldMatrix = worldMatrix;
        this.color = color;
        this.texture = texture;
        this.textureMatrix = Matrix4.makeIdentity();
    }
}
class ComponentIDs {
    constructor() {
        this.positionID = 0;
        this.physicsID = 0;
        this.renderID = 0;
    }
}
class AssemblageIDs {
    constructor() {
        this.physicalID = 0;
    }
}
/// <reference path="../../LibXOR/LibXOR.d.ts" />
/// <reference path="htmlutils.ts" />
/// <reference path="ecs.ts" />
/// <reference path="app.ts" />
function noise2(x, y) {
    let dot = x * 12.9898 + y * 78.233;
    let f = Math.sin(dot * 43758.5453);
    return f - Math.floor(f);
}
;
function mix(x, y, a) {
    return (1 - a) * x + a * y;
}
function randBetween(a, b) {
    return (Math.random() * (b - a) + a) | 0;
}
function randRange(count) {
    return (Math.random() * count) | 0;
}
class GameEntity {
    constructor(ecs, componentIDs, entityID, position, physics, render) {
        this.ecs = ecs;
        this.componentIDs = componentIDs;
        this.entityID = entityID;
        this.position = position;
        this.physics = physics;
        this.render = render;
        this.active = 1;
        this.dead = 0;
        this.direction = 1;
        this.wrap = 1;
        this.landed = 0;
        this.eating = 0;
        this.eatingTime = 0;
        ecs.setComponentData(entityID, componentIDs.positionID, position);
        ecs.setComponentData(entityID, componentIDs.physicsID, physics);
        ecs.setComponentData(entityID, componentIDs.renderID, render);
    }
    get x() {
        return this.position.position.x;
    }
    get y() {
        return this.position.position.y;
    }
    get vx() {
        return this.physics.velocity.x;
    }
    get vy() {
        return this.physics.velocity.y;
    }
    set x(x) {
        this.position.position.x = x;
    }
    set y(y) {
        this.position.position.y = y;
    }
    set vx(x) {
        this.physics.velocity.x = x;
    }
    set vy(y) {
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
    moveTo(p, angleInDegrees = 0) {
        this.position.position.copy(p);
        this.position.angleInDegrees = angleInDegrees;
        this.recalcMatrix();
    }
    update(dt) {
        this.position.position.accum(this.physics.velocity, dt);
        this.recalcMatrix();
    }
    draw(xor, rc) {
        rc.uniformMatrix4f('WorldMatrix', this.render.worldMatrix);
        rc.uniformMatrix4f('TextureMatrix', this.render.textureMatrix);
        rc.uniform3f('Kd', this.render.color);
        let mix = 0;
        if (this.render.texture.length > 0) {
            let texture = xor.fluxions.textures.get(this.render.texture);
            if (texture) {
                texture.bindUnit(0);
                if (this.wrap) {
                    texture.setWrapST(WebGLRenderingContext.REPEAT, WebGLRenderingContext.REPEAT);
                }
                else {
                    texture.setWrapST(WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE);
                }
                texture.setMinMagFilter(WebGLRenderingContext.NEAREST, WebGLRenderingContext.NEAREST_MIPMAP_NEAREST);
                mix = 1;
            }
        }
        rc.uniform1f('MapKdMix', mix);
        xor.meshes.render(this.render.meshName, rc);
    }
}
const Player1 = 1;
const Player2 = 2;
const Player1Spear = 3;
const Player2Spear = 4;
const APHead1 = 20;
const APCount = 10;
const APArm1 = 30;
const APArmSegments = 10;
const APBubble1 = 300;
const Fish1 = 500;
const FishCount = 128;
const FishBottom = -45;
const FishTop = -15;
const FishRange = FishTop - FishBottom;
const PlayerBottom = FishBottom - 5;
const PlayerTop = FishTop + 2;
const PlayerLeft = -9;
const PlayerRight = 8;
const BackdropStart = 900;
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
    constructor(numHeads, numSegments, storminess) {
        this.numHeads = numHeads;
        this.numSegments = numSegments;
        this.storminess = storminess;
        this.playerPosition = GTE.vec3(0, FishBottom + 5, gmZDistance + 0.1);
        this.plantoidPosition = Vector3.make(0, FishBottom - 5, gmZDistance);
        this.angles = [230, 190, 70, 25, 80, 10, 260, 100, 120, 160];
        this.angles1 = [-10, -10, -10, -10, -10, -10, -10, -10, -10, -10];
        this.angles2 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
        this.plantoidHealths = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        this.plantoidHungers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        for (let i = 0; i < this.angles.length; i++) {
            this.angles[i] += randBetween(this.angles1[i], this.angles2[i]);
        }
        for (let i = 0; i < numSegments; i++) {
            this.plantoidHealths[i] = (Math.random() * numSegments) | 0;
        }
    }
    sway(i, sin) {
        return this.angles[i] + mix(this.angles1[i], this.angles2[i], sin);
    }
}
const levels = [
    new LevelInfo(4, 6, 0.3), new LevelInfo(4, 4, 0.5), new LevelInfo(5, 5, 0.4),
    new LevelInfo(6, 5, 0.4), new LevelInfo(6, 6, 0.4), new LevelInfo(6, 10, 0.4)
];
class Game {
    constructor(xor, ecs, width, height) {
        this.xor = xor;
        this.ecs = ecs;
        this.width = width;
        this.height = height;
        this.bboxSizeOne = new GTE.BoundingBox(Vector3.make(-0.5, -0.5, -0.5), Vector3.make(0.5, 0.5, 0.5));
        this.components = new ComponentIDs();
        this.assemblages = new AssemblageIDs();
        this.entities = new Map();
        this.level = 1;
        this.levelInfo = levels[this.level];
        this.pauseGame = false;
        this.gameStarted = false;
        this.gameOver = false;
        this.gameOverTime = 0;
        this.plantoidHealths = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        this.plantoidHungers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.playerHealth = 20;
        this.playerBreath = 20;
        this.highestPlantY = FishBottom;
        this.numLives = 0;
        // Set up Assemblage for Physical Entities
        this.components.positionID =
            this.ecs.addComponent('position', 'Location of entity');
        this.components.physicsID =
            this.ecs.addComponent('physics', 'physics info of entity');
        this.components.renderID =
            this.ecs.addComponent('render', 'renderable info of entity');
        this.assemblages.physicalID = this.ecs.addAssemblage();
        this.ecs.addComponentToAssemblage(this.assemblages.physicalID, this.components.positionID);
        this.ecs.addComponentToAssemblage(this.assemblages.physicalID, this.components.physicsID);
        this.ecs.addComponentToAssemblage(this.assemblages.physicalID, this.components.renderID);
        // Create Player Entity
        this.createPhysical(Player1, 'player1', 'rect01', XOR.Color.WHITE, 'player1');
        // this.createPhysical(
        //     Player2, 'player2', 'rect01', XOR.Color.WHITE, 'player2');
        this.createPhysical(Player1Spear, 'player1spear', 'spear', XOR.Color.WHITE, 'spear1');
        // this.createPhysical(
        //     Player2Spear, 'player2spear', 'rect01', XOR.Color.WHITE, 'spear2');
        for (let i = BackdropStart; i < BackdropEnd; i++) {
            let e = this.createPhysical(i, 'backdrop' + i.toString(), 'bigrect', XOR.Color.WHITE, 'water');
            e.wrap = 0;
        }
        let b1 = this.entities.get(BackdropBlank1);
        let b2 = this.entities.get(BackdropBlank2);
        if (b1)
            b1.render.texture = 'water21';
        if (b2)
            b2.render.texture = 'water22';
        // Create Atlantoid Plantoid Entity
        for (let i = 0; i < APCount; i++) {
            // segments
            for (let j = 0; j < APArmSegments; j++) {
                let index = APArm1 + i * APCount + j;
                const armname = 'aparm' + (i + 1).toString() + (j + 1).toString();
                let textures = ['stem1', 'stem2', 'stem3'];
                let texture = textures[(Math.random() * textures.length) | 0];
                let e = this.createPhysical(index, armname, 'rect', XOR.Color.WHITE, texture);
                let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
                e.moveTo(p);
            }
            // heads
            {
                const j = APArmSegments;
                const headname = 'aphead' + (i + 1).toString();
                let textures = ['plantoid1', 'plantoid2', 'plantoid3', 'plantoid4'];
                let texture = textures[(Math.random() * textures.length) | 0];
                let e = this.createPhysical(APHead1 + i, headname, 'rect', XOR.Color.WHITE, texture);
                let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
                e.moveTo(p);
            }
            // bubbles
            {
                const j = APArmSegments + 2;
                let e = this.createPhysical(APBubble1 + i, 'bubble' + i.toString(), 'rect', XOR.Color.WHITE, 'bubble');
                let p = Vector3.make(i - APCount * 0.5, j, gmZDistance);
                e.moveTo(p);
            }
        }
        for (let i = 0; i < FishCount; i++) {
            let index = Fish1 + i;
            let e = this.createPhysical(index, 'fish' + i.toString(), 'rect01', XOR.Color.CYAN, 'fish1');
            this.spawnFish(e);
        }
    }
    get playerPosition() {
        let e = this.entities.get(Player1);
        if (e)
            return e.position.position;
        return Vector3.make(0, 0, 0);
    }
    get plantoidHealth() {
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
    createPhysical(index, name, meshName, colorIndex, textureName) {
        // Create entity and add assemblage
        let id = this.ecs.addEntity(name, 'player 1');
        this.ecs.addAssemblageToEntity(id, this.assemblages.physicalID);
        let ge = new GameEntity(this.ecs, this.components, id, new PositionComponent(Vector3.make(0, 0, 0), this.bboxSizeOne.clone()), new PhysicsComponent(Vector3.make(0, 0, 0), 1.0), new RenderComponent(meshName, Matrix4.makeIdentity(), XOR.Colors[colorIndex], textureName));
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
            if (data)
                components.push(data);
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
            if (data)
                components.push(data);
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
            if (data)
                components.push(data);
        }
        return components;
    }
    /**
     * initialize the game from nothing
     */
    init() { }
    /**
     * plays a sound effect
     * @param id which sample id to play
     */
    playSound(id) {
        this.xor.sound.sampler.playSample(id, false);
    }
    /**
     * plays a music file
     * @param id which music track to play
     */
    playMusic(id) {
        this.xor.sound.jukebox.volume = 0.5;
        this.xor.sound.jukebox.play(id);
    }
    /**
     * Reset the game to start at a certain level
     * @param level which level to begin at
     */
    reset(level) {
        if (this.numLives == 0) {
            if (level > levels.length)
                level = 1;
            this.level = level;
            this.levelInfo = levels[this.level - 1];
            this.numLives = 5;
            this.playMusic(MUS_GAME);
        }
        for (let i = 0; i < FishCount; i += 2) {
            let e = this.entities.get(Fish1 + i);
            if (e)
                this.spawnFish(e);
        }
        let e = this.player;
        e.moveTo(GTE.vec3(0, this.highestPlantY + 4, 0));
        e.dead = 0;
        this.playerBreath = 20;
        this.gameOver = false;
        this.gameStarted = true;
    }
    get player() {
        let e = this.entities.get(Player1);
        if (!e)
            throw 'No player!';
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
        }
        else {
            this.gameStarted = false;
        }
    }
    spawnFish(fe) {
        let textures = ['fish1', 'fish2', 'fish3', 'fish4'];
        let colors = [
            XOR.Color.RED, XOR.Color.GREEN, XOR.Color.GOLD, XOR.Color.YELLOW,
            XOR.Color.ORANGE
        ];
        fe.render.color = XOR.Colors[colors[(Math.random() * colors.length) | 0]];
        fe.render.texture = textures[(Math.random() * textures.length) | 0];
        fe.moveTo(GTE.vec3(Math.random() * this.width, Math.random() * FishRange + FishBottom, Math.random() * -6 + 3), 0);
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
            if (!e)
                continue;
            let x = 5.5 * (i - BackdropStart - BackdropCount * 0.5);
            let n = 0.2 * noise2(x, 0);
            let p = Vector3.make(x + n + 0.25 * Math.sin(theta), this.levelInfo.storminess * Math.sin(i + theta + n), -35); // bgZDistance);
            e.moveTo(p);
        }
        let p1 = this.entities.get(Player1);
        let b1 = this.entities.get(BackdropBlank1);
        if (b1 && p1) {
            let p = Vector3.make(Math.cos(0.1234 * theta), Math.sin(0.3456 * theta), -75);
            b1.moveTo(p);
        }
        let b2 = this.entities.get(BackdropBlank2);
        if (b2 && p1) {
            let p = Vector3.make(Math.cos(1 + 0.1234 * theta), Math.sin(1 + 0.3456 * theta), -75);
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
                if (!e)
                    continue;
                e.active = this.plantoidHealths[i] >= j ? 1 : 0;
            }
            for (let j = 0; j < numArmSegments; j++) {
                let index = APArm1 + i * APCount + j;
                let e = this.entities.get(index);
                if (!e)
                    continue;
                let odd = j & 1;
                e.moveTo(Vector3.make(x, y, gmZDistance + (odd ? -0.05 : 0.05)));
                if (j == numArmSegments - 1) {
                    x += phunger * travel * v.x;
                    y += phunger * travel * v.y;
                }
                else {
                    x += travel * v.x;
                    y += travel * v.y;
                }
            }
            // heads
            let he = this.entities.get(APHead1 + i);
            if (!he)
                continue;
            if (this.plantoidHealths[i] < 0)
                he.dead = 1;
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
                if (!e)
                    continue;
                e.moveTo(GTE.vec3(x, y, gmZDistance));
                if (he.dead)
                    e.dead = 1;
            }
        }
    }
    /**
     * Update the player that lives in the air bubble under the sea
     */
    updatePlayer() {
        let p1 = this.entities.get(Player1);
        if (!p1)
            return;
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
        if (p1.x <= PlayerLeft && p1.vx < 0)
            p1.vx = 0;
        if (p1.x >= PlayerRight && p1.vx > 0)
            p1.vx = 0;
        if (p1.y >= PlayerTop && p1.vy > 0)
            p1.vy = 0;
        if (p1.y <= PlayerBottom && p1.vy < 0)
            p1.vy = 0;
        this.playerBreath = GTE.clamp(this.playerBreath - PlayerBreathRate * this.xor.dt, 0, MaxPlayerBreath);
        if (this.playerBreath == 0 && !p1.dead) {
            this.loseGame();
            this.playSound(SFX_DEAD);
            p1.dead = 1;
        }
        p1.position.scale.y = p1.dead ? -1 : 1;
        if (p1.dead) {
            p1.vy = GTE.clamp(p1.vy, -1, 1);
            if (p1.y > PlayerBottom)
                p1.position.angleInDegrees += this.xor.dt * 10;
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
        if (!p1)
            return;
        let s1 = this.entities.get(Player1Spear);
        if (!s1)
            return;
        let offset = p1.direction > 0 ? Vector3.make(1.0, 0, 0) : Vector3.make(-0.5, 0, 0);
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
            if (!e)
                continue;
            if (e.dead) {
                e.y -= this.xor.dt;
                e.y = GTE.clamp(e.y, PlayerBottom, e.y);
                if (e.y == PlayerBottom)
                    e.vx = 0;
            }
            else {
                const fix = 2 * (PlayerRight - PlayerLeft);
                if (e.position.position.x < -PlayerLeft * 2)
                    e.position.position.x += fix;
                if (e.position.position.x > PlayerRight * 2)
                    e.position.position.x -= fix;
                e.position.position.y =
                    GTE.clamp(e.position.position.y + cos, FishBottom, FishTop);
                if (e.physics.velocity.x < 0)
                    e.direction = -1;
                if (e.physics.velocity.x > 0)
                    e.direction = 1;
                e.position.scale.x = e.direction;
                e.moveTo(e.position.position);
            }
        }
    }
    collideFishes() {
        let spearE = this.entities.get(Player1Spear);
        if (!spearE)
            return;
        let spear = GTE.vec3(spearE.x, spearE.y, 0);
        for (let i = 0; i < FishCount; i++) {
            let fe = this.entities.get(Fish1 + i);
            if (!fe)
                continue;
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
                    if (!ape)
                        continue;
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
                if (fe.eatingTime < this.xor.t1)
                    fe.active = 0;
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
        if (!pe)
            return;
        if (!pe.dead) {
            let pep = GTE.vec3(pe.x, pe.y, 0);
            for (let ap = 0; ap < APCount; ap++) {
                let ape = this.entities.get(APHead1 + ap);
                if (!ape)
                    continue;
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
                    this.playSound(SFX_BUBBLE1 + (Math.random() > 0.5 ? 1 : 0));
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
    update(dt) {
        this.updateBackground();
        this.updatePlantoid();
        this.updatePlayer();
        this.updateFishes();
        for (let e of this.entities) {
            e[1].update(dt);
            if (!e[1].landed && e[1].y == PlayerBottom) {
                this.playSound(SFX_DOOP);
                e[1].landed = 1;
            }
            else if (e[1].y > PlayerBottom)
                e[1].landed = 0;
        }
        this.updateSpears();
        this.collide();
    }
    /**
     * Draw the game
     * @param rc render config to draw with
     */
    draw(rc) {
        for (let e of this.entities) {
            if (e[1].active)
                e[1].draw(this.xor, rc);
        }
    }
}
///* global XOR Vector3 Matrix4 BoundingBox createButtonRow createRangeRow
/// setIdToHtml createCheckRow createDivRow setDivRowContents getCheckValue */
/// <reference path="../../LibXOR/LibXOR.d.ts" />
/// <reference path="htmlutils.ts" />
/// <reference path="ecs.ts" />
/// <reference path="components.ts" />
/// <reference path="game.ts" />
class Camera {
    constructor() {
        this.eye = Vector3.make(0, 0, 10);
        this.target = Vector3.make(0, 0, 0);
        this.up = Vector3.make(0, 1, 0);
    }
    update(p) {
        this.target.x = GTE.clamp(this.target.x, p.x - 1, p.x + 1);
        this.target.y = GTE.clamp(this.target.y, p.y - 1, p.y + 1);
        this.eye.x =
            GTE.clamp(this.eye.x, this.target.x - 0.1, this.target.x + 0.1);
        this.eye.y =
            GTE.clamp(this.eye.y, this.target.y - 0.1, this.target.y + 0.1);
        this.eye.x = GTE.clamp(this.eye.x, PlayerLeft, PlayerRight);
        this.eye.y = GTE.clamp(this.eye.y, PlayerBottom + 2, PlayerTop - 2);
    }
    get matrix() {
        return Matrix4.makeLookAt(this.eye, this.target, this.up);
    }
}
class App {
    constructor() {
        this.parentID = 'game';
        this.xor = new LibXOR(this.parentID);
        this.width = 640;
        this.height = 512;
        // hudCanvas = document.createElement('canvas');
        this.hudCanvas = new OffscreenCanvas(this.width, this.height);
        this.theta = 0;
        this.mouse = Vector3.make(0, 0, 0);
        this.click = Vector3.make(0, 0, 0);
        this.euroKeys = 0;
        this.xmoveKeys = [['KeyA', 'KeyD'], ['KeyQ', 'KeyD']];
        this.zmoveKeys = [['KeyW', 'KeyS'], ['KeyZ', 'KeyS']];
        this.zturnKeys = [['KeyQ', 'KeyE'], ['KeyA', 'KeyE']];
        this.ymoveKeys = [['KeyC', 'KeyZ'], ['KeyC', 'KeyW']];
        this.yturnKeys = [['ArrowLeft', 'ArrowRight'], ['ArrowLeft', 'ArrowRight']];
        this.xturnKeys = [['ArrowUp', 'ArrowDown'], ['ArrowUp', 'ArrowDown']];
        this.p1x = 0;
        this.p2x = 0;
        this.p1y = 0;
        this.p2y = 0;
        this.ENTERbutton = 0;
        this.BACKbutton = 0;
        this.SPACEbutton = 0;
        this.TABbutton = 0;
        this.help = true;
        this.loading = true;
        this.cameraZoom = 0;
        this.camera = new Camera();
        this.ecs = new XOR.ECS();
        // components = new ComponentIDs();
        // assemblages = new AssemblageIDs();
        // player1ID = 0;
        // player2ID = 0;
        this.game = new Game(this.xor, this.ecs, this.width, this.height);
        // this.hudCanvas.style.position = 'absolute';
        // this.hudCanvas.style.zIndex = '5';
        let ctx = this.hudCanvas.getContext('2d');
        if (!ctx)
            throw 'Unable to create 2D Canvas';
        this.hud2D = ctx;
        setIdToHtml(this.parentID, '<p>This is a test of the LibXOR retro console.</p>');
        let self = this;
        let controls = document.getElementById('controls');
        if (!controls)
            throw 'controls element does not exist';
        createButtonRow(controls, 'bReset', 'Reset', () => {
            self.reset(1);
        });
        createButtonRow(controls, 'bNextLevel', 'Next Level', () => {
            self.xor.resetClock();
            let level = this.game.level + 1;
            this.help = true;
            self.ecs = new XOR.ECS();
            self.game = new Game(this.xor, this.ecs, this.width, this.height);
            self.reset(level);
        });
        createButtonRow(controls, 'bZSDF', 'ZSDF/WASD', () => {
            self.euroKeys = 1 - self.euroKeys;
        });
        createRangeRow(controls, 'fBreathRate', 0.40, 0.0, 1.0, 0.01);
        createRangeRow(controls, 'fEatRate', 0.05, 0.0, 1.0, 0.01);
        createRangeRow(controls, 'fKillDistance', 1.5, 1.0, 2.0, 0.05);
        // createRangeRow(controls, 'fZoom', 0.0, 0.0, 1.0, 0.01);
        // createCheckRow(controls, 'zasdKeys', false);
        // createRangeRow(controls, 'SOffsetX', 0, -8, 8);
        // createRangeRow(controls, 'SOffsetY', 0, -8, 8);
        // createRangeRow(controls, 'SZoomX', 1.0, 0.0, 4.0, 0.1);
        // createRangeRow(controls, 'SZoomY', 1.0, 0.0, 4.0, 0.1);
        // createRangeRow(controls, 'playTrack', 0, 0, 7);
        // createRangeRow(controls, 'sfxTrack', 0, 0, 15);
        // createButtonRow(controls, 'bPlayTrack', 'Play Track', () => {
        //   self.playMusic(getRangeValue('playTrack'));
        // });
        // createButtonRow(controls, 'bPlaySFX', 'Play SFX', () => {
        //   self.playSfx(getRangeValue('sfxTrack'));
        // });
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
    getAxis(keysToCheck) {
        let neg = this.xor.input.checkKeys([keysToCheck[this.euroKeys][0]]);
        let pos = this.xor.input.checkKeys([keysToCheck[this.euroKeys][1]]);
        return pos - neg;
    }
    /**
     * playMusic(index)
     * @param {number} index Which slot to start playing
     */
    playMusic(index) {
        this.xor.sound.jukebox.play(index | 0);
    }
    /**
     * playSfx(index)
     * @param {number} index Which slot to start playing
     */
    playSfx(index) {
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
        this.loadMusic();
        this.loadSounds();
        this.loadGraphics();
        this.reset();
    }
    loadGraphics() {
        this.xor.renderconfigs.load('default', 'shaders/basic.vert', 'shaders/libxor.frag');
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
        this.xor.fluxions.textures.load('help', 'instructions.png');
        this.xor.fluxions.textures.load('seawall', 'images/seawall.png');
        this.xor.fluxions.textures.load('seafloor', 'images/seafloor.png');
        this.xor.fluxions.textures.load('spear1', 'images/spear1.png');
        this.xor.fluxions.textures.load('spear2', 'images/spear2.png');
        this.xor.fluxions.textures.load('bubble', 'images/bubble.png');
        this.xor.fluxions.textures.load('water', 'images/water.png');
        this.xor.fluxions.textures.load('water21', 'images/water2_layer1.png');
        this.xor.fluxions.textures.load('water22', 'images/water2_layer2.png');
        for (let i = 1; i <= 4; i++) {
            this.xor.fluxions.textures.load('stem' + i.toString(), 'images/stem' + i.toString() + '.png');
            this.xor.fluxions.textures.load('plantoid' + i.toString(), 'images/plantoid' + i.toString() + '.png');
        }
        for (let i = 1; i <= 4; i++) {
            this.xor.fluxions.textures.load('fish' + i.toString(), 'images/fishes_' + i.toString() + '.png');
        }
        this.xor.fluxions.textures.load('player1', 'images/player1.png');
        this.xor.fluxions.textures.load('player2', 'images/parrot.png');
    }
    loadSounds() {
        this.xor.sound.sampler.loadSample(SFX_DOOP, 'sounds/sfx_doop.wav');
        this.xor.sound.sampler.loadSample(SFX_BEEP, 'sounds/sfx_beep.wav');
        this.xor.sound.sampler.loadSample(SFX_ERCK, 'sounds/sfx_erck.wav');
        this.xor.sound.sampler.loadSample(SFX_POOF, 'sounds/sfx_poof.wav');
        this.xor.sound.sampler.loadSample(SFX_DEAD, 'sounds/sfx_dead.wav');
        this.xor.sound.sampler.loadSample(SFX_BUBBLE1, 'sounds/sfx_bubble1.wav');
        this.xor.sound.sampler.loadSample(SFX_BUBBLE2, 'sounds/sfx_bubble2.wav');
        this.xor.sound.sampler.loadSample(SFX_EATEN1, 'sounds/sfx_plantoid1.wav');
        this.xor.sound.sampler.loadSample(SFX_EATEN2, 'sounds/sfx_plantoid2.wav');
        this.xor.sound.sampler.loadSample(SFX_EATEN3, 'sounds/sfx_plantoid3.wav');
        this.xor.sound.sampler.loadSample(SFX_EATEN4, 'sounds/sfx_plantoid4.wav');
        this.xor.sound.sampler.loadSample(SFX_FishDead1, 'sounds/sfx_fishdead1.wav');
        this.xor.sound.sampler.loadSample(SFX_FishDead2, 'sounds/sfx_fishdead2.wav');
        this.xor.sound.sampler.loadSample(SFX_FishDead3, 'sounds/sfx_fishdead3.wav');
        this.xor.sound.sampler.loadSample(SFX_FishDead4, 'sounds/sfx_fishdead4.wav');
    }
    /**
     * loadMusic using the sound jukebox
     */
    loadMusic() {
        this.xor.sound.jukebox.add(MUS_WAVE, 'music/atlantoid_noise.mp3', true, false);
        this.xor.sound.jukebox.add(MUS_GAME, 'music/atlantoid_plantoid.mp3', true, false);
        // this.xor.sound.jukebox.add(1, 'music/maintheme.mp3', true, false);
        // this.xor.sound.jukebox.add(2, 'music/adventuretheme.mp3', true, false);
        // this.xor.sound.jukebox.add(3, 'music/arcadetheme.mp3', true, false);
    }
    /**
     * reset game back to initial conditions
     */
    reset(level = 1) {
        this.xor.t0 = this.xor.t1;
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
        this.xor.resetClock();
        this.game.reset(level);
        this.game.pauseGame = false;
    }
    /**
     * start the main loop
     */
    start() {
        this.game.gameStarted = false;
        this.game.update(0);
        this.mainloop();
    }
    /**
     * update the game
     * @param dt time elapsed since last frame in seconds
     */
    update(dt) {
        var _a, _b;
        let xor = this.xor;
        xor.input.poll();
        this.updateControls();
        // if (xor.input.checkKeys([' ', 'Space'])) {
        //   this.reset();
        // }
        // if (xor.input.mouseOver && xor.input.mouseButtons.get(0))
        //   this.ENTERbutton = 1;
        // else
        this.ENTERbutton = xor.input.checkKeys(['Enter', 'Return']);
        if (this.ENTERbutton)
            xor.input.resetKeys(['Enter', 'Return']);
        if (this.help) {
            if (!this.ENTERbutton)
                return;
            this.help = false;
        }
        if (!this.game.gameStarted || this.game.gameOver) {
            if (xor.input.checkKeys(['Enter', 'Return'])) {
                xor.input.resetKeys(['Enter', 'Return']);
                this.game.reset(1);
            }
            this.game.update(dt);
            return;
        }
        if (xor.input.checkKeys(['Escape'])) {
            if (xor.triggers.get('ESC').tick(xor.t1)) {
                this.game.pauseGame = !this.game.pauseGame;
            }
        }
        if (xor.input.checkKeys(['Space'])) {
            xor.input.resetKeys(['Space']);
            if (xor.triggers.get('SPC').tick(xor.t1)) {
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
        let pe = this.game.entities.get(Player1);
        if (!pe)
            return;
        let p1 = (_a = this.game.entities.get(Player1)) === null || _a === void 0 ? void 0 : _a.physics;
        let p2 = (_b = this.game.entities.get(Player2)) === null || _b === void 0 ? void 0 : _b.physics;
        if (p1 && !pe.dead) {
            p1.velocity.reset(this.p1x, -this.p1y, 0);
        }
        for (let i = 0; i < 4; i++) {
            let spr = xor.graphics.sprites[2 + i];
            let gp = xor.input.gamepads.get(i);
            if (gp && gp.enabled) {
                spr.enabled = true;
                spr.position.x += gp.axe(0) * dt * 10;
                spr.position.y += gp.axe(1) * dt * 10;
                if (p1 && !pe.dead)
                    p1.velocity.reset(gp.axe(0), gp.axe(1), 0);
            }
            else {
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
        }
        else if (xor.input.touches[0].pressed) {
            let w = xor.graphics.width >> 1;
            let h = xor.graphics.height >> 1;
            this.click.reset(xor.input.touches[0].x - w, -xor.input.touches[0].y + h, 0);
        }
        else {
            this.click.reset(this.p2x, -this.p2y, 0);
        }
        if (p2) {
            p2.velocity = Vector3.makeUnit(this.click.x, this.click.y, 0);
        }
        if (!this.game.pauseGame) {
            this.game.update(dt);
        }
        this.theta += dt;
    }
    /**
     * update the controls from the web page
     */
    updateControls() {
        let xor = this.xor;
        // xor.graphics.setOffset(
        //     getRangeValue('SOffsetX'), getRangeValue('SOffsetY'));
        // xor.graphics.setZoom(getRangeValue('SZoomX'), getRangeValue('SZoomY'));
        // this.cameraZoom = getRangeValue('fZoom');
        PlantoidEatRate = getRangeValue('fEatRate');
        PlayerBreathRate = getRangeValue('fBreathRate');
        APKillDistance = getRangeValue('fKillDistance');
        setDivLabelValue('bNextLevel', this.game.level.toString());
    }
    /**
     * render the 3D graphics for the game
     */
    render() {
        var _a, _b;
        let xor = this.xor;
        xor.graphics.clear(XOR.Color.AZURE, XOR.Color.WHITE, 5);
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
            (_a = this.xor.fluxions.textures.get('seawall')) === null || _a === void 0 ? void 0 : _a.bindUnit(0);
            rc.uniformMatrix4f('WorldMatrix', Matrix4.makeScale(0.5, 0.5, 0.5));
            this.xor.meshes.render('seawall', rc);
            (_b = this.xor.fluxions.textures.get('seafloor')) === null || _b === void 0 ? void 0 : _b.bindUnit(0);
            this.xor.meshes.render('seafloor', rc);
            this.game.draw(rc);
            rc.restore();
        }
    }
    drawText(text, y, color, shadowOffset, alpha) {
        let tm = this.hud2D.measureText(text);
        let cx = ((this.width - tm.width) >> 1);
        let a = GTE.clamp((255.99 * alpha) | 0, 0, 255).toString(16);
        if (a.length == 1)
            a = '0' + a;
        if (shadowOffset > 0) {
            this.hud2D.fillStyle = '#000000' + a;
            this.hud2D.fillText(text, cx - shadowOffset, y - shadowOffset);
        }
        this.hud2D.fillStyle = color + a;
        this.hud2D.fillText(text, cx, y);
    }
    drawTextLeft(text, x, y, color) {
        this.hud2D.fillStyle = color;
        this.hud2D.fillText(text, x, y);
    }
    drawMeter(percent, x, y, w, h, stroke, fill, label) {
        this.hud2D.strokeStyle = stroke;
        this.hud2D.fillStyle = fill;
        this.hud2D.fillRect(x, y, (w * percent) | 0, h);
        this.hud2D.strokeRect(x, y, w, h);
        this.hud2D.font = (h - 4).toString() + 'px Pedrita';
        this.drawTextLeft(label, x + 6, y + h - 2, '#000000');
        this.drawTextLeft(label, x + 10, y + h - 6, '#ffffff');
    }
    /**
     * Render the 2D overlay for the game
     */
    renderHUD() {
        var _a;
        // this.hudCanvas.style.position = '0 0';
        let xor = this.xor;
        let gl = this.xor.fluxions.gl;
        let ox = 2 + 2 * (0.5 + 0.5 * Math.cos(this.xor.t1));
        let cycle = 0.75 + 0.25 * Math.cos(this.xor.t1);
        this.hud2D.clearRect(0, 0, this.width, this.height);
        this.hud2D.font = '64px Pedrita';
        if (this.xor.t1 < 10) {
            let t = this.xor.t1 < 5 ? 1 : 1 - (this.xor.t1 - 5) / 5.0;
            let green = xor.palette.getHtmlColor(GTE.vec3(0, cycle, 0));
            let red = xor.palette.getHtmlColor(GTE.vec3(cycle, 0, 0));
            this.drawText('Atlantoid', 64, green, ox, t);
            this.drawText('Plantoid', 128, red, ox, t);
        }
        this.hud2D.font = '32px Pedrita';
        this.drawTextLeft('Lives: ' + this.game.numLives.toString(), 0, 32, '#ffffff');
        if (this.loading) {
            let color = this.xor.palette.getHtmlColor(GTE.vec3(cycle, cycle, cycle));
            this.hud2D.font = '64px Pedrita';
            this.drawText('Loading', 256, color, 4, 1);
        }
        if (this.game.pauseGame) {
            let color = this.xor.palette.getHtmlColor(GTE.vec3(cycle, cycle, cycle));
            this.hud2D.font = '64px Pedrita';
            this.drawText('Paused', 256, color, 4, 1);
        }
        if (!this.game.gameStarted) {
            let color = this.xor.palette.getHtmlColor(GTE.vec3(cycle, cycle, cycle));
            this.hud2D.font = '64px Pedrita';
            this.drawText('Want to Play?', 256, color, 4, 1);
            this.hud2D.font = '48px Pedrita';
            this.drawText('Press ENTER to Start', 320, color, 4, 1);
        }
        if (this.game.gameOver) {
            let fade = this.xor.t1 - this.game.gameOverTime;
            let color = this.xor.palette.getHtmlColor(GTE.vec3(cycle, cycle, cycle));
            this.hud2D.font = '64px Pedrita';
            this.drawText('Game Over!', 256, color, 4, fade);
            this.hud2D.font = '48px Pedrita';
            this.drawText('Press ENTER to Start', 320, color, 4, fade);
        }
        // render breath
        this.drawMeter(this.game.playerBreath / MaxPlayerBreath, this.width - 204, 4, 200, 32, '#0000ff', '#0072E4', 'Air');
        this.drawMeter(this.game.plantoidHealth, (this.width >> 1) - 200, 4, 200, 32, '#00ff00', '#00ff00', 'AP');
        // render creature health
        for (let i = 0; i < this.game.levelInfo.numHeads; i++) {
            this.drawTextLeft(this.game.plantoidHealths[i].toString() + '/' +
                this.game.plantoidHungers[i].toFixed(2), i * 80, 64, '#ffffff');
        }
        let image = this.hud2D.getImageData(0, 0, 640, 512);
        let rc = xor.renderconfigs.use('default');
        let texture = gl.createTexture();
        if (texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
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
            if (this.help) {
                (_a = this.xor.fluxions.textures.get('help')) === null || _a === void 0 ? void 0 : _a.bindUnit(0);
                xor.meshes.render('rect', rc);
            }
            else {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                xor.meshes.render('rect', rc);
            }
            rc.restore();
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.deleteTexture(texture);
    }
    /**
     * delay the main thread by zero or more milliseconds
     * @param ms time in milliseconds
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * repeatedly poll input, update game logic, render graphics, and render the
     * HUD
     */
    mainloop() {
        let self = this;
        window.requestAnimationFrame((t) => __awaiter(this, void 0, void 0, function* () {
            self.xor.startFrame(t);
            if (this.xor.textfiles.loaded && this.xor.fluxions.textures.loaded &&
                this.xor.sound.loaded) {
                this.loading = false;
                self.xor.input.poll();
                self.xor.sound.update();
                self.update(self.xor.dt);
                self.render();
            }
            else {
                this.loading = true;
            }
            self.renderHUD();
            yield self.delay(1);
            self.mainloop();
        }));
    }
}
/**
 * Called by the web page to start the game. If we do not do this, then we don't
 * get an active event to use sound.
 */
function startGame() {
    let app = new App();
    app.init();
    // while (!app.xor.fluxions.textures.loaded) {
    //   app.delay(5);
    // }
    // while (!app.xor.textfiles.loaded) {
    //   app.delay(5);
    // }
    app.start();
}
//# sourceMappingURL=game.js.map