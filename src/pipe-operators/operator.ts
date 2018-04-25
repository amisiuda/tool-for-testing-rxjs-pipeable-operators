export abstract class Operator {
    
    args!: {[k: string]: any} | undefined;


    abstract getId(): string;
    
    
    getArgs(): {[k: string]: any} | undefined {
        return this.args;
    }
    
    
    setArgs(args: {[k: string]: any}): void {
        this.args = args;
    }
}
