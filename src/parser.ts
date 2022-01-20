import { Operation } from "./operation";
import { Algorithm } from "./algorithm";

class ParsingError extends Error {
  constructor(cause: string) {
    super("The error occurred when parsing algorithm. " + cause);
  }
}

interface OperationData {
  from: string;
  to: string;
}

const createStartOfWordRegExp = (from: string): RegExp => {
  const regexpContent = from.length == 1 ? "" : from.substring(1, from.length);

  return new RegExp("^" + regexpContent);
};

const replaceSpecialCharacters = (
  input: string,
  specialCharacters: string[]
) => {
  let outputString = "";

  for (const inputChar of input) {
    if (specialCharacters.find((value) => value == inputChar) !== undefined) {
      outputString += "\\";
    }

    outputString += inputChar;
  }

  return outputString;
};

const replaceRegexSpecialChars = (input: string): string => {
  const regexSpecialCharacters = [
    ".",
    "+",
    "?",
    "*",
    "^",
    "{",
    "}",
    "[",
    "]",
    "(",
    ")",
    "|",
    "\\",
  ];

  return replaceSpecialCharacters(input, regexSpecialCharacters);
};

const createOperationInputRegex = (input: string): RegExp => {
  const regexString = replaceRegexSpecialChars(input);

  if (regexString.startsWith(" ")) return createStartOfWordRegExp(regexString);
  return new RegExp(regexString);
};

const parseOperation = (line: string): OperationData => {
  const regex = /\"(?<from>.+)\" *(->) *\"(?<to>.*)\"/;

  const match = line.match(regex);

  if (match == null || match.groups == undefined) {
    throw new ParsingError("Invalid input line format: " + line);
  }

  const from = match.groups.from;
  const to = match.groups.to;

  return {
    from,
    to,
  };
};

const createOperationFromLine = (line: string): Operation => {
  const operationData = parseOperation(line);

  let from: RegExp;

  let isOperationFinal = false;

  if (operationData.to.charAt(operationData.to.length - 1) == ".") {
    isOperationFinal = true;
    operationData.to = operationData.to.substring(
      0,
      operationData.to.length - 1
    );
  }

  from = createOperationInputRegex(operationData.from);

  return {
    from,
    to: operationData.to,
    isFinal: isOperationFinal,
  };
};

export const parseAlgorithm = (input: string): Algorithm => {
  const lines = input.split("\n");
  const operations: Operation[] = [];

  for (const line of lines) {
    const lineData = line.trim();

    if (lineData == "") continue;
    if (lineData.startsWith("//")) continue;

    operations.push(createOperationFromLine(line));
  }

  return { operations };
};
