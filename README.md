# Hiroshi's Discord BOT

### Objetivo: Estudar novas coisas, como Redis, postgres, Discord.js e etc.

### Nível atual como programador: Iniciante

>desculpe pelo meu inglês ruim

## Stack

- Node.js
- Discord.js (Comunicação com a API do discord)
- Postgres (Persistencia de alguns dados)
- pg (Conexão no banco | Querys são feitas manualmente)
- Redis (cache)
- Docker
- CommandKit library (Event and command handler)

## Features

- **/clear** (limpa as mensagens do chat)
- **/blacklist [subCommand]** (Adiciona palavras a blacklist)
- **/ping** (Mostra o ping do bot)
- **/setup** (Configura o banco de dados da guild)
- **/timeout [subCommand]** (Deixa o usuário selecionado impossibilitado de digitar em chats ou remove seu timeout)
- **/bot [subCommand]** (Da reload em algumas features do bot, como commands, event listeners e validations)
- **/say (text)** (Bot diz algo que você escreveu)
- **/speak (text)** (Le sua mensagem em TTS)
- **/choose (text[])** (Escolhe aleatoriamente entre as opções passadas pela option)
- **/help** (Mostra todos os comandos cadastrados e suas opções)
- **/warn [subCommand]** (Sistema de warns)
- **/dm (user) (text)** (Envia uma mensagem para um usuário especifico pela DM)
- etc etc
## Como executar o projeto:

### Baixar o repositório

Para executar o projeto, você primeiro precisa baixar o repositório na sua maquina, utilizando:

```bash
Git clone https://github.com/hiroshimorowaka/discordbotjs.git
```

ou baixando de forma zipada e descompactando na sua pasta.

### Depêndencias globais:

- Docker Engine v24.0.6 com Docker Compose v2.22.0
- Node.js v20.8.0

### Dependências locais

Então após baixar o repositório, não se esqueça de instalar as dependências locais do projeto:

```bash
npm install
```

### Configuração inicial

> Crie um arquivo `.env` na raiz do projeto e popule com as variáveis de ambiente do seu bot baseado no arquivo já existente `.env.template` (caso você não saiba criar um bot no discord, [clique aqui](https://discord.com/developers/docs/getting-started#step-1-creating-an-app))

### Configurando o BOT

Depois de feito toda a configuração do `.env` e das dependências, você irá precisar configurar o arquivo `config.json` e o `status.json`

- O `config.json` possui um objeto com duas chaves: `testServers` e `devs`  
  Esses parametros recebem um array com o ID dos servidores de testes que comandos marcados com `devsOnly` será registrado e o `devs` que é o ID das pessoas que são desenvolvedores que receberão permissão de executar esses comandos  
  Mais informações sobre os comandos em:

  - [Commandkit Guide](https://commandkit.js.org/guide/installation)
  - [Commandkit Docs](https://commandkit.js.org/docs/typedef/AutocompleteProps)
  - [Developer video tutorial](https://www.youtube.com/watch?v=hUKh0NS1Ypk&ab_channel=UnderCtrl)

- O `status.json` possui um array com multiplos objetos, e dentro de cada objeto possui as chaves: `name` e `type`.  
  `Name` é a chave que define a frase que você quer que apareça no status do bot  
  `Type` é o tipo de status que você quer que apareça no bot (listening/playing etc)  
  Você pode ter multiplos objetos para que fique fazendo um looping entre eles dentro de 10 segundos, mas caso você não queira fazer nenhum looping, você pode definir somente UM status no `status.json`  
  Mais informações sobre status em:
  - [Discord.js Guide](https://discordjs.guide/popular-topics/faq.html#how-do-i-set-my-playing-status)
  - [Arquivo que controla a mudança de status](https://github.com/hiroshimorowaka/discordbotjs/blob/main/src/index.js)
  - [Arquivo que mostra como definir os status type dentro do status.json](https://github.com/hiroshimorowaka/discordbotjs/blob/main/status_type.txt)

Depois de fazer todas as etapas acima, seu bot já está pronto para ser executado!

> Agora é só startar o projeto com `npm run start`, e ele irá subir os container e executar o projeto;
>
> Para derrubar os container ou subi-los sem executar o projeto, existem os comandos:  
> `npm run up:services` Subir os containers  
> `npm run down:services` Derrubar os containers  
> `npm run stop:services` Parar os container respectivamente

