import {parseSearchString} from './parse-search-string.fn';
import 'jest';
import {deepEqual} from 'assert';

describe(parseSearchString.name, () => {
  it('parses search strings :P', () => {
    const parsed = parseSearchString('?blah=blub&blub%20=%20blah');

    deepEqual(parsed, {blah: 'blub', ' blah': ' blub'});
  });
});
