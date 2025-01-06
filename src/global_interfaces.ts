export interface ISaveLoadAble
{
    saveId: string;

    save(): string;
    load(data: Object): boolean; // false for failed to load
}

export interface IUpdates
{
    update(minutes: number): void;
}

export interface IScreenTintSource
{
    toggle(): void;
}