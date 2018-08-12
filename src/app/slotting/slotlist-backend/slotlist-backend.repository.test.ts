import 'jest';
import {ok} from 'assert';
import {SlotlistBackendRepository} from './slotlist-backend.repository';

describe('SlotlistBackendRepository', () => {
  it('bar', () => {
    const missionService = {} as any;
    const slotGroupService = {} as any;
    const foo = new SlotlistBackendRepository(
      {getAuthToken: () => 'foo'} as any,
      missionService,
      slotGroupService,
      {getTid: () => 1} as any
    );
    foo.save({
      uuid: 'ieaie',
    });
    ok(true);
  });
});
