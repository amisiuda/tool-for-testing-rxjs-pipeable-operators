# Tool for testing RxJs pipeable operators

The aim of this project is to provide a tool for easy testing of **RxJs**'s pipeable operators.

## Motivation
The main motivation for starting this project was the prospect for solving not trivial task and have fun hacking my way to find the solution.

This idea also looked as a good opportunity to learn more about RxJs's implementation and design.

## Main challenges
* Getting used operators' arguments

    Since observable's pipe function is fed with already processed function, the challenge was to find a way of retreiving parameters which were given to those functions.

    Solution involved listening on observable's "lift" function which appears to used as a base of each available pipeable operator.

* Assuring correct results of their computations

    Knowing that each operator should provide a function which accepts  observable and returns derived observable, this problem has been solved by feeding each subsequent operator with the observable provided by previous operator. The data could be then gathered by spying on each observable given to each operator.

* Setting expectation on arguments which are functions.

    It is still an open point.

## Supported operators

The number of operators is limited due to the fact that the project's purpose was to solve a problem and not provide full support.

In case you will want to use it and need more operators to be supported feel free to contact me and we will find a solution to that :)

Below is the list of currently supported operators and their support types. 

| Operator  | Call count support* | Arguments support** |
| --------- | ------------------- | ------------------- |
| filter    | yes                 | no                  |
| map       | yes                 | no                  |
| reduce    | yes                 | no                  |
| take      | yes                 | yes                 |
 
\* Support for expecting specific number of given operator's usages.

\*\* Support for expecting specific arguments used on given operator.

## Dependencies
Tool is designed to work with `jasmine` framework.

## Examples

For examples of usage please see the integration tests available in `./src/index.integration.spec.ts`.
