import { DefaultIfEmptyOperator } from './operators/DefaultIfEmptyOperator';
import { FilterOperator } from './operators/FilterOperator';
import { MapOperator } from './operators/MapOperator';
import { ScanOperator } from './operators/ScanOperator';
import { TakeLastOperator } from './operators/TakeLastOperator';
import { TakeOperator } from './operators/TakeOperator';


export const LIFT_OPERATORS_MAP: {[k: string]: any} = {
    ScanOperator,
    TakeLastOperator,
    DefaultIfEmptyOperator,
    MapOperator,
    FilterOperator,
    TakeOperator
};
