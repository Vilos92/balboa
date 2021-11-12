#!/usr/bin/env node
import {hideBin} from 'yargs/helpers';
import yargs from 'yargs/yargs';

/*
 * Script.
 */

const argv = hideBin(process.argv);
const yargv = yargs(argv).argv;

console.log('args 1', process.argv);
console.log('args 2', argv);
console.log('yargs 3', yargv);
