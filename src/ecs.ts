/// <reference path="../../LibXOR/LibXOR.d.ts" />

namespace XOR {
  export class ComponentInfo {
    constructor(readonly id: number, public name: string, public desc: string) {
    }
  }

  export class EntityInfo {
    components = new Set<number>()
    constructor(readonly id: number, public name: string, public desc: string) {
    }
  }

  export class ECS {
    entities = new Map<number, EntityInfo>()
    newEntityIndex = 0

    components = new Map<number, ComponentInfo>()
    newComponentIndex = 0

    assemblages = new Map<number, Set<number>>()
    assemblagesEntities = new Map<number, Set<number>>()
    newAssemblageIndex = 0

    componentEntityData = new Map<number, Map<number, any>>()

    /**
     * @constructor
     */
    constructor() {}

    /**
     *
     * @param name name of the entity
     * @param desc a helpful debugging description
     */
    addEntity(name: string, desc: string): number {
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
    addAssemblageToEntity(entityID: number, assemblageID: number): number {
      let assemblage = this.assemblages.get(assemblageID);
      if (!assemblage) return 0;
      let addedCount = 0;
      for (let componentID of assemblage) {
        this.addEntityComponent(entityID, componentID);
        addedCount++;
      }
      let entities = this.assemblagesEntities.get(assemblageID)
      if (entities) entities.add(entityID);
      return addedCount;
    }

    /**
     *
     * @param assemblageID the index of the assembly
     * @returns {Iterable<number} an iterable of entityIDs
     */
    getEntitiesWithAssemblage(assemblageID: number): Iterable<number> {
      let entities = this.assemblagesEntities.get(assemblageID);
      if (!entities) return new Set<number>().keys();
      return entities.keys();
    }

    /**
     *
     * @param name the name of the component
     * @param desc a helpful debugging description
     */
    addComponent(name: string, desc: string) {
      let id = ++this.newComponentIndex;
      this.components.set(id, new ComponentInfo(id, name, desc));
      // create a set for entities
      this.componentEntityData.set(id, new Map<number, any>());
      return id;
    }

    getEntitiesWithComponent(componentID: number): IterableIterator<number> {
      let entities = this.componentEntityData.get(componentID);
      if (!entities) return new Set<number>().keys();
      return entities.keys()
    }

    getEntitiesWithComponents(componentIDs: number[]):
        IterableIterator<number> {
      let C: Map<number, any>[] = [];
      for (let cID of componentIDs) {
        let component = this.componentEntityData.get(cID);
        if (!component) return new Set<number>().keys();
        C.push(component)
      }
      let c = this.componentEntityData.get(componentIDs[0]);
      if (!c) return new Set<number>().keys();
      let srckeys = c.keys()
      let entities = new Set<number>();
      for (let k of srckeys) {
        let i = 0;
        for (; i < C.length; i++) {
          if (!C[i].has(k)) {
            break;
          }
        }
        if (i != componentIDs.length) continue;
        entities.add(k);
      }
      return entities.keys()
    }

    addEntityComponent(entityID: number, componentID: number): boolean {
      let entity = this.entities.get(entityID);
      if (!entity) return false;
      entity.components.add(componentID);
      return this.setComponentData(entityID, componentID, null)
    }

    deleteEntityComponent(entityID: number, componentID: number): boolean {
      let entity = this.entities.get(entityID);
      if (!entity) return false;
      if (!entity.components.has(componentID)) return false;
      let ced = this.componentEntityData.get(componentID);
      if (ced) ced.delete(entityID);
      entity.components.delete(componentID);
      return true;
    }

    setComponentData(entityID: number, componentID: number, componentData: any):
        boolean {
      let entity = this.entities.get(entityID);
      if (!entity) return false;
      // entity has component, is it empty?
      let entityData = this.componentEntityData.get(componentID)
      if (!entityData) {
        return false;
      }
      entityData.set(entityID, componentData)
      return true
    }

    getComponentData(entityID: number, componentID: number): any {
      let ced = this.componentEntityData.get(componentID);
      if (!ced) return null;
      let entityData = ced.get(entityID);
      if (!entityData) return null;
      return entityData;
    }

    addAssemblage(): number {
      let id = ++this.newAssemblageIndex;
      this.assemblages.set(id, new Set<number>());
      this.assemblagesEntities.set(id, new Set<number>())
      return id
    }

    deleteAssemblage(assemblageID: number): boolean {
      let a = this.assemblages.get(assemblageID);
      if (!a) return false;
      this.assemblages.delete(assemblageID);
      return true
    }

    addComponentToAssemblage(assemblageID: number, componentID: number):
        boolean {
      let a = this.assemblages.get(assemblageID);
      if (!a) return false;
      a.add(componentID);
      return true
    }
  }
}
