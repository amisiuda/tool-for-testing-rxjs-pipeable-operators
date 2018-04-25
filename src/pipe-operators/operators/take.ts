import { PipedOperator } from '../piped-operator';


export class Take extends PipedOperator {

    static id = 'take';


    constructor() {
        super([ 'TakeOperator' ]);
    }
    

    getId(): string {
        return Take.id;
    }


    setArgsFromExpectation(args: {[k: string]: any} | any[]): void {
        this.setArgs({
            total: args[0]
        });
    }


    protected parseArgs(argumentList: any[]) {
        this.setArgs(argumentList[0]);
    }


    protected argsEqualOrThrow(pipedOperator: PipedOperator): void {
        const args: any = this.getArgs();
        const args2: any = pipedOperator.getArgs();
        if (args.total !== args2.total) {
            this.throwArgumentsError(`Expected "${args.total}" but "${args2.total}" has been given.`);
        }
    }
}
