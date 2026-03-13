---
title: "Paper Reading: Neural Machine Translation by Jointly Learning to Align and Translate"
date: 2026-01-11
category: "Paper Reading"
description: The origin of attention mechanism, with core code reimplemented in Rust
tags: [paper-reading, attention, AI, LLM, rust]
pinned: false
---

On September 1, 2014, three researchers uploaded a paper to arXiv (a preprint server where researchers can publish papers without waiting for journal peer review): <a href="/papers/Neural%20Machine%20Translation%20by%20Jointly%20Learning%20to%20Align%20and%20Translate.pdf" target="_blank"><i>Neural Machine Translation by Jointly Learning to Align and Translate</i></a>.

The three were Dzmitry Bahdanau, KyungHyun Cho, and Yoshua Bengio, from the University of Montreal. Yoshua Bengio is one of the "three godfathers" of deep learning, alongside Geoffrey Hinton and Yann LeCun; the three shared the 2018 Turing Award. Bahdanau was still a PhD student at the time.

The core contribution of this paper can be summarized in one thing: teaching a translation model to look back at different parts of the source sentence when generating each word. It sounds obvious in hindsight, but in the neural machine translation research of the time, this was a genuinely novel idea. It has a name: the "attention mechanism."

Three years later, eight people at Google pushed this idea to its logical extreme and wrote [<i>Attention Is All You Need</i>](/posts/attention-is-all-you-need/). So if you want to understand the Transformer, this paper is one of its most important predecessors.

## 1. The Problem

The standard architecture for neural machine translation in 2014 was the encoder-decoder. The encoder, a Recurrent Neural Network (RNN), reads the source sentence from start to finish and compresses the entire sentence into a single fixed-length vector (think of it as a list of numbers with a fixed count). The decoder, another RNN, starts from this vector and generates the translation one word at a time.

The problem is obvious: whether the source sentence is 5 words or 50 words, the encoder must squeeze it into a vector of the same length. Short sentences are fine, but long sentences lose information. It is like asking someone to read an entire page and then summarize it in a single sentence -- the longer the page, the more gets lost.

The paper demonstrated this experimentally: when sentence length exceeded 30 words, the translation quality of the conventional encoder-decoder dropped sharply.

This is the "fixed-length bottleneck."

## 2. The Core Idea: Stop Compressing, Let the Decoder Look for Itself

The paper's solution is intuitive: if compressing the entire sentence into a single vector loses information, then stop compressing. The encoder retains the annotation vector at every position (formed by concatenating the forward and backward hidden states of a bidirectional RNN -- think of it as the intermediate result produced after processing each word), and the decoder, when generating each target word, decides for itself which parts of the source sentence to focus on.

This is the heart of the attention mechanism: **instead of forcing all information through a single bottleneck, let the model learn to look back and find what it needs, when it needs it.**

Specifically, it works in three steps:

**Step 1: Scoring.** Before generating the i-th target word, the decoder compares its current state s_{i-1} with each encoder position's hidden state h_j, producing an "alignment score" e_{ij}. The higher the score, the more important position j in the source sentence is for generating the current target word.

The scoring function used in the paper:

> e_{ij} = a(s_{i-1}, h_j) = v_a^T tanh(W_a s_{i-1} + U_a h_j)

This is called "additive attention." The decoder state and encoder state each undergo a linear transformation (multiply by a matrix), the results are added together, passed through tanh (a function that squashes values to between -1 and 1), and then dot-producted with a vector v_a to produce a scalar score.

**Step 2: Normalization.** Softmax converts all position scores into probabilities that sum to 1:

> α_{ij} = softmax(e_{ij}) = exp(e_{ij}) / Σ exp(e_{ik})

**Step 3: Weighted sum.** These probabilities are used to compute a weighted sum of the encoder's hidden states, producing a "context vector" c_i:

> c_i = Σ α_{ij} h_j

This context vector is the key information the decoder extracts from the source sentence when generating the i-th word. The context vector is different for each generated word, because the model focuses on different source positions each time.

In Rust:

```rust
// Rust

/// Additive attention: Bahdanau style
fn bahdanau_attention(
    decoder_state: &Tensor,  // decoder's current state s_{i-1}
    encoder_outputs: &Tensor, // encoder hidden states at all positions [h_1, ..., h_T]
    w_a: &Tensor,            // weight matrix W_a
    u_a: &Tensor,            // weight matrix U_a
    v_a: &Tensor,            // vector v_a
) -> (Tensor, Tensor) {
    // Step 1: compute alignment scores
    let score = v_a.matmul(
        &(w_a.matmul(decoder_state) + u_a.matmul(encoder_outputs))
            .tanh()             // tanh squashes values to [-1, 1]
    );
    // Step 2: softmax to get probabilities
    let weights = score.softmax(-1);
    // Step 3: weighted sum to get context vector
    let context = weights.matmul(encoder_outputs.transpose(-2, -1));
    (context, weights)          // return context vector and attention weights
}
```

Unlike the "dot-product attention" used later in the Transformer (where Q and K are directly dot-producted), this paper uses "additive attention" (each is linearly transformed first, then added together). The two approaches have different characteristics, but dot-product attention is better suited for efficient matrix multiplication; combined with the Transformer's removal of RNN's sequential dependency, attention finally became a core operator that could be massively parallelized.

## 3. The Encoder: Bidirectional RNN

A unidirectional RNN reads the sentence left to right, outputting a summary vector only after the last word. The problem: each position's hidden state mainly carries left-side context and cannot see what is to the right.

The paper solves this with a bidirectional RNN (BiRNN). One RNN reads left to right, another reads right to left, and then the hidden states from both directions are concatenated. This way, each position's hidden state contains context from both the left and the right.

```rust
// Rust

struct BidirectionalRNN {
    forward_rnn: RNN,   // reads left to right
    backward_rnn: RNN,  // reads right to left
}

impl BidirectionalRNN {
    fn forward(&self, input: &[Tensor]) -> Vec<Tensor> {
        let fwd = self.forward_rnn.forward(input);          // forward hidden states
        let bwd = self.backward_rnn.forward_reversed(input); // backward hidden states
        // concatenate forward and backward hidden states
        fwd.iter().zip(bwd.iter())
            .map(|(f, b)| Tensor::cat(&[f, b], -1))
            .collect()
    }
}
```

In the paper, each direction has 1000 hidden units, concatenated to 2000 dimensions. This doubles the parameters compared to a unidirectional RNN, but in return every position can see the full context.

## 4. The Decoder: Realigning at Every Step

Putting the encoder and attention mechanism together, the decoder's workflow becomes clear:

1. The encoder reads the source sentence with a bidirectional RNN, retaining the hidden state (annotation vector) at every position
2. The decoder begins generating the translation, and before generating each word:
   - Computes attention weights using the current state and all annotation vectors
   - Produces a context vector via weighted sum
   - Combines the context vector, the previously generated word, and the current state to predict the next word

```rust
// Rust

struct AttentionDecoder {
    rnn: RNN,
    attention: BahdanauAttention,
    output_proj: Linear,
}

impl AttentionDecoder {
    fn decode_step(
        &self,
        prev_word: &Tensor,       // previously generated word
        prev_state: &Tensor,      // previous hidden state
        encoder_outputs: &Tensor, // encoder hidden states at all positions
    ) -> (Tensor, Tensor) {
        // attention: decide which parts of the source to focus on
        let (context, _weights) = self.attention.forward(prev_state, encoder_outputs);
        // RNN state update: fuse context, previous word, and previous state
        let new_state = self.rnn.step(prev_word, prev_state, &context);
        // predict probability distribution over next word
        let output = self.output_proj.forward(&new_state);
        (output, new_state)
    }
}
```

The key point: every time the decoder generates a target word, it recomputes the attention distribution. When translating the first word, it might focus on the beginning of the source sentence; when translating the last word, it might focus on the end. This dynamic alignment capability is something the previous fixed-vector architecture simply could not do.

## 5. Experimental Results

The paper ran experiments on the English-to-French translation task (using the WMT '14 dataset), measuring performance with BLEU scores (a standard metric for machine translation, measuring how close the machine output is to human translation, with a maximum of 100).

Key comparisons:
- **RNNencdec-50** (conventional encoder-decoder, trained on sentences up to 50 words): 26.71 BLEU
- **RNNsearch-50** (model with attention, trained on sentences up to 50 words): **34.16 BLEU**
- **Moses** (the strongest conventional phrase-based translation system at the time): 33.30 BLEU

An improvement of 7.45 points. In the experimental setup reported by the paper, the attention-based neural model had matched or even surpassed the dominant conventional phrase-based translation system.

The more critical finding is in the paper's Figure 2: as sentence length increased, the conventional encoder-decoder's BLEU score dropped steeply, while the attention-based model was barely affected. This directly validated the paper's core hypothesis: the fixed-length vector is the bottleneck, and the attention mechanism can bypass it.

The paper also visualized the attention weights. In English-to-French translation, the attention weights nearly formed a diagonal line, showing that the model had automatically learned that "English word 1 corresponds to French word 1, English word 2 corresponds to French word 2." When word order differed (for instance, French adjectives placed after nouns), the attention weights shifted accordingly. The model learned all of this without any manual alignment annotations.

## 6. My Takeaways

After reading this paper, a few things stand out.

First, the problem this paper solves is extremely clear: the encoder compresses the entire sentence into a single vector, and long sentences lose information. The solution is equally intuitive: stop compressing, and let the decoder look for itself. Good research is often like this -- the problem is clear, and the solution follows naturally.

Second, attention in this paper is still a supporting role to the RNN. The encoder is still recurrent (bidirectional RNN), the decoder is still recurrent, and attention merely bridges the two. Three years later, Vaswani et al. asked a far more radical question: if attention works so well, can we throw away the RNN entirely and keep only attention? The answer was the Transformer.

Third, when reimplementing this paper's attention mechanism in Rust, you will notice that its computation is considerably more complex than the Transformer's Scaled Dot-Product Attention. Additive attention requires extra weight matrices W_a, U_a, v_a, while dot-product attention only needs Q and K to be directly multiplied and scaled. Going from "addition" to "multiplication" seems like a small step, but in practice it dramatically simplified the computation and made it far more suitable for efficient matrix operations.

Fourth, Bahdanau was a PhD student at the time, and Bengio was his advisor. A PhD student's paper ended up defining the core component of AI research for the next decade. The attention mechanism started here, was amplified by the Transformer, and ultimately became the foundation of GPT, BERT, and LLaMA.

This paper did not invent any complicated mathematics. It simply asked a straightforward question: why can't the decoder look back?

Then it let the decoder look back.

And that look changed an entire era.

---

**Paper Reading Series**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/posts/sequence-to-sequence-learning-with-neural-networks/) — Establishing the encoder-decoder paradigm
- [<i>Attention Is All You Need</i>](/posts/attention-is-all-you-need/) — Attention takes center stage: the birth of the Transformer
- [<i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i>](/posts/bert/) — Establishing the pre-training paradigm
- [<i>Scaling Laws for Neural Language Models</i>](/posts/scaling-laws-for-neural-language-models/) — The mathematics of scale
- [<i>Language Models are Few-Shot Learners</i>](/posts/language-models-are-few-shot-learners/) — Larger models, better at eliciting abilities from context
- [<i>Training Compute-Optimal Large Language Models</i>](/posts/training-compute-optimal-large-language-models/) — How to spend your compute budget wisely
