import { LiftOperator } from '../lift-operator';


export class ScanOperator extends LiftOperator {

    constructor(innerOperator: any) {
        super(innerOperator, {
            accumulator: innerOperator.accumulator,
            seed: innerOperator.seed,
            hasSeed: innerOperator.hasSeed
        });
    }
}
