import { LIFT_OPERATORS_MAP } from '../lift-inner-operators/lift-inner-operators-map';
import { LiftOperator } from '../lift-inner-operators/lift-operator';
import { PipedOperator } from './piped-operator';
import { OPERATOR_CLASS } from './piped-operator-class-map';


export class PipedOperators {

    calledOperators: any[][] = [];
    liftedInnerOperators: any[] = [];
    leftLiftOperators: LiftOperator[] = [];
    order: string[] = [];
    operatorsMap: {[k: string]: PipedOperator[]} = {};


    public addPipedOperators(operators: any[]): void {
        // TODO: map to a PipedOperator class's instance
        this.calledOperators.push(operators);
    }


    public addLiftedOperator(operator: any): void {
        // TODO: map to a LiftOperator class's instance
        this.liftedInnerOperators.push(operator);
    }


    public analyse() {
        let liftedOperators = this.getLiftedOperators();
        const pipedOperators = this.getPipedOperators(this.calledOperators);
        this.leftLiftOperators = this.processLiftedOperators(pipedOperators, liftedOperators);
        this.order = pipedOperators.map(operator => operator.getId());
        this.operatorsMap = this.convertToMap(pipedOperators);
    }


    private processLiftedOperators(pipedOperators: PipedOperator[], liftedOperators: LiftOperator[]): LiftOperator[] {
        return (
            pipedOperators.reduce((liftedOperators: LiftOperator[], operator: PipedOperator) => {
                return operator.parseLiftOperators(liftedOperators);
            }, liftedOperators));
    }
    
    
    private getLiftedOperators(): LiftOperator[] {
        return (
            this.liftedInnerOperators.map(innerOperator => {
                if (!innerOperator || !innerOperator.constructor) {
                    throw new Error(`Something is wrong with lifted operator: "${innerOperator}".`);
                }
                const operatorName = innerOperator.constructor.name;
                const operatorClass = LIFT_OPERATORS_MAP[operatorName];
                if (!operatorClass) {
                    throw new Error(`Lift operator "${operatorName}" is not supported.`);
                }
                return new operatorClass(innerOperator);
            }));
    }


    private getPipedOperators(pipedOperators: any[]): PipedOperator[] {
        return (
            Array.prototype.concat(
                ...pipedOperators.map(operators => 
                    operators.map((operator: any) => {
                        const _class: any = OPERATOR_CLASS[operator];
                        if (!_class) {
                            throw new Error(`Operator "${operator}" is not supported!`);
                        }
                        return new _class();
                    }))));
    }


    private convertToMap(pipedOperators: PipedOperator[]): {[k: string]: PipedOperator[]} {
        return  (
            pipedOperators.reduce((operatorsMap: {[k: string]: PipedOperator[]}, operator: PipedOperator) => {
                const operatorId = operator.getId();
                const operatorData = operatorsMap[operatorId];
                if (!operatorData) {
                    operatorsMap[operatorId] = [ operator ];
                } else {
                    operatorsMap[operatorId].push(operator);
                }
                return operatorsMap;
            }, {}));
    }
}
