import { LiftOperator } from '../lift-operator';


export class FilterOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            predicate: innerOperator.predicate,
            thisArg: innerOperator.thisArg
        });
    }
}
