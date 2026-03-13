---
title: 📝 Guia de Estilo Markdown
date: 2026-01-02
category: Tutorial
description: Um guia completo de todos os recursos Markdown suportados no Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Este post demonstra cada recurso Markdown suportado pelo Astro-Theme-Aither. Use como referência ao escrever seus próprios posts. Adicione esta página aos favoritos — ela cobre toda a gama de opções de formatação disponíveis.

## Títulos

Use `##` para títulos de seção, `###` para subseções e `####` para sub-subseções. Evite `#` no conteúdo do post — o título do post já é renderizado como título de nível superior.

### Título de Terceiro Nível

Títulos de terceiro nível são ideais para dividir uma seção em tópicos distintos. Eles criam hierarquia visual sem serem muito proeminentes.

#### Título de Quarto Nível

Títulos de quarto nível funcionam para subseções detalhadas. Use-os com moderação — se seu esboço vai além de quatro níveis, considere reestruturar seu conteúdo.

### Práticas Recomendadas para Títulos

Algumas diretrizes para uso eficaz de títulos:

- **Não pule níveis** — vá de `##` para `###`, nunca de `##` direto para `####`. Pular níveis quebra a estrutura do documento e pode confundir leitores de tela.
- **Use títulos descritivos** — "Configuração" é melhor que "Coisas de Setup". Leitores escaneiam títulos antes de decidir se leem uma seção.
- **Use sentence case** — capitalize apenas a primeira palavra e nomes próprios.

## Parágrafos e Quebras de Linha

Texto de parágrafo flui naturalmente. Deixe uma linha em branco entre parágrafos para separá-los.

Este é um segundo parágrafo. Mantenha parágrafos focados em uma ideia para a melhor experiência de leitura.

Ao escrever para a web, parágrafos mais curtos tendem a funcionar melhor que longos blocos de texto. Um parágrafo de três a cinco frases é uma unidade de leitura confortável em telas. Se um parágrafo ultrapassa seis ou sete frases, considere dividi-lo.

Quebras de linha simples dentro de um parágrafo (sem linha em branco) serão tratadas como espaço, não como nova linha. Se precisar de uma quebra de linha forçada sem iniciar novo parágrafo, termine a linha com dois espaços ou use uma tag `<br>` — embora isso raramente seja necessário na prática.

## Ênfase

- **Texto em negrito** com `**asteriscos duplos**`
- *Texto em itálico* com `*asteriscos simples*`
- ***Negrito e itálico*** com `***asteriscos triplos***`
- ~~Riscado~~ com `~~tils duplos~~`

### Quando Usar Cada Estilo

**Negrito** funciona melhor para termos-chave, avisos importantes ou definições — qualquer coisa que o leitor não deve perder mesmo ao escanear. Use para a frase mais importante de um parágrafo, não para frases inteiras.

*Itálico* serve para ênfase dentro de uma frase, títulos de livros e publicações, termos técnicos na primeira utilização e expressões estrangeiras. Fornece uma ênfase mais leve que o negrito.

~~Riscado~~ é útil para mostrar correções, informações obsoletas ou itens concluídos em um changelog. Tem um conjunto mais restrito de usos, mas é valioso quando necessário.

## Links

[Link inline](https://astro.build) com sintaxe `[texto](url)`.

Links também podem referenciar outros posts em seu site usando caminhos relativos. Use texto de link descritivo — "leia o guia Markdown" é melhor que "clique aqui". Bom texto de link ajuda tanto leitores quanto mecanismos de busca a entender para onde o link leva.

Você também pode criar links que se leem naturalmente dentro da frase. Por exemplo: a [documentação do Astro](https://docs.astro.build) cobre cada recurso em detalhe.

## Listas

Lista não ordenada:

- Primeiro item
- Segundo item
  - Item aninhado
  - Outro item aninhado
- Terceiro item

Lista ordenada:

1. Primeiro passo
2. Segundo passo
   1. Sub-passo um
   2. Sub-passo dois
3. Terceiro passo

Lista de tarefas:

- [x] Configurar o projeto
- [x] Escrever o primeiro post
- [ ] Deploy para produção

### Dicas de Formatação de Listas

Listas são uma das ferramentas mais eficazes na escrita web. Elas quebram texto denso, tornam informações escaneáveis e comunicam claramente sequências ou coleções de itens.

**Use listas não ordenadas** quando os itens não têm sequência inerente — recursos, requisitos, opções ou exemplos.

**Use listas ordenadas** quando a sequência importa — passos em um processo, itens ranqueados ou instruções que devem ser seguidas em ordem.

**Use listas de tarefas** para acompanhar progresso, checklists de projeto ou itens de tarefas.

Mantenha itens de lista paralelos em estrutura. Se o primeiro item começa com um verbo, todos os itens devem começar com um verbo.

## Citações

> O propósito da abstração não é ser vago, mas criar um novo nível semântico no qual se pode ser absolutamente preciso.
>
> — Edsger W. Dijkstra

Citações aninhadas:

> Primeiro nível
>
> > Segundo nível
> >
> > > Terceiro nível

### Uso de Citações

Citações servem a vários propósitos além de citar pessoas famosas:

- **Citar fontes** — ao referenciar outro artigo, livro ou documento
- **Destaques** — destacar informações importantes ou avisos
- **Estilo email** — mostrar o que alguém disse em uma conversa à qual você está respondendo
- **Pull quotes** — chamar atenção para uma passagem-chave do seu próprio artigo

Ao usar citações com atribuição, coloque o nome do autor em uma linha separada precedida por um travessão, como mostrado no exemplo de Dijkstra acima.

## Código

`Código` inline com crases. Use código inline para nomes de funções como `getPublishedPosts()`, caminhos de arquivo como `src/content/posts/`, instruções de linha de comando como `pnpm dev` e quaisquer valores literais que apareçam no texto corrido.

Bloco de código com destaque de sintaxe:

```typescript
interface Post {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

function getPublishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
```

```css
@theme {
  --font-sans: 'system-ui', sans-serif;
  --font-serif: 'ui-serif', 'Georgia', serif;
}
```

### Dicas para Blocos de Código

Sempre especifique o identificador de linguagem após as crases triplas de abertura. Isso ativa o destaque de sintaxe, que melhora drasticamente a legibilidade. Identificadores comuns incluem `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python` e `markdown`.

Para comandos shell, use `bash` ou `sh`:

```bash
# Instalar dependências
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev

# Compilar para produção
pnpm build
```

Para arquivos de configuração JSON:

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

Mantenha blocos de código focados. Mostre apenas as linhas relevantes em vez de colar um arquivo inteiro. Se contexto for necessário, adicione um comentário indicando onde o código está.

## Tabelas

| Recurso | Status | Notas |
|---|---|---|
| Modo escuro | Suportado | Claro / Escuro / Sistema |
| Feed RSS | Embutido | `/rss.xml` |
| Sitemap | Auto-gerado | Via `@astrojs/sitemap` |
| SEO | Embutido | Open Graph + canonical |

Colunas alinhadas à direita e centralizadas:

| Esquerda | Centro | Direita |
|:---|:---:|---:|
| Texto | Texto | Texto |
| Texto mais longo | Texto mais longo | Texto mais longo |

### Diretrizes para Tabelas

Tabelas funcionam melhor para dados estruturados com colunas e linhas claras. São ideais para comparações de recursos, opções de configuração, parâmetros de API e dados de referência.

Mantenha tabelas simples. Se uma tabela tem mais de cinco ou seis colunas, fica difícil de ler em dispositivos móveis. Considere dividir tabelas complexas em várias menores, ou use formato de lista.

O alinhamento de colunas é controlado com dois-pontos na linha separadora:

- `:---` para alinhamento à esquerda (padrão)
- `:---:` para centralização
- `---:` para alinhamento à direita

Use alinhamento à direita para dados numéricos para que pontos decimais se alinhem visualmente.

## Linha Horizontal

Use `---` para criar uma linha horizontal:

---

Conteúdo após a linha.

Linhas horizontais são úteis para separar seções principais de um post, indicar mudança de tópico ou quebrar visualmente artigos muito longos. Use-as com parcimônia — se precisar de separadores frequentes, títulos podem ser uma escolha estrutural melhor.

## Imagens

Imagens são suportadas com sintaxe Markdown padrão:

```markdown
![Texto alternativo](./image.jpg)
```

Este tema é focado em tipografia, mas imagens funcionam quando você precisa delas.

### Práticas Recomendadas para Imagens

- **Sempre inclua texto alternativo** — é essencial para acessibilidade e também aparece quando imagens falham ao carregar
- **Use nomes de arquivo descritivos** — `dashboard-error-state.png` é melhor que `screenshot-2.png`
- **Otimize tamanhos de arquivo** — comprima imagens antes de adicioná-las ao seu repositório; imagens grandes desaceleram o carregamento das páginas
- **Considere o fluxo de leitura** — posicione imagens perto do texto que as referencia, não a parágrafos de distância

## Conclusão

Os recursos Markdown descritos neste guia cobrem a grande maioria do que você precisará para escrever em blog. A chave para um bom Markdown é usar o elemento certo para o propósito certo: títulos para estrutura, ênfase para importância, listas para coleções, blocos de código para conteúdo técnico e parágrafos para todo o resto.

Escreva com clareza, formate com consistência e deixe a tipografia fazer seu trabalho.
