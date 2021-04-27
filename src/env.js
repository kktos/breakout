
const rootDir= "./assets";

const ENV= {

	MAIN_FONT: "bubble-bobble",

	RESOURCES_PATH: `${rootDir}/`,

	SCENES_PATH: `${rootDir}/scenes/`,

	LEVELS_DIR: "/levels/",

	SOUNDS_PATH: `${rootDir}/sounds/`,
	VOLUME: 50,

	SPRITESHEETS_PATH: `${rootDir}/spritesheets/`,
	IMAGES_PATH: `${rootDir}/images/`,
	FONTS_PATH: `${rootDir}/fonts/`,

	BALL_RADIUS: 5,

	PADDLE_X: 300,
	PADDLE_Y: 550,

	BRICKS_PER_ROW: 17,
	BRICKS_ROW: 14,
	BRICK_TOP: 70+16+16,
	BRICK_LEFT: 20,

	WALL_TOP: 50,

	FPS: 1/60
};

export default ENV;