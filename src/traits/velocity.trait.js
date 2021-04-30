import Trait from './trait.js';
export default class VelocityTrait extends Trait {
    update(entity, {dt}) {
        if(entity.isFixed)
            return;
        entity.pos.x += entity.vel.x * dt;
        entity.pos.y += entity.vel.y * dt;
    }
}
