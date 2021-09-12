import { Company, FireTeam, Platoon, Slot, Squad } from '.';

export default interface Match {
    uuid: string;
    slot: Slot[];
    fireteam: FireTeam[];
    squad: Squad[];
    platoon: Platoon[];
    company: Company[];
}
