# Hiroshi's Discord BOT

### Objetivo: Estudar novas coisas, como Redis, postgres, Discord.js e etc.

### Nível atual como programador: Iniciante

## Stack

- Node.js
- Discord.js (Comunicação com a API do discord)
- Postgres (Persistencia de alguns dados)
- Redis (cache)
- Docker
- CommandKit library (Event and command handler)

## Features

- **/clear** (limpa as mensagens do chat)
- **/blacklist [subCommand]** (Adiciona palavras a blacklist)
- **/birthday [subCommand]** (Adiciona sua data de aniversário e lista os aniversáriantes cadastrados)
- **/list** (Mostra a lista de pessoas que fazem aniversário e estão cadastradas)
- **/ping** (Mostra o ping do bot)
- **/setup** (Configura o banco de dados da guild)
- **/timeout [subCommand]** (Deixa o usuário selecionado impossibilitado de digitar em chats ou remove seu timeout)
- **/logs** (Adiciona um canal para ser enviado o logs dos comandos)
- **/bot [subCommand]** (Da reload em algumas features do bot, como commands, event listeners e validations)

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

## Tempo gasto:

### Dia 1

- Começo: 06/01/2024 - 22:30
- Fim: 07/01/2024 - 11:51
- Tempo total: 13:21

### Dia 2

- Começo: 07/01/2024 - 23:30
- Fim: 08/01/2024 - 16:03
- Tempo total: 16:33

### Dia 3

- Começo: 09/01/2024 - 03:30
- Fim: 09/01/2024 - 14:03
- Tempo total: 10:33

### Dia 4

- Começo: 11/01/2024 - 03:30
- Fim: 11/01/2024 - 17:07
- Tempo total: 13:37
