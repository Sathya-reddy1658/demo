import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import express from 'express';
dotenv.config();
const app = express();

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function ask(Q) {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [{
      "role": "user",
      "content": `Generate a list of 5 unique questions with  answers in JSON format on the topic of ${Q}.frame question in a manner that it has short answers`,
    }],
    "model": "llama3-70b-8192",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  });
  let res = "";
  for await (const chunk of chatCompletion) {
    res += (chunk.choices[0]?.delta?.content || '');
  }
  console.log(res);
}
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index'); 
});

app.listen(3000, () => {
  console.log('listening through port 3000');
}
)
