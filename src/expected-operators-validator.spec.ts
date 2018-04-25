import { map, reduce } from 'rxjs/operators';
import { ExpectedOperators } from './expected-operators';
import { ExpectedOperatorsValidator } from './expected-operators-validator';
import { IPipeTest } from './index.d';
import { LiftOperator } from './lift-inner-operators/lift-operator';
import { ScanOperator } from './lift-inner-operators/operators/ScanOperator';
import { Map } from './pipe-operators/operators/map';
import { Reduce } from './pipe-operators/operators/reduce';
import { PipedOperators } from './pipe-operators/piped-operators';


class MapOperator {}
class ReduceOperator {}


describe('ExpectedOperatorsValidator', () => {

    let _class: ExpectedOperatorsValidator;
    let parent: IPipeTest;
    let pipedOperators: PipedOperators;
    let expectedOperators: ExpectedOperators;
    const OPERATORS = [ new MapOperator(), new ReduceOperator() ];

    
    describe('validateOrder()', () => {

        it('should ignore order validation when "any" order strategy has been selected', () => {
            createExpectedOperators();
            expectedOperators.expect(map, parent).verify();
            //
            expect(() => {
                _class.validateOrder();
            }).not.toThrow();
        });


        describe('for exact order', () => {

            it('should not throw exception when order is exactly as expected', () => {
                createExpectedOperators();
                expectedOperators
                    .expect(map, parent)
                    .expect(reduce, parent)
                    .inExactOrder()
                    .verify();
                pipedOperators.order = [ 'map', 'reduce' ];
                _class = new ExpectedOperatorsValidator(expectedOperators, pipedOperators);
                    //
                expect(() => {
                    _class.validateOrder();
                }).not.toThrow();
            });


            it('should throw exception when order differs from expected', () => {
                createExpectedOperators();
                expectedOperators
                    .expect(reduce, parent)
                    .expect(map, parent)
                    .inExactOrder()
                    .verify();
                //
                pipedOperators.order = [ 'map', 'reduce' ];
                expect(() => {
                    _class.validateOrder();
                }).toThrowError(
                    'Order of called pipable operators is not as expected. ::: ' +
                    'Actual: map, reduce ::: ' +
                    'Expected: reduce, map');
            });
        });
    });


    describe('validateOperators()', () => {

        it('should throw exception when some of the expected operators are not found', () => {
            const givenOperatorsMap = {
                map: [ new Map() ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(reduce, parent)
                .inExactOrder()
                .verify();
            //
            expect(() => {
                _class.validateOperators(givenOperatorsMap);
            }).toThrowError('Following expected operators are missing: ::: reduce');
        });


        it('should throw exception when number of operators do not match expected operators', () => {
            const givenOperatorsMap = {
                map: [ new Map() ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(map, parent)
                .expect(reduce, parent)
                .inExactOrder()
                .verify();
            //
            expect(() => {
                _class.validateOperators(givenOperatorsMap);
            }).toThrowError(
                'Operators are not the same as expected. ::: ' +
                `Actual: map ::: ` +
                `Expected: map, reduce`);
        });


        it('should throw when calls count does not match', () => {
            const givenOperatorsMap = {
                map: [ new Map() ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(map, parent).calledTimes(2)
                .verify();
            //
            expect(() => {
                _class.validateOperators(givenOperatorsMap);
            }).toThrowError('Operator "map" is expected to be called 2 time(s). It was called 1 time(s).');
        });


        it('should call arguments validation on expected operator', () => {
            const operator = new Map();
            const givenOperatorsMap = {
                map: [ operator ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(map, parent)
                .verify();
            //
            const expectedOperator = expectedOperators.operators.map[0];
            spyOn(expectedOperator, 'equalsOrThrow');
            _class.validateOperators(givenOperatorsMap);
            expect(expectedOperator.equalsOrThrow).toHaveBeenCalledTimes(1);
        });


        it('should accept operators when no are expected', () => {
            const operator = new Map();
            operator.setArgs({
                project: () => 111,
                thisArg: {}
            });
            const givenOperatorsMap = {
                map: [ operator ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(map, parent)
                .verify();
            //
            expect(() => {
                _class.validateOperators(givenOperatorsMap);
            }).not.toThrow();
        });


        it('should successfully validate operators when given operators are as expected', () => {
            const givenOperatorsMap = {
                map: [ new Map() ],
                reduce: [ new Reduce() ]
            };
            createExpectedOperators();
            expectedOperators
                .expect(map, parent)
                .expect(reduce, parent)
                .inExactOrder()
                .verify();
            //
            expect(() => {
                _class.validateOperators(givenOperatorsMap);
            }).not.toThrowError();
        });
    });


    describe('validateLiftOperators()', () => {

        it('should throw exception when any lift operator has not been processed', () => {
            const leftLiftOperators: LiftOperator[] = [
                new ScanOperator({ constructor: { name: 'some-lift-operator' } })
            ];
            //
            createExpectedOperators();
            expect(() => {
                _class.validateLiftOperators(leftLiftOperators);
            }).toThrowError(
                'Not all lift operators have been processed! This is an unexpected error. ::: ' +
                'Left operators: some-lift-operator');
        });


        it('should not throw any exception when no lift operator have been left unprocessed', () => {
            createExpectedOperators();
            expect(() => {
                _class.validateLiftOperators([]);
            }).not.toThrow();
        });
    });


    function createExpectedOperators(): void {
        expectedOperators = new ExpectedOperators();
        pipedOperators = new PipedOperators();
        pipedOperators.addPipedOperators([ map ]);
        pipedOperators.addLiftedOperator(new MapOperator());
        pipedOperators.analyse();
        _class = new ExpectedOperatorsValidator(expectedOperators, pipedOperators);
        parent = {
            expect: expectedOperators.expect.bind(expectedOperators),
            verify: () => expectedOperators.done()
        };
    }
});
