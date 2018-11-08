/**
 * Write a JSON version of config-example.js to the example directory.
 */
import { resolve } from 'path';
import { writeFileSync, PathLike } from 'fs';
import { IConfig } from 'src/types';

const examplePath: PathLike = resolve(__dirname, '../../examples');
const example: IConfig = require(resolve(examplePath, 'config-example.js'));

// Write the JSON with an indent of 2 spaces and a single newline at the end of the file
writeFileSync(resolve(examplePath, 'config-example.json'), JSON.stringify(example, null, 2) + '\n');
