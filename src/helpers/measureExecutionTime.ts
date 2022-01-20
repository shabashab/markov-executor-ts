export const measureExecutionTime = (fun: () => void): number => {
	const startTime = performance.now();
	fun();
	const endTime = performance.now();
	return endTime - startTime;
}
