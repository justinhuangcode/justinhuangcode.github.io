---
title: Agentes de IA e Uso de Ferramentas (Exemplo)
date: 2026-01-09
category: AI
description: Como modelos de IA vão além do chat executando ações no mundo real
tags: [AI, Agents]
pinned: false
---

Um agente de IA é um modelo de linguagem que pode tomar ações — não apenas gerar texto. Ele pode buscar na web, executar código, chamar APIs, ler arquivos e tomar decisões sobre o que fazer em seguida. Essa mudança da geração passiva de texto para a resolução ativa de problemas representa um dos desenvolvimentos mais significativos na IA aplicada.

## De Chat para Ação

Um chatbot responde perguntas. Um agente resolve problemas. A diferença é autonomia: agentes decidem quais ferramentas usar, em que ordem e como lidar com erros.

Considere a diferença na prática. Você pergunta a um chatbot: "Como está o clima em Tóquio?" Ele pode responder com base em seus dados de treinamento — que têm meses ou anos e quase certamente estão errados. Você faz a mesma pergunta a um agente, e ele chama uma API de clima, recupera os dados atuais e retorna uma resposta precisa e atualizada.

O chatbot gera texto plausível. O agente interage com o mundo.

### O Espectro da Autonomia

Nem todos os agentes são igualmente autônomos. Existe um espectro:

1. **Chat assistido por ferramentas** — o modelo pode chamar ferramentas, mas apenas em resposta direta às solicitações do usuário. Uma chamada de ferramenta por turno.
2. **Agentes multi-etapas** — o modelo pode encadear múltiplas chamadas de ferramentas para realizar uma tarefa, decidindo a sequência por conta própria.
3. **Agentes totalmente autônomos** — o modelo opera independentemente por períodos prolongados, tomando decisões, lidando com erros e perseguindo objetivos com supervisão humana mínima.

A maioria dos sistemas em produção hoje está nos níveis 1-2. Agentes totalmente autônomos são uma área ativa de pesquisa com desafios significativos de segurança ainda a resolver.

## Uso de Ferramentas

Tool use permite que um modelo de IA chame funções externas. O modelo decide quando uma ferramenta é necessária, gera os parâmetros corretos e incorpora o resultado em sua resposta. Isso transforma um gerador de texto em um assistente capaz.

### Como Funciona o Tool Use

A mecânica é direta:

1. **Definição da ferramenta** — você descreve as ferramentas disponíveis para o modelo, incluindo seus nomes, parâmetros e o que fazem. Isso é tipicamente fornecido como JSON estruturado no prompt do sistema ou via um campo de API dedicado.
2. **Decisão** — ao processar uma solicitação do usuário, o modelo decide se uma ferramenta seria útil. Se sim, gera uma chamada de ferramenta com os parâmetros apropriados.
3. **Execução** — sua aplicação executa a chamada da ferramenta (o modelo não a executa diretamente) e retorna o resultado.
4. **Integração** — o modelo incorpora o resultado da ferramenta em sua resposta ao usuário.

### Exemplo de Definição de Ferramenta

```json
{
  "name": "search_documentation",
  "description": "Search the product documentation for relevant articles",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "default": 5
      }
    },
    "required": ["query"]
  }
}
```

O modelo vê essa definição e sabe que pode pesquisar na documentação. Quando um usuário faz uma pergunta sobre o produto, o modelo gera uma chamada como `search_documentation(query="how to reset password")`, seu sistema executa a busca, e o modelo usa os resultados para compor uma resposta precisa.

### Categorias Comuns de Ferramentas

Sistemas de agentes em produção tipicamente oferecem ferramentas em várias categorias:

- **Recuperação de informações** — busca web, consultas a banco de dados, leitura de arquivos, chamadas de API
- **Execução de código** — executar Python, JavaScript ou comandos shell em um ambiente sandboxed
- **Comunicação** — enviar emails, postar mensagens, criar tickets
- **Manipulação de arquivos** — criar, editar e organizar arquivos
- **Operações de sistema** — deploy de código, gerenciamento de infraestrutura, execução de pipelines CI

As ferramentas que você fornece definem os limites do que o agente pode fazer. Um conjunto de ferramentas bem projetado dá ao agente capacidade suficiente para ser útil sem poder suficiente para ser perigoso.

## Loops Agênticos

O padrão mais poderoso é o loop agêntico: o modelo planeja um passo, executa, observa o resultado e decide o próximo passo. Esse loop continua até que a tarefa seja concluída ou o modelo determine que não pode prosseguir.

### O Loop na Prática

Considere um agente encarregado de debugar um teste falhando:

1. **Planejar** — "Devo primeiro ler o arquivo de teste para entender o que ele está testando"
2. **Executar** — chama `read_file("tests/auth.test.ts")`
3. **Observar** — vê que o teste espera um status 200 mas recebe 401
4. **Planejar** — "Devo verificar o middleware de autenticação para ver o que está retornando 401"
5. **Executar** — chama `read_file("src/middleware/auth.ts")`
6. **Observar** — encontra um bug na verificação de expiração do token
7. **Planejar** — "Devo corrigir a comparação de expiração"
8. **Executar** — chama `edit_file(...)` com a correção
9. **Observar** — confirma que a edição foi feita
10. **Planejar** — "Devo executar o teste para verificar a correção"
11. **Executar** — chama `run_command("pnpm test tests/auth.test.ts")`
12. **Observar** — teste passa
13. **Concluído** — reporta a correção ao usuário

Cada passo envolve o modelo raciocinando sobre o estado atual, decidindo o que fazer em seguida e se adaptando com base no que descobre. Isso é fundamentalmente diferente de um script linear — o agente lida com descobertas inesperadas e muda de curso quando necessário.

### Lidando com Erros no Loop

Agentes robustos devem lidar com falhas graciosamente. Uma ferramenta pode retornar um erro, um arquivo pode não existir, ou uma API pode estar com rate limit. Um bom design de agente inclui:

- **Lógica de retry** — retentar falhas transitórias com backoff
- **Estratégias alternativas** — se uma abordagem falha, tentar outra
- **Degradação graciosa** — se a tarefa não pode ser completamente realizada, completar o máximo possível e explicar o que resta
- **Limites de loop** — definir um número máximo de iterações para prevenir loops infinitos quando o agente fica travado

## Projetando Ferramentas Eficazes

A qualidade de um sistema de agentes depende fortemente da qualidade de suas ferramentas. Ferramentas mal projetadas levam a agentes confusos e resultados incorretos.

### Princípios de Design de Ferramentas

- **Nomes claros** — `search_users` é melhor que `query_db_1`. O modelo usa o nome para decidir quando chamar a ferramenta.
- **Parâmetros descritivos** — inclua descrições para cada parâmetro. O modelo lê essas descrições para determinar quais valores passar.
- **Escopo focado** — cada ferramenta deve fazer uma coisa bem. Uma ferramenta `read_file` e uma ferramenta `write_file` são melhores que uma ferramenta `file_operations` com um parâmetro de modo.
- **Erros úteis** — retorne mensagens de erro claras que ajudem o modelo a entender o que deu errado e o que tentar em seguida.
- **Idempotentes quando possível** — ferramentas que podem ser retentadas com segurança simplificam o tratamento de erros.

## Riscos

Agentes que podem tomar ações podem tomar ações erradas. Sandboxing, passos de confirmação e revisão humana são medidas de segurança essenciais para qualquer sistema de agentes em produção.

### Categorias de Risco

- **Ações destrutivas** — um agente com acesso ao sistema de arquivos poderia deletar arquivos importantes. Um agente com acesso ao banco de dados poderia dropar tabelas. Ambientes sandbox e limites de permissão são essenciais.
- **Exfiltração de dados** — um agente que pode tanto ler dados sensíveis quanto fazer requisições de rede poderia inadvertidamente (ou por injeção de prompt) vazar informações.
- **Custos descontrolados** — um agente em loop chamando APIs caras pode acumular custos significativos rapidamente. Limites de orçamento e rate limiting são necessidades práticas.
- **Ações incorretas executadas com confiança** — o agente pode entender mal uma solicitação e tomar uma ação irreversível. Para operações de alto risco, sempre exija confirmação humana.

### Padrões de Segurança

Sistemas de agentes em produção devem implementar vários padrões de segurança:

1. **Privilégio mínimo** — dê ao agente apenas as ferramentas necessárias para sua tarefa específica, nada mais
2. **Sandboxing** — execute código e operações de arquivo em ambientes isolados
3. **Portões de confirmação** — exija aprovação humana para ações destrutivas ou irreversíveis
4. **Log de auditoria** — registre cada chamada de ferramenta e seu resultado para revisão
5. **Kill switches** — forneça mecanismos para parar imediatamente um agente em execução
6. **Limites de orçamento** — defina limites rígidos para chamadas de API, uso de tokens e tempo de computação

O objetivo não é impedir os agentes de serem úteis — é garantir que sejam úteis dentro de limites bem definidos.
