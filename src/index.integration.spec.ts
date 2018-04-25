import 'rxjs/add/observable/from';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { filter, map, reduce, take } from 'rxjs/operators';
import { testPipesOn } from '.';


describe('Pipe Test', () => {

    let testObservable: Observable<any>;


    beforeEach(() => {
        testObservable = Observable.create(() => {});
    });


    describe('expect()', () => {

        it('should succeed when no pipe has been called and no expectations have been set', () => {
            const pipeTest =
                testPipesOn(testObservable);
            pipeTest.verify();
        });


        it('should verify that given operator has been called', () => {
            const pipeTest =
                testPipesOn(testObservable)
                    .expect(take);
            testObservable
                .pipe(take(1));
            pipeTest.verify();
        });


        describe('calledWith()', () => {

            it('should accept arguments for multiple operator calls in the same order', () => {
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(take).calledWith([2], [1]);
                testObservable
                    .pipe(
                        take(2),
                        take(1));
                pipeTest.verify();
            });


            it('should fail when given arguments for multiple operator calls are not in correct order', () => {
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(take).calledWith([1], [2]);
                testObservable
                    .pipe(
                        take(2),
                        take(1));
                expect(() => pipeTest.verify()).toThrow();
            });


            it('should throw exception with deatils about failing call arguments expectation', () => {
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(take).calledWith([1], [4]);
                testObservable
                    .pipe(
                        take(1),
                        take(1));
                expect(() =>
                    pipeTest.verify()
                ).toThrowError('Operator "take" has different arguments than expected. Expected "4" but "1" has been given.');
            });


            it('should throw exception when expected arguments count is too big', () => {
                const actualCallArgs = [ 2, 1 ];
                const expectedCallArgs = [ 2, 1, 1 ];
                testoperatorArgsLength(actualCallArgs, expectedCallArgs);
            });


            it('should throw exception when expected arguments count is too small', () => {
                const actualCallArgs = [ 2, 1 ];
                const expectedCallArgs = [ 2 ];
                testoperatorArgsLength(actualCallArgs, expectedCallArgs);
            });


            function testoperatorArgsLength(actualCallArgs: number[], expectedCallArgs: number[]): void {
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(take).calledWith(...expectedCallArgs);
                testObservable
                    .pipe(
                        take(actualCallArgs[0]),
                        take(actualCallArgs[1]));
                expect(() => {
                    pipeTest.verify();
                }).toThrowError(`Operator "take" is expected to be called ${expectedCallArgs.length} time(s). It was called ${actualCallArgs.length} time(s).`);
            }
        });


        describe('assuring correct original observables execution', () => {

            it('should not affect original observable and should perform all expected operations within the pipe', (done) => {
                testObservable = Observable.from([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(map)
                        .expect(filter)
                        .expect(reduce)
                        .expect(take);
                const obs =
                    testObservable
                        .pipe(
                            take(5),
                            map(number => number * 3),
                            filter(number => number % 2 === 0),
                            reduce((sum, number) => sum + number, 0))
                        .subscribe((result: number) => {
                            expect(result).toEqual(18);
                            pipeTest.verify();
                            done();
                        });
            });
    
    
            it('should handle multiple pipe calls and return expected result', (done) => {
                testObservable = Observable.from([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(map)
                        .expect(filter)
                        .expect(reduce)
                        .expect(take);
                const obs =
                    testObservable
                        .pipe(take(5))
                        .pipe(map(number => number * 3))
                        .pipe(
                            filter(number => number % 2 === 0),
                            reduce((sum, number) => sum + number, 0))
                        .subscribe((result: number) => {
                            expect(result).toEqual(18);
                            pipeTest.verify();
                            done();
                        });
            });
        });


        describe('calls order', () => {

            it('should fail on incorrect expected order', (done) => {
                testObservable = Observable.from([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(filter)
                        .expect(map)
                        .expect(take)
                        .expect(reduce)
                        .inExactOrder();
                const obs =
                    testObservable
                        .pipe(
                            take(5),
                            map(number => number * 3),
                            filter(number => number % 2 === 0),
                            reduce((sum, number) => sum + number, 0))
                        .subscribe((result: number) => {
                            expect(result).toEqual(18);
                            expect(() => {
                                pipeTest.verify();
                            }).toThrowError('Order of called pipable operators is not as expected. ::: Actual: take, map, filter, reduce ::: Expected: filter, map, take, reduce');
                            done();
                        });
            });
    
    
            it('should succeed when order is not impotrant', (done) => {
                testObservable = Observable.from([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
                const pipeTest =
                    testPipesOn(testObservable)
                        .expect(filter)
                        .expect(map)
                        .expect(take)
                        .expect(reduce)
                        .inAnyOrder();
                const obs =
                    testObservable
                        .pipe(
                            take(5),
                            map(number => number * 3),
                            filter(number => number % 2 === 0),
                            reduce((sum, number) => sum + number, 0))
                        .subscribe((result: number) => {
                            expect(result).toEqual(18);
                            expect(() => {
                                pipeTest.verify();
                            }).not.toThrow();
                            done();
                        });
            });
        });
    });
});
