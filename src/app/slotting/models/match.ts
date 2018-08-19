import {Company} from './company';
import {Platoon} from './platoon';
import {Squad} from './squad';

export interface Match {
  uuid: string;
  company?: Company[];
  platoon?: Platoon[];
  squad?: Squad[];
}
