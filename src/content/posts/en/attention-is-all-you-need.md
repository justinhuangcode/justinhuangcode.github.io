---
title: "Paper Reading: Attention Is All You Need"
date: 2026-01-06
category: "Paper Reading"
description: Sharing my understanding of the Transformer paper, with core code reimplemented in Rust
tags: [paper-reading, transformer, AI, LLM, rust]
pinned: false
---

On June 12, 2017, eight people uploaded a paper to arXiv (a preprint server where researchers can publish papers without waiting for journal peer review), with a title of just five words: <a href="/papers/Attention%20Is%20All%20You%20Need.pdf" target="_blank"><i>Attention Is All You Need</i></a>.

The eight were Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia Polosukhin, most of them working at Google Brain and Google Research at the time.

After the paper came out, the group scattered. Noam Shazeer left Google to start Character.AI, then was later bought back by Google at a premium. Aidan Gomez started Cohere before he even finished his PhD at the University of Toronto, building enterprise-scale large language models. Llion Jones moved to Japan and founded Sakana AI. Illia Polosukhin took a path no one saw coming -- he started NEAR Protocol, a blockchain project. Ashish Vaswani and Niki Parmar teamed up to co-found Adept AI, then later started Essential AI together. Jakob Uszkoreit founded Inceptive, using AI to design RNA-based medicines. Łukasz Kaiser joined OpenAI and contributed to the development of the GPT series. 

Eight authors, seven companies, spanning AI, blockchain, and biotech.

Nearly nine years later, ChatGPT, Claude, DeepSeek, Qwen -- the underlying architecture of these AI products can almost all be traced back to those 15 pages.

This post is my understanding after reading the paper, with core code reimplemented in Rust. It is not a translation, not a summary. You do not need a technical background to follow along.

## 1. The One-Sentence Version

Before the Transformer, AI processed language the way a person reads a book by running a finger under each word, one at a time. By the time you reach word 100, what word 1 said has already faded. The longer the sentence, the worse the forgetting. That was the fundamental bottleneck of Recurrent Neural Networks (RNNs, an earlier AI architecture).

The authors asked a simple question: **why do we have to read in order?**

Unlike RNNs, which must process tokens step by step, the Transformer processes an entire input in parallel, directly modeling the relationship between any two positions. No queuing, no waiting for the previous word to finish before looking at the next one.

The paper calls this core capability "attention." The title is not saying "the model literally contains nothing but attention." It is saying: in sequence modeling, attention has been promoted to the lead role for the first time, no longer needing recurrence or convolution (a method that extracts local features through sliding windows) as its backbone.

## 2. What Attention Actually Does

Imagine you walk into a noisy bar where twenty people are talking at once. Your brain does not split its attention evenly across every voice. Someone calls your name, and your ears lock onto that direction instantly. Every other sound fades to background noise.

The Transformer does the same thing for every word. The paper defines three roles:

- **Query**: what this word is looking for. Like your ears searching for "who just called my name?"
- **Key**: what this word can offer. Like the vocal signature of each person in the bar
- **Value**: the actual content this word carries. Like the specific words that person is saying

Each word's Query is matched against every other word's Key. High match scores pull more information from that word's Value. Low match scores are effectively ignored.

The formula the paper gives is called Scaled Dot-Product Attention:

> Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V

Do not panic at the formula. Let's break it down step by step:

- **QK^T**: the dot product of Q and K. What is a dot product? Multiply two lists of numbers element-wise, then sum the results. For example, [1, 2] and [3, 4] gives 1x3 + 2x4 = 11. The larger the result, the more related two words are. This step computes a "match score" for every pair of words
- **/ sqrt(d_k)**: divide by a scaling factor. d_k is the length of the vector (think of a vector as "a list of numbers that describes something" -- for instance, 64 numbers describing the meaning of a word). Why divide? Because the longer the number list, the larger the dot product tends to be. Without scaling, higher dimensions cause higher variance in the dot products, pushing softmax into saturation (almost all probability mass on a single word), which shrinks gradients (the signal the model uses to adjust its own parameters) and destabilizes training
- **softmax**: converts a set of scores into probabilities that sum to 1. For example, if three words have scores [10, 2, 1], softmax turns them into roughly [0.99, 0.007, 0.003]. The highest-scoring word captures nearly all the attention; the rest are pushed close to zero
- **x V**: use those probabilities to take a weighted combination of each word's actual content. High-probability words contribute more, low-probability words contribute less. The final output is a new vector that fuses the key information together

In Rust:

```rust
// Rust

fn scaled_dot_product_attention(
    query: &Tensor,   // what each word is looking for
    key: &Tensor,     // what each word can offer
    value: &Tensor,   // the actual content each word carries
) -> Tensor {
    let d_k = key.size(-1) as f64;       // vector length
    let scores = query.matmul(           // dot product: compute match scores
        &key.transpose(-2, -1)
    ) / d_k.sqrt();                       // scale down to prevent exploding scores
    let weights = scores.softmax(-1);     // convert to probabilities (summing to 1)
    weights.matmul(value)                 // weighted combination to extract information
}
```

That is just a few lines of code. Many of the capabilities that later reshaped the industry were built on top of this handful of operations.

## 3. Multi-Head Attention: Looking from Multiple Angles at Once

A single attention head tends to latch onto one type of relationship pattern. But language packs multiple layers of meaning into a single sentence.

Take "The cat sat on the mat yesterday" as an example:
- "cat" and "sat" have a subject-verb relationship (who did what)
- "yesterday" and "sat" have a temporal relationship (when it happened)
- "on" and "mat" have a spatial relationship (where it happened)

Asking one head to juggle all these layers at once is a tall order. The paper's solution is the multi-head mechanism: dispatch 8 heads to run in parallel, giving the model the chance to observe a sentence from different subspaces simultaneously, then concatenate their findings at the end.

The formula from the paper:

> MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O

Breaking it down:
- **head_1, ..., head_h**: 8 heads each independently run one attention computation, producing 8 separate results
- **Concat**: concatenate all 8 results end-to-end into one long vector
- **W^O**: a linear transformation (think "multiply by a matrix") that projects the concatenated long vector back to the original dimension. Like a manager listening to reports from 8 investigators and producing one consolidated conclusion

```rust
// Rust

struct MultiHeadAttention {
    heads: Vec<AttentionHead>,    // 8 attention heads, each operating independently
    output_proj: Linear,          // W^O: consolidates all heads' results
}

impl MultiHeadAttention {
    fn forward(&self, query: &Tensor, key: &Tensor, value: &Tensor) -> Tensor {
        // each head runs attention independently
        let head_outputs: Vec<Tensor> = self.heads
            .iter()
            .map(|head| head.forward(query, key, value))
            .collect();
        // concatenate all heads' results
        let concatenated = Tensor::cat(&head_outputs, -1);
        // project concatenated result back to original dimension via W^O
        self.output_proj.forward(&concatenated)
    }
}
```

The paper's parameters: the model uses 512 numbers to describe each word (d_model = 512), with 8 heads, each getting 64 numbers (512 / 8 = 64). The total computation of 8 heads is roughly the same as a single 512-dimensional head, but the expressive power is far greater. Same cost, multi-perspective understanding. A very good trade.

## 4. Positional Encoding: Telling the Model About Word Order

The Transformer processes the entire sentence in parallel, which is fast, but the trade-off is that it loses word order. Without additional position information, the attention mechanism alone cannot tell the difference between "the cat ate the fish" and "the fish ate the cat." That clearly will not do.

The fix: generate a unique "address code" for each position and add it to the word's vector. The model no longer sees just "cat" and "fish" -- it sees "cat at position 1" and "fish at position 3."

The paper uses sine and cosine functions to generate this encoding:

> PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
>
> PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

The formula looks intimidating, but the core idea is intuitive:
- **pos**: the word's position in the sentence (1st, 2nd, 3rd, ...)
- **i**: which dimension of the vector. Even positions use sin, odd positions use cos
- **10000^(2i/d_model)**: a scaling factor that changes with the dimension. Low dimensions oscillate fast, high dimensions oscillate slowly. Like a clock: the second hand completes a full rotation in one minute, while the hour hand takes twelve hours. Different "hands" cover different time scales, and together they can pinpoint any moment precisely

The end result: each position gets a unique numerical fingerprint, and the model uses this fingerprint to distinguish word order.

```rust
// Rust

fn positional_encoding(seq_len: usize, d_model: usize) -> Tensor {
    let mut encoding = Tensor::zeros(&[seq_len, d_model]);
    for pos in 0..seq_len {                          // iterate over each position
        for i in (0..d_model).step_by(2) {           // process one pair of dimensions at a time (even + odd)
            let angle = pos as f64               // position index
                / (10000_f64).powf(i as f64 / d_model as f64);  // divide by scaling factor
            encoding[[pos, i]] = angle.sin();        // even dimensions use sin
            if i + 1 < d_model {
                encoding[[pos, i + 1]] = angle.cos();// odd dimensions use cos
            }
        }
    }
    encoding
}
```

Why sine and cosine specifically? Because they have an elegant mathematical property: the relationship between the encodings of two positions separated by a fixed distance is the same regardless of whether those positions are at the start or the end of the sentence. The model does not need to memorize the relationship between "position 3 and position 8" -- it only needs to learn what "5 positions apart" means. The paper's team also tried letting the model learn positional encodings on its own, and the results were similar, but the sinusoidal version has one extra advantage: it can handle sentences longer than any seen during training.

## 5. Encoder and Decoder

The full Transformer architecture is split into two halves.

The **encoder** (6 stacked layers) is responsible for understanding the input. Each layer contains two sub-layers: one multi-head self-attention, one feed-forward network. Each sub-layer has two protective mechanisms:

- **Residual connection**: add the sub-layer's input directly to its output, i.e., x + Sublayer(x). Why? Imagine applying a filter to a photo. If the filter turns out badly, the residual connection ensures you can still see the original image. In deep networks, information gets transformed at every layer, and by the sixth layer it may be unrecognizable. Residual connections let the original signal take a "shortcut" straight to deeper layers, preventing information from being lost in transit
- **Layer normalization** (LayerNorm): rescales values to a uniform range, preventing some numbers from exploding to infinity while others vanish to zero. Similar to standardizing exam scores -- no matter how different the raw scores are, standardization puts them on a comparable scale

The **decoder** (6 stacked layers) is responsible for generating the output. Its structure resembles the encoder, but with two critical additions:

First, **cross-attention**: as the decoder generates each word, it looks back at the encoder's output. In a translation scenario, this is like writing English while glancing back at the Chinese source text.

Second, **masking**: when generating the 3rd word, the model is only allowed to see the first 2 words. The 4th position and beyond are blocked (attention scores set to negative infinity, which becomes zero after softmax). The logic is simple: when you are writing an essay, the next word has not been written yet -- you cannot peek ahead.

```rust
// Rust

struct Transformer {
    encoder_layers: Vec<EncoderLayer>,  // 6 encoder layers
    decoder_layers: Vec<DecoderLayer>,  // 6 decoder layers
}

struct EncoderLayer {
    self_attention: MultiHeadAttention, // self-attention: relationships between words within the sentence
    feed_forward: FeedForward,          // feed-forward network: independent transformation at each position
    norm1: LayerNorm,                   // first normalization layer
    norm2: LayerNorm,                   // second normalization layer
    dropout: f64, // 0.1               // randomly disable 10% of pathways during training to prevent memorizing the data
}

struct DecoderLayer {
    masked_self_attention: MultiHeadAttention, // masked self-attention: can only see previously generated words
    cross_attention: MultiHeadAttention,       // cross-attention: looks back at encoder output
    feed_forward: FeedForward,                 // feed-forward network
    norm1: LayerNorm,
    norm2: LayerNorm,
    norm3: LayerNorm,                          // extra normalization layer (for the additional cross-attention)
    dropout: f64, // 0.1
}
```

There is one more component that is easy to overlook: the feed-forward network. Its formula is FFN(x) = max(0, xW1 + b1)W2 + b2. In plain language: take each word's 512-dimensional vector and expand it to 2048 dimensions (multiply by a matrix and add a bias), run it through ReLU (all negative numbers become zero, positive numbers stay), then compress it back to 512 dimensions. The ReLU step is the key: it introduces "nonlinearity," allowing the model to learn complex patterns that a straight line could never capture. If every operation were linear, stacking multiple layers would still be mathematically equivalent to a single layer. Nonlinearity is the prerequisite for modeling complexity.

## 6. Training Details

With the architecture designed, how do you train it? The paper put real thought into this as well.

**Hardware**: 8 NVIDIA P100 GPUs. The base model trained for 12 hours (100,000 steps), the large model for 3.5 days (300,000 steps). By today's standards, that cost is remarkably low.

**Optimizer**: Adam (an algorithm that automatically adjusts model parameters), but with a clever learning rate schedule. The learning rate determines how big a step the model takes with each update. Steps too large risk overshooting the optimum; steps too small waste time. The paper's strategy: ramp up over the first 4,000 steps (warmup), avoiding overly aggressive updates at the start; after 4,000 steps, gradually decay on a schedule, stabilizing the later stages of training. Rise then fall -- bold exploration in the first half, fine-tuning in the second.

**Regularization**: two techniques. The first is Dropout: randomly disable 10% of neurons (think of them as computational nodes in the network) during training, forcing the model to not rely on any single pathway and learn more robust features. The second is label smoothing (epsilon = 0.1): instead of telling the model "the probability of the correct answer is 100%," you say "90% on the correct answer, 10% spread across the other options." This actually makes the model worse on one metric (perplexity, which measures how "uncertain" the model is), but translation quality improves. Intuitively, a model that admits it is not 100% sure is more reliable than one that is overconfident.

**Results**: the paper uses BLEU scores (a standard metric for machine translation, measuring how close the machine output is to human translation, with a maximum of 100) to evaluate performance. English-to-German: 28.4. English-to-French: 41.8. Both set new records at the time. Training cost was one to two orders of magnitude lower than previous approaches. Faster, stronger, cheaper.

## 7. My Takeaways

After reading this paper, a few things stand out.

First, the core insight of this paper is remarkably concise: throw away the baggage of sequential processing and let the attention mechanism directly model the relationship between any two positions. Self-Attention, residual connections, Layer Normalization -- none of these were new inventions. The real breakthrough was not inventing new tools, but the authors' willingness to bet that "these simple building blocks, assembled together, are enough" -- and then proving themselves right with experiments.

Second, reimplementing it in Rust gave me a deeper understanding of every design decision. When you write Scaled Dot-Product Attention yourself, you feel viscerally why that sqrt(d_k) scaling matters. When you implement masking, you understand exactly where the autoregressive generation constraint comes from. Reading the paper ten times is not worth as much as writing it once yourself.

Third, what truly struck me was not how many models it later spawned, but the fact that it reframed the problem back in 2017: from "how do we remember a sentence in order" to "how do we let every position directly find the information it needs most." GPT, BERT, T5, LLaMA -- all of them are products of that reframing.

How far a sufficiently good architecture can go depends on how many people are willing to keep building on it.

This paper gave us that architecture.

Attention Is All You Need.

---

**Paper Reading Series**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/posts/sequence-to-sequence-learning-with-neural-networks/) — Establishing the encoder-decoder paradigm
- [<i>Neural Machine Translation by Jointly Learning to Align and Translate</i>](/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — The origin of attention
- [<i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i>](/posts/bert/) — Establishing the pre-training paradigm
- [<i>Scaling Laws for Neural Language Models</i>](/posts/scaling-laws-for-neural-language-models/) — The mathematics of scale
- [<i>Language Models are Few-Shot Learners</i>](/posts/language-models-are-few-shot-learners/) — Larger models, better at eliciting abilities from context
- [<i>Training Compute-Optimal Large Language Models</i>](/posts/training-compute-optimal-large-language-models/) — How to spend your compute budget wisely
