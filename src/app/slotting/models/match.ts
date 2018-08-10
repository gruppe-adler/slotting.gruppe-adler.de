import {Company} from './company';

export interface Match {
  uuid: string;
  company?: Company[];
  platoon?: Company[];
  squad?: Company[];
}
