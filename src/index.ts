import * as yargs from "yargs";
import * as fs from "fs";

import { parseAlgorithm } from "./parser";
import { AlgorithmExecutionResult, executeAlgorithm } from "./executer";
import { Algorithm } from "./models/algorithm";
import { measureExecutionTime } from "./helpers/measureExecutionTime";

yargs
  .scriptName("markov")
  .usage("$0 [args]")
  .command(
    "run <algorithm> [input] [inputFile] [outputFile] [rewrite]",
    "Parse and run the algorithm from file",
    (yargs) => {
      yargs
        .positional("algorithm", {
          type: "string",
          describe: "the path to algorithm file",
        })
        .positional("input", {
          type: "string",
          describe: "the input data for the algorithm",
        })
        .positional("inputFile", {
          type: "string",
          describe: "the file name for input for the algorithm",
        })
        .positional("outputFile", {
          type: "string",
          describe: "the file the file in which program will write the output",
        })
        .positional("rewrite", {
          type: "boolean",
          describe:
            "if the flag is specified, than outputFile (if exists) will be rewritten",
        })
        .check(({ algorithm }) => {
          if (!algorithm)
            throw new Error("No algorithm file has been specified");

          if (!fs.existsSync(algorithm))
            throw new Error("The algorithm file does not exist");

					return true;
        })
        .check(({ input, inputFile }) => {
          if (!input && !inputFile)
            throw new Error("Either input or inputFile should be specified");

          if (input && inputFile)
            throw new Error("Only single input or inputFile is allowed");

					return true;
        })
        .check(({ outputFile, rewrite }) => {
          const outputFilePath = <string>outputFile;
          const rewriteValue = <boolean>rewrite;

          if (fs.existsSync(outputFilePath) && !rewriteValue) {
            throw new Error(
              "The output file with specified name already exists. If you want to rewrite it, please run the program with --rewrite flag"
            );
          }

					return true;
        });
    },
    (argv) => {
      let inputContents: string = <string>argv.input;

      if (argv.inputFile) {
        const fileName = <string>argv.inputFile;

        inputContents = fs.readFileSync(fileName).toString();
      }

      const fileName: string = <string>argv.algorithm;

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

      console.log(
        "Executed successfully in " + executionTime.toFixed(4) + "ms"
      );
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
  .demandCommand()
  .help().argv;
