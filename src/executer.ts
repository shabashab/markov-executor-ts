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
  let continueLoop = true;

  for (const operation of operations) {
    const operationResult = executeOperation(input, operation);
    const operationSucceeded = operationResult !== input;

    if (!operationSucceeded) continue;

    input = operationResult;
    if (operation.isFinal) continueLoop = false;

    return {
      output: input,
      continueLoop,
    };
  }

  return {
    output: input,
    continueLoop: false,
  };
};

export const executeAlgorithm = (
  input: string,
  algorithm: Algorithm
): AlgorithmExecutionResult => {
  const operations = algorithm.operations;
  let data: string = input;

	let stepsCount = 0;

  while (true) {
		stepsCount++;
    const executionResult = executeOperations(data, operations);

		if(executionResult.output == data) break;

    data = executionResult.output;

    if (!executionResult.continueLoop) break;
  }

  return {
		stepsCount,
		outputString: data
	};
};
