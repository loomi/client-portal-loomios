# Immersion Project Template

Template de **projeto fullstack totalmente configurado para desenvolvimento assistido por agentes de IA**, em especial o [Claude Code](https://claude.com/claude-code). O monorepo já vem com a estrutura, convenções, documentação interna e *skills* customizadas necessárias para que o agente entenda o projeto e produza código alinhado ao padrão da casa desde o primeiro prompt.

## O que o template inclui

- **`back-end/`** — API em NestJS 11 + Prisma + PostgreSQL, com Swagger, autenticação JWT, filtro global de exceções, interceptor de resposta padronizado e configuração tipada via `ConfigService`.
- **`front-end/`** — App em Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + TanStack Query, organizado por *features*.
- **`.claude/skills/` na raiz** — *skills* especializadas centralizadas, abrangendo back-end e front-end. Assim, basta abrir **uma única sessão do Claude Code na raiz do monorepo** para trabalhar nos dois projetos sem precisar abrir sessões separadas.
- **`CLAUDE.md` em cada subprojeto** — guia autoritativo de arquitetura, convenções e *workflows* lido pelo agente antes de qualquer alteração.

### Skills disponíveis

Todas vivem em `.claude/skills/` e usam prefixo `back-` ou `front-` para deixar claro a qual subprojeto pertencem:

| Back-end                  | Front-end                  |
| ------------------------- | -------------------------- |
| `/back-add-feature`       | `/front-test`              |
| `/back-add-tests`         | `/front-optimize`          |
| `/back-add-logs`          | `/front-security`          |
| `/back-prisma-change`     | `/front-ui-ux`             |
| `/back-swagger-docs`      | `/front-typescript-strict` |
| `/back-set-external-lib`  | `/front-design`            |
| `/back-standardize-code`  |                            |
| `/back-update-docs`       |                            |

A ideia é que você clone, configure e já comece a delegar tarefas ao Claude Code em linguagem natural ou via *slash commands*.

## Pré-requisitos

- Node.js 20+ e npm
- Git
- Acesso a uma instância PostgreSQL (local, em container, gerenciado em nuvem — qualquer uma serve)
- [Claude Code](https://claude.com/claude-code) instalado, se for usar o fluxo assistido por IA
- *(Opcional)* Docker e Docker Compose — apenas se quiser subir o PostgreSQL local via o `docker-compose.yml` que acompanha o `back-end/`

## Clonando o repositório

```bash
git clone <url-do-repositorio>
cd immersion-project-template
```

## Banco de dados (importante)

O back-end **não** sobe banco automaticamente. Antes de rodar, garanta que existe uma instância PostgreSQL acessível e que as variáveis de ambiente em `back-end/.env` apontam corretamente para ela. Sem isso, as migrations e a aplicação irão falhar.

No mínimo, defina em `back-end/.env`:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public
```

Use o banco que preferir:

- **Postgres já existente** (local, na sua máquina, ou remoto/nuvem): basta apontar a `DATABASE_URL` para ele.
- **Postgres via Docker (opcional)**: se você quiser, o `back-end/docker-compose.yml` sobe um container pronto com as credenciais de `.env.example`. Nesse caso:
  ```bash
  cd back-end
  docker compose up -d
  ```
  As variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` e `POSTGRES_PORT` no `.env` controlam o container e devem permanecer **consistentes com a `DATABASE_URL`**.

## Back-end

```bash
cd back-end
npm install
cp .env.example .env          # ajuste DATABASE_URL para o seu banco
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

A API ficará disponível em `http://localhost:3001/api` e o Swagger em `http://localhost:3001/docs`.

Comandos úteis:

| Comando                 | Descrição                          |
| ----------------------- | ---------------------------------- |
| `npm run lint`          | Lint com ESLint                    |
| `npm test`              | Testes unitários (Jest)            |
| `npm run test:e2e`      | Testes end-to-end                  |
| `npm run prisma:studio` | Abre o Prisma Studio               |
| `npm run db:reset`      | Reseta e re-aplica as migrations   |

## Front-end

Em outro terminal, na raiz do projeto:

```bash
cd front-end
npm install
cp .env.example .env.local
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`. Por padrão, ela aponta para `http://localhost:3001/api` — mantenha o back-end rodando antes de iniciar o front.

Comandos úteis:

| Comando             | Descrição                    |
| ------------------- | ---------------------------- |
| `npm run build`     | Build de produção            |
| `npm run start`     | Sobe a build de produção     |
| `npm run lint`      | Lint via `next lint`         |
| `npm run typecheck` | Checagem de tipos com `tsc`  |

## Ordem recomendada para subir tudo

1. Garanta um PostgreSQL acessível e atualize `back-end/.env` com a `DATABASE_URL` correta (ou rode `docker compose up -d` em `back-end/` se quiser usar o container).
2. `npm run prisma:migrate` em `back-end/`
3. `npm run start:dev` em `back-end/`
4. `npm run dev` em `front-end/`

## Trabalhando com Claude Code

Abra o Claude Code **na raiz do monorepo** — uma única sessão enxerga tanto o back-end quanto o front-end e tem acesso a todas as *skills*. Descreva a tarefa em linguagem natural ou invoque *skills* diretamente:

- `/back-add-feature criar módulo de pedidos com CRUD`
- `/back-prisma-change adicionar campo "status" em Order`
- `/back-add-tests cobrir OrdersService`
- `/front-ui-ux revisar acessibilidade da página de checkout`
- `/front-optimize reduzir bundle da home`

Cada *skill* declara seu *scope* (`back-end/` ou `front-end/`) e segue as convenções do `CLAUDE.md` correspondente — o agente *cd* para o diretório certo, lê o guia, e roda *lint*/*build*/testes antes de declarar concluído.

## Estrutura geral

```
.
├── .claude/
│   └── skills/              # skills compartilhadas (back-* e front-*)
├── back-end/                # API NestJS — ver back-end/CLAUDE.md
└── front-end/               # App Next.js — ver front-end/CLAUDE.md
```

Consulte os `README.md` e `CLAUDE.md` de cada subprojeto para detalhes de arquitetura, convenções e *recipes* completas.
<!-- ci/cd test 1778514086 -->
<!-- pipeline test 1778590224 -->
