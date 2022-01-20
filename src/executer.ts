import { Operation } from "./operation";
import { Algorithm } from "./algorithm";

export interface AlgorithmExecutionResult {
  stepsCount: number;
  outputString: string;
}

const executeOperation = (input: string, operation: Operation): string => {
  return input.replace(operation.from, operation.to);
};

const executeOperations = (
  input: string,
  operations: Operation[]
): {
  output: string;
  continueLoop: boolean;
} => {
  let output = input;
  let continueLoop = false;

  for (const operation of operations) {
    const operationResult = executeOperation(output, operation);
    const operationSucceeded = operationResult !== input;

    if (!operationSucceeded) continue;

    output = operationResult;
    continueLoop = !operation.isFinal;

    break;
  }

  return {
    output,
    continueLoop,
  };
};

export const executeAlgorithm = (
  input: string,
  algorithm: Algorithm
): AlgorithmExecutionResult => {
  const operations = algorithm.operations;
  let data: string = input;

  let stepsCount = 0;

  for (let continueLoop = true; continueLoop; stepsCount++) {
    const operationsResult = executeOperations(data, operations);
    continueLoop = operationsResult.continueLoop;

    const output = operationsResult.output;

    if (output == data) break;
    data = output;
  }

  return {
    stepsCount,
    outputString: data,
  };
};
