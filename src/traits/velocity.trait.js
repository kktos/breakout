import Trait from './Trait.js';
export default class VelocityTrait extends Trait {
    update(entity, {dt}) {
        if(entity.isFixed)
            return;
        entity.left += entity.vel.x * dt;
        entity.top += entity.vel.y * dt;
    }
}
