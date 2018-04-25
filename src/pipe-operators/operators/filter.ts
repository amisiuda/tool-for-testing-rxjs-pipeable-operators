import { PipedOperator } from '../piped-operator';


export class Filter extends PipedOperator {

    static id = 'filter';


    constructor() {
        super([ 'FilterOperator' ]);
    }
    

    getId(): string {
        return Filter.id;
    }


    setArgsFromExpectation(args: {[k: string]: any} | any[]): void {
        this.throwNoArgumentSupportError();
    }


    protected parseArgs(argumentList: any[]) {
        // we do not save them since we do not support expected arguments validation
    }


    protected argsEqualOrThrow(pipedOperator: PipedOperator): void {}
}
