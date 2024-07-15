const TOKEN_COST_PER_1k = 0.005;

const generateCost = (usage: { total_tokens: number}) => {
    const totalTokens = usage.total_tokens;
    const cost = totalTokens * TOKEN_COST_PER_1k;
    console.log(`Tokens used: ${totalTokens}`);
    console.log(`Cost: $${cost.toFixed(4)}`);
    return { totalTokens, cost };
}