//importa as dependencias
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

//constantes utilizadas
const url = 'https://pokeapi.co/api/v2/pokemon/'
let port = 3000;

//configurações da aplicação express
app.use(bodyParser.urlencoded({ extended: false }))



//rotas utilizadas
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.post('/', async function (req, res) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + req.body.entrada)
        const app = await response.json()
        res.send(`
            <div">
            <p><b>${app.name}</b></p>
            <img
            src='${app.sprites.front_default}'
            />
            <div>
                <p>Tipo: ${app.types[0].type.name}</p>
                <p>Peso: ${app.weight}</p>
                <p>Altura:${app.height}</p>
            </div>
            <a href="/">voltar</a>`)
    } catch {
        res.send('<p>Entarada de dados invalida</p> <a href="/">Voltar</a>');
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


