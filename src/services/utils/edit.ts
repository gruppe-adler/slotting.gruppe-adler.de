
export function parseXML<T extends Record<string, unknown>> (str: string): T {
    const parser = new DOMParser();

    const doc = parser.parseFromString(str, 'application/xml');

    const match = doc.firstElementChild;
    if (match === null) throw new Error('Oh snap!');
    return xmlToJSON(match) as T;
}

function xmlToJSON (element: Element) {
    const json: { [key: string]: unknown } = {};

    for (const attr of Array.from(element.attributes)) {
        json[attr.name] = attr.value;
    }

    for (const child of Array.from(element.children)) {
        const childJSON = xmlToJSON(child);

        if (!Array.isArray(json[child.tagName])) {
            json[child.tagName] = [];
        }

        // we made sure this is an array in the previous line
        (json[child.tagName] as unknown[]).push(childJSON);
    }

    return json;
}

const COMMON_FIELDS = ['slot', 'natosymbol', 'side', 'vehicletype', 'callsign', 'min-slotted-player-count', 'reserved-for'];

const ALLOWED_FIELDS = new Map<string, string[]>([
    ['match', ['uuid', 'squad', 'platoon', 'company']],
    ['company', ['platoon', 'squad', ...COMMON_FIELDS]],
    ['platoon', ['squad', ...COMMON_FIELDS]],
    ['squad', ['fireteam', ...COMMON_FIELDS]],
    ['fireteam', ['slot', 'reserved-for', 'min-slotted-player-count']],
    ['slot', ['description', 'shortcode', 'uuid', 'reserved-for', 'min-slotted-player-count']]
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToXML (obj: { [x: string]: any; }, tag: string, spaces = 0): string {
    const allowedFields = ALLOWED_FIELDS.get(tag) ?? [];

    /**
   * @type {string[]}
   */
    const children: string[] = [];

    /**
   * @type {Array<[string, string]>}
   */
    const attributes: Array<[string, string]> = [];

    for (const key in obj) {
        if (!allowedFields.includes(key)) continue;

        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (Array.isArray(value)) {
                for (const item of value) {
                    children.push(jsonToXML(item, key, spaces + 4));
                }
            } else {
                attributes.push([key, value]);
            }
        }
    }

    const attributeStr = attributes.map(([key, value]) => `${key}="${value}"`).join(' ');

    const spacesStr = ' '.repeat(spaces);

    const childrenStr = children.join('\n');

    if (children.length === 0) {
        return `${spacesStr}<${tag}${attributeStr.length === 0 ? '' : ' '}${attributeStr} />`;
    }

    return `${spacesStr}<${tag}${attributeStr.length === 0 ? '' : ' '}${attributeStr}>\n${childrenStr}\n${spacesStr}</${tag}>`;
}
