import { Operation } from "./operation";

const executeOperation = (input: string, operation: Operation): string => {
  return input.replace(operation.from, operation.to);
};

export const executeOperations = (
  input: string,
  operations: Operation[]
): string => {
  let isLooping = true;

  while (isLooping) {
    let executedOperationsCount = 0;

    for (const operation of operations) {
      const operationResult = executeOperation(input, operation);
      const operationSucceeded = operationResult !== input;

      if (!operationSucceeded) continue;

      executedOperationsCount++;
      input = operationResult;

      if (operation.isFinal) isLooping = false;

      break;
    }

    if (executedOperationsCount == 0) break;
  }

  return input;
};
