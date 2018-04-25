import { Operator } from '../pipe-operators/operator';


export abstract class LiftOperator extends Operator {

    private id: string;


    constructor(innerOperator: any, args: {[k: string]: any}) {
        super();
        this.setArgs(args);
        this.id = innerOperator.constructor.name;
    }


    getId(): string {
        return this.id;
    }
}
