import { Observable } from 'rxjs/Observable';
import { PipeTest } from './pipe-test';


export function testPipesOn(observable: Observable<any>) {
    return new PipeTest(observable);
}
