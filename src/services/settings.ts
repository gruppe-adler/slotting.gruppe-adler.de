export interface Settings {
    showGroupColor: boolean;
    ownedDLCs: string[],
}

const KEY = 'grad-slotting-settings';

const DEFAULT_SETTINGS: Settings = {
    showGroupColor: false,
    ownedDLCs: []
};

export function saveSettings (settings: Settings): void {
    localStorage.setItem(KEY, JSON.stringify(settings));
}

export function loadSettings (): Settings {
    const value = localStorage.getItem(KEY);

    return valueToSetting(value);
}

function valueToSetting (value: string|null): Settings {
    if (value === null) return DEFAULT_SETTINGS;

    return JSON.parse(value);
}

const TARGET = new EventTarget();

type SettingsChangeEvent = CustomEvent<Settings>;

window.addEventListener('storage', e => {
    if (e.key !== KEY) return;

    TARGET.dispatchEvent(new CustomEvent<Settings>('change', {
        detail: valueToSetting(e.newValue)
    }));
});

export function addEventListener (cb: (e: SettingsChangeEvent) => unknown): void {
    TARGET.addEventListener('change', cb as (e: Event) => unknown);
}

export function removeEventListener (cb: (e: SettingsChangeEvent) => unknown): void {
    TARGET.removeEventListener('change', cb as (e: Event) => unknown);
}
