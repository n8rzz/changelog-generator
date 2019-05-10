export interface IConfigModel {
    autoLinkIssue: boolean;
    defaultConfigFilename: string;
    entriesDir: string;
    entryType: string[];
    lastTag: string;
    issueSourceUrl?: string;
    outputFilename: string;
    projectName: string;
}

/**
 * Defines the shape of what we look for in the
 * configuration file.
 *
 * @class ConfigModel
 */
export default class ConfigModel implements IConfigModel {
    public autoLinkIssue: boolean = false;
    public defaultConfigFilename: string = '';
    public entriesDir: string = '';
    public entryType: string[] = [];
    public lastTag: string = '';
    public issueSourceUrl?: string = '';
    public outputFilename: string = '';
    public projectName: string = '';

    constructor(configProps: IConfigModel) {
        this.autoLinkIssue = configProps.autoLinkIssue;
        this.defaultConfigFilename = configProps.defaultConfigFilename;
        this.entriesDir = configProps.entriesDir;
        this.entryType = configProps.entryType;
        this.lastTag = configProps.lastTag;
        this.issueSourceUrl = configProps.issueSourceUrl;
        this.outputFilename = configProps.outputFilename;
        this.projectName = configProps.projectName;
    }

    /**
     * Return the instance as a string, with pretty
     * formatting, in preparation for writing to file
     *
     * @method toJson
     * @returns {string}
     */
    public toJson(): string {
        return JSON.stringify(this, null, 2);
    }
}
