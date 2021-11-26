import { FireTeam, NatoSymbol, Side, Slot, VehicleType } from '.';

export default interface Squad extends FireTeam {
    callsign: string;
    natosymbol: NatoSymbol;
    side: Side;
    vehicletype: VehicleType;
    frequency?: number;
    fireteam: FireTeam[];
    slot: Slot[];
}
