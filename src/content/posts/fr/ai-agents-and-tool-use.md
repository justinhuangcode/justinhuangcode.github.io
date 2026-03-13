---
title: Agents IA et utilisation d'outils (Exemple)
date: 2026-01-09
category: AI
description: Comment les modèles IA vont au-delà du chat en exécutant des actions dans le monde réel
tags: [AI, Agents]
pinned: false
---

Un agent IA est un modèle de langage capable d'agir — pas seulement de générer du texte. Il peut chercher sur le web, exécuter du code, appeler des API, lire des fichiers et décider quoi faire ensuite. Ce passage de la génération passive de texte à la résolution active de problèmes représente l'une des avancées les plus significatives de l'IA appliquée.

## Du chat à l'action

Un chatbot répond aux questions. Un agent résout des problèmes. La différence est l'autonomie : les agents décident quels outils utiliser, dans quel ordre, et comment gérer les erreurs.

Considérez la différence en pratique. Vous demandez à un chatbot : « Quel temps fait-il à Tokyo ? » Il pourrait répondre en se basant sur ses données d'entraînement — qui datent de mois ou d'années et sont presque certainement incorrectes. Vous posez la même question à un agent, et il appelle une API météo, récupère les données actuelles et renvoie une réponse précise et à jour.

Le chatbot génère du texte plausible. L'agent interagit avec le monde.

### Le spectre de l'autonomie

Tous les agents ne sont pas également autonomes. Il existe un spectre :

1. **Chat assisté par outils** — le modèle peut appeler des outils, mais uniquement en réponse directe aux requêtes de l'utilisateur. Un appel d'outil par tour.
2. **Agents multi-étapes** — le modèle peut enchaîner plusieurs appels d'outils pour accomplir une tâche, décidant lui-même de la séquence.
3. **Agents entièrement autonomes** — le modèle opère indépendamment sur des périodes prolongées, prenant des décisions, gérant les erreurs et poursuivant des objectifs avec une supervision humaine minimale.

La plupart des systèmes en production se situent aux niveaux 1-2. Les agents entièrement autonomes sont un domaine de recherche actif avec des défis de sécurité importants encore à résoudre.

## Utilisation d'outils

L'utilisation d'outils permet à un modèle IA d'appeler des fonctions externes. Le modèle décide quand un outil est nécessaire, génère les bons paramètres et intègre le résultat dans sa réponse. Cela transforme un générateur de texte en un assistant capable.

### Comment fonctionne l'utilisation d'outils

La mécanique est simple :

1. **Définition de l'outil** — vous décrivez les outils disponibles au modèle, y compris leurs noms, paramètres et ce qu'ils font. Ceci est généralement fourni sous forme de JSON structuré dans le prompt système ou via un champ API dédié.
2. **Décision** — lors du traitement d'une requête utilisateur, le modèle décide si un outil serait utile. Si oui, il génère un appel d'outil avec les paramètres appropriés.
3. **Exécution** — votre application exécute l'appel d'outil (le modèle ne l'exécute pas directement) et renvoie le résultat.
4. **Intégration** — le modèle intègre le résultat de l'outil dans sa réponse à l'utilisateur.

### Exemple de définition d'outil

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

Le modèle voit cette définition et sait qu'il peut rechercher dans la documentation. Quand un utilisateur pose une question sur le produit, le modèle génère un appel comme `search_documentation(query="how to reset password")`, votre système exécute la recherche, et le modèle utilise les résultats pour composer une réponse précise.

### Catégories courantes d'outils

Les systèmes d'agents en production offrent généralement des outils dans plusieurs catégories :

- **Récupération d'informations** — recherche web, requêtes base de données, lecture de fichiers, appels API
- **Exécution de code** — exécution de Python, JavaScript ou commandes shell dans un environnement sandboxé
- **Communication** — envoi d'emails, publication de messages, création de tickets
- **Manipulation de fichiers** — création, édition et organisation de fichiers
- **Opérations système** — déploiement de code, gestion d'infrastructure, exécution de pipelines CI

Les outils que vous fournissez définissent les limites de ce que l'agent peut faire. Un ensemble d'outils bien conçu donne à l'agent suffisamment de capacités pour être utile sans assez de pouvoir pour être dangereux.

## Boucles agentiques

Le pattern le plus puissant est la boucle agentique : le modèle planifie une étape, l'exécute, observe le résultat et décide de l'étape suivante. Cette boucle continue jusqu'à ce que la tâche soit terminée ou que le modèle détermine qu'il ne peut pas poursuivre.

### La boucle en pratique

Considérez un agent chargé de déboguer un test échouant :

1. **Planifier** — « Je devrais d'abord lire le fichier de test pour comprendre ce qu'il teste »
2. **Exécuter** — appelle `read_file("tests/auth.test.ts")`
3. **Observer** — voit que le test attend un statut 200 mais obtient un 401
4. **Planifier** — « Je devrais vérifier le middleware d'authentification pour voir ce qui renvoie 401 »
5. **Exécuter** — appelle `read_file("src/middleware/auth.ts")`
6. **Observer** — trouve un bug dans la vérification d'expiration du token
7. **Planifier** — « Je devrais corriger la comparaison d'expiration »
8. **Exécuter** — appelle `edit_file(...)` avec la correction
9. **Observer** — confirme que la modification a été effectuée
10. **Planifier** — « Je devrais exécuter le test pour vérifier la correction »
11. **Exécuter** — appelle `run_command("pnpm test tests/auth.test.ts")`
12. **Observer** — le test passe
13. **Terminé** — rapporte la correction à l'utilisateur

Chaque étape implique que le modèle raisonne sur l'état actuel, décide quoi faire ensuite et s'adapte en fonction de ce qu'il découvre. C'est fondamentalement différent d'un script linéaire — l'agent gère les découvertes inattendues et change de cap quand nécessaire.

### Gestion des erreurs dans la boucle

Les agents robustes doivent gérer les échecs avec élégance. Un outil peut retourner une erreur, un fichier peut ne pas exister, ou une API peut être limitée en débit. Un bon design d'agent inclut :

- **Logique de réessai** — réessayer les échecs transitoires avec un backoff
- **Stratégies alternatives** — si une approche échoue, en essayer une autre
- **Dégradation gracieuse** — si la tâche ne peut être complètement réalisée, accomplir autant que possible et expliquer ce qui reste
- **Limites de boucle** — fixer un nombre maximum d'itérations pour éviter les boucles infinies

## Concevoir des outils efficaces

La qualité d'un système d'agents dépend fortement de la qualité de ses outils. Des outils mal conçus mènent à des agents confus et des résultats incorrects.

### Principes de conception d'outils

- **Noms clairs** — `search_users` est meilleur que `query_db_1`. Le modèle utilise le nom pour décider quand appeler l'outil.
- **Paramètres descriptifs** — incluez des descriptions pour chaque paramètre. Le modèle lit ces descriptions pour déterminer quelles valeurs passer.
- **Portée ciblée** — chaque outil devrait faire une seule chose bien. Un outil `read_file` et un outil `write_file` sont meilleurs qu'un outil `file_operations` avec un paramètre de mode.
- **Erreurs utiles** — retournez des messages d'erreur clairs qui aident le modèle à comprendre ce qui s'est mal passé et quoi essayer à la place.
- **Idempotent quand possible** — les outils qui peuvent être réessayés en toute sécurité simplifient la gestion des erreurs.

## Risques

Les agents qui peuvent agir peuvent mal agir. Le sandboxing, les étapes de confirmation et les revues humaines sont des mesures de sécurité essentielles pour tout système d'agents en production.

### Catégories de risques

- **Actions destructrices** — un agent avec accès au système de fichiers pourrait supprimer des fichiers importants. Un agent avec accès à la base de données pourrait supprimer des tables. Les environnements sandbox et les limites de permissions sont essentiels.
- **Exfiltration de données** — un agent qui peut à la fois lire des données sensibles et faire des requêtes réseau pourrait involontairement (ou par injection de prompt) divulguer des informations.
- **Coûts incontrôlés** — un agent dans une boucle appelant des API coûteuses peut accumuler des coûts significatifs rapidement. Les limites de budget et le rate limiting sont des nécessités pratiques.
- **Actions incorrectes exécutées avec assurance** — l'agent pourrait mal comprendre une requête et prendre une action irréversible. Pour les opérations à haut risque, toujours exiger une confirmation humaine.

### Patterns de sécurité

Les systèmes d'agents en production devraient implémenter plusieurs patterns de sécurité :

1. **Principe du moindre privilège** — ne donnez à l'agent que les outils nécessaires à sa tâche spécifique, rien de plus
2. **Sandboxing** — exécutez le code et les opérations sur fichiers dans des environnements isolés
3. **Portes de confirmation** — exigez l'approbation humaine pour les actions destructrices ou irréversibles
4. **Journalisation d'audit** — enregistrez chaque appel d'outil et son résultat pour revue
5. **Kill switches** — fournissez des mécanismes pour arrêter immédiatement un agent en cours d'exécution
6. **Limites de budget** — fixez des plafonds stricts pour les appels API, l'utilisation de tokens et le temps de calcul

L'objectif n'est pas d'empêcher les agents d'être utiles — c'est de s'assurer qu'ils sont utiles dans des limites bien définies.
