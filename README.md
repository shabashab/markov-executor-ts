# Markov Executor TS

This simple program allows you to execute markov's normal algorithms.

## Building

Run the `build` script using your package manager (originally `pnpm`).

Example for `npm`:
```
npm run build
```

Example for `pnpm`:
```
pnpm run build
```

Example for `yarn`:
```
yarn run build
```


## Running

Arguments:
- `fileName` - the file name or path to the algorithm
- `input` or `inputFileName` - the input to the algorithm or the file name of the file that has the input for the algorithm
- `outputFile` - the file the algorithm output will be written in (if not specified, output will be displayed in stdout)
- `rewrite` - if the specified outputFile already exists, allows the program to rewrite it

## Algorithm format

### Algorithm entries

The algorithms are written in the format:
```
"<from>" -> "<to>"
```

If the `<from>` starts with the space, it indicates that the program will look for the start of the line.

If the `<to>` ends with the `.`, it indicates that the algorithm will finish after the replacement.

Every line in the algorithm file is only one replacement written in a format stated above.

### Comments

You can define comments in an algorithm by starting the line with `//`

Example:

```
//The input1 string converts to output1 string
"input1" -> "output1"
```
