
/**
 * This is a Netlify function that proxies requests to the OpenAI API.
 * It is used to hide the API key from the client.
 */

// Configure the OpenAI API client
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);



// Intercept API requests and return a response
module.exports.handler = async (event, context) => {
  console.log('> proxy.js: Running proxy function');

  // Check if the API key is configured
  if (!configuration.apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'proxy.js: OpenAI API key not configured!' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Run the proxy function
  const { body } = event;

  try {
    console.log('> proxy.js: trying to create chat completion');

    const data = JSON.parse(body);
    const completion = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      ...data
    });

    const message = completion.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    };


  // Catch possible errors
  } catch (error) {
    console.log(`> proxy.js: Error:`);
    console.log(error);

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message }),
      headers: { 'Content-Type': 'application/json', },
    };
  }
};
