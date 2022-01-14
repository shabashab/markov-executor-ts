import * as yargs from "yargs";
import * as fs from "fs";

import {parseAlgorithm} from "./parser";
import {executeOperations} from "./executer";
import {Operation} from "./operation"

yargs
	.scriptName("markov")
	.usage("$0 [args]")
	.command("$0 [fileName] [input] [inputFileName]", "The default command", (yargs) => {
		yargs.positional('fileName', {
			type: "string",
			describe: "the path to input file"
		});
		yargs.positional('input', {
			type: "string",
			describe: "the input data for the algorithm"
		});
		yargs.positional('inputFileName', {
			type: "string",
			describe: "the file name for input for the algorithm"
		});
	}, (argv) => {
		if(!argv.fileName) {
			console.log("No file name was specified!");
			return;
		}

		if(!(argv.input || argv.inputFileName)) {
			console.log("No input or input file name was specified!");
			return;
		}

		if(argv.input && argv.inputFileName) {
			console.log("Can't have input and input file name specified simoultaneously. Please specify only one of the arguments");
			return;
		}

		let inputContents: string = "";


		if(argv.input) {
			inputContents = <string>argv.input;
		}

		if(argv.inputFileName) {
			const fileName = <string>argv.inputFileName;

			if(!fs.existsSync(fileName)) {
				console.log("The specified input file does not exist");
				return;
			}

			inputContents = fs.readFileSync(fileName).toString();
		}

		const fileName: string = <string>argv.fileName;

		if(!fs.existsSync(fileName)) {
			console.log("The specified algorithm file does not exist");
			return;
		}

		const algorithmFileContents = fs.readFileSync(fileName).toString();
		let ops: Operation[] = [];

		try {
			ops = parseAlgorithm(algorithmFileContents);
		} catch (e: any) {
			console.log(e.message);
			return;
		}

		const operationsResult = executeOperations(inputContents, ops);
		console.log("Result: \n" + operationsResult);
	}).help().argv;
