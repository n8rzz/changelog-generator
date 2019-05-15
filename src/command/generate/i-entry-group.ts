import EntryModel from '../entry/entry.model';

export interface IEntryGroup {
    [key: string]: EntryModel[];
}
