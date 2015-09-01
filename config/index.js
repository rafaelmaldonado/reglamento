var config = {
	development: {
		mode: 'development',
		port: 3000
	},
	staging: {
		mode: 'staging',
		port: 4500
	},
	production: {
		mode: 'production',
		port: 2201
	}
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'development'] || config.development;
}