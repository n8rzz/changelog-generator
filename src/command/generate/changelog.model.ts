import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import EntryModel from '../entry/entry.model';
import { IChangelog } from './i-changelog';
import { IEntryGroup } from './i-entry-group';

export default class ChangelogModel implements IChangelog {
    public version: string = '';
    public date: Date = new Date();
    public entries: IEntryGroup = {};

    constructor(props: IChangelog) {
        this.version = props.version;
        this.date = props.date;
        this.entries = props.entries || {};
    }

    /**
     *
     *
     *
     */
    public buildChangelogFromAnswers(
        rawEntrySelections: string[],
        entryList: EntryModel[],
        sortedEntryGroup: IEntryGroup,
    ): void {
        if (rawEntrySelections.length === entryList.length) {
            this.entries = sortedEntryGroup;
        }

        this._updateEntryGroupWithUserSelections(
            rawEntrySelections,
            entryList,
        );
    }

    /**
     *
     *
     *
     */
    private _groupAndSortEntryListByType(entryList: EntryModel[]): IEntryGroup {
        const groupedEntrylist: IEntryGroup = groupBy(entryList, 'type');

        return Object.keys(groupedEntrylist).reduce((sum: any, groupKey: string): any => {
            sum[groupKey] = sortBy(groupedEntrylist[groupKey], ['date']);

            return sum;
        }, {} as IEntryGroup);
    }

    /**
     *
     *
     *
     */
    private _updateEntryGroupWithUserSelections(
        rawEntrySelections: string[],
        entryList: EntryModel[],
    ): void {
        const trimmedEntryList: EntryModel[] = entryList.filter((entryModel: EntryModel): boolean => {
            return rawEntrySelections.indexOf(entryModel.buildCheckboxLabel()) !== -1;
        });

        this.entries = this._groupAndSortEntryListByType(trimmedEntryList);
    }
}
