'use strict';

const routes = require('./src/routes.json');
const { spawn } = require('child_process');
const { join } = require('path');
const { mkdir, copyFile } = require('fs/promises');
const { Command } = require('commander');

const build = join(__dirname, 'build');
const index = join(__dirname, 'build', 'index.html');

const routers = {
	async file() {
		for (let { dir, pages } of routes) {
			const dir_name = dir;
			const dir_abs = join(build, dir_name);

			console.log('Create', dir);

			try {
				await mkdir(dir_abs);
			} catch (error) {
				if (error.code !== 'EEXIST') {
					throw error;
				}
			}

			for (let page of pages) {
				const page_name = `${page}.html`;
				const page_abs = join(dir_abs, page_name);

				try {
					console.log('Copy', index, `${dir}${page_name}`);
					copyFile(index, page_abs);
				} catch (error) {
					if (error.code !== 'EEXIST') {
						throw error;
					}
				}
			}
		}
	},
	async id() {
		for (let dir_i in routes) {
			const { pages } = routes[dir_i];
			const dir_name = dir_i;
			const dir_abs = join(build, dir_name);

			console.log('Create', dir_name);

			try {
				await mkdir(dir_abs);
			} catch (error) {
				if (error.code !== 'EEXIST') {
					throw error;
				}
			}

			for (let page_i in pages) {
				// const page = pages[page_i];
				const page_name = `${page_i}.html`;
				const page_abs = join(dir_abs, page_name);

				try {
					console.log('Copy', index, `${dir_name}${page_name}`);
					copyFile(index, page_abs);
				} catch (error) {
					if (error.code !== 'EEXIST') {
						throw error;
					}
				}
			}
		}
	},
};

function spawnAsync(...args) {
	return new Promise((resolve, reject) => {
		const process = spawn(...args);
		process.on('exit', resolve);
		process.on('error', reject);
	});
}

async function main({ router, development, skipNpm }) {
	if (!skipNpm) {
		await spawnAsync('npm', ['run', 'build'], {
			stdio: 'inherit',
			cwd: __dirname,
			env: {
				...process.env,
				NODE_ENV: development ? 'development' : 'production',
				REACT_APP_ROUTER: router,
			},
		});
	}

	await routers[router]();
}

const program = new Command();

program
	.description('Build script')
	.option('-d, --development')
	.option('-s, --skip-npm', 'Skips NPM in the build process')
	.requiredOption(`-r, --router <${Object.keys(routers)}>`, 'Router', value => {
		if (!(value in routers)) {
			throw new RangeError(`${value} was not a valid route.`);
		}

		return value;
	})
	.action(main);

program.parse(process.argv);
