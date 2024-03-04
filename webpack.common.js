const path= require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
	entry: './src/main.js',

	plugins: [

		new HtmlWebpackPlugin({
			template: './webpack/index.html'
		}),

		// new CircularDependencyPlugin({
		// 	// exclude detection of files based on a RegExp
		// 	exclude: /a\.js|node_modules/,
		// 	// include specific files based on a RegExp
		// 	include: /dir/,
		// 	// add errors to webpack instead of warnings
		// 	failOnError: true,
		// 	// allow import cycles that include an asyncronous import,
		// 	// e.g. via import(/* webpackMode: "weak" */ './file.js')
		// 	allowAsyncCycles: false,
		// 	// set the current working directory for displaying module paths
		// 	cwd: process.cwd(),
		//   })	

	],

	output: {
		filename: 'main.js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		// publicPath: "/",
	},

	module: {
		rules: [
		  {
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
		  },
		  {
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
		  },		  
		  {
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: 'asset/resource',
		  },
		  {
			test: /\.script(?:\.txt)?$/i,
			type: 'asset/source',
		  },
		  {
			test: /\.(ogg|mp3)$/i,
			type: 'asset/resource',
		  },		  		  
		],
	  },	
};