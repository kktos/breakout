import Scene from './Scene.js';

export default class Director {
    constructor(gc) {
        this.sceneIndex= -1;
        this.scenes= [];
        this.gc= gc;
    }

    addScene(scene) {
        scene.events.on(Scene.EVENT_COMPLETE, (name) => {
            if(name)
                this.run(name);
            else
                this.runNext();
        });
        this.scenes.push(scene);
    }

    get currentScene() {
        return this.scenes[this.sceneIndex];
    }

    pauseScene() {
        if(this.currentScene)
            this.currentScene.pause();
    }

    runPrevious() {
        this.pauseScene();
        this.sceneIndex--;
        if(this.sceneIndex<0)
            this.sceneIndex= 0;
        if(this.currentScene)
            this.currentScene.init(this.gc);
    }
    runNext() {
        this.pauseScene();
        this.sceneIndex++;
        if(this.currentScene)
            this.currentScene.init(this.gc);
    }

    run(name) {
        this.pauseScene();
        const sceneIdx= this.scenes.findIndex(scene => scene.name == name);
        if(sceneIdx>=0) {
            this.sceneIndex= sceneIdx;
            if(this.currentScene)
                this.currentScene.init(this.gc);
            return;
        }

        Scene.load(this.gc, name).then(scene => {
            this.addScene(scene);
            this.sceneIndex= this.scenes.length-1;
            this.currentScene.init(this.gc);
        });
    }

	handleEvent(gc, e) {
        if(this.currentScene)
            this.currentScene.handleEvent(gc, e);

	}
    update(gc) {
        if(this.currentScene) {
            this.currentScene.update(gc);
            this.currentScene.render(gc);
        }
    }
}
