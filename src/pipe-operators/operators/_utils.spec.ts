export function testOperator({ sourceFactory, expectationsFactory, sourcePiping, onComplete, onError = () => {} }): void {
    const source = sourceFactory();
    const expectations = expectationsFactory(source);
    const result: any[] = [];
    sourcePiping(source)
        .subscribe(
            value => result.push(value),
            onError,
            () => onComplete(expectations, result));
}
