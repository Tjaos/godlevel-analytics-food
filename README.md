# 🍽️ Analytics Food — Plataforma de Analytics para Restaurantes

Painel interativo para análise de vendas, desempenho e comportamento de clientes.
Desenvolvido com **Next.js 16**, **Prisma ORM** e **PostgreSQL** e **Shadcn** para componentização.

---

## 🚀 Tecnologias Principais

| Área               | Tecnologia                                                                                             | Finalidade                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **Frontend**       | [Next.js 16 (App Router)](https://nextjs.org/docs)                                                     | Interface interativa com SSR e componentes modernos |
| **Backend**        | [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | APIs unificadas para analytics                      |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/)                                                              | Banco relacional escalável                          |
| **ORM**            | [Prisma](https://www.prisma.io)                                                                        | Mapeamento e manipulação de dados com tipagem forte |
| **UI**             | [ShadCN/UI](https://ui.shadcn.com) + [TailwindCSS](https://tailwindcss.com)                            | Componentes modernos e responsivos                  |
| **Gráficos**       | [Recharts](https://recharts.org/en-US/)                                                                | Visualização de dados                               |

---

## 💡 Funcionalidades

- 📊 **Dashboard de Analytics Completo**
- 🔝 Produtos mais vendidos (por canal, dia e horário);
- 💸 Ticket médio por canal, loja e período;
- 🚴 Tempo médio de entrega (por loja, dia da semana e hora);
- ⚠️ Produtos com baixa saída por loja e período;
- 🚫 Clientes inativos (+30 dias) por loja
- 💰 Resumo de vendas e pedidos totais e ticket médio geral

---

## 🧱 Estrutura principal do Projeto

![Estrutura do projeto](./public/estrutura.png)

<p><strong>Legenda:</strong></p>

<ul>
  <li><strong>1️⃣ <code>/app/api/analytics/</code></strong> — Rotas de API (handlers) responsáveis pelos dados do dashboard</li>
  <li><strong>2️⃣ <code>/app/pages/analytics/</code></strong> — Páginas principais do painel de analytics</li>
  <li><strong>3️⃣ <code>/components/</code></strong> — Componentes reutilizáveis e estilizados (cards, modais, listas)</li>
  <li><strong>4️⃣ <code>/prisma/</code></strong> — Schema, migrations e client Prisma para conexão com PostgreSQL</li>
  <li><strong>5️⃣ <code>/public/</code></strong> — Assets públicos (ícones, imagens, favicon)</li>
  <li><strong>6️⃣ <code>/src/lib/</code></strong> — Funções auxiliares e configurações globais</li>
  <li><strong>7️⃣ <code>package.json</code></strong> — Dependências e scripts do projeto</li>
  <li><strong>8️⃣ <code>README.md</code></strong> — Documentação completa do projeto</li>
</ul>

## Como rodar o projeto Localmente

### 1️⃣ Clonar os repositórios abaixo

```bash
#O projeto em si
git clone https://github.com/Tjaos/godlevel-analytics-food

# entrar na pasta do projeto
cd godlevel-analytics-food

# instalar dependências
npm install

# Configure o .env
# ex:
DATABASE_URL="postgresql://challenge:challenge_2024@localhost:5432/challenge_db"

# Rodar o projeto
npm run dev
```

#### Projeto do banco de dados disponibilizado pela god-level:

```bash
# Clonar o repositório abaixo
git clone https://github.com/lucasvieira94/nola-god-level
```

#### Após clonar, acesse o [Repositório da god-level](https://github.com/lucasvieira94/nola-god-level) e siga o passo a passo descrito no mesmo para gerar o banco de dados e subir o mesmo para o docker.

#### Com os containers do banco de dados rodando use um aplicativo de banco de dados como o [dBeaver](https://dbeaver.io/) para testar a conexão e estando tudo certo modifique o arquivo **.env** do projeto conforme necessário.
