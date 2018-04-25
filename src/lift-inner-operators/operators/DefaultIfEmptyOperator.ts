import { LiftOperator } from "../lift-operator";


export class DefaultIfEmptyOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            defaultValue: innerOperator.defaultValue
        });
    }
}