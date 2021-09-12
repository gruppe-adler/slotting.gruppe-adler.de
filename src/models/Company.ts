import { Platoon } from '.';

export default interface Company extends Platoon {
    platoon: Platoon[];
}
