import { map, reduce, take } from 'rxjs/operators';
import { ExpectedOperators } from './expected-operators';
import { ExpectedOperatorsBuilder } from './expected-operators-builder';
import { IPipeTest } from './index.d';


describe('ExpectedOperators', () => {

    let _class: ExpectedOperators;
    let parent: IPipeTest;


    beforeEach(() => {
        _class = new ExpectedOperators();
        parent = {
            expect: _class.expect.bind(_class),
            verify: () => _class.done()
        };
    });


    describe('expect()', () => {
        
        it('should save last defined expectation data', () => {
            _class.expect(map, parent)
            expect(Object.keys(_class.operators)).toEqual([]);
            //
            parent.verify();
            expect(Object.keys(_class.operators)).toEqual([ 'map' ]);
        });

        
        it('should add default arguments and call count data about expected operator', () => {
            _class.expect(map, parent).verify();
            //
            expect(Object.keys(_class.operators).length).toEqual(1);
            expect(_class.operators['map'][0].getId()).toEqual('map');
            expect(_class.operators['map'][0].getArgs()).toEqual(ExpectedOperatorsBuilder.ANY_ARGS);
        });


        it('should return available actions for expected operator', () => {
            const actions = _class.expect(map, parent);
            //
            const expectedActions = [
                'calledWith',
                'calledTimes',
                'inAnyOrder',
                'inExactOrder',
                'expect',
                'verify'
            ];
            expect(Object.getOwnPropertyNames(actions)).toEqual(expectedActions);
        });


        it('should sum expected call count when setting multiple expectations of the same type', () => {
            _class.expect(map, parent)
                  .expect(map, parent)
                  .expect(map, parent)
                  .verify();
            //
            expect(_class.operators['map'].length).toEqual(3);
        });


        describe('call count', () => {

            it('should sum expected call count when setting multiple expectations of the same type and using "calledTimes()"', () => {
                _class.expect(map, parent).calledTimes(1)
                      .expect(map, parent).calledTimes(3)
                      .expect(map, parent)
                      .verify();
                //
                expect(_class.operators['map'].length).toEqual(5);
            });
            

            it('calling "calledWith()" should add proper amount to call count', () => {
                _class.expect(take, parent).calledWith([1], [2]).verify();
                //
                expect(_class.operators['take'].length).toEqual(2);
            });
        });


        describe('call arguments', () => {

            it('should create call arguments list with "undefined" values for unspecified call arguments', () => {
                _class.expect(map, parent).calledTimes(3)
                      .expect(map, parent)
                      .verify();
                //
                const expectedCallsArguments: any[] = [
                    undefined, undefined, undefined,
                    undefined
                ];
                const givenArgs = _class.operators['map'].map(o => o.getArgs());
                expect(givenArgs).toEqual(expectedCallsArguments);
            });


            it('should correctly sum arguments', () => {
                _class.expect(take, parent)
                      .expect(take, parent).calledWith([1], [2])
                      .expect(take, parent)
                      .expect(take, parent).calledWith([1])
                      .verify();
                //
                const expectedCallsArguments: any[] = [
                    undefined,
                    { total: 1 }, { total: 2 },
                    undefined,
                    { total: 1 }
                ];
                const givenArgs = _class.operators['take'].map(o => o.getArgs());
                expect(givenArgs).toEqual(expectedCallsArguments);
            });
        });


        describe('calls order', () => {

            it('should create correct call order', () => {
                _class.expect(map, parent).calledTimes(3)
                      .expect(reduce, parent).calledTimes(2)
                      .expect(map, parent)
                      .expect(reduce, parent)
                      .verify();
                //
                const expectedCallsOrder = [
                    'map', 'map', 'map',
                    'reduce', 'reduce',
                    'map',
                    'reduce'
                ];
                expect(_class.callsOrder).toEqual(expectedCallsOrder);
            });
        });
    });


    describe('Misc.', () => {
        
        it('should set "any" order strategy as default one', () => {
            expect(_class.orderStrategy).toEqual(ExpectedOperators.ANY_ORDER);
        });


        it('should set proper values', () => {
            _class.expect(map, parent).calledTimes(3)
                  .expect(reduce, parent)
                  .expect(map, parent)
                  .expect(take, parent).calledTimes(2).calledWith([4], [2])
                  .expect(map, parent)
                  .expect(take, parent).calledWith([5], [1])
                  .verify();
            //
            const expectedCallsOrder = [
                'map', 'map', 'map',
                'reduce',
                'map',
                'take', 'take',
                'map',
                'take', 'take'
            ];
            const expectedArguments: any = {
                map: [ undefined, undefined, undefined, undefined, undefined ],
                reduce: [ undefined ],
                take: [ { total: 4 }, { total: 2 }, { total: 5 }, { total: 1 } ]
            };
            expect(_class.callsOrder).toEqual(expectedCallsOrder);
            expect(_class.operators['map'].map(o => o.getArgs())).toEqual(expectedArguments.map);
            expect(_class.operators['reduce'].map(o => o.getArgs())).toEqual(expectedArguments.reduce);
            expect(_class.operators['take'].map(o => o.getArgs())).toEqual(expectedArguments.take);
        });
    });
});
