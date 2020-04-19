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
const APHead2 = 21;
const APHead3 = 22;
const APHead4 = 23;
const APHeadCount = 4;
const APArm1 = 30;
const APArm2 = 31;
const APArm3 = 32;
const APArm4 = 33;
const APArmCount = 4;
const APArmSegments = 3;
const Fish1 = 100;
const FishCount = 100;
const BackdropStart = 200;
const BackdropCount = 50;
const BackdropEnd = BackdropStart + BackdropCount;
const BackdropBlank1 = BackdropEnd + 1;
const BackdropBlank2 = BackdropEnd + 2;
const bgZDistance = -14;
const gmZDistance = -4;
class LevelInfo {
    constructor(numHeads, storminess) {
        this.numHeads = numHeads;
        this.storminess = storminess;
        this.plantoidPosition = Vector3.make(0, -8, gmZDistance);
    }
}
const levels = [new LevelInfo(1, 0.1), new LevelInfo(2, 1.0), new LevelInfo(3, 0.5)];
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
            this.createPhysical(i, 'backdrop' + i.toString(), 'rect', XOR.Color.WHITE, 'water');
        }
        let b1 = this.entities.get(BackdropBlank1);
        let b2 = this.entities.get(BackdropBlank2);
        if (b1)
            b1.render.texture = 'water21';
        if (b2)
            b2.render.texture = 'water22';
        // Create Atlantoid Plantoid Entity
        for (let i = 0; i < APHeadCount; i++) {
            for (let j = 0; j < APArmSegments; j++) {
                let index = APArm1 + i * APArmCount + j;
                const armname = 'aparm' + (i + 1).toString() + (j + 1).toString();
                let textures = ['stem1', 'stem2', 'stem3'];
                let texture = textures[(Math.random() * textures.length) | 0];
                let e = this.createPhysical(index, armname, 'rect01', XOR.Color.WHITE, texture);
                let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
                e.moveTo(p);
            }
            {
                const j = APArmSegments;
                const headname = 'aphead' + (i + 1).toString();
                let textures = ['plantoid1', 'plantoid2', 'plantoid3'];
                let texture = textures[(Math.random() * textures.length) | 0];
                let e = this.createPhysical(APHead1 + i, headname, 'rect01', XOR.Color.WHITE, texture);
                let p = Vector3.make(i - APHeadCount * 0.5, j, gmZDistance);
                e.moveTo(p);
            }
        }
    }
    get playerPosition() {
        let e = this.entities.get(Player1);
        if (e)
            return e.position.position;
        return Vector3.make(0, 0, 0);
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
     * Reset the game to start at a certain level
     * @param level which level to begin at
     */
    reset(level) {
        if (level > levels.length)
            level = 1;
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
            if (!e)
                continue;
            let x = 1.5 * (i - BackdropStart - BackdropCount * 0.5);
            let n = 0.2 * noise2(x, 0);
            let p = Vector3.make(x + n + 0.25 * Math.sin(theta), this.levelInfo.storminess * Math.sin(i + theta + n), bgZDistance);
            e.moveTo(p);
        }
        let p1 = this.entities.get(Player1);
        let b1 = this.entities.get(BackdropBlank1);
        if (b1 && p1) {
            let p = p1.position.position.add(Vector3.make(Math.cos(0.1234 * theta), Math.sin(0.3456 * theta), -1));
            b1.moveTo(p);
        }
        let b2 = this.entities.get(BackdropBlank2);
        if (b2 && p1) {
            let p = p1.position.position.add(Vector3.make(Math.cos(1 + 0.1234 * theta), Math.sin(1 + 0.3456 * theta), -1));
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
                if (!e)
                    continue;
                e.moveTo(Vector3.make(x, y, gmZDistance));
                x += travel * v.x;
                y += travel * v.y;
            }
            {
                let e = this.entities.get(APHead1 + i);
                if (!e)
                    continue;
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
        if (!p1)
            return;
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
        if (!p1)
            return;
        let s1 = this.entities.get(Player1Spear);
        if (!s1)
            return;
        let offset = p1.direction > 0 ? Vector3.make(1.0, 0, 0) : Vector3.make(-0.5, 0, 0);
        let p = p1.position.position.add(offset);
        s1.position.scale.copy(Vector3.make(p1.direction, 1, 1));
        s1.moveTo(p, p1.position.angleInDegrees);
    }
    /**
     * Update the fishes that live under the sea
     */
    updateFishes() { }
    /**
     * Update the game
     * @param dt elapsed time since last frame
     */
    update(dt) {
        this.updateBackground();
        this.updatePlantoid();
        this.updatePlayer();
        this.updateSpears();
        for (let e of this.entities) {
            e[1].update(dt);
        }
    }
    /**
     * Draw the game
     * @param rc render config to draw with
     */
    draw(rc) {
        for (let e of this.entities) {
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
class App {
    constructor() {
        this.parentID = 'game';
        this.xor = new LibXOR(this.parentID);
        this.width = 640;
        this.height = 512;
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
        this.cameraZoom = 0;
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
        this.xor.renderconfigs.load('default', 'shaders/basic.vert', 'shaders/libxor.frag');
        let bbox = new GTE.BoundingBox();
        bbox.add(Vector3.make(-0.5, -0.5, -0.5));
        bbox.add(Vector3.make(0.5, 0.5, 0.5));
        // this.xor.meshes.load('dragon', 'models/dragon.obj', bbox, null);
        // this.xor.meshes.load('bunny', 'models/bunny.obj', bbox, null);
        this.xor.meshes.load('box', 'models/box.obj', null, null);
        this.xor.meshes.load('rect', 'models/rect.obj', null, null);
        this.xor.meshes.load('rect01', 'models/rect01.obj', null, null);
        this.xor.meshes.load('spear', 'models/spear.obj', null, null);
        this.xor.meshes.load('seabackdrop', 'models/seabackdrop.obj', null, null);
        this.xor.fluxions.textures.defaultWrapS =
            WebGLRenderingContext.CLAMP_TO_EDGE;
        this.xor.fluxions.textures.defaultWrapT =
            WebGLRenderingContext.CLAMP_TO_EDGE;
        this.xor.fluxions.textures.load('spear1', 'images/spear1.png');
        this.xor.fluxions.textures.load('spear2', 'images/spear2.png');
        this.xor.fluxions.textures.load('water', 'images/water.png');
        this.xor.fluxions.textures.load('water21', 'images/water2_layer1.png');
        this.xor.fluxions.textures.load('water22', 'images/water2_layer2.png');
        for (let i = 1; i <= 3; i++) {
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
    reset(level = 1) {
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
    update(dt) {
        var _a, _b;
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
        let p1 = (_a = this.game.entities.get(Player1)) === null || _a === void 0 ? void 0 : _a.physics;
        let p2 = (_b = this.game.entities.get(Player2)) === null || _b === void 0 ? void 0 : _b.physics;
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
                if (p1)
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
        this.game.update(dt);
        this.theta += dt;
    }
    /**
     * update the controls from the web page
     */
    updateControls() {
        let xor = this.xor;
        xor.graphics.setOffset(getRangeValue('SOffsetX'), getRangeValue('SOffsetY'));
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
        let target = this.game.playerPosition;
        let pmatrix = Matrix4.makePerspectiveY(45.0, 1.5, 1.0, 100.0);
        let cmatrix = Matrix4.makeOrbit(-90, 0, 5.0);
        cmatrix = Matrix4.makeLookAt(Vector3.make(0, 0, 10 + this.cameraZoom), target, Vector3.make(0, 1, 0));
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
            this.xor.meshes.render('seabackdrop', rc);
            this.game.draw(rc);
            rc.restore();
        }
    }
    drawText(text, y, color, shadowOffset) {
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
            self.xor.input.poll();
            self.xor.sound.update();
            self.update(self.xor.dt);
            self.render();
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
    app.start();
}
//# sourceMappingURL=game.js.map