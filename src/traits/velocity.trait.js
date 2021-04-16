import Trait from './Trait.js';
export default class VelocityTrait extends Trait {
    update(entity, {dt}) {
        entity.pos.x += entity.vel.x * dt;
        entity.pos.y += entity.vel.y * dt;
    }
}
