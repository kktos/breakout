import SceneFactory from './Scene.factory.js';
import Scene from './Scene.js';

export default class Director {
    constructor(gc) {
        this.sceneIndex= -1;
        this.scenes= [];
        this.gc= gc;
    }

    addScene(scene) {
        scene.events.on(Scene.EVENT_COMPLETE, (nameOrIdx) => {
            if(Number.isInteger(nameOrIdx)) {
                if(nameOrIdx<0)
                    this.runPrevious();
                else
                    this.runNext();
            }
            else
                this.run(nameOrIdx);
        });
        this.scenes.push(scene);
    }

    get currentScene() {
        return this.scenes[this.sceneIndex];
    }

    pauseScene() {
        if(!this.currentScene)
            return;
        this.currentScene.pause();
        this.currentScene.killOnExit && this.scenes.splice(this.sceneIndex, 1);
    }

    runPrevious() {
        this.pauseScene();
        this.sceneIndex--;
        if(this.sceneIndex<0)
            this.sceneIndex= 0;
        if(this.currentScene) {
            this.currentScene.init(this.gc);
            this.currentScene.run();
        }
    }
    runNext() {
        this.pauseScene();
        this.sceneIndex++;
        if(this.currentScene) {
            this.currentScene.init(this.gc);
            this.currentScene.run();
        }
    }

    run(name) {
        this.pauseScene();
        const sceneIdx= this.scenes.findIndex(scene => scene.name === name);
        if(sceneIdx>=0) {
            this.sceneIndex= sceneIdx;
            if(this.currentScene) {
                this.currentScene.init(this.gc);
                this.currentScene.run();
            }
            return;
        }

        SceneFactory.load(this.gc, name).then(scene => {
            this.addScene(scene);
            this.sceneIndex= this.scenes.length-1;
            this.currentScene.init(this.gc);
            this.currentScene.run();
        });
    }

	handleEvent(gc, e) {
        if(this.currentScene)
            this.currentScene.handleEvent(gc, e);

	}
    update(gc) {
        if(!this.currentScene?.isRunning)
            return;
        this.currentScene.update(gc);
        this.currentScene.render(gc);
    }
}
