import { isEqual } from 'underscore';
import { Operator } from './pipe-operators/operator';
import { PipedOperator } from './pipe-operators/piped-operator';
import { OPERATOR_CLASS } from './pipe-operators/piped-operator-class-map';


export class ExpectedOperatorsBuilder {

    static readonly ANY_ARGS = undefined;
    operator!: Operator;
    callCount!: number;
    args!: any[];
    private argsLocked = false;
    private callCountLocked = false;


    static create(operator: Operator, callCount: number = 1, args: any[] = [ ExpectedOperatorsBuilder.ANY_ARGS ]): ExpectedOperatorsBuilder {
        const obj = new ExpectedOperatorsBuilder();
        obj.operator = operator;
        obj.callCount = callCount;
        obj.args = args;
        return obj;
    }


    public setCallsArguments(args: any | any[]): ExpectedOperatorsBuilder {
        if (this.argsLocked) {
            throw new Error(`Call arguments for operator '${this.operator.getId()}' has already been specified!`);
        }
        if (!this.callCountLocked) {
            this.callCount = args.length;
        } else if (args.length !== this.callCount) {
            throw new Error(`Length of given arguments does not fit previously specified calls count (${this.callCount}). Given arguments: ${args}`);
        }
        this.args = args;
        this.argsLocked = true;
        return this;
    }


    public setCallsCount(count: number): ExpectedOperatorsBuilder {
        if (this.callCountLocked) {
            throw new Error(`Calls count for operator '${this.operator.getId()}' has already been specified!`);
        }
        if (!this.argsLocked) {
            this.args = new Array(count).fill(ExpectedOperatorsBuilder.ANY_ARGS);
        } else if (count !== this.args.length) {
            throw new Error(`Given calls count (${count}) does not fit previously specified number of call arguments (${this.args.length}).`);
        }
        this.callCount = count;
        this.callCountLocked = true;
        return this;
    }


    public merge(data: ExpectedOperatorsBuilder): ExpectedOperatorsBuilder {
        if (data.operator.getId() !== this.operator.getId()) {
            throw new Error(`Cannot merge operators with following ids: ${data.operator.getId()} and ${this.operator.getId()}`);
        }
        const newData = ExpectedOperatorsBuilder.create(data.operator);
        newData.setCallsArguments(this.args.concat(data.args));
        newData.setCallsCount(this.callCount + data.callCount);
        return newData;
    }


    public build(): PipedOperator[] {
        return (
            this.args.map(args => {
                const operator = new OPERATOR_CLASS[this.operator.getId()]();
                if (args !== ExpectedOperatorsBuilder.ANY_ARGS) {
                    operator.setArgsFromExpectation(args);
                }
                return operator;
            }));
    }


    // public compare(builder: ExpectedOperatorsBuilder): boolean {
    //     if (this.operator.getId() !== builder.operator.getId()) {
    //         throw new Error(`Operators have different ids. "${this.operator.getId()}" does not equal "${builder.operator.getId()}".`);
    //     }
    //     if (this.callCount !== builder.callCount) {
    //         throw new Error(`Operators "${this.operator.getId()}" have different call counts. ${this.callCount} does not equal ${builder.callCount}.`);
    //     }
    //     if (this.args.length !== builder.args.length) {
    //         this.throwArgsError(builder);
    //     }
    //     this.compareArguments(builder);
    //     return true;
    // }


    private compareArguments(builder: ExpectedOperatorsBuilder) {
        const ANY_ARGS = ExpectedOperatorsBuilder.ANY_ARGS;
        if (this.args.length !== builder.args.length) {
            this.throwArgsError(builder);
        }
        for (let i = 0; i < this.args.length; i++) {
            const args1 = this.args[i];
            const args2 = builder.args[i];
            if (!(args1 instanceof Array)) {
                this.compareValues(args1, args2, builder);
                return;
            }
            for (let j = 0; j < args1.length; j++) {
                this.compareValues(args1[j], args2[j], builder);
            }
        }
    }


    private compareValues(arg1: any, arg2: any, builder: ExpectedOperatorsBuilder): void {
        const { ANY_ARGS } = ExpectedOperatorsBuilder;
        if (arg1 !== ANY_ARGS && arg2 !== ANY_ARGS && !isEqual(arg1, arg2)) {
            this.throwArgsError(builder);
        }
    }


    private throwArgsError(builder: ExpectedOperatorsBuilder): void {
        throw new Error(`Operators "${this.operator.getId()}" have different arguments. ${JSON.stringify(this.args)} does not equal ${JSON.stringify(builder.args)}.`);
    }
}
