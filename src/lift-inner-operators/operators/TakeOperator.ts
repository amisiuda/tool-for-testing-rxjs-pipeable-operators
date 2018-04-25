import { LiftOperator } from '../lift-operator';


export class TakeOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            total: innerOperator.total
        });
    }
}
