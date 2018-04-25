import { take } from 'rxjs/operators';
import { MapOperator } from '../lift-inner-operators/operators/MapOperator';
import { PipedOperators } from './piped-operators';
import { ScanOperator } from '../lift-inner-operators/operators/ScanOperator';
import { Take } from './operators/take';


describe('PipedOperators', () => {

    let _class: PipedOperators;


    beforeEach(() => {
        _class = new PipedOperators();
    });


    describe('addPipedOperators()', () => {

        it('should add given operators to list', () => {
            const operators1 = [ 'operator-1', 'operator-2' ];
            const operators2 = [ 'operator-4', 'operator-6' ];
            //
            _class.addPipedOperators(operators1);
            _class.addPipedOperators(operators2);
            //
            expect(_class.calledOperators).toEqual([ operators1, operators2 ]);
        });
    });


    describe('addLiftedOperator()', () => {

        it('should add given operators to list', () => {
            const mapOperator = new MapOperator({});
            const scanOperator = new ScanOperator({});
            //
            _class.addLiftedOperator(mapOperator);
            _class.addLiftedOperator(scanOperator);
            //
            expect(_class.liftedInnerOperators).toEqual([ mapOperator, scanOperator ]);
        });
    });


    describe('analyse()', () => {

        const ARGS = {
            total: 4
        };


        it('should properly analyse given data', () => {
            _class.addPipedOperators([ take ]);
            _class.addLiftedOperator(getTestLiftOperator());
            _class.analyse();
            //
            expect(_class.leftLiftOperators).toEqual([]);
            expect(_class.order).toEqual([ 'take' ]);
            const ExpectedOperator = new Take();
            ExpectedOperator.setArgs(ARGS);
            expect(_class.operatorsMap).toEqual({ take: [ ExpectedOperator ] });
        });


        function getTestLiftOperator() {
            class TakeOperator {
                total = ARGS.total;
            }
            return new TakeOperator();
        }
    });
});
