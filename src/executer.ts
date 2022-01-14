import { Operation } from "./operation";

const executeOperation = (input: string, operation: Operation): string => {
  if (operation.from.startsWith(" ")) {
    const content =
      operation.from.length == 1
        ? ""
        : operation.from.substring(1, operation.from.length);

    const regexp = new RegExp("^" + content);

    return input.replace(regexp, operation.to);
  }

  return input.replace(operation.from, operation.to);
};

export const executeOperations = (
  input: string,
  operations: Operation[]
): string => {
  let isLooping = true;
	console.log(input);

  while (isLooping) {
    let executedOperationsCount = 0;

    for (const operation of operations) {
      const operationResult = executeOperation(input, operation);
      const operationSucceeded = operationResult !== input;

      if (!operationSucceeded) continue;

      executedOperationsCount++;
      input = operationResult;

			console.log(input);
      if (operation.final) isLooping = false;

      break;
    }

    if (executedOperationsCount == 0) break;
  }

  return input;
};
