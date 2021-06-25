const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.urlencoded())
app.set('view engine', 'pug')
const port = 80

// Get the translation API URL from the environment variables
const translateApiUrl = process.env.TRANSLATE_API_URL + '/translate';

// The languages we will make available for translation
const availableLanguages = {
    en: { name: 'English', flag: '🇬🇧󠁿' },
    fr: { name: 'French', flag: '🇫🇷' },
    de: { name: 'German', flag: '🇩🇪' },
    es: { name: 'Spanish', flag: '🇪🇸' },
    it: { name: 'Italian', flag: '🇮🇹' }
}

// Render the form
app.get('/', async (req, res) => {
    res.render('index', { availableLanguages })
})

// Handle form submission
app.post('/', async (req, res) => {

    let translatedText;
    error = false;

    try {
        // The payload to send to the translation service
        let payload = {
            sourceLangCode: req.body.srcLangCode,
            targetLangCode: req.body.targetLangCode,
            text: req.body.text
        };

        let response = await axios.post(translateApiUrl, payload);
        translatedText = response.data.translatedText;
    } catch (e) {
        error = e.message
    }

    res.render('index', {
        availableLanguages,
        sourceLangCode: req.body.srcLangCode,
        targetLangCode: req.body.targetLangCode,
        text: req.body.text,
        error,
        translatedText
    })
})

// Spin up the web server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Stop the app when the docker container is killed
var nodeProcess = require('process')
nodeProcess.on('SIGINT', () => {
  console.info("Interrupted")
  nodeProcess.exit(0)
})

