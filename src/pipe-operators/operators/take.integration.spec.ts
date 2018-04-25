import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { testPipesOn } from '../..';
import { testOperator } from './_utils.spec';


describe('take()', () => {
    
    const sourceFactory = () => Observable.of(1, 2, 3);
    const sourcePiping =
        source =>
            source.pipe(
                take(2));


    it('simple expect', (done) => {
        testOperator({
            sourceFactory,
            sourcePiping,
            
            expectationsFactory:
                source =>
                    testPipesOn(source)
                        .expect(take),

            onComplete:
                (expectations, result) => {
                    expect(result).toEqual([ 1, 2 ]);
                    expectations.verify();
                    done();
                }
        });
    });


    describe('argumetns expectations', () => {

        it('should successfully validate expectations', (done) => {
            testOperator({
                sourceFactory,
                sourcePiping,
                
                expectationsFactory:
                    source =>
                        testPipesOn(source)
                            .expect(take).calledWith([2]),
    
                onComplete:
                    (expectations, result) => {
                        expect(() => {
                            expectations.verify();
                        }).not.toThrow();
                        done();
                    }
            });
        });


        it('should throw exception when arguments are different', (done) => {
            testOperator({
                sourceFactory,
                sourcePiping,
                
                expectationsFactory:
                    source =>
                        testPipesOn(source)
                            .expect(take).calledWith([4]),

                onComplete:
                    (expectations, result) => {
                        expect(() => {
                            expectations.verify();
                        }).toThrowError('Operator "take" has different arguments than expected. Expected "4" but "2" has been given.');
                        done();
                    }
            });
        });
    });
});
