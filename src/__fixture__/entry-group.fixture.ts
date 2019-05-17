import { IEntryGroup } from '../command/generate/i-entry-group';
import {
    featureEntryModelFixture,
    bugfixEntryModelFixture,
    bugfixEntryModelWithExtendedDescriptionFixture,
} from './entry-model.fixture';

export const validEntryGroupFixture: IEntryGroup = {
    bugfix: [
        bugfixEntryModelFixture,
        bugfixEntryModelWithExtendedDescriptionFixture,
    ],
    feature: [
        featureEntryModelFixture,
    ],
};
