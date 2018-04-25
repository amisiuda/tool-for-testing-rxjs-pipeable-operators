import { PipedOperator } from '../piped-operator';


export class Reduce extends PipedOperator {

    static id = 'reduce';


    constructor() {
        super([ 'ScanOperator', 'TakeLastOperator', 'DefaultIfEmptyOperator' ]);
    }
    

    getId(): string {
        return Reduce.id;
    }


    setArgsFromExpectation(args: {[k: string]: any} | any[]): void {
        this.throwNoArgumentSupportError();
    }


    protected parseArgs(argumentList: any[]) {
        // we do not save them since we do not support expected arguments validation
    }


    protected argsEqualOrThrow(pipedOperator: PipedOperator): void {}
}
