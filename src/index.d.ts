import { PipedOperator } from './pipe-operators/piped-operator';


export interface IPipeTest {
    expect: Function;
    verify: Function;
}


export interface Actions extends IPipeTest {
    inAnyOrder: Function;
    inExactOrder: Function;
}


export interface ExpectedOperatorActions extends Actions {
    calledWith: Function;
    calledTimes: Function;
}


export interface ExpectedAndActualOperators {
    id: string;
    expected: PipedOperator[];
    actual: PipedOperator[];
}
