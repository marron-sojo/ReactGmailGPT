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

  const emailPrompt = req.body.emailPrompt || '';
  // todo - implement tones and reqType
  // depends how we get the value
  // if we get the value by array -> change to string 
  // ex) friendly, formal
  // const tones = req.body.tones || '';
  // const reqType = req.body.type || '';
  const reqType = "GENERATE";
  
  if (emailPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid emailPrompt",
      }
    });
    return;
  }

  console.log(emailPrompt);

  try {
    // todo: when generate again, do we have to keep track of the history?
    // or does it automatically keeps track of our conversation

    var completion;

    switch(reqType) {
      case "PARAPHRASE":
        completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: paraphraseEmail(originalEmail, "", ""),
          max_tokens: 100,
          n: 1,
          temperature: 0.6, // 0(safe) - 1(creative)
        });
        break;
      // GENERATE
      default:
        completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: generateNewEmail(emailPrompt, "", ""),
          max_tokens: 100,
          n: 1,
          temperature: 0.6, 
        });
    }

    console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // todo
    // console.log(error);
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

function generateNewEmail(emailPrompt, tones, context) {
  return `
    Given the context: ${context}.
    You are an assistant helping to draft a ${tones} email. 
    Use the email in the double square bracket as the summary of the email that you need to rewrite. 
    Please note that you are rewriting the email and not replying. 
    Do not include the brackets in the output, only respond with the email. 
    Also, reply in language of the text in bracket. 
    Always have a greeting and closing too:
    [${emailPrompt}]`;
}

function paraphraseEmail(originalEmail, tones, context) {
  return `
    Given the context: ${context}. Paraphrase this email in the square bracket: [${originalEmail}]`;
}
