---
title: "论文共读：《Scaling Laws for Neural Language Models》（神经语言模型的缩放定律）"
date: "2026-03-01T16:45:39+08:00"
category: "Paper Reading"
description: 规模的数学：为什么更大的模型可预测地更强，附 Rust 复现核心代码
tags: [paper-reading, scaling-laws, AI, LLM, rust]
pinned: false
---

2020 年 1 月 23 日，OpenAI 的十个人在 arXiv（一个学术论文预印本网站，论文不用等期刊审稿就能直接发布）上传了一篇论文：[《Scaling Laws for Neural Language Models》](/papers/2001.08361v1.pdf)（神经语言模型的缩放定律）。

十位作者分别是 Jared Kaplan、Sam McCandlish、Tom Henighan、Tom B. Brown、Benjamin Chess、Rewon Child、Scott Gray、Alec Radford、Jeffrey Wu 和 Dario Amodei，当时全部在 OpenAI。

这份名单放到今天回看，特别有意思。Jared Kaplan 和 Sam McCandlish 是理论物理出身：Kaplan 在加入 OpenAI 之前，是约翰斯·霍普金斯大学的弦理论教授。Dario Amodei 是 OpenAI 研究副总裁。Tom B. Brown 后来成了 GPT-3 论文的第一作者。Alec Radford 设计了 GPT-1 和 GPT-2。两年之内，Kaplan、McCandlish 和 Amodei 就离开了 OpenAI，联合创立了 Anthropic（Claude 的开发商）。

弦理论学者有个职业习惯：在复杂现象里寻找简洁的普适定律。

这个习惯贯穿了整篇论文。

## 0. 先认几个词

如果你平时不常看这种带公式的论文，先把这几个词认熟，后面会顺很多：

- `参数量`：模型里一共有多少可学习参数，也就是模型的大小。
- `数据量`：训练时一共喂给模型多少文本。
- `算力 / compute`：训练时总共做了多少计算。你可以先把它当成“电费账单”。
- `loss / 损失`：模型犯错有多严重，通常越低越好。
- `幂律 / power law`：某个量按固定指数变化的关系；画在对数坐标上，经常会接近一条直线。
- `对数坐标`：像 `1、10、100、1000` 这样按倍数增长的刻度，不是 `1、2、3、4` 那样均匀加一。

## 1. 要解决什么问题

到 2020 年初，AI 圈已经知道一件事：模型越大，效果越好。但「越大越好」不是科学，是感觉。

大家回答不了几个最基本的问题：算力预算翻一倍，效果能好多少？这笔钱是该花在更大的模型上、更多的数据上，还是更久的训练上？有没有一个公式，可以在花钱之前就算出来？

这篇论文给出了公式。不是靠拍脑袋，也不是靠经验法则：靠方程。

## 2. 幂律：核心发现

论文的核心发现，一句话就能说清：**AI 模型的表现好坏，和它的「个头」之间存在一个简洁的数学关系。**

具体来说，论文测量了三样东西对模型表现的影响：模型有多大（参数量）、喂了多少数据、烧了多少算力。在论文观测到的范围内，只要模型的瓶颈主要在其中一项上，表现和这一项之间的关系都能画成一条漂亮的直线：前提是你把坐标轴的刻度取成对数（也就是 1, 10, 100, 1000 这样等距排列，而不是 1, 2, 3, 4）。

这种「对数坐标下的直线关系」，数学上叫**幂律（power law）**。

三个方程概括了整篇论文：

> L(N) ≈ (N_c / N)^α_N，α_N ≈ 0.076
>
> L(D) ≈ (D_c / D)^α_D，α_D ≈ 0.095
>
> L(C) ≈ (C_c / C)^α_C，α_C ≈ 0.050

别被符号吓到。拆开就是几个简单的角色：

- **L** 是「测试损失」：你可以理解为模型的考试成绩，只不过分数越低代表越好（想象成失误率：失误越少，能力越强）
- **N** 是参数量，也就是模型的「个头」。参数越多，模型能记住的规律就越多
- **D** 是训练数据量，也就是模型的「课本厚度」。课本越厚，能学到的东西就越多
- **C** 是训练消耗的总算力，也就是「电费账单」。单位是 PetaFLOP-days：每秒做一千万亿次运算，连续跑一整天
- **N_c、D_c、C_c** 是常数，当参考点用的
- **α**（alpha）是幂律的指数，决定了「个头翻倍时，成绩能进步多少」。指数越大，同样的投入换来的进步越大

为什么幂律这么重要？因为它意味着回报不会快速见顶。

打个比方：如果 AI 的进步像背单词：前 1000 个很容易，后面越来越慢，背到 5000 个就几乎不动了：那就是对数增长，回报递减极快。但幂律不一样，它像修路：你修到 10 公里的时候觉得效果不错，修到 100 公里效果更好，修到 1000 公里效果又上了一个台阶。每上一个量级都有实实在在的回报。

当然，论文也提醒了：路不可能修到无限远。这个趋势最终一定会变平。但在论文观测到的范围内，这条线走得干净利落，没有撞墙的迹象。

```rust
// Rust

/// Power-law scaling: loss as a function of a single variable
/// L(x) = (x_c / x)^alpha
/// On a log-log plot, this is a straight line with slope -alpha
fn power_law_loss(x: f64, x_c: f64, alpha: f64) -> f64 {
    (x_c / x).powf(alpha)
}

/// The three scaling laws from the paper
fn scaling_laws() {
    let alpha_n = 0.076;  // exponent for model size
    let alpha_d = 0.095;  // exponent for dataset size
    let alpha_c = 0.050;  // exponent for compute

    // Example: if you 10x the number of parameters
    let improvement_n = (10.0_f64).powf(alpha_n);
    // loss decreases by a factor of ~1.19 (about 19% better)

    // Example: if you 10x the dataset
    let improvement_d = (10.0_f64).powf(alpha_d);
    // loss decreases by a factor of ~1.24 (about 24% better)

    // Example: if you 10x the compute
    let improvement_c = (10.0_f64).powf(alpha_c);
    // loss decreases by a factor of ~1.12 (about 12% better)
}
```

三个指数本身就在讲故事。数据量（α = 0.095）扩大一个量级带来的进步最大。模型大小（α = 0.076）次之。算力（α = 0.050）最低：因为如果你只是堆算力，却不合理分配到模型大小和训练时长上，就是在烧钱。真正的杠杆在于：扩对东西。

## 3. 在论文测过的范围内，怎么搭不重要，搭多大才重要

这是论文最出人意料的发现。

Transformer 有很多可以调的「形状」参数：堆多少层（深度）、每层有多宽（隐藏维度）、用多少个注意力头、前馈网络有多大。直觉上你可能觉得，这些比例关系至关重要，调好了事半功倍。

但论文发现：在它测过的 Transformer 形状范围内，这些比例关系几乎不影响最终表现。真正起决定作用的是一个数字：非嵌入参数的总量。

什么是「非嵌入参数」？简单说，模型的参数分两种：一种是「词典」（嵌入层，负责把文字转成数字），另一种是「大脑」（Transformer 层，负责理解和推理）。论文发现，真正决定模型能力的是「大脑」的大小，不是「词典」的大小。

一个只有 2 层但每层特别宽的 Transformer？和一个 40 层但每层很窄的 Transformer？只要它们的「大脑」总参数量接近，考试成绩就差不多。

```rust
// Rust

/// The paper's finding: architecture shape has minimal effect on performance
/// What matters is the total number of non-embedding parameters
struct ArchitectureExperiment {
    n_layers: usize,
    d_model: usize,
    n_heads: usize,
    d_ff: usize,
}

fn non_embedding_params(config: &ArchitectureExperiment) -> u64 {
    let n = config.n_layers as u64;
    let d = config.d_model as u64;
    let ff = config.d_ff as u64;
    // Each Transformer layer has:
    // - attention: 4 * d_model^2 parameters (Q, K, V projections + output projection)
    // - feed-forward: 2 * d_model * d_ff parameters (two linear layers)
    // - layer norms: 4 * d_model parameters
    n * (4 * d * d + 2 * d * ff + 4 * d)
}

// The point: two configs with different shapes but same non_embedding_params()
// will have approximately the same test loss.
// Architecture is not destiny. Scale is.
```

这个发现的实际意义很直接：你不用花几周去搜索「最优架构」。选一个合理的 Transformer 形状，然后把精力放在做大就行。

## 4. 模型什么时候会「死记硬背」：数据瓶颈

模型不是越大越好：如果你的课本太薄的话。

想象一个记忆力超强的学生，你只给他一本 100 页的教材，他很快就能把这本书倒背如流。但这不叫「学会了」，这叫「背下来了」。考试一换题型就傻眼。这就是过拟合：模型把训练数据死记硬背了，却没有学到真正的规律。

论文这里真正漂亮的地方，是给出了一个统一公式，把「模型多大」和「数据多少」如何共同决定表现写进了一个式子：

> L(N, D) = [(N_c / N)^(α_N / α_D) + D_c / D]^α_D

这个公式说的是：模型的考试成绩不是由「个头」或「课本厚度」单独决定的，而是两者一起。如果模型够大但数据不够，性能就卡在数据上；如果数据够多但模型太小，性能就卡在模型上。过拟合，就是「个头大、课本薄」这对矛盾的自然结果。

从这个关系出发，论文还给了一个粗略的经验门槛：「课本至少要多厚，才不会让这个学生背书」：

> D ≳ 5 × 10³ × N^0.74 词元

用大白话说：模型大 10 倍，课本只需要厚大约 5.5 倍就够了。更大的模型学习效率更高：同样看一页书，它能悟到更多。

```rust
// Rust

/// The paper's unified two-variable loss formula
/// L(N, D) = [(N_c / N)^(alpha_N / alpha_D) + D_c / D]^alpha_D
fn loss_nd(n_params: f64, n_tokens: f64) -> f64 {
    let n_c = 8.8e13;       // reference constant for model size
    let d_c = 5.4e13;       // reference constant for dataset size
    let alpha_n = 0.076;
    let alpha_d = 0.095;
    let ratio = alpha_n / alpha_d;
    ((n_c / n_params).powf(ratio) + d_c / n_tokens).powf(alpha_d)
}

/// Rough overfitting threshold from the paper
/// D_min ≈ 5000 * N^0.74
fn min_dataset_tokens(n_params: f64) -> f64 {
    5000.0 * n_params.powf(0.74)
}

/// Example: for a 1B parameter model
/// min_dataset_tokens(1e9) ≈ 5000 * (1e9)^0.74 ≈ 2.3 × 10^10 tokens (~23B tokens)
///
/// For a 175B parameter model (GPT-3 scale)
/// min_dataset_tokens(175e9) ≈ 5000 * (175e9)^0.74 ≈ ~1.0 × 10^12 tokens (~1T tokens)
```

按这个公式粗略一算，GPT-3 那个级别（1750 亿参数）的模型要想不「背书」，课本厚度应该接近万亿词元。但 GPT-3 实际只喂了 3000 亿词元：远没到安全线。回头看，GPT-3 的数据其实是偏少的。这也是为什么后来业界重新审视了「模型多大、数据喂多少」这个配比：最典型的就是 Chinchilla 论文（Hoffmann 等人，2022 年），直接指出：之前那些大模型，数据普遍喂少了。

## 5. 算力最优分配：钱该怎么花

如果你有一笔固定的算力预算：比如说够你租 1000 块 GPU 跑一个月：应该怎么花？这是论文里最有实际价值的问题，答案相当反直觉。

论文发现最优分配遵循：

> N_opt ∝ C^0.73（模型大小应该随算力增长最快）
>
> B_opt ∝ C^0.24（每次喂给模型的数据批量增长缓慢）
>
> S_opt ∝ C^0.03（训练轮数几乎不增加）

翻译成人话：如果你的预算涨了 10 倍，你应该把模型做大约 5.4 倍，每次喂的数据量增加约 1.7 倍，训练时间几乎不延长（大约只多 7%）。

钱主要花在哪？花在把模型做大上。

反直觉的部分来了：**你应该造一个尽可能大的模型，然后不用训到头就可以停。** 大多数人的直觉是「我选个中等大小的模型，然后慢慢训，训到极致」。缩放定律说的恰恰相反：同样一笔钱，一个没训完的大模型，比一个训透了的小模型，表现更好。

就像装修：同样 50 万预算，与其在一个 60 平的小户型里堆满顶配材料，不如买一个 120 平的大户型做个简装。空间大了，住起来怎么都比小房子舒服。

```rust
// Rust

/// Compute-optimal allocation: given a compute budget C,
/// how to distribute it across model size, batch size, and training steps
struct ComputeAllocation {
    n_params: f64,        // model parameters
    batch_size: f64,      // tokens per batch
    training_steps: f64,  // number of optimization steps
}

fn optimal_allocation(compute: f64) -> ComputeAllocation {
    // These exponents are from the paper's empirical fits
    ComputeAllocation {
        n_params: compute.powf(0.73),       // most of the budget goes to model size
        batch_size: compute.powf(0.24),      // batch size scales slowly
        training_steps: compute.powf(0.03),  // training steps barely change
    }
}

/// The implication: compute-efficient frontier
/// For each compute budget, there is ONE optimal model size.
/// Larger models trained for fewer steps beat smaller models trained to convergence.
fn is_compute_efficient(n_params: f64, compute: f64) -> bool {
    let optimal_n = compute.powf(0.73);
    // If your model is much smaller than optimal, you're wasting compute
    // on training steps that yield diminishing returns
    (n_params / optimal_n - 1.0).abs() < 0.5  // within ~50% of optimal
}
```

这个结论深刻地改变了整个行业。五个月后发布的 GPT-3 直接遵循了这个思路：造一个当时规模空前的 1750 亿参数模型，而不是把小模型训到极致。后来的 Chinchilla 论文（Hoffmann 等人，2022 年）更新了具体的指数，认为大多数大模型的数据其实喂少了：但「最优权衡是可以算出来的」这个核心洞察，源头在这里。

## 6. 临界批大小：什么时候该加机器

训练 AI 模型的时候，你可以选择每次给模型看多少数据再更新一次：这叫「批大小」（batch size）。批大小越大，你可以同时用更多 GPU 并行处理，训练速度就越快。但并不是加机器就一定有用。

论文发现，批大小存在一个「甜蜜点」：

> B_crit ∝ L^(-4.8)

训练刚开始的时候，模型还很「菜」，每批数据都能给它很大启发，小批量就够了。但训练到后期，简单的规律都学完了，每批数据带来的新信息越来越少，这时候就需要更大的批量来「凑够信号」。

甜蜜点以下，加机器很划算：机器翻倍，训练时间几乎减半。甜蜜点以上，加机器就是烧钱：多出来的机器几乎不加速。

```rust
// Rust

/// Critical batch size: the threshold between compute-efficient and time-efficient training
/// B_crit(L) ∝ L^(-4.8)
fn critical_batch_size(loss: f64, b_star: f64, l_star: f64) -> f64 {
    // b_star and l_star are reference constants from empirical fitting
    b_star * (l_star / loss).powf(4.8)
}

/// Below B_crit: each step gives a strong gradient signal.
///   Doubling batch size ≈ halving training time. Compute stays roughly constant.
/// Above B_crit: gradient signal per additional sample diminishes.
///   Doubling batch size barely speeds up training. You're wasting compute.
///
/// Practical implication: as training progresses and loss drops,
/// you can (and should) increase the batch size to maintain efficiency.
```

很多团队全程用固定的批大小训练。缩放定律告诉你：应该随着训练推进逐步加大：开始用小批量，模型变强后再加机器。

## 7. 我的思考

读完这篇论文，有几点感受。

第一，论文最深层的贡献不是任何一个具体数字，而是证明了一件事：AI 模型的表现好坏，不是玄学，是可以用简洁的数学关系描述的。在这篇论文之前，训练大模型基本靠经验：试一试，调调参数，听天由命。有了这篇论文，你可以在花钱之前就算出来结果大概会怎样。它至少把大模型训练里最贵、最关键的一部分：钱怎么花：从「靠感觉」推进到了「可以算」。

第二，作者的背景很重要。Kaplan 和 McCandlish 带来了理论物理学家的思维方式：精确测量，拟合规律，寻找最简洁的描述。这不是大多数 AI 论文的写法。多数 AI 论文是「我发明了一个新东西，效果比之前好」。这篇论文没发明任何新东西。它提出的是一种看问题的方式。工具不新：洞察是新的。

第三，「尽量把模型做大，但不用训到头就可以停」这个结论是真的反直觉，而且直接重塑了行业的资源分配方式。在这篇论文之前，默认做法是选一个模型大小然后训到完全收敛：把这笔预算花到底。有了这篇论文之后，问题变成了：同样一笔预算，与其把一个小模型训到极致，不如把模型做到尽可能大，训到「够用」就停：因为一个没训完的大模型，比一个训透的小模型表现更好。这个思路直接催生了 GPT-3（1750 亿参数，3000 亿词元），也影响了后来的每一个大模型。

第四，从历史脉络看，这篇论文可以被视为 [GPT-3 论文](/zh-hans/posts/language-models-are-few-shot-learners/)的理论基础。GPT-3 直接引用了它，GPT-3 论文也明确展示了 few-shot 能力（给几个例子就能完成新任务）随模型容量平滑提升。把 GPT-3 选择 1750 亿参数看作受缩放定律启发，是合理的推断：尽管 GPT-3 论文本身并没有逐句写明「我们按 Kaplan 的公式设定了参数量」。但可以说，没有缩放定律提供的信心，在那个规模上做决策的不确定性会大得多。

「更大的模型更强」，这句话在 2020 年之前只是一种感觉。这篇论文把它变成了一组方程：告诉你强多少、花多少、怎么花最划算。

AI 行业后来变成了一场算力竞赛。读完这篇论文你就明白了：这场竞赛不是盲目的军备竞赛，而是有人先算清了账。

---

**论文共读系列**

- [《Sequence to Sequence Learning with Neural Networks》](/zh-hans/posts/sequence-to-sequence-learning-with-neural-networks/)（使用神经网络进行序列到序列学习） — 编码器-解码器范式的确立
- [《Neural Machine Translation by Jointly Learning to Align and Translate》](/zh-hans/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/)（通过联合学习对齐与翻译实现神经机器翻译） — 注意力机制的起源
- [《Attention Is All You Need》](/zh-hans/posts/attention-is-all-you-need/)（注意力就是你所需要的全部） — 注意力成为主角，Transformer 的诞生
- [《BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding》](/zh-hans/posts/bert/)（BERT：用于语言理解的深度双向 Transformer 预训练） — 预训练范式的确立
- [《Language Models are Few-Shot Learners》](/zh-hans/posts/language-models-are-few-shot-learners/)（语言模型是少样本学习者） — 更大的模型，更善于从上下文中诱发能力
- [《Training Compute-Optimal Large Language Models》](/zh-hans/posts/training-compute-optimal-large-language-models/)（训练计算最优的大语言模型） — 怎样花算力最划算
