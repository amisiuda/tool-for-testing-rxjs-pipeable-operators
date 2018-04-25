import { LiftOperator } from '../lift-operator';


export class MapOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            project: innerOperator.project,
            thisArg: innerOperator.thisArg
        });
    }
}
