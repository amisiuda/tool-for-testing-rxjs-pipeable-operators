import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { testPipesOn } from '../..';
import { testOperator } from './_utils.spec';


describe('map()', () => {
    
    const sourceFactory = () => Observable.of(1, 2, 3);
    const sourcePiping =
        source =>
            source.pipe(
                map((value: any) => value * 2));


    it('simple expect', (done) => {
        testOperator({
            sourceFactory,
            sourcePiping,
            
            expectationsFactory:
                source =>
                    testPipesOn(source)
                        .expect(map),

            onComplete:
                (expectations, result) => {
                    expect(result).toEqual([2, 4, 6]);
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
                        .expect(map).calledWith([ value => value * 2 ]),

            onComplete:
                (expectations, result) => {
                    expect(() =>
                        expectations.verify()
                    ).toThrowError('Setting expectations on arguments is not supported for operator "map".');
                    done();
                }
        });
    });
});
