import { ExpectedOperatorsBuilder } from './expected-operators-builder';
import { Operator } from './pipe-operators/operator';
import { Map } from './pipe-operators/operators/map';
import { Reduce } from './pipe-operators/operators/reduce';
import { Take } from './pipe-operators/operators/take';


describe('ExpectedOperatorsBuilder', () => {

    let mapOperator: Operator;
    let reduceOperator = new Reduce();
    let mapOperatorBuilder: ExpectedOperatorsBuilder;
    let reduceOperatorBuilder: ExpectedOperatorsBuilder;
    const ARGS: any[] = [ 1, 2 ];


    beforeEach(() => {
        mapOperator = new Map();
        reduceOperator = new Reduce();
        mapOperatorBuilder = ExpectedOperatorsBuilder.create(mapOperator);
        reduceOperatorBuilder = ExpectedOperatorsBuilder.create(reduceOperator);
    });


    describe('create()', () => {
        
        it('should create new operator data instance filled with default values', () => {
            expect(mapOperatorBuilder.operator.getId()).toEqual('map');
            expect(mapOperatorBuilder.args).toEqual([ ExpectedOperatorsBuilder.ANY_ARGS ]);
            expect(mapOperatorBuilder.callCount).toEqual(1);
        });
    });


    describe('setCallsArguments()', () => {

        describe('when calls count is not specified', () => {
        
            beforeEach(() => {
                mapOperatorBuilder.setCallsArguments(ARGS);
            });
    
            
            it('should set given arguments', () => {
                expect(mapOperatorBuilder.args).toEqual(ARGS);
            });
    
            
            it('should set call count when none has been specified before', () => {
                expect(mapOperatorBuilder.callCount).toEqual(ARGS.length);
            });
    
            
            it('should throw error when call arguments have already been set', () => {
                expect(() => {
                    mapOperatorBuilder.setCallsArguments(ARGS);
                }).toThrowError(`Call arguments for operator 'map' has already been specified!`);
            });
        });


        describe('when calls count is already specified', () => {
        
            beforeEach(() => {
                mapOperatorBuilder.setCallsCount(ARGS.length);
            });

        
            it('should set call arguments when only call count has been given before', () => {
                mapOperatorBuilder.setCallsArguments(ARGS);
                expect(mapOperatorBuilder.args).toEqual(ARGS);
            });

        
            it('should throw error when arguments length is different than specified calls count', () => {
                const args = ARGS.concat([3, 4]);
                expect(() => {
                    mapOperatorBuilder.setCallsArguments(args);
                }).toThrowError(`Length of given arguments does not fit previously specified calls count (${ARGS.length}). Given arguments: ${args}`);
            });
        });
    });


    describe('setCallsCount()', () => {

        describe('when calls arguments are not specified', () => {
        
            beforeEach(() => {
                mapOperatorBuilder.setCallsCount(ARGS.length);
            });
    
            
            it('should set given count', () => {
                expect(mapOperatorBuilder.callCount).toEqual(ARGS.length);
            });
    
            
            it('should set calls arguments when none has been specified before', () => {
                expect(mapOperatorBuilder.args).toEqual(ARGS.map(i => ExpectedOperatorsBuilder.ANY_ARGS));
            });
    
            
            it('should throw error when call count has already been set', () => {
                expect(() => {
                    mapOperatorBuilder.setCallsCount(ARGS.length);
                }).toThrowError(`Calls count for operator 'map' has already been specified!`);
            });
        });


        describe('when calls arguments are already specified', () => {
        
            beforeEach(() => {
                mapOperatorBuilder.setCallsArguments(ARGS);
            });

        
            it('should set call count when only call arguments have been given before', () => {
                mapOperatorBuilder.setCallsCount(ARGS.length);
                expect(mapOperatorBuilder.callCount).toEqual(ARGS.length);
            });

        
            it('should throw error when arguments length is different than specified calls count', () => {
                const count = ARGS.length + 10;
                expect(() => {
                    mapOperatorBuilder.setCallsCount(count);
                }).toThrowError(`Given calls count (${count}) does not fit previously specified number of call arguments (${ARGS.length}).`);
            });
        });
    });


    describe('merge()', () => {
        
        it('should create new operator data instance and fill it with it\'s data combined with the data from given source', () => {
            const mapOperatorBuilder2 = ExpectedOperatorsBuilder.create(mapOperator);
            const sourceArgs = [ 'a', 'b' ];
            mapOperatorBuilder.setCallsArguments(ARGS);
            mapOperatorBuilder2.setCallsArguments(sourceArgs);
            //
            const mergedOperatorData = mapOperatorBuilder.merge(mapOperatorBuilder2);
            //
            const expectedArgs = ARGS.concat(sourceArgs);
            expect(mergedOperatorData.args).toEqual(expectedArgs);
            expect(mergedOperatorData.callCount).toEqual(expectedArgs.length);
        });
        

        it('should throw exception when sources have different ids', () => {
            expect(() => {
                mapOperatorBuilder.merge(reduceOperatorBuilder);
            }).toThrowError(`Cannot merge operators with following ids: ${reduceOperatorBuilder.operator.getId()} and ${mapOperatorBuilder.operator.getId()}`);
        });
    });


    describe('build()', () => {

        it('should return list of expected piped operators', () => {
            const builder =
                ExpectedOperatorsBuilder.create(
                    new Take(),
                    2,
                    [ [4], [6] ]);
            const result = builder.build();
            expect(result.length).toEqual(2);
            expect(result[0].getId()).toEqual('take');
            expect(result[0].getArgs()).toEqual({ total: 4 });
            expect(result[1].getId()).toEqual('take');
            expect(result[1].getArgs()).toEqual({ total: 6 });
        });
    });
});
