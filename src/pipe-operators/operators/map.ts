import { PipedOperator } from '../piped-operator';


export class Map extends PipedOperator {

    static id = 'map';


    constructor() {
        super([ 'MapOperator' ]);
    }
    

    getId(): string {
        return Map.id;
    }


    setArgsFromExpectation(args: {[k: string]: any} | any[]): void {
        this.throwNoArgumentSupportError();
    }


    protected parseArgs(argumentList: any[]) {
        // we do not save them since we do not support expected arguments validation
    }


    protected argsEqualOrThrow(pipedOperator: PipedOperator): void {}
}
