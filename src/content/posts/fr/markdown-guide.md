---
title: 📝 Guide de style Markdown
date: 2026-01-02
category: Tutorial
description: Guide complet de toutes les fonctionnalités Markdown prises en charge par Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Cet article présente toutes les fonctionnalités Markdown supportées par Astro-Theme-Aither. Utilisez-le comme référence pour rédiger vos propres articles. Ajoutez-le à vos favoris — il couvre l'ensemble des options de formatage disponibles.

## Titres

Utilisez `##` pour les titres de section, `###` pour les sous-sections et `####` pour les sous-sous-sections. Évitez `#` dans le contenu — le titre de l'article est déjà rendu comme titre principal.

### Titre de niveau 3

Les titres de troisième niveau sont idéaux pour diviser une section en sujets distincts. Ils créent une hiérarchie visuelle sans être trop proéminents.

#### Titre de niveau 4

Les titres de quatrième niveau conviennent aux sous-sections détaillées. Utilisez-les avec parcimonie — si votre plan descend au-delà de quatre niveaux, envisagez de restructurer votre contenu.

### Bonnes pratiques pour les titres

Quelques lignes directrices pour une utilisation efficace des titres :

- **Ne sautez pas de niveaux** — passez de `##` à `###`, jamais directement de `##` à `####`. Sauter des niveaux casse la structure du document et peut perturber les lecteurs d'écran.
- **Gardez des titres descriptifs** — « Configuration » est préférable à « Trucs de réglages ». Les lecteurs parcourent les titres avant de décider s'ils lisent une section.
- **Utilisez la casse de phrase** — majuscule uniquement au premier mot et aux noms propres.

## Paragraphes et sauts de ligne

Le texte de paragraphe coule naturellement. Laissez une ligne vide entre les paragraphes pour les séparer.

Ceci est un second paragraphe. Gardez les paragraphes centrés sur une seule idée pour la meilleure expérience de lecture.

Pour le web, les paragraphes courts fonctionnent mieux que les longs blocs de texte. Un paragraphe de trois à cinq phrases est une unité de lecture confortable sur écran. Si un paragraphe dépasse six ou sept phrases, envisagez de le diviser.

Les sauts de ligne simples dans un paragraphe (sans ligne vide) seront traités comme un espace, pas comme une nouvelle ligne. Si vous avez besoin d'un saut de ligne dur sans nouveau paragraphe, terminez la ligne par deux espaces ou utilisez une balise `<br>` — bien que ce soit rarement nécessaire en pratique.

## Mise en forme

- **Texte en gras** avec `**doubles astérisques**`
- *Texte en italique* avec `*astérisques simples*`
- ***Gras et italique*** avec `***triples astérisques***`
- ~~Barré~~ avec `~~doubles tildes~~`

### Quand utiliser chaque style

Le **gras** fonctionne le mieux pour les termes clés, les avertissements importants ou les définitions — tout ce que le lecteur ne devrait pas manquer même en parcourant rapidement. Utilisez-le pour la phrase la plus importante d'un paragraphe, pas pour des phrases entières.

L'*italique* sert pour l'emphase dans une phrase, les titres de livres et publications, les termes techniques à leur première utilisation et les expressions étrangères. Il fournit une emphase plus légère que le gras.

Le ~~barré~~ est utile pour montrer des corrections, des informations obsolètes ou des éléments complétés dans un changelog. Il a un champ d'utilisation plus restreint mais est précieux quand vous en avez besoin.

## Liens

[Lien inline](https://astro.build) avec la syntaxe `[texte](url)`.

Les liens peuvent aussi référencer d'autres articles sur votre site en utilisant des chemins relatifs. Utilisez un texte de lien descriptif — « lisez le guide Markdown » est mieux que « cliquez ici ». Un bon texte de lien aide à la fois les lecteurs et les moteurs de recherche à comprendre où mène le lien.

Vous pouvez aussi créer des liens qui s'intègrent dans le contexte en écrivant un texte d'ancrage descriptif qui se lit naturellement dans la phrase. Par exemple : la [documentation Astro](https://docs.astro.build) couvre chaque fonctionnalité en détail.

## Listes

Liste non ordonnée :

- Premier élément
- Deuxième élément
  - Élément imbriqué
  - Autre élément imbriqué
- Troisième élément

Liste ordonnée :

1. Première étape
2. Deuxième étape
   1. Sous-étape un
   2. Sous-étape deux
3. Troisième étape

Liste de tâches :

- [x] Configurer le projet
- [x] Écrire le premier article
- [ ] Déployer en production

### Conseils de formatage des listes

Les listes sont l'un des outils les plus efficaces en rédaction web. Elles découpent le texte dense, rendent l'information scannable et communiquent clairement des séquences ou collections d'éléments.

**Utilisez les listes non ordonnées** quand les éléments n'ont pas de séquence inhérente — fonctionnalités, exigences, options ou exemples.

**Utilisez les listes ordonnées** quand la séquence compte — étapes d'un processus, éléments classés ou instructions à suivre dans l'ordre.

**Utilisez les listes de tâches** pour suivre la progression, les checklists de projet ou les éléments à faire.

Gardez les éléments de liste parallèles en structure. Si le premier élément commence par un verbe, tous les éléments devraient commencer par un verbe.

## Citations

> Le but de l'abstraction n'est pas d'être vague, mais de créer un nouveau niveau sémantique dans lequel on peut être absolument précis.
>
> — Edsger W. Dijkstra

Citations imbriquées :

> Premier niveau
>
> > Deuxième niveau
> >
> > > Troisième niveau

### Utilisation des citations

Les citations servent plusieurs objectifs au-delà de citer des personnes célèbres :

- **Citer des sources** — en référençant un autre article, livre ou document
- **Annotations** — mettre en évidence des informations importantes ou des avertissements
- **Style email** — montrer ce que quelqu'un a dit dans une conversation à laquelle vous répondez
- **Citations d'accroche** — attirer l'attention sur un passage clé de votre propre article

Lors de l'utilisation de citations avec attribution, placez le nom de l'auteur sur une ligne séparée précédée d'un tiret cadratin, comme montré dans l'exemple de Dijkstra ci-dessus.

## Code

Code `inline` avec des backticks. Utilisez le code inline pour les noms de fonctions comme `getPublishedPosts()`, les chemins de fichiers comme `src/content/posts/`, les instructions en ligne de commande comme `pnpm dev` et toute valeur littérale apparaissant dans le texte courant.

Bloc de code avec coloration syntaxique :

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

### Conseils pour les blocs de code

Spécifiez toujours l'identifiant de langage après les triples backticks d'ouverture. Cela active la coloration syntaxique, qui améliore considérablement la lisibilité. Les identifiants courants incluent `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python` et `markdown`.

Pour les commandes shell, utilisez `bash` ou `sh` :

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Compiler pour la production
pnpm build
```

Pour les fichiers de configuration JSON :

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

Gardez les blocs de code ciblés. Montrez uniquement les lignes pertinentes plutôt que de coller un fichier entier. Si du contexte est nécessaire, ajoutez un commentaire indiquant où se trouve le code.

## Tableaux

| Fonctionnalité | Statut | Notes |
|---|---|---|
| Mode sombre | Supporté | Clair / Sombre / Système |
| Flux RSS | Intégré | `/rss.xml` |
| Plan du site | Auto-généré | Via `@astrojs/sitemap` |
| SEO | Intégré | Open Graph + canonique |

Colonnes alignées à droite et centrées :

| Gauche | Centre | Droite |
|:---|:---:|---:|
| Texte | Texte | Texte |
| Texte plus long | Texte plus long | Texte plus long |

### Directives pour les tableaux

Les tableaux fonctionnent mieux pour les données structurées avec des colonnes et lignes clairement définies. Ils sont idéaux pour les comparaisons de fonctionnalités, les options de configuration, les paramètres d'API et les données de référence.

Gardez les tableaux simples. Si un tableau a plus de cinq ou six colonnes, il devient difficile à lire sur mobile. Envisagez de diviser les tableaux complexes en plusieurs plus petits, ou utilisez un format de liste à la place.

L'alignement des colonnes se contrôle avec des deux-points dans la ligne de séparation :

- `:---` pour l'alignement à gauche (par défaut)
- `:---:` pour le centrage
- `---:` pour l'alignement à droite

Utilisez l'alignement à droite pour les données numériques afin que les points décimaux s'alignent visuellement.

## Ligne horizontale

Utilisez `---` pour créer une ligne horizontale :

---

Contenu après la ligne.

Les lignes horizontales sont utiles pour séparer les sections majeures d'un article, indiquer un changement de sujet ou découper visuellement les articles très longs. Utilisez-les judicieusement — si vous avez besoin de séparateurs fréquents, les titres pourraient être un meilleur choix structurel.

## Images

Les images sont supportées avec la syntaxe Markdown standard :

```markdown
![Texte alternatif](./image.jpg)
```

Ce thème est centré sur la typographie, mais les images fonctionnent quand vous en avez besoin.

### Bonnes pratiques pour les images

- **Toujours inclure un texte alternatif** — il est essentiel pour l'accessibilité et apparaît aussi quand les images ne se chargent pas
- **Utiliser des noms de fichiers descriptifs** — `dashboard-error-state.png` est mieux que `screenshot-2.png`
- **Optimiser la taille des fichiers** — compressez les images avant de les ajouter à votre dépôt ; les images lourdes ralentissent le chargement des pages
- **Considérer le flux de lecture** — placez les images près du texte qui les référence, pas à des paragraphes de distance

## Conclusion

Les fonctionnalités Markdown décrites dans ce guide couvrent la grande majorité de ce dont vous aurez besoin pour écrire un blog. La clé d'un bon Markdown est d'utiliser le bon élément pour le bon usage : les titres pour la structure, la mise en forme pour l'importance, les listes pour les collections, les blocs de code pour le contenu technique et les paragraphes pour tout le reste.

Écrivez clairement, formatez avec cohérence et laissez la typographie faire son travail.
