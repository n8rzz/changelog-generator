import { ICliCommand } from '../types/cli-arg.model';

export const validArgWithoutAliasMock: ICliCommand = {
    arg: 'issue',
};

export const validCliArgMock: ICliCommand = {
    ...validArgWithoutAliasMock,
    alias: 'i',
};
