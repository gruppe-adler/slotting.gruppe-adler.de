import { Squad } from '.';

export default interface Platoon extends Squad {
    squad: Squad[];
}
