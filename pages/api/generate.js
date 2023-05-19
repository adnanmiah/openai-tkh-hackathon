import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const situation = req.body.situation || '';


  validateInput(situation, "Situation");

  function validateInput(input, inputName) {
    if (input.trim().length === 0) {
      res.status(400).json({
        error: {
          message: `Please enter a valid ${inputName}`,
        }
      });
      return;
    }
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(situation),
      temperature: 0.9,
      max_tokens: 250,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(situation) {
  return `You give advice on environmentally conscious things you can do to your home or place of living.
You respond with a max of 250 tokens, so you should keep your bullets straight to the point.
Don't give an intro or ending, just respond with 10 bullet points of things to do to be more environmentally concious based on the following input:

${situation}`;
}
