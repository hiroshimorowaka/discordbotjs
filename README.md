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

### Depêndencias:

- Docker
- Node.js (Eu estou usando a 20.8.0)


>Faça um Git clone na sua máquina ou baixe o código fonte zipado
>
>Crie um arquivo `.env` na raiz do projeto e popule com as variáveis de ambiente do seu bot baseado no arquivo já existente `.env.template` (caso você não saiba criar um bot no discord, [clique aqui](https://discord.com/developers/docs/getting-started#step-1-creating-an-app))
>
>Depois de criado o arquivo, é só subir startar o projeto com `npm run start`, e ele irá subir os container e executar o projeto; 
> 
> para derrubar os container ou subi-los sem executar o projeto, existem os comandos:
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


