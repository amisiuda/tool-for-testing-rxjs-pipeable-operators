import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { testPipesOn } from '../..';
import { testOperator } from './_utils.spec';


describe('filter()', () => {
    
    const sourceFactory = () => Observable.of(3, 4, 5);
    const sourcePiping =
        source =>
            source.pipe(
                filter((value: number) => value > 3));


    it('simple expect', (done) => {
        testOperator({
            sourceFactory,
            sourcePiping,
            
            expectationsFactory:
                source =>
                    testPipesOn(source)
                        .expect(filter),

            onComplete:
                (expectations, result) => {
                    expect(result).toEqual([ 4, 5 ]);
                    expectations.verify();
                    done();
                }
        });
    });


    it('should throw exception when user sets expectations on arguments', (done) => {
        testOperator({
            sourceFactory,
            sourcePiping,
            
            expectationsFactory:
                source =>
                    testPipesOn(source)
                        .expect(filter).calledWith([ value => value > 3 ]),

            onComplete:
                (expectations, result) => {
                    expect(() =>
                        expectations.verify()
                    ).toThrowError('Setting expectations on arguments is not supported for operator "filter".');
                    done();
                }
        });
    });
});
