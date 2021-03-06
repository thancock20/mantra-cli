import { _generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath } from './utils';
import { getLineBreak } from '../utils';
import shelljs from 'shelljs/shell';
import fs from 'fs';
import _ from 'lodash';
import { logger } from '../logger';

export function generateCollection(name, options, config) {
  const {exists} = _generate('collection', null, name, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./lib/collections/index.js`,
      exportBeginning: 'export {',
      insertImport: `import ${_.upperFirst(_.camelCase(name))} from './${_.snakeCase(name)}';`,
      insertExport: `  ${_.upperFirst(_.camelCase(name))}`,
      commaDelimited: true
    });
  }

  let packageList = fs.readFileSync('./.meteor/packages');

  if (options.schema === 'collection2') {
    // if no aldeed:collection2, or commented out
    if (!(/aldeed\:collection2/).test(packageList) || (/#+\s*aldeed\:collection2/).test(packageList)) {
      logger.invoke('add_collection_2');
      const lineBreak = getLineBreak();
      `aldeed:collection2${lineBreak}`.toEnd('.meteor/packages');
    }
  } else if (options.schema === 'astronomy') {
    // if no jagi:astronomy, or commented out
    if (!(/jagi\:astronomy/).test(packageList) || (/#+\s*jagi\:astronomy/).test(packageList)) {
      logger.invoke('add_astronomy');
      const lineBreak = getLineBreak();
      `jagi:astronomy${lineBreak}`.toEnd('.meteor/packages');
    }
  }
}

export function destroyCollection(name) {
  removeFile(getOutputPath('collection', name));

  removeFromIndexFile(`./lib/collections/index.js`, name, { capitalizeVarName: true });
}
