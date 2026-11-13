# Brev.ly

Encurtador de URL fullstack desenvolvido como desafio prático da Pós Tech Developer 360 da Rocketseat.

A aplicação permite cadastrar, listar e remover links encurtados, acompanhar a quantidade de acessos de cada um, exportar um relatório em CSV e redirecionar o link encurtado para a URL original.

## Estrutura

```
.
├── server   # API (back-end + DevOps)
└── web      # SPA em React (front-end)
```

## Tecnologias

**Back-end:** Node.js, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Zod, Cloudflare R2 (via SDK S3), Vitest e Docker.

**Front-end:** React, TypeScript, Vite, TailwindCSS, React Router, TanStack Query, React Hook Form e Zod.

## Rodando o projeto

Pré-requisitos: Node.js 22+, pnpm e Docker.

### Back-end

```bash
cd server
cp .env.example .env   # preencha as variáveis da Cloudflare
pnpm install
docker compose up -d db
pnpm db:migrate
pnpm dev
```

A API sobe em `http://localhost:3333` e a documentação (Swagger) fica em `http://localhost:3333/docs`.

Para rodar os testes (usa o banco `brevly_test`, criado automaticamente pelo container):

```bash
pnpm test
```

Para gerar a imagem Docker da aplicação:

```bash
docker build -t brevly-server .
```

Também é possível subir banco e API juntos com `docker compose up -d` (lembrando de rodar o `pnpm db:migrate` na primeira vez).

### Front-end

```bash
cd web
cp .env.example .env
pnpm install
pnpm dev
```

Exemplo de `.env` para rodar localmente:

```
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

## Rotas da API

| Método | Rota                  | Descrição                                        |
| ------ | --------------------- | ------------------------------------------------ |
| POST   | `/links`              | Cria um link                                     |
| GET    | `/links`              | Lista os links (paginação por cursor)            |
| GET    | `/links/:shortUrl`    | Busca a URL original a partir da URL encurtada   |
| DELETE | `/links/:id`          | Remove um link                                   |
| PATCH  | `/links/:id/access`   | Incrementa a quantidade de acessos               |
| POST   | `/links/exports`      | Gera o CSV, envia para o R2 e retorna a URL      |

## Algumas decisões

- **id nas operações de remoção e incremento:** as duas rotas usam o `id` do link, mantendo o mesmo padrão. A URL encurtada é usada só para a busca no redirecionamento.
- **URL encurtada:** aceita letras, números, `-` e `_`. É única no banco (constraint `unique`), então a busca por ela usa índice.
- **Listagem performática:** o `id` é um UUIDv7, que é ordenável pelo tempo, então a listagem usa paginação por cursor (`id < cursor`) em vez de `OFFSET`. No front a lista carrega mais itens conforme o scroll.
- **Contagem de acessos:** o incremento é feito direto no banco (`access_count + 1`) para não perder acessos simultâneos.
- **Exportação do CSV:** os registros são lidos do banco em lotes (cursor do Postgres) e enviados ao R2 via stream, sem carregar tudo na memória. O nome do arquivo leva um UUID, então é aleatório e único.
