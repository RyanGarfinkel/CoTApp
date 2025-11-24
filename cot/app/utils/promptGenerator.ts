
const getStandardPrompt = (query: string) => {
    return `Solve this math problem and give only the final numerical answer. Problem: ${query}`;
};

const getCoTPrompt = (query: string) => {
    return `Solve this math problem step by step. Show your reasoning for each step (in plaintext, no markdown), then give the final answer. Problem: ${query}`;
};

export { getStandardPrompt, getCoTPrompt };
