
// const rootDir= "./assets";
const rootDir= "";

const ENV= {

	MAIN_FONT: "bubble-bobble",

	SCENES_PATH: "scenes/",
	LEVELS_DIR: "/levels/",
	SOUNDS_PATH: "sounds/",
	VOLUME: 50,

	SPRITESHEETS_PATH: "spritesheets/",
	IMAGES_PATH: "images/",
	FONTS_PATH: "fonts/",

	COLORS: {
		DEFAULT_TEXT: "white",
		SELECTED_TEXT: "#ffff07",
		SELECT_RECT: "#A5A5A5"
	},

	HIGHSCORES_COUNT: 10,
	
	BALL_RADIUS: 5,

	PADDLE_X: 300,
	PADDLE_Y: 550,

	BRICKS_PER_ROW: 17,
	BRICKS_ROW: 14,
	BRICK_TOP: 70+16+16,
	BRICK_LEFT: 20,

	WALL_TOP: 50,

	VIEWPORT_WIDTH: 600,
	VIEWPORT_HEIGHT: 600,

	FPS: 1/60
};

export default ENV;