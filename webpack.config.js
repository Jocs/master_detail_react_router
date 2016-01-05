module.exports = {
	entry: './app.js',
	output: {
		path: './build',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel'
		},{
			test: /\.css$/,
			exclude: /node_modules/,
			loader: 'style!css'
		}]
	}
}