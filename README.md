# CoTApp

## Next.js Demo
Follow these steps to run the Next.js app we made locally. Requires a Gemini API key.
1. `cd cot`
2. `npm install`
3. Create `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. `npm run dev`

## Compare Scripts
Follow these steps to run the scripts we used to compare standard and CoT prompting with Gemini and GPT-3.5-Turbo. Requires a Gemini and OpenAI API key.
1. `cd scripts`
2. `pip install -r requirement.txt`
3. Create `.env`:
   ```
   OPENAI_API_KEY=abcde12345
   GEMINI_API_KEY=abcde12345
   ```
4. Run scripts:
   - `python openai_test.py`
   - `python gemini_test.py`

### Output
The scripts generate JSON files containing the results of the comparison:

- **`gpt_results.json`**: Results from the GPT-3.5-Turbo model.
- **`gemini_results.json`**: Results from the gemini-2.5-flash model.

Each file contains:
- **experiment_info**: Date, model name, sample size, and seed.
- **results**: Accuracy of chain of thought and standard prompting results, number of problems correct.
- **detailed_results**: A list of every problem tested, including the question, ground truth, model responses, and whether the response was correct.

## Results
- **GPT-3.5-Turbo**: Chain-of-Thought prompting improved accuracy by **66%** (22% - 88%).
- **Gemini 2.0 Flash**: Chain-of-Thought prompting improved accuracy by **40%** (56% - 96%).

Both models showed significant performance gains when using Chain-of-Thought prompting on the GSM8K dataset. The JSON files we saved can be found in **`/scripts/`**.
