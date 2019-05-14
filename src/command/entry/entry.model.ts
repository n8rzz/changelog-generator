export interface IEntryModel {
    date: string;
    skipFilenameCheck: boolean;
    author: string;
    email: string;
    description?: string;
    issue?: string;
    type?: string;
    issueSourceUrl: string;
    name?: string;
}

/**
 * @type EntryModel
 */
export default class EntryModel implements IEntryModel {
    public date: string = '';
    public skipFilenameCheck: boolean = false;
    public author: string = '';
    public email: string = '';
    public description: string = '';
    public issue: string = '';
    public type: string = '';
    public issueSourceUrl: string = '';
    public name: string = '';

    constructor(props: IEntryModel) {
        this.date = props.date;
        this.skipFilenameCheck = props.skipFilenameCheck;
        this.author = props.author || '';
        this.email = props.email || '';
        this.description = props.description || '';
        this.issue = props.issue || '';
        this.type = props.type || '';
        this.issueSourceUrl = props.issueSourceUrl || '';
        this.name = props.name || '';
    }

    public authorNameWithoutSpaces(): string {
        if (!this.author) {
            return '';
        }

        return this.author.split(' ').join('-');
    }

    public buildCheckboxLabel(): string {
        return `${this.issue} - ${this.author}`;
    }

    public generateFileName(): string {
        const nowInSeconds: number = new Date(this.date).getTime();

        if (!this.issue || !this.author) {
            return `${nowInSeconds}.json`;
        }

        return `${nowInSeconds}-${this.issue.toLowerCase()}-${this.authorNameWithoutSpaces().toLowerCase()}.json`;
    }
}
