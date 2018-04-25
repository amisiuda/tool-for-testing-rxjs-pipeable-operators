import { Observable } from 'rxjs/Observable';
import { filter, map, reduce, take } from 'rxjs/operators';
import { Filter } from './operators/filter';
import { Map } from './operators/map';
import { Reduce } from './operators/reduce';
import { Take } from './operators/take';


export const OPERATOR_CLASS = {
    [ Reduce.id ]: Reduce,
    [ reduce.toString() ]: Reduce,
    [ reduce(() => {}).toString() ]: Reduce,
    [ reduce<number>(() => 1, 1).toString() ]: Reduce,

    [ Map.id ]: Map,
    [ map.toString() ]: Map,
    [ map(Observable.create()).toString() ]: Map,
    
    [ Filter.id ]: Filter,
    [ filter.toString() ]: Filter,
    [ filter(() => true).toString() ]: Filter,
    
    [ Take.id ]: Take,
    [ take.toString() ]: Take,
    [ take(1).toString() ]: Take
};
