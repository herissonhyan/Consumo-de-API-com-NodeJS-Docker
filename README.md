# Consumo de API com NodeJS + Docker

A principal função desse projeto é criar uma aplicação node.js capaz de consumir uma api publica como a pokeapi.co, criar uma pagina HTML na qual sera responsavel pelas consultas da api e após isso realizar o processo de conteinerização com o uso da plataforma [Docker][df1], ganhando assim a possibilidade de execução e implementação desses sistemas em maquinas heterogêneas já que um conteiner docker mantém suas configurações pré-definidas.

As principais tecnologias utilizadas no processo foram:
- [Docker][df1] (Para realizar a conteinerização do projeto)
- [Node.js][df2] (Para criar as rotas, consumir a API e mostrar resultados)
- [Express][df3] (Ele torna os aplicativos da web mais rápidos e fáceis em comparação com o desenvolvimento de um aplicativo usando apenas Node.js.)
- [BodyParser][df4] (O body-parser é um módulo capaz de converter o body da requisição para vários formatos para facilitar sua manipulação)
- [Node-fetch][df5] (A Node-fetch prove a funcionalidade de acessar e manipular partes do protocolo HTTP, como solicitações e respostas)
- [Nodemon][df7] (nodemon é uma ferramenta que ajuda a desenvolver aplicativos baseados em Node.js, reiniciando automaticamente o aplicativoquando são detectadas alterações de arquivo no diretório.)
- [Git/github][df6] (Para versionamento do código e upload no github)

# 1.criação da aplicação de node.js
#### 1.1 Instalação das dependências
O primeiro passo para a criação da nossa aplicação é instalar as dependencias necessárias, para isso dentro de uma pasta express_app criar um arquivo index.js, abra o terminal e inicie uma aplicação node ele irá criar um arquivo package.json com as informações dependências e versões do projeto:
```sh
npm init
```
Para utilizar a biblioteca node express é preciso instala-la e adiciona-la ao arquivo package.json a partir do seguinte comando:
```sh
npm install --save express
```
Da mesma maneira é feita a instalação das outras bibliotecas
```sh
npm install --save body-parser
```
As novas versões do node-fetch apresentam alguns problemas de compatibilidade, por isso optou-se instalar a versão 2.0.
```sh
npm install --save node-fetch@2
```
Para facilitar o processo de depuração é recomendado instalar a biblioteca nodemon, ela é responsável reiniciar automaticamente o aplicativo ao detectar qualquer alteração.
```sh
npm install --save nodemon
```
Dentro do arquivo package.json na seção de scripts adicione "start": "nodemon app.js" para executar o código com o nodemon.
Ao final você deve ter um arquivo package.json mais ou menos assim:
O arquivo deve estar mais ou menos assim:
```sh
{
  "name": "teste",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.1",
    "express": "^4.18.2",
    "node-fetch": "^2.6.7",
    "nodemon": "^2.0.20"
  }
}
```
#### 1.2 Criação do index.js
Agora vamos trabalhar no nosso arquivo index.js, o primeiro passo é importar e instânciar as bibliotecas baixadas:
```sh
// Importa as bibliotecas e instancia o módulo express
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()
```
Vamos criar em seguida uma rota local do tipo GET e enviar uma mensagem para testar nossa aplicação:
```sh
// Essa mensagem que irá ser retornada 
msg = "Só sucesso"
// Cria um end point para a api
app.get('/', (req, res) => res.send(msg));
  
// Nesse momento a aplicação estrá rodando e escutando
// Na porta 3000
app.listen(3000, () => {
    console.log("O app está rodando na porta 3000...");
})
```
Agora sua aplicação deve retornar a mensagem de sucesso no localhost:3000
#### 1.3 Criação do HTML para requisitar os dados da api
Vamos criar na nossa pasta um arquivo chamdo index.html, ele será responsavel por salvar a entrada de dados do usuario e passa-la para a nossa aplicação node, para isso vamos criar um forms, ele recebe dois parametros importantes que nos ajudará na comunicação com nossa aplicação, o primeiro é o action, ele define a rota para qual os dados serão enviados, o segundo parametro define qual metodo HTTP será usado, como queremos enviar dados escolhemos o metodo POST.
Dentro do corpo do form vamos passar um Input para o usuario entrar com seus dados e um botão para envio.

NOTE que o campu input possui um name entrada, esse valor será importante posteriormente para identificar qual campo de dado pegar.
```sh
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Usuario</title>
</head>
<body>
    <form action="/" method="post">
    <input id="entrada" name="entrada">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
```
#### 1.4 Criar comunicação 
Já temos onde nosso usuario irá submeter os dados, o desafio agora é fazer nossa aplicação node enxerga-los.
Para isso vamos criar uma rota do tipo POST para abrir nossa linha de comunicação e para testar a rota basta enviar como uma resposta uma mensagem de sucesso.
```sh
app.post('/', (req, res) => {
    res.send("Minha rota POST está funcionando")
});
```

O req e res do Express, são os objetos de requisição e resposta enquanto o res é usado para responder a solicitação daquela determinada rota, o res é responsavel por fazer a requisição dos dados da mesma.
Se tentarmos pegar os dados usando apenas o req.body teremos um problema, de certa forma nosso req não conhece que tipo de dados pegar, a partir desse momento entra em cena a lib bodyParser, com ela é possivel pegar os dados enviados, mas primeiro é importante configura-la, para fazer isso copie essa configuração no seu codigo.

Quando o cliente manda dados via form, esse pacote formata e transforma os dados para o formato de objeto javascript e joga tudo isso em um objeto dentro do objeto de requisição (req): req.body.
```sh
app.use(bodyParser.urlencoded({ extended: false }))
```
Agora podemos pegar esses dados usando o bodyParser desse modo:
```sh
app.post('/', (req, res) => {
    res.send(req.body.entrada)
});
```
Aqui percebemos o uso do atributo name utilizado lá no HTML.

Para que esse arquivo seja mostrado ao usuario quando a pagina for carregada, basta passar o caminho absoluto do index.html dentro da minha função da rota raiz atravez do comando res.sendFile().
OBS. Para facilitar esse caminh usa-se o __dirname, ele pega o caminho até esta pasta, ae basta concatenar com "/index.html".
```sh
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

```
### 1.5 Explicando a API
A API escolhida para o exemplo foi a pokeapi.co, ela nos dá acesso a informações de quase todos os pokemons, suas requisições são feitas de duas maneiras pelo ID ou pelo nome.
Qualquer duvida sobre o funcionamento consulte a [documentação][doc]

### 1.5.1 Requisitar dados da API
Já conseguimos pegar os dados do usuario, agora nos resta fazer uma requisição a pokeapi.co para isso utilizaremos a biblioteca node-fetch, ela é uma biblioteca isomorfica ou seja tem a mesma estrutura da biblioteca fetch usad no front-end, sua resposta para a requisição vem em formato Json.
Para fazer uma requisição simples pode ser feito da seguinte forma:
```sh
import fetch from 'node-fetch';
const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
const body = await response.text();
console.log(body);
```
Essa estrutura funciona de modo assincrono, assim para utilizarmos em nossa função post temos que transforma-la em uma função assincrona.
Para fazer a requisição com o pokemon escolhido basta interpolar ou concatenar a URL com a saida que veio do usuario.
Para mostrar as informações obtidas vamos passar um codigo HTML no res.send interpolados com nossas variaveis providas pelo Json.
```sh
app.post('/', async function (req, res) {
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
});
```
#### 1.6 Tratamento de entradas falhas
Um possivel problema para nossa aplicação é a possibilidade do usuario passar parametros invalidos, isso iria parar a execução da mesma pelo fato do node-fetch não conseguir fazer a requsição para API.
Dessa forma vamos implementar um try catch para resolver esse problema.
```sh
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
```
Agora nosso código está funcional e seguro de entradas invalidas :)
# 2. criação da imagem para o container
O processo de conteinerização começa com a criação da imagem dentro da pasta express_app, para isso criamos um arquivo DOCKFILE com as seguintes configurações:
```sh
FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]
```
1.O FROM leva o nome da imagem base para usar opcionalmente com sua versão nesse caso foi carregado uma imagem node.
2.WORKDIR informa o diretório que contém os arquivos do aplicativo no contêiner.
3.O comando COPY copia o arquivo package.json para o diretório do aplicativo.
4.O comando RUN executa o comando fornecido para instalar todas as dependências mencionadas no arquivo package.json.
5.Em seguida, COPY é usado para copiar o restante dos arquivos para o diretório do aplicativo no container.

Agora utilizando o comando build do docker podemos criar nossa imagem, além disso foi utilizado a flag -t ela é responsável por dar um nome a imagem nesse caso docker-container-nodejs

```sh
docker build -t container-nodejs .
```
#### 2.1 Criação do container
Depois da criação da imagem nos resta criar um container que vai carregar nossa imagem e executar seu conteúdo:
as flags utilizadas foram:
- -d: executa a aplicação em segundo plano
- -p: expõe a porta do IP para a comunicação com o exterior
- -v: é usado para montar nossos arquivos de aplicativo no diretório de aplicativo do contêiner - salvando os dados em um volume.
```sh
docker run -d -p 8000:3000 -v volume_do_nodejs:/app container-nodejs
```

[df1]: <https://www.docker.com/products/docker-desktop/>
[df2]: <https://nodejs.org/en/download/>
[df3]: <https://www.npmjs.com/package/express>
[df4]:<https://www.npmjs.com/package/body-parser>
[df5]: <https://www.npmjs.com/package/node-fetch>
[df6]: <https://git-scm.com/downloads>
[df7]: <https://www.npmjs.com/package/nodemon>
[doc]:<https://pokeapi.co/docs/v2>
