import Trait from './Trait.js';
export default class GravityTrait extends Trait {
    update(entity, {dt, scene}) {
        entity.vel.y += scene.gravity * entity.mass * dt;
    }
}
