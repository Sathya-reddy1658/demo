import express from 'express';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(express.json());
app.set('view engine', 'ejs');

async function ask(Q) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [{
                "role": "user",
                "content": `Generate a list of 5 unique questions with answers in Array format on the topic of ${Q}. Frame questions in a manner that it has short answers.do not send any other text except the JSON object.`,
            }],
            "model": "llama3-70b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        const result = chatCompletion.choices[0]?.message?.content || '';

        return result;
    } catch (error) {
        console.error('Error in ask function:', error);
        throw new Error('Failed to get completion');
    }
}

app.get('/ask', async (req, res) => {
    const query = req.query.name;
    try {
        const result = await ask(query);
        res.json({ result });
    } catch (err) {
        console.log(err);
    }
});
app.get('/search', async (req, res) => {
    const query = req.query.name;
    console.log("hello");
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [{
                "role": "user",
                "content":  query,
            }],
            "model": "llama3-70b-8192",
            "temperature": 1,
            "max_tokens": 8192,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        let cont = chatCompletion.choices[0]?.message?.content || '';

        res.send(cont);
    } catch (error) {
        console.error('Error in ask function:', error);
        throw new Error('Failed to get completion');
    }

})

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});




