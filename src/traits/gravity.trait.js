import Trait from './Trait.js';
export default class GravityTrait extends Trait {
    update(entity, {dt, level}) {
        entity.vel.y += level.gravity * entity.mass * dt;
    }
}
