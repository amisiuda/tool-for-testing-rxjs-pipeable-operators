import { ExpectedOperatorsBuilder } from '../expected-operators-builder';
import { LiftOperator } from '../lift-inner-operators/lift-operator';
import { Operator } from './operator';


export abstract class PipedOperator extends Operator {

    constructor(private liftOperatorIds: string[]) {
        super();
    }


    protected abstract parseArgs(argumentList: any[]);
    protected abstract argsEqualOrThrow(pipedOperator: PipedOperator): void;
    // function used while building piped operators from given expectations data
    protected abstract setArgsFromExpectation(args: {[k: string]: any} | any[]): void;


    equalsOrThrow(pipedOperator: PipedOperator): void {
        if (this.getId() !== pipedOperator.getId()) {
            throw new Error(`Operators have different ids: ${this.getId()} & ${pipedOperator.getId()}`);
        }
        if (this.getArgs() === ExpectedOperatorsBuilder.ANY_ARGS || pipedOperator.getArgs() === ExpectedOperatorsBuilder.ANY_ARGS) {
            return;
        }
        this.argsEqualOrThrow(pipedOperator);
    }


    getId(): string {
        throw new Error("Method not implemented.");
    }


    parseLiftOperators(liftOperators: LiftOperator[]): LiftOperator[] {
        const count = this.liftOperatorIds.length;
        if (liftOperators.length < count) {
            throw new Error(
                `Piped operator "${this.getId()}" requires ${count} lift operators but only ${liftOperators.length} have been given! ::: ` +
                `Actual: ${liftOperators.map(o => o.getId())} ::: ` +
                `Expected ${this.liftOperatorIds}`);
        }
        const args: any[] = [];
        for (let idx = 0; idx < count; idx++) {
            const liftOperator: LiftOperator = liftOperators[idx];
            const expectedId = this.liftOperatorIds[idx];
            if (liftOperator.getId() !== expectedId) {
                throw new Error(`Unexpected lift operator! ::: Actual: ${liftOperator.getId()} :::  Expected: ${expectedId}`);
            }
            args.push(liftOperator.getArgs());
        }
        this.parseArgs(args);
        return liftOperators.slice(count);
    }


    protected throwNoArgumentSupportError(): void {
        throw new Error(`Setting expectations on arguments is not supported for operator "${this.getId()}".`);
    }


    protected throwArgumentsError(msg: string): void {
        throw new Error(`Operator "${this.getId()}" has different arguments than expected. ` + msg);
    }
}
