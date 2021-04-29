const path= require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/main.js',
	devtool: 'source-map',

	plugins: [
		new HtmlWebpackPlugin({
			template: './webpack/index.html'
		}),
	],

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
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
			test: /\.ogg$/i,
			use: [
			  {
				loader: 'file-loader',
			  },
			],
		  },		  		  
		],
	  },	
};