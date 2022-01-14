import {Operation} from "./operation";

class ParsingError extends Error {
	constructor(cause: string) {
		super("The error occurred when parsing algorithm. " + cause);
	}
}

const parseOperation = (line: string): Operation => {
	const regex = /\"(?<from>.+)\" *(->) *\"(?<to>.+)\"/;

	const match = line.match(regex);

	if(match == null || match.groups == undefined) {
		throw new ParsingError("Invalid input line format: " + line);
	}

	let from = match.groups.from;
	let to = match.groups.to;
	let isOperationFinal = false;

	if(to.charAt(to.length - 1) == '.') {
		isOperationFinal = true;
		to = to.substring(0, to.length - 1);
	}

	return {
		from,
		to,
		final: isOperationFinal
	};
}

export const parseAlgorithm = (input: string): Operation[] => {
	const lines = input.split("\n");
	const operations: Operation[] = [];

	for(const line of lines) {
		const lineData = line.trim();

		if(lineData == "")
			continue;

		operations.push(parseOperation(line));	
	}

	return operations;
};
