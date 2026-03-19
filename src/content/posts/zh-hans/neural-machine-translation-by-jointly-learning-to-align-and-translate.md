---
title: 论文共读：《Neural Machine Translation by Jointly Learning to Align and Translate》
date: 2026-01-11
category: "Paper Reading"
description: 注意力机制的起源，附 Rust 复现代码
tags: [paper-reading, attention, AI, LLM, rust]
pinned: false
---

2014 年 9 月 1 日，三个人在 arXiv（一个学术论文预印本网站，论文不用等期刊审稿就能直接发布）上传了一篇论文：<a href="/papers/1409.0473v7.pdf" target="_blank">《Neural Machine Translation by Jointly Learning to Align and Translate》</a>（通过联合学习对齐与翻译实现神经机器翻译）。

这三个人是 Dzmitry Bahdanau、KyungHyun Cho 和 Yoshua Bengio，来自蒙特利尔大学。Yoshua Bengio 是深度学习「三巨头」之一，另外两位是 Geoffrey Hinton 和 Yann LeCun；三人共同获得了 2018 年图灵奖。Bahdanau 当时还是博士生。

这篇论文的核心贡献可以概括成一件事：让翻译模型在生成每个词的时候，学会回头看源句子的不同部分。听起来理所当然，但在当时的神经机器翻译研究里，这是一个非常新的想法。它有一个名字，叫「注意力机制」。

三年后，Google 的八个人把这个想法推到了极致，写出了[《Attention Is All You Need》](/zh-hans/posts/attention-is-all-you-need/)。所以如果你想理解 Transformer，这篇论文是最重要的前史之一。

## 1. 问题出在哪

2014 年的神经机器翻译有一个标准架构：编码器-解码器（Encoder-Decoder）。编码器是一个循环神经网络（RNN），把源句子从头到尾读一遍，把整个句子压缩成一个固定长度的向量（可以理解为一串固定数量的数字）。解码器是另一个 RNN，从这个向量出发，一个词一个词地生成翻译。

问题很明显：不管源句子是 5 个词还是 50 个词，编码器都要把它压进同一个长度的向量里。短句子还行，长句子就丢信息。就像你让一个人读完一整页书，然后只能用一句话复述，句子越长，遗漏越多。

论文用实验证明了这一点：当句子长度超过 30 个词，传统编码器-解码器的翻译质量急剧下降。

这就是「固定长度瓶颈」。

## 2. 核心想法：别压缩，让解码器自己去找

论文的解决方案很直觉：既然把整个句子压成一个向量会丢信息，那就不压了。编码器保留每个位置的注解向量（annotation，由双向 RNN 的前向和后向隐藏状态拼接而成，可以理解为每个词处理完之后产生的中间结果），解码器在生成每个目标词时，自己决定该重点看源句子的哪些部分。

这就是注意力机制的核心：**不再强迫所有信息挤过一个瓶颈，而是让模型学会在需要的时候回头找需要的信息。**

具体来说，分三步：

**第一步，打分。** 解码器在生成第 i 个目标词之前，会用自己当前的状态 s_{i-1} 和编码器每个位置的隐藏状态 h_j 做比较，算出一个「对齐分数」e_{ij}。分数越高，说明生成当前目标词时，源句子的第 j 个位置越重要。

论文用的打分函数是：

> e_{ij} = a(s_{i-1}, h_j) = v_a^T tanh(W_a s_{i-1} + U_a h_j)

这叫「加性注意力」（additive attention）。把解码器状态和编码器状态各自做一次线性变换（乘以矩阵），加起来，过一个 tanh（一种把数值压缩到 -1 到 1 之间的函数），再和一个向量 v_a 做点积，得到一个标量分数。

**第二步，归一化。** 用 softmax 把所有位置的分数转成概率，加起来等于 1：

> α_{ij} = softmax(e_{ij}) = exp(e_{ij}) / Σ exp(e_{ik})

**第三步，加权求和。** 用这些概率对编码器的隐藏状态做加权求和，得到一个「上下文向量」c_i：

> c_i = Σ α_{ij} h_j

这个上下文向量就是解码器在生成第 i 个词时，从源句子里提取到的关键信息。每生成一个词，上下文向量都不一样，因为模型关注的源句子位置不一样。

用 Rust 写出来：

```rust
// Rust

/// 加性注意力：Bahdanau 风格
fn bahdanau_attention(
    decoder_state: &Tensor,  // 解码器当前状态 s_{i-1}
    encoder_outputs: &Tensor, // 编码器所有位置的隐藏状态 [h_1, ..., h_T]
    w_a: &Tensor,            // 权重矩阵 W_a
    u_a: &Tensor,            // 权重矩阵 U_a
    v_a: &Tensor,            // 向量 v_a
) -> (Tensor, Tensor) {
    // 第一步：算对齐分数
    let score = v_a.matmul(
        &(w_a.matmul(decoder_state) + u_a.matmul(encoder_outputs))
            .tanh()             // tanh 把数值压到 -1 到 1
    );
    // 第二步：softmax 转成概率
    let weights = score.softmax(-1);
    // 第三步：加权求和，得到上下文向量
    let context = weights.matmul(encoder_outputs.transpose(-2, -1));
    (context, weights)          // 返回上下文向量和注意力权重
}
```

和后来 Transformer 用的「点积注意力」（Q 和 K 直接做点积）不同，这篇论文用的是「加性注意力」（先各自做线性变换，再加起来）。两种方法各有特点，但点积注意力更适合用高效矩阵乘法实现；再加上 Transformer 去掉了 RNN 的顺序依赖，注意力才真正成为可大规模并行的核心算子。

## 3. 编码器：双向 RNN

单向 RNN 从左往右读句子，到了最后一个词才输出一个总结向量。问题是：每个位置的隐藏状态主要只带着左侧上下文，看不到右边。

论文用了双向 RNN（BiRNN）来解决这个问题。一个 RNN 从左往右读，另一个从右往左读，然后把两个方向的隐藏状态拼起来。这样每个位置的隐藏状态就同时包含了左边和右边的上下文。

```rust
// Rust

struct BidirectionalRNN {
    forward_rnn: RNN,   // 从左往右读
    backward_rnn: RNN,  // 从右往左读
}

impl BidirectionalRNN {
    fn forward(&self, input: &[Tensor]) -> Vec<Tensor> {
        let fwd = self.forward_rnn.forward(input);          // 正向隐藏状态
        let bwd = self.backward_rnn.forward_reversed(input); // 反向隐藏状态
        // 把正向和反向的隐藏状态拼起来
        fwd.iter().zip(bwd.iter())
            .map(|(f, b)| Tensor::cat(&[f, b], -1))
            .collect()
    }
}
```

论文里每个方向各有 1000 个隐藏单元，拼起来就是 2000 维。这比单向 RNN 多了一倍参数，但换来的是每个位置都能看到完整的上下文。

## 4. 解码器：每一步都重新对齐

把编码器和注意力机制组装起来，解码器的工作流程就清楚了：

1. 编码器用双向 RNN 读完源句子，保留每个位置的隐藏状态（注解向量）
2. 解码器开始生成翻译，每生成一个词之前：
   - 用当前状态和所有注解向量算注意力权重
   - 加权求和得到上下文向量
   - 结合上下文向量、上一个生成的词和当前状态，预测下一个词

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
        prev_word: &Tensor,       // 上一步生成的词
        prev_state: &Tensor,      // 上一步的隐藏状态
        encoder_outputs: &Tensor, // 编码器所有位置的隐藏状态
    ) -> (Tensor, Tensor) {
        // 注意力：决定看源句子的哪些部分
        let (context, _weights) = self.attention.forward(prev_state, encoder_outputs);
        // RNN 更新状态：融合上下文、上一个词和上一步状态
        let new_state = self.rnn.step(prev_word, prev_state, &context);
        // 预测下一个词的概率分布
        let output = self.output_proj.forward(&new_state);
        (output, new_state)
    }
}
```

关键在于：每生成一个目标词，解码器都会重新计算注意力分布。翻译第一个词时可能重点关注源句子的开头，翻译最后一个词时可能重点关注源句子的结尾。这种动态对齐能力，是之前的固定向量架构做不到的。

## 5. 实验结果

论文在英法翻译任务上做了实验（使用 WMT '14 数据集），用 BLEU 分数（衡量机器翻译和人工翻译接近程度的标准评分，满分 100）衡量效果。

关键对比：
- **RNNencdec-50**（传统编码器-解码器，训练时最长 50 词）：26.71 BLEU
- **RNNsearch-50**（带注意力的模型，训练时最长 50 词）：**34.16 BLEU**
- **Moses**（当时最强的传统短语翻译系统）：33.30 BLEU

提升了 7.45 分。在论文报告的实验设置里，带注意力的神经模型已经达到甚至超过了当时强势的传统短语翻译系统。

更关键的发现在论文的 Figure 2：随着句子长度增加，传统编码器-解码器的 BLEU 分数急速下跌，而带注意力的模型几乎不受影响。这直接验证了论文的核心假设：固定长度向量是瓶颈，注意力机制可以绕过它。

论文还展示了注意力权重的可视化。在英法翻译里，注意力权重几乎形成了一条对角线，说明模型自动学会了「英语第 1 个词对应法语第 1 个词，英语第 2 个词对应法语第 2 个词」的对齐关系。遇到语序不同的情况（比如法语的形容词放在名词后面），注意力权重也会对应地偏移。模型不需要任何人工对齐标注，就学会了这些。

## 6. 我的思考

读完这篇论文，有几个感受。

第一，这篇论文解决的问题极其明确：编码器把整个句子压成一个向量，长句子丢信息。解决方案也极其直觉：别压了，让解码器自己去找。好的研究往往就是这样，问题清晰，解法自然。

第二，注意力机制在这篇论文里还是 RNN 的配角。编码器仍然是循环的（双向 RNN），解码器也是循环的，注意力只是在两者之间架了一座桥。三年后 Vaswani 等人问了一个更激进的问题：既然注意力这么好用，能不能把 RNN 整个扔掉，只留注意力？答案就是 Transformer。

第三，用 Rust 复现这篇论文的注意力机制时，你会发现它的计算流程比 Transformer 的 Scaled Dot-Product Attention 复杂不少。加性注意力需要额外的权重矩阵 W_a、U_a、v_a，而点积注意力只需要 Q 和 K 直接相乘再缩放。从「加法」到「乘法」，看似一小步，实际上大幅简化了计算，也更适合用矩阵运算高效实现。

第四，Bahdanau 当时是博士生，Bengio 是他的导师。一个博士生的论文，定义了此后十年 AI 研究的核心组件。注意力机制从这里开始，经过 Transformer 的放大，最终成为 GPT、BERT、LLaMA 的基石。

这篇论文没有发明什么复杂的数学。它只是问了一个简单的问题：解码器为什么不能回头看？

然后它让解码器回头看了。

这一看，看出了整个时代。

---

**论文共读系列**

- [《Sequence to Sequence Learning with Neural Networks》](/zh-hans/posts/sequence-to-sequence-learning-with-neural-networks/) — 编码器-解码器范式的确立
- [《Attention Is All You Need》](/zh-hans/posts/attention-is-all-you-need/) — 注意力成为主角，Transformer 的诞生
- [《BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding》](/zh-hans/posts/bert/) — 预训练范式的确立
- [<i>Scaling Laws for Neural Language Models</i>](/zh-hans/posts/scaling-laws-for-neural-language-models/) — 规模的数学：为什么更大的模型可预测地更好
- [《Language Models are Few-Shot Learners》](/zh-hans/posts/language-models-are-few-shot-learners/) — 更大的模型，更善于从上下文中诱发能力
- [《Training Compute-Optimal Large Language Models》](/zh-hans/posts/training-compute-optimal-large-language-models/) — 怎样花算力最划算
