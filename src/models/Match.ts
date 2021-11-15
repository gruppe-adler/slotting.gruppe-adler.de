import { jsonToXML, parseXML } from '@/services/utils/edit';
import { Company, FireTeam, Platoon, Slot, Squad, User } from '.';

export interface IMatch {
    uuid: string;
    slot?: Slot[];
    fireteam?: FireTeam[];
    squad?: Squad[];
    platoon?: Platoon[];
    company?: Company[];
    slottedPlayerCount?: number;
}

export class Match {
    private _slotCount = 0;
    private _slotCountTaken = 0;
    private _slots = new Map<string, Slot>();
    private _data: IMatch;

    constructor (data: IMatch) {
        Match.normalizeNode(data);

        this._data = data;

        Match.traverseSlots(this._data, (s: Slot) => {
            this._slotCount++;
            if (s.user) this._slotCountTaken++;

            this._slots.set(s.uuid, s);
        });
    }

    public get statistics (): { max: number, count: number } {
        return { max: this._slotCount, count: this._slotCountTaken };
    }

    public get uuid (): string { return this._data.uuid; }
    public get allSlots (): Map<string, Slot> { return this._slots; }
    public get slot (): Slot[] { return this._data.slot ?? []; }
    public get fireteam (): FireTeam[] { return this._data.fireteam ?? []; }
    public get squad (): Squad[] { return this._data.squad ?? []; }
    public get platoon (): Platoon[] { return this._data.platoon ?? []; }
    public get company (): Company[] { return this._data.company ?? []; }

    public updateSlotUser (slotUUID: string, user?: User): void {
        const slot = this._slots.get(slotUUID);

        if (slot === undefined) throw new Error('Couldn\'t find slot.');

        if (slot.user === undefined && user === undefined) return;

        if (user === undefined && slot.user !== undefined) {
            this._slotCountTaken--;
        } else if (slot.user === undefined && user !== undefined) {
            this._slotCountTaken++;
        }

        slot.user = user;
    }

    public clone (): Match {
        return new Match(JSON.parse(JSON.stringify(this._data)));
    }

    public toXML (): string {
        return jsonToXML(this._data, 'match');
    }

    public static fromXML (xmlStr: string): Match {
        return new Match(parseXML(xmlStr) as unknown as IMatch);
    }

    /**
     * Recursively traverse slots and call callback for each slot
     * @param ctx Node
     * @param callback Callback
     */
    private static traverseSlots (ctx: Partial<Pick<IMatch, 'fireteam'|'squad'|'platoon'|'company'|'slot'>>, callback: (s: Slot) => unknown) {
        for (const field of ['fireteam', 'squad', 'platoon', 'company'] as const) {
            if (ctx[field] === undefined) continue;

            // We literally checked this in the line above
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ctx[field]!.forEach(e => Match.traverseSlots(e, callback));
        }

        if (!ctx.slot) return;

        ctx.slot.forEach(callback);
    }

    // The current backend uses '0' as a default value for the reserved-for and vehicletype
    // properties. We do not want that, because it breaks stuff so normalizeNode takes care
    // of that shit
    private static normalizeNode (node: Partial<Pick<IMatch, 'fireteam'|'squad'|'platoon'|'company'|'slot'>>) {
        for (const field of ['fireteam', 'squad', 'platoon', 'company', 'slot'] as const) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (node[field] ?? []).forEach(Match.normalizeNode);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (node['reserved-for'] === 0) delete node['reserved-for'];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (node.vehicletype === 0) delete node.vehicletype;
    }
}
