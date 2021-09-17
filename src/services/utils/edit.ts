
export function parseXML (str: string) {
    const parser = new DOMParser();

    const doc = parser.parseFromString(str, 'application/xml');

    const match = doc.firstElementChild;
    if (match === null) return;
    return xmlToJSON(match);
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

export function jsonToXML (obj: { [x: string]: any; }, tag: string): string {
    const parser = new DOMParser();

    /**
   * @type {string[]}
   */
    const children: string[] = [];

    /**
   * @type {Array<[string, string]>}
   */
    const attributes: Array<[string, string]> = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (Array.isArray(value)) {
                for (const item of value) {
                    children.push(jsonToXML(item, key));
                }
            } else {
                attributes.push([key, value]);
            }
        }
    }

    const attributeStr = attributes.map(([key, value]) => `${key}="${value}"`).join(' ');

    const childrenStr = children.join('\n');

    if (children.length === 0) {
        return `<${tag}${attributeStr.length === 0 ? '' : ' '}${attributeStr} />`;
    }

    return `<${tag}${attributeStr.length === 0 ? '' : ' '}${attributeStr}>\n${childrenStr}\n</${tag}>`;
}
