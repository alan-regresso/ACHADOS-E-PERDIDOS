# Achados Front

Front-end em React + Vite para o sistema de Achados e Perdidos do IFRN.

## Tecnologias

- React
- Vite
- React Router
- Axios
- API real de Achados e Perdidos

## Como executar

```bash
npm install
npm run dev
```

Depois abra o endereço mostrado pelo Vite.

## Chave da API

A chave está no arquivo `.env` apenas para uso local.

O `.gitignore` já impede que `.env` seja enviado para o GitHub.

## Rotas

- `/` — lista de itens
- `/item/:id` — detalhe
- `/novo` — cadastro
- `/editar/:id` — edição

## API

Base:
`https://api-achados.jefersonqueiroga.com.br`

A aplicação utiliza uma única instância Axios em `src/services/api.js`.
