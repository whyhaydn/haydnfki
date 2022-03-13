const WebpackObfuscator = require('webpack-obfuscator');
const { when, whenDev, whenProd } = require('@craco/craco');

module.exports = {
	webpack: {
		...whenProd(() => ({
			devtool: 'none',
		}), {}),
		plugins: [
			...whenProd(() => [ 
				new WebpackObfuscator({
					compact: true,
					controlFlowFlattening: false,
					deadCodeInjection: false,
					debugProtection: false,
					debugProtectionInterval: 0,
					disableConsoleOutput: false,
					identifierNamesGenerator: 'hexadecimal',
					log: false,
					numbersToExpressions: false,
					renameGlobals: false,
					selfDefending: false,
					simplify: true,
					splitStrings: false,
					stringArray: true,
					stringArrayCallsTransform: false,
					stringArrayCallsTransformThreshold: 0.5,
					stringArrayEncoding: ['rc4'],
					stringArrayIndexShift: true,
					stringArrayRotate: true,
					stringArrayShuffle: true,
					stringArrayWrappersCount: 1,
					stringArrayWrappersChainedCalls: true,
					stringArrayWrappersParametersMaxCount: 2,
					stringArrayWrappersType: 'variable',
					stringArrayThreshold: 1,
					unicodeEscapeSequence: false
				}),
			], []),
		],
	},
};