import { IEntryGroup } from './i-entry-group';

export interface IChangelog {
    version: string;
    date: Date;
    entries: IEntryGroup;
}
