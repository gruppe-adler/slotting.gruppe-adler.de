// TODO
type NatoSymbol = string;
type Side = string;
type VehicleType = number;

export interface Slot {
    description: string;
    shortcode: string;
    uuid: string;
}

export interface FireTeam {
    slot: Slot[];
    'min-slotted-player-count'?: number;
    'reserved-for'?: string;
}

export interface Squad extends FireTeam {
    callsign: string;
    natosymbol: NatoSymbol;
    side: Side;
    vehicletype: VehicleType;
    fireteam: FireTeam[];
    slot: Slot[];
}

export interface Platoon extends Squad {
    squad: Squad[];
}

export interface Company extends Platoon {
    platoon: Platoon[];
}

export default interface Match {
    uuid: string;
    slot: Slot[];
    fireteam: FireTeam[];
    squad: Squad[];
    platoon: Platoon[];
    company: Company[];
}
