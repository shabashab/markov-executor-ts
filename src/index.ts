import * as yargs from "yargs";
import * as fs from "fs";

import { parseAlgorithm } from "./parser";
import { AlgorithmExecutionResult, executeAlgorithm } from "./executer";
import { Algorithm } from "./algorithm";
import { measureExecutionTime } from "./helpers/measureExecutionTime";

yargs
  .scriptName("markov")
  .usage("$0 [args]")
  .command(
    "$0 [algorithm] [input] [inputFile] [outputFile] [rewrite]",
    "The default command",
    (yargs) => {
      yargs.positional("fileName", {
        type: "string",
        describe: "the path to algorithm file",
      });
      yargs.positional("input", {
        type: "string",
        describe: "the input data for the algorithm",
      });
      yargs.positional("inputFileName", {
        type: "string",
        describe: "the file name for input for the algorithm",
      });
      yargs.positional("outputFile", {
        type: "string",
        describe: "the file the file in which program will write the output",
      });
      yargs.positional("rewrite", {
        type: "boolean",
        describe:
          "if the flag is specified, than outputFile (if exists) will be rewritten",
      });
    },
    (argv) => {
      if (!argv.algorithm) {
        console.log("No algorithm file name was specified!");
        return;
      }

      if (!(argv.input || argv.inputFile)) {
        console.log("No input or input file was specified!");
        return;
      }

      if (argv.input && argv.inputFileName) {
        console.log(
          "Can't have input and input file specified simoultaneously. Please specify only one of the arguments"
        );
        return;
      }

      let inputContents: string = "";

      if (argv.input) {
        inputContents = <string>argv.input;
      }

      if (argv.inputFile) {
        const fileName = <string>argv.inputFile;

        if (!fs.existsSync(fileName)) {
          console.log("The specified input file does not exist");
          return;
        }

        inputContents = fs.readFileSync(fileName).toString();
      }

      const fileName: string = <string>argv.algorithm;

      if (!fs.existsSync(fileName)) {
        console.log("The specified algorithm file does not exist");
        return;
      }

      if (argv.outputFile) {
        const outputFile = <string>argv.outputFile;

        if (fs.existsSync(outputFile) && !argv.rewrite) {
          console.log(
            "The output file with specified name already exists. If you want to rewrite it, please run the program with --rewrite flag"
          );
          return;
        }
      }

      const algorithmFileContents = fs.readFileSync(fileName).toString();

      let algorithm: Algorithm;

      try {
        algorithm = parseAlgorithm(algorithmFileContents);
      } catch (e: any) {
        console.log(e.message);
        return;
      }

			let algorithmResult!: AlgorithmExecutionResult;

			const executionTime = measureExecutionTime(() => {
				 algorithmResult = executeAlgorithm(inputContents, algorithm);
			});

			console.log("Executed successfully in " + executionTime.toFixed(4) + "ms");
			console.log("Steps count: " + algorithmResult.stepsCount);

      if (argv.outputFile) {
				const outputFilePath = <string>argv.outputFile;

        fs.writeFileSync(outputFilePath, algorithmResult.outputString);
				console.log("Output has been written to " + outputFilePath);
      } else {
        console.log("Output: \n" + algorithmResult.outputString);
      }
    }
  )
  .help().argv;
