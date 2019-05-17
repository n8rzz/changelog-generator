import inquirer from 'inquirer';
import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import EntryModel from '../entry/entry.model';
import { IChangelog } from './i-changelog';
import { IEntryGroup } from './i-entry-group';

/**
 * Defines a list of entries for a release
 *
 * Will accept answers from a user from `inquirer` and will
 * build up an object that will be written to a changelog file
 *
 * @class ChangelogModel
 */
export default class ChangelogModel implements IChangelog {
    /**
     * The semver version of the release
     *
     * @property version
     * @type string
     */
    public version: string = '';

    /**
     * Date of the release
     *
     * @property date
     * @type {Date}
     */
    public date: Date = new Date();

    /**
     * @property entries
     * @type {IEntryGroup}
     */
    public entries: IEntryGroup = {};

    /**
     * @constructor
     * @param props {inquirer.Answers}
     * @param entryList {EntryModel[]}
     */
    constructor(props: inquirer.Answers, entryList: EntryModel[]) {
        this.version = props.version;

        this._buildChangelogFromAnswers(
            props.entries,
            entryList,
        );
    }

    /**
     * Accepts user answers from `inquirer` and builds out list of
     * `EntryModel`s to be included in the changelog file
     *
     * @private
     * @method _buildChangelogFromAnswers
     * @param rawEntrySelections {string[]}
     * @param entryList {EntryModel[]}
     * @return {void}
     */
    private _buildChangelogFromAnswers(
        rawEntrySelections: string[],
        entryList: EntryModel[],
    ): void {
        if (rawEntrySelections.length === entryList.length) {
            this.entries = this._groupAndSortEntryListByType(entryList);

            return;
        }

        this._updateEntryGroupWithUserSelections(
            rawEntrySelections,
            entryList,
        );
    }

    /**
     * Groups `EntryModel`s by `type` property
     *
     * Used in preparation for writing to changelog file
     * Allows for grouping each entry by type
     *
     * ```txt
     * ## Bugfix
     * - entry
     * - entry
     *
     * ## Feature
     * - entry
     * - entry
     * ```
     *
     * @private
     * @method _groupAndSortEntryListByType
     * @param entryList {EntryModel[]}
     * @returns {IEntryGroup}
     */
    private _groupAndSortEntryListByType(entryList: EntryModel[]): IEntryGroup {
        const groupedEntrylist: IEntryGroup = groupBy(entryList, 'type');

        return Object.keys(groupedEntrylist).reduce((sum: IEntryGroup, groupKey: string): IEntryGroup => {
            sum[groupKey] = sortBy(groupedEntrylist[groupKey], ['date']);

            return sum;
        }, {} as IEntryGroup);
    }

    /**
     * Given a list of selected entries from `inquirer`, filter out
     * non-selected `EntryModel`s and set to `#entries`
     *
     * @private
     * @method _updateEntryGroupWithUserSelections
     * @param rawEntrySelections {string[]}
     * @param entryList {EntryModel[]}
     * @returns {void}
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
