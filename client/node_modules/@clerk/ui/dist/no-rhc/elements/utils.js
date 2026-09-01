//#region src/elements/utils.ts
function distributeStrategiesIntoRows(strategies, maxStrategiesPerRow, lastAuthenticationStrategy) {
	if (lastAuthenticationStrategy && strategies.includes(lastAuthenticationStrategy)) {
		const remainingStrategies = strategies.filter((strategy) => strategy !== lastAuthenticationStrategy);
		if (remainingStrategies.length === 0) return {
			strategyRows: [[lastAuthenticationStrategy]],
			lastAuthenticationStrategyPresent: true
		};
		const remainingRows = distributeStrategiesIntoRows(remainingStrategies, maxStrategiesPerRow, null);
		return {
			strategyRows: [[lastAuthenticationStrategy], ...remainingRows.strategyRows],
			lastAuthenticationStrategyPresent: true
		};
	}
	if (strategies.length <= maxStrategiesPerRow) return {
		strategyRows: [strategies],
		lastAuthenticationStrategyPresent: false
	};
	const numRows = Math.ceil(strategies.length / maxStrategiesPerRow);
	const strategiesPerRow = Math.ceil(strategies.length / numRows);
	const strategyRows = Array.from({ length: numRows }, () => []);
	let currentArrayIndex = 0;
	for (const strategy of strategies) {
		strategyRows[currentArrayIndex].push(strategy);
		if (strategyRows[currentArrayIndex].length === strategiesPerRow) currentArrayIndex++;
	}
	return {
		strategyRows,
		lastAuthenticationStrategyPresent: false
	};
}

//#endregion
export { distributeStrategiesIntoRows };
//# sourceMappingURL=utils.js.map