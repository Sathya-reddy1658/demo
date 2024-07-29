const Groq = require('groq-sdk');
const express = require('express');
const app = express();



document.getElementById('yo').addEventListener('click',()=>{
  console.log("hello");
})

app.listen(3000, () => {
  console.log('listening through port 3000');
}
)

const groq = new Groq();

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