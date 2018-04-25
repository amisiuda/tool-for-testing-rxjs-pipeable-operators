import { ExpectedOperators } from './expected-operators';
import { ExpectedAndActualOperators } from './index.d';
import { LiftOperator } from './lift-inner-operators/lift-operator';
import { PipedOperator } from './pipe-operators/piped-operator';
import { PipedOperators } from './pipe-operators/piped-operators';


export class ExpectedOperatorsValidator {

    constructor(private expectedOperators: ExpectedOperators,
                private pipedOperators: PipedOperators) {}


    validate() {
        this.validateOrder();
        this.validateOperators(this.pipedOperators.operatorsMap);
        this.validateLiftOperators(this.pipedOperators.leftLiftOperators);
    }


    public validateLiftOperators(leftLiftOperators: LiftOperator[]): void {
        if (leftLiftOperators.length > 0) {
            throw new Error(
                'Not all lift operators have been processed! This is an unexpected error. ::: ' +
                `Left operators: ${leftLiftOperators.map(o => o.getId()).join(', ')}`);
        }
    }


    public validateOrder(): void {
        if (this.expectedOperators.orderStrategy === ExpectedOperators.ANY_ORDER) {
            return;
        }
        const givenOrder = this.pipedOperators.order;
        const expectedOrder = this.expectedOperators.callsOrder;
        if (givenOrder.length !== expectedOrder.length) {
            this.throwOrderError();
        }
        for (let i = 0; i < expectedOrder.length; i++) {
            if (expectedOrder[i] !== givenOrder[i]) {
                this.throwOrderError();
            }
        }
    }


    public validateOperators(operatorsMap: {[k: string]: PipedOperator[]}): void {
        const expectedOperatorNames = Object.keys(this.expectedOperators.operators);
        const givenOperatorNames = Object.keys(operatorsMap);
        if (expectedOperatorNames.length !== givenOperatorNames.length) {
            throw new Error(
                'Operators are not the same as expected. ::: ' +
                `Actual: ${givenOperatorNames.join(', ')} ::: ` +
                `Expected: ${expectedOperatorNames.join(', ')}`);
        }
        const operatorData: ExpectedAndActualOperators[] =
            expectedOperatorNames
                .map(operatorId => ({
                    id: operatorId,
                    expected: this.expectedOperators.operators[operatorId],
                    actual: operatorsMap[operatorId] || null
                }));
        this.validateMissingOperators(operatorData);
        this.validateExpectations(operatorData);
    }


    private validateExpectations(operatorData: ExpectedAndActualOperators[]): void {
        operatorData.forEach(operator => {
            const { expected, actual } = operator;
            if (expected.length !== actual.length) {
                throw new Error(`Operator "${operator.id}" is expected to be called ${expected.length} time(s). It was called ${actual.length} time(s).`)
            }
            expected.forEach((expectedOperator, idx) =>
                expectedOperator.equalsOrThrow(actual[idx]));
        });
    }


    private throwOrderError(): void {
        throw new Error(
            'Order of called pipable operators is not as expected. ::: ' +
            `Actual: ${this.pipedOperators.order.join(', ')} ::: ` +
            `Expected: ${this.expectedOperators.callsOrder.join(', ')}`);
    }

    
    private validateMissingOperators(operatorData: ExpectedAndActualOperators[]): void {
        const missingOperators = operatorData.filter(item => !item.actual);
        if (missingOperators.length > 0) {
            throw new Error(
                'Following expected operators are missing: ::: ' +
                `${missingOperators.map(item => item.id).join(', ')}`);
        }
    }
}
