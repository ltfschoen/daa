/**
 * ES6 Runner script
 *
 * @author Patrice Juergens <pj@validitylabs.org>
 */

import {spawn} from 'child_process';
import {spawnSync} from 'child_process';
import kill from 'tree-kill';
import {logger as log} from './logger';
import sh from 'shelljs';

const env   = process.env.NODE_ENV  || 'develop';
const task  = process.env.TASK;
const bnode = env === 'production' ? 'node' : 'babel-node';
let dead    = false;

/**
 * Do a clean exit and kill all (child) processes properly
 *
 * @returns {void}
 */
function cleanExit() {
    if (!dead) {
        log.info('Clean up all (sub) processes');
        kill(process.pid);
        dead = true;
    }
}

/**
 * Listen to all async process events
 *
 * @param {object} p Process
 * @returns {void}
 */
function listen(p) {
    p.on('exit', () => {
        cleanExit();
    });

    p.on('SIGINT', cleanExit);    // Catch ctrl-c
    p.on('SIGTERM', cleanExit);   // Catch kill

    p.on('error', (err) => {
        log.error('onError:');
        log.error(err);
        p.exit(1);
    });

    p.on('unhandledRejection', (err) => {
        log.error(err);
        p.exit(1);
    });

    p.on('uncaughtException', (err) => {
        log.error('onUncaughtException:');
        log.error(err);
        p.exit(1);
    });
}

/**
 * Spawn a new ganache server
 *
 * @returns {void}
 */
function spawnServer() {
    return spawn(bnode + ' ./tools/server', {
        stdio: 'inherit',
        shell: true
    });
}

// Listen to main process
listen(process);

/**
 * Run specific procedure
 *
 * @returns {void}
 * @export
 */
export async function run() {
    switch (task) {
        case 'compile':
            spawnSync('truffle compile --all', {
                stdio: 'inherit',
                shell: true
            });

            cleanExit();

            break;
        case 'testrpc':
            process.env.verbose = true;
            listen(spawnServer());

            break;
        case 'migrate':
            listen(spawnServer());
            spawnSync('truffle migrate --reset --compile-all --network develop', {
                stdio: 'inherit',
                shell: true
            });
            cleanExit();

            break;
        case 'test':
            listen(spawnServer());

            spawnSync('truffle test --network develop', {
                stdio: 'inherit',
                shell: true
            });

            cleanExit();

            break;
        case 'coverage':
            // remove build folder, otherwise the result of code coverage might not be correct
            sh.rm('-fr', './build');

            spawnSync('solidity-coverage', {
                stdio: 'inherit',
                shell: true
            });
            cleanExit();

            break;
        default:
    }
}
