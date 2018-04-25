import { ExpectedOperatorsBuilder } from './expected-operators-builder';
import { Actions, ExpectedOperatorActions, IPipeTest } from './index.d';
import { PipedOperator } from './pipe-operators/piped-operator';
import { OPERATOR_CLASS } from './pipe-operators/piped-operator-class-map';


export class ExpectedOperators {
    
    static readonly ANY_ORDER = 'any';
    static readonly EXACT_ORDER = 'exact';
    operators: {[k: string]: PipedOperator[]} = {};
    callsOrder: string[] = [];
    orderStrategy = ExpectedOperators.ANY_ORDER;
    private lastExpectation!: ExpectedOperatorsBuilder;
    private operatorBuilders: {[k: string]: ExpectedOperatorsBuilder} = {};


    public expect(operatorFn: any, parent: IPipeTest): ExpectedOperatorActions {
        const operator = this.validateAndGetOperatorObject(operatorFn);
        this.saveLastExpectation();
        const expectetionBuilder = ExpectedOperatorsBuilder.create(operator);
        this.lastExpectation = expectetionBuilder;
        const actions = this.createActions(parent);
        const expectationActions = Object.assign({
            calledWith: (...args: any[]) => {
                expectetionBuilder.setCallsArguments(args);
                return expectationActions;
            },
            calledTimes: (callsCount: number) => {
                expectetionBuilder.setCallsCount(callsCount);
                return expectationActions;
            }
        }, actions);
        return expectationActions;
    }


    private createActions(parent: IPipeTest): Actions {
        return {
            inAnyOrder: () => {
                this.inAnyOrder();
                return this.createActions(parent);
            },
            inExactOrder: () => {
                this.inExactOrder();
                return this.createActions(parent);
            },
            expect: parent.expect.bind(parent),
            verify: parent.verify.bind(parent)
        }
    }
    
    
    public inAnyOrder(): void {
        this.orderStrategy = ExpectedOperators.ANY_ORDER;
    }


    public inExactOrder(): void {
        this.orderStrategy = ExpectedOperators.EXACT_ORDER;
    }


    public done(): void {
        this.saveLastExpectation();
        this.buildExpectedOperators();
    }


    private buildExpectedOperators(): void {
        this.operators =
            Object.keys(this.operatorBuilders).reduce((map, key) => {
                map[key] = this.operatorBuilders[key].build();
                return map;
            }, {});
    }


    private saveLastExpectation(): void {
        if (this.lastExpectation) {
            const id = this.lastExpectation.operator.getId();
            let operatorBuilder = this.operatorBuilders[id];
            this.operatorBuilders[id] =
                operatorBuilder
                    ? operatorBuilder.merge(this.lastExpectation)
                    : this.lastExpectation;
            this.saveToCallsOrder(id, this.lastExpectation.callCount);
        }
    }


    private saveToCallsOrder(id: string, count = 1): void {
        this.callsOrder = this.callsOrder.concat(new Array(count).fill(id));
    }


    private validateAndGetOperatorObject(operator: any): PipedOperator {
        const operatorClass: any = OPERATOR_CLASS[operator];
        if (!operatorClass) {
            throw new Error(`Operator "${operator}" is not supported!`);
        }
        return new operatorClass();
    }
}
