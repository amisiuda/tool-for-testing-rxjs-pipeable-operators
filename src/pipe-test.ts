import { Observable } from 'rxjs/Observable';
import { ExpectedOperators } from './expected-operators';
import { ExpectedOperatorsValidator } from './expected-operators-validator';
import { ExpectedOperatorActions, IPipeTest } from './index.d';
import { PipedOperators } from './pipe-operators/piped-operators';


export class PipeTest implements IPipeTest {
    
    private expectedOperators: ExpectedOperators = new ExpectedOperators();
    private pipedOperators: PipedOperators = new PipedOperators();


    constructor(observable: Observable<any>) {
        this.spyOnLiftOperator(observable);
        this.spyOnPipeFunction(observable);
    }


    private spyOnPipeFunction(observable: Observable<any>): void {
        if (this.isSpiedUpon(observable.pipe)) {
            return;
        }
        const self = this;
        const spy = (...operators: any[]) => {
            this.pipedOperators.addPipedOperators(operators);
            const newObservable =
                operators.reduce((observable, operator) => {
                    return operator(observable);
                }, observable);
            this.spyOnPipeFunction(newObservable);
            return newObservable;
        }
        spyOn(observable, 'pipe').and.callFake(spy);
    }


    private spyOnLiftOperator(observable: Observable<any>): void {
        if (this.isSpiedUpon(observable.lift)) {
            return;
        }
        const realLift = observable.lift;
        const self = this;
        const spy = function(param: any) {
            const isContextDifferent = this !== observable;
            if (param) {
                self.pipedOperators.addLiftedOperator(param);
            }
            const newObservable =
                isContextDifferent
                    ? this.lift(param)
                    : realLift.call(this, param);
            self.spyOnLiftOperator(newObservable);
            return newObservable;
        }
        spyOn(observable, 'lift').and.callFake(spy);
    }


    private isSpiedUpon(obj: any) {
        const keys: string[] = Object.keys(obj);
        return (
            keys.indexOf('and') > -1 &&
            keys.indexOf('withArgs') > -1 &&
            keys.indexOf('calls') > -1
        );
    }


    expect(operator: any): ExpectedOperatorActions {
        return this.expectedOperators.expect(operator, this);
    }
    
    
    verify() {
        this.expectedOperators.done();
        this.pipedOperators.analyse();
        new ExpectedOperatorsValidator(this.expectedOperators, this.pipedOperators).validate();
    }
}
