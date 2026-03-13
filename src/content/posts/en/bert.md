---
title: "Paper Reading: BERT — Pre-training of Deep Bidirectional Transformers for Language Understanding"
date: 2026-01-31
category: "Paper Reading"
description: Establishing the pre-training paradigm, with core code reimplemented in Rust
tags: [paper-reading, bert, AI, LLM, rust]
pinned: false
---

On October 11, 2018, the Google AI Language team uploaded a paper to arXiv (a preprint server where researchers can publish papers without waiting for journal peer review): <a href="/papers/BERT%20Pre-training%20of%20Deep%20Bidirectional%20Transformers%20for%20Language%20Understanding.pdf" target="_blank"><i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i></a>.

The authors are Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova, all from Google. Devlin had previously worked at Microsoft Research before joining Google, where he led the design and implementation of BERT.

BERT stands for Bidirectional Encoder Representations from Transformers. It did something remarkably bold for its time: first do general-purpose pre-training on massive amounts of unlabeled text, then add just one output layer and fine-tune on a specific task to achieve state-of-the-art results.

This "pre-train, then fine-tune" paradigm later became the standard approach across all of NLP. The GPT series followed a similar idea but took a different path — unidirectional generation. BERT chose bidirectional understanding. The two paths each spawned vast families of models.

## 1. The Problem

In 2018, NLP had an awkward status quo: every task required its own specially designed model architecture. Question answering needed one model, sentiment analysis needed another, named entity recognition yet another. Labeled data for each task was scarce, and models trained on one task were hard to transfer to others.

There had already been attempts at pre-training. ELMo used bidirectional LSTMs to learn contextual representations, but it merely "bolted" pre-trained features onto task-specific architectures — the architecture itself was still task-specific. OpenAI GPT used the Transformer for pre-training and fine-tuning, but it could only look left-to-right (unidirectional) — each token could only attend to tokens before it, never after.

The paper argued that unidirectional language models have significant limitations on language understanding tasks that require deep bidirectional context. For example:

> "He picked up the _____ and started playing."

Looking only at the left context ("He picked up the"), the answer could be anything. But seeing the right context ("and started playing"), you immediately know it is some kind of musical instrument. For many language understanding tasks, bidirectional context is naturally more advantageous.

## 2. The Core Idea: Mask Some Words, Make the Model Guess

BERT's solution is intuitive: since a bidirectional language model cannot be trained the traditional way (each word would indirectly "see itself"), change the training objective.

**Masked Language Model (MLM)**: randomly mask 15% of the input tokens — specifically, replace them with a special \[MASK\] token — then have the model predict the masked words from context. This idea comes from the Cloze task in psychology (proposed by Taylor in 1953), just like the fill-in-the-blank exercise above.

After masking, the model must use both left and right context to make predictions, and bidirectional understanding emerges naturally.

But replacing all selected tokens with \[MASK\] introduces a problem: \[MASK\] never appears during fine-tuning, creating a mismatch between pre-training and fine-tuning. The paper's solution: of the selected 15% of tokens, 80% are replaced with \[MASK\], 10% are replaced with a random token, and 10% are left unchanged. This way, the model cannot simply rely on "I see \[MASK\] so I need to predict" — it must maintain understanding at every position.

```rust
// Rust

fn mask_tokens(tokens: &[Token], mask_prob: f64) -> (Vec<Token>, Vec<usize>, Vec<Token>) {
    let mut masked = tokens.to_vec();
    let mut positions = Vec::new();
    let mut labels = Vec::new();

    for i in 0..tokens.len() {
        if random::<f64>() < mask_prob {  // 15% chance of being selected
            positions.push(i);
            labels.push(tokens[i].clone()); // remember original token for training
            let r = random::<f64>();
            if r < 0.8 {
                masked[i] = Token::MASK;       // 80%: replace with [MASK]
            } else if r < 0.9 {
                masked[i] = random_token();     // 10%: replace with random token
            }
            // remaining 10%: keep original token unchanged
        }
    }
    (masked, positions, labels)  // return masked input, positions, and original labels
}
```

## 3. The Second Pre-training Task: Next Sentence Prediction

Many NLP tasks (such as question answering and natural language inference) require understanding the relationship between two sentences, but language models do not directly model such relationships.

The paper added a second pre-training task: **Next Sentence Prediction (NSP)**. The model is given two sentences A and B — 50% of the time B is the actual next sentence after A, and 50% of the time B is randomly drawn from the corpus. The model must judge whether B actually follows A.

The task design is simple, but the paper's ablation study (removing one component at a time to observe the effect) showed that removing NSP noticeably hurt performance on question answering and natural language inference tasks; however, later work (such as RoBERTa) reached different conclusions about the necessity of NSP.

```rust
// Rust

struct PretrainingExample {
    tokens: Vec<Token>,      // [CLS] sentence_A [SEP] sentence_B [SEP]
    segment_ids: Vec<usize>, // 0 for sentence A, 1 for sentence B
    masked_positions: Vec<usize>,  // positions that were masked
    masked_labels: Vec<Token>,     // original tokens at masked positions
    is_next: bool,                 // whether B is the actual next sentence
}
```

## 4. Model Architecture

BERT's architecture is not a new invention. It is simply the encoder portion of the [Transformer](/posts/attention-is-all-you-need/), stacked layer by layer.

The paper specifies two sizes:

- **BERT_BASE**: 12 layers, hidden size 768, 12 attention heads, 110M parameters
- **BERT_LARGE**: 24 layers, hidden size 1024, 16 attention heads, 340M parameters

BERT_BASE has roughly the same parameter count as OpenAI GPT, enabling direct comparison. The most critical difference between the two is just one thing: GPT uses unidirectional attention (each token can only see tokens to its left), while BERT uses bidirectional attention (each token can see all positions).

The input representation is the sum of three components:

- **Token Embedding**: WordPiece tokenization, 30,000 vocabulary
- **Segment Embedding**: marks whether a token belongs to sentence A or sentence B
- **Position Embedding**: tells the model the position of each token (BERT uses learned position embeddings, not sinusoidal)

Every input sequence begins with a special \[CLS\] token, whose final-layer hidden state is used for sentence-level classification (e.g., NSP, sentiment analysis). Two sentences are separated by \[SEP\].

```rust
// Rust

struct BertInput {
    token_ids: Vec<usize>,    // [CLS] tok1 tok2 [SEP] tok3 tok4 [SEP]
    segment_ids: Vec<usize>,  // [0,    0,   0,   0,    1,   1,   1  ]
    position_ids: Vec<usize>, // [0,    1,   2,   3,    4,   5,   6  ]
}

struct BertModel {
    token_embedding: Embedding,     // token embedding
    segment_embedding: Embedding,   // segment embedding
    position_embedding: Embedding,  // position embedding
    layers: Vec<TransformerLayer>,  // 12 or 24 Transformer encoder layers
}

impl BertModel {
    fn forward(&self, input: &BertInput) -> Vec<Tensor> {
        // sum the three embeddings
        let mut hidden = self.token_embedding.lookup(&input.token_ids)
            + self.segment_embedding.lookup(&input.segment_ids)
            + self.position_embedding.lookup(&input.position_ids);

        // pass through each Transformer encoder layer
        for layer in &self.layers {
            hidden = layer.forward(&hidden);  // bidirectional self-attention + feed-forward
        }
        hidden
    }
}
```

## 5. Fine-tuning: One Model for Every Task

The most elegant aspect of BERT is the simplicity of fine-tuning. Once pre-training is complete, the procedure is nearly identical regardless of the downstream task: add one task-specific output layer on top of BERT, then fine-tune all parameters with a small amount of labeled data.

- **Text classification** (sentiment analysis, natural language inference): take the output vector at the \[CLS\] position and feed it to a linear classifier
- **Question answering** (given a passage, find the answer span): apply two linear transformations to each token's output vector, predicting the start and end positions of the answer
- **Sequence labeling** (named entity recognition): attach a classifier to each token's output vector, predicting labels token by token

Pre-training may take days, but fine-tuning typically takes only minutes to hours (most tasks under 1 hour on a single TPU). This efficiency gap is the core appeal of the "pre-train + fine-tune" paradigm.

## 6. Experimental Results

The paper ran experiments on 11 NLP tasks, setting new records on all of them.

**GLUE benchmark** (General Language Understanding Evaluation, 8 sub-tasks):
- BERT_LARGE averaged 80.5%, a 7.7 percentage point improvement over the previous best (OpenAI GPT)
- On the largest sub-task MNLI, a 4.6% improvement

**SQuAD v1.1** (reading comprehension QA, Test F1):
- BERT_LARGE single model + TriviaQA data: F1 91.8, surpassing human performance (91.2)
- BERT_LARGE ensemble + TriviaQA data: F1 93.2

**SQuAD v2.0** (includes unanswerable questions):
- F1 of 83.1, a 5.1 point improvement over the previous best system

**SWAG** (commonsense reasoning):
- Accuracy of 86.3%, an 8.3 point improvement over OpenAI GPT

The paper also ran ablation experiments on model size and found an important conclusion: larger models performed better on all tasks, even on tasks with very little labeled data (as few as 3,600 examples). This ran counter to the prevailing intuition that small datasets would cause large models to overfit (memorize training data and perform poorly on new data), suggesting that pre-trained knowledge effectively mitigates this risk.

## 7. Training Details

**Pre-training data**: BooksCorpus (800M words) + English Wikipedia (2,500M words), using only text passages and discarding lists, tables, and headers. The paper emphasized the importance of using document-level corpora rather than shuffled sentence-level corpora, in order to capture long-range contextual relationships.

**Tokenization**: WordPiece with a vocabulary of 30,000. WordPiece splits uncommon words into smaller subword units — for example, "playing" might be split into "play" + "##ing".

**Optimizer**: Adam, learning rate 1e-4, with linear warmup over the first 10,000 steps followed by linear decay. Batch size of 256 sequences, maximum sequence length of 512.

**Hardware**: BERT_BASE was trained on 4 Cloud TPUs (16 TPU chips) for 4 days. BERT_LARGE was trained on 16 Cloud TPUs (64 TPU chips) for 4 days.

**Dropout**: 0.1 across all layers. The activation function is GELU (Gaussian Error Linear Unit), rather than the original Transformer's ReLU.

## 8. My Takeaways

After reading this paper, a few things stand out.

First, BERT's real contribution is not the model architecture (it is just the Transformer encoder) but the training method. The masked language model idea looks simple, but it elegantly solves a fundamental contradiction: how to leverage bidirectional context without letting the model "cheat." The 80/10/10 masking strategy is even more carefully designed, addressing the mismatch between pre-training and fine-tuning.

Second, the divergence between BERT and GPT is already clear in this paper. GPT's autoregressive objective is more naturally suited to generation; BERT's bidirectional encoding is better suited to discriminative language understanding tasks. GPT later scaled up toward stronger generation capabilities, while BERT spawned a family of understanding-oriented models including RoBERTa, ALBERT, and DeBERTa. Both lines continue to serve their respective domains.

Third, the impact of the "pre-train + fine-tune" paradigm extends far beyond NLP. Computer vision later made a wholesale shift toward the same approach (ViT, MAE), and even multimodal models (CLIP, GPT-4V) build on large-scale pre-training with fine-tuning or prompting. BERT was not the first to do pre-training, but it was the first to push pre-training, in such a concise way, from a useful trick into the mainstream working paradigm of NLP.

Fourth, when reimplementing BERT's input processing in Rust, you can feel how clean the design is. \[CLS\] + sentence A + \[SEP\] + sentence B + \[SEP\], with three embeddings summed together — the entire pipeline can handle classification, question answering, and sequence labeling with a single unified codebase. This "one model for every task" simplicity is where its real power lies.

There is one word in this paper's title that matters most: Pre-training. Before BERT, every NLP task was learning from scratch. BERT proved something: general knowledge about language can be learned first, then transferred to virtually any task.

That idea changed how an entire field works.

---

**Paper Reading Series**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/posts/sequence-to-sequence-learning-with-neural-networks/) — Establishing the encoder-decoder paradigm
- [<i>Neural Machine Translation by Jointly Learning to Align and Translate</i>](/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — The origin of attention
- [<i>Attention Is All You Need</i>](/posts/attention-is-all-you-need/) — Attention takes center stage: the birth of the Transformer
- [<i>Scaling Laws for Neural Language Models</i>](/posts/scaling-laws-for-neural-language-models/) — The mathematics of scale
- [<i>Language Models are Few-Shot Learners</i>](/posts/language-models-are-few-shot-learners/) — Larger models, better at eliciting abilities from context
- [<i>Training Compute-Optimal Large Language Models</i>](/posts/training-compute-optimal-large-language-models/) — How to spend your compute budget wisely
