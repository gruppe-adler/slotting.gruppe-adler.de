import 'jest';
import {ok} from 'assert';
import {SlotlistBackendMigrationService} from './slotlist-backend-migration.service';

describe('SlotlistBackendMigrationService', () => {
  it('bar', () => {
    const missionService = {} as any;
    const slotGroupService = {} as any;
    const foo = new SlotlistBackendMigrationService(
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
