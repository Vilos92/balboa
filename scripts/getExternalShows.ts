#!/usr/bin/env node
import {hideBin} from 'yargs/helpers';
import yargs from 'yargs/yargs';

import {GetTvMazeShowsResponse, getTvMazeShows} from '../externalApi/tvMaze';
import {SupabaseConfig, createSupabaseClient} from '../utils/supabase';

/*
 * Types.
 */

enum CommandsEnum {
  EXECUTE = 'execute'
}

enum ExecuteArgsEnum {
  URL = 'url',
  ANON_KEY = 'anonKey'
}

enum ArgsEnum {
  START = 's',
  END = 'e'
}

/*
 * Script.
 */

function parseArgv(argv: Array<string>) {
  const argvSansBin = hideBin(argv);

  const parser = yargs(argvSansBin)
    .usage('Usage: $0 <command> [options]')
    .example('Usage: $0 --start 1 --end 5', 'print pages of shows from the TV Maze API')
    .command(`${CommandsEnum.EXECUTE} <url> <anonKey>`, 'save shows from the TV Maze API to the database')
    .example(
      `Usage: $0 ${CommandsEnum.EXECUTE} <url> <anonKey> --start 1 --end 5`,
      'save pages 1 through 5 from the TV Maze API to the database'
    )
    .alias(ArgsEnum.START, 'start')
    .default(ArgsEnum.START, 1)
    .nargs(ArgsEnum.START, 1)
    .describe(ArgsEnum.START, 'first page to print or save')
    .alias(ArgsEnum.END, 'end')
    .nargs(ArgsEnum.END, 1)
    .describe(ArgsEnum.END, 'last page to print or save')
    .default(ArgsEnum.END, 1)
    .help('h')
    .alias('h', 'help');

  return parser.parseSync();
}

async function run(argv: Array<string>) {
  const yargv = parseArgv(argv);

  const commands = yargv['_'];
  const shouldExecute = commands.includes(CommandsEnum.EXECUTE);

  const start = yargv[ArgsEnum.START];
  const end = yargv[ArgsEnum.END];

  if (start > end) {
    throw new Error('start page must be less than or equal to the end page');
  }

  const pagesRange = computeRange(start, end);
  const showsPages = await Promise.all(pagesRange.map(async page => getTvMazeShows(page)));

  const showsHandler = shouldExecute
    ? async (shows: GetTvMazeShowsResponse) => {
        const url = yargv[ExecuteArgsEnum.URL];
        const anonKey = yargv[ExecuteArgsEnum.ANON_KEY];

        if (typeof url !== 'string' || typeof anonKey !== 'string')
          throw new Error('Cannot execute without both a supabase url and anonKey');

        await saveShows(shows, {url, anonKey});
      }
    : printShows;

  Promise.all(showsPages.map(async shows => showsHandler(shows)));
}

/*
 * Helpers.
 */

function computeRange(start: number, end: number): ReadonlyArray<number> {
  const pagesCount = end + 1 - start;

  return Array.from({length: pagesCount}, (_, k) => k + start);
}

async function saveShows(shows: GetTvMazeShowsResponse, supabaseConfig: SupabaseConfig) {
  console.warn('saving show to db', shows.length);

  const supabase = createSupabaseClient(supabaseConfig);

  const {data, error, count} = await supabase.from('tv_show').select(`name`, {count: 'exact'});

  console.log('error', error);
  console.log('count', count);
  console.log('data', data);
}

function printShows(shows: GetTvMazeShowsResponse) {
  const prettyResponse = JSON.stringify(shows.length, null, 2);

  console.warn('printing shows', shows.length);
  return;

  console.info(prettyResponse);
}

/*
 * Runtime.
 */

run(process.argv);
