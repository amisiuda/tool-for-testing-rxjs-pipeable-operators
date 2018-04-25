import { LiftOperator } from '../lift-operator';


export class TakeLastOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            total: innerOperator.total
        });
    }
}
