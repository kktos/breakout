const path= require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.js',

	plugins: [
		new HtmlWebpackPlugin({
			template: './webpack/index.html'
		}),
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
			test: /\.script\.txt$/i,
			type: 'asset/source',
		  },
		  {
			test: /\.(ogg|mp3)$/i,
			type: 'asset/resource',
		  },		  		  
		],
	  },	
};