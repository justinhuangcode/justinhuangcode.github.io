---
title: "技术报告共读：《Attention Residuals》（注意力残差）"
date: "2026-03-19T16:49:27+08:00"
category: "Technical Report Reading"
description: Kimi 团队 Attention Residuals 技术报告：为什么残差连接也该“注意力化”，以及 Full AttnRes / Block AttnRes 如何把这个想法做成可训练、可部署的系统
tags: [technical-report-reading, residual-connections, transformer, AI, LLM, rust]
pinned: false
---

2026 年 3 月 16 日，Kimi Team 在 arXiv 上传了一篇技术报告：[《Attention Residuals》](/papers/2603.15031v1.pdf)（注意力残差）。

从整份报告的结构就能看出作者真正的重心：不是只发一个新模块，而是按 `motivation -> AttnRes -> Block AttnRes -> infrastructure -> experiments -> discussion` 的顺序，把“残差连接到底在做什么”这件事重新讲了一遍。

## 0. 先认几个词

如果你完全没有机器学习背景，可以顺着这篇报告真正关心的问题，按下面这个顺序先建立一个直觉：

- `Transformer`：今天大多数大模型的基础架构。你可以先把它理解成一台一层一层处理信息的机器。
- `hidden state`：模型在某一层里的内部中间表示。可以粗略理解成“模型此刻脑子里的临时笔记”。
- `residual connection / 残差连接`：层和层之间的一条“保留旧内容”的通道。它会先把上一层的内容留住，再把这一层新算出来的东西加上去。
- `residual / 残差`：更接近“这一层新补上去的增量”，也就是上面那条残差连接里新增的那一部分。
- `attention`：从很多信息里，挑出“当前最该看哪一部分”的机制。这个词你可以先记成“有选择地看重点”。
- `PreNorm`：在进入一层之前，先把数值尺度调匀，再做后续计算。可以把它想成“先把音量调到合适，再继续混音”。

## 1. 一句话说清楚

这份技术报告问了一个非常锋利的问题：

**既然 Transformer 已经用 attention 取代了“时间维度上的递归”，为什么大模型在“深度维度上的信息聚合”还停留在固定加法？**

现代 LLM 几乎都在用一种很常见的层结构：先做 PreNorm，再走 residual。直白地说，就是先把数值尺度调匀，再把这一层新算出来的结果加回原输入。大家熟悉它的一个功能，是让训练过程更稳定，深层网络不那么容易失控。但作者提醒我们，残差连接其实还有另一个同样重要、却长期被忽视的角色：

**它定义了信息怎样沿着深度被汇总。**

如果下面的式子看不熟，不用卡住，直接看后面的“翻译成人话”就够了。

标准残差的规则很简单：

> h_l = h_{l-1} + f_{l-1}(h_{l-1})

这里可以直接把两部分拆开看：

- `h_{l-1}`：旧内容，也就是上一层已经有的表示
- `f_{l-1}(h_{l-1})`：这一层新算出来的增量，更接近“残差”这个词本身

而把这两部分重新加在一起的整条做法，才更准确地叫“残差连接”。

把这个递推式展开，你会得到：

> h_l = h_1 + \sum_{i=1}^{l-1} f_i(h_i)

翻译成人话就是：第 `l` 层看到的输入，本质上是“embedding 加上前面所有层输出的统一加总”。每一层的权重都是 1，没有选择，没有抑制，没有“这一步我更该看第 3 层还是第 17 层”的机制。

AttnRes 的核心思想只有一句话：

**把 residual 从固定加法，改成沿深度做一次 softmax attention。**

## 2. 旧残差到底哪里有问题

这份技术报告最重要的地方，不在于它提出了一个新公式，而在于它把一个大家已经习惯了的东西重新问题化了。

标准残差长期被视为“训练稳定性工具”。只要能让梯度过得去，它就算完成任务了。但从信息流角度看，这条路径其实非常粗糙。

想象你在写一份持续迭代的文档。每一轮修改，你都不是“挑出最 relevant 的旧版本内容再整合”，而是把之前所有版本一股脑全文追加到文档末尾。第 20 轮的时候，前 3 轮的重要洞察当然还在，但它们已经淹没在越来越厚的堆叠里了。

PreNorm 的问题就在这儿。报告引用了 SiameseNorm 的观察，并进一步强调：在 PreNorm 下，`hidden state` 的量级会随着深度近似按 `O(L)` 增长。这里的 hidden state，说白了就是模型每一层里的那份“内部笔记”。结果就是：

- 越往后的层，看到的是一个越来越膨胀的“历史总和”
- 早期层的信息虽然没有消失，但会被不断稀释
- 后面层如果还想“发出声音”，就被迫输出更大的量级

这篇技术报告把这个现象叫 `PreNorm dilution`。这是一个非常准确的命名。不是梯度断了，不是模型炸了，而是每一层的相对贡献被越来越稀。

报告里有一句我很喜欢的潜台词：我们在序列维度上早就不满足于“所有过去 token 一视同仁”了，所以才有了 attention；那为什么到了深度维度，却还能接受“所有过去层统一权重相加”？

## 3. AttnRes 到底做了什么

AttnRes 的形式很干净。第 `l` 层不再机械地接收“前面所有层输出的总和”，而是对这些历史表示做一次加权选择：

> h_l = \sum_{i=0}^{l-1} \alpha_{i \to l} \cdot v_i

其中权重 `α_{i -> l}` 来自一层 softmax。你可以先把 softmax 理解成“把一组分数压成一组权重，而且所有权重加起来等于 1”，这样模型才能明确表达“更该看谁、少看谁”：

> α_{i -> l} = softmax(w_l^T RMSNorm(k_i))

如果你没接触过 attention，还有一个最省力的理解方式：

- `query`：当前这一层现在想找什么
- `key`：每一层历史信息各自贴着什么“索引标签”
- `value`：最后真正被取回来、参与汇总的内容

这里最值得注意的设计有三个。

第一，**query 不是当前 hidden state 现算出来的，而是每层一个可学习的 pseudo-query 向量 `w_l`。**  
这有点反直觉。我们平时看到 attention，会自然以为 query 必须来自当前输入。但作者故意把 query 设计成层级参数，而不是 token 级动态向量。这样做的好处是：同一个 block 里的多个 query 可以提前批量算，后面基础设施优化才有空间做。

第二，**key/value 直接来自前面层的输出。**  
也就是说，真正带来“输入相关性”的不是 query，而是各层当前样本上的表示本身。不同样本经过前面层后得到的 key 不一样，所以最后的深度注意力依然是 input-dependent 的。

第三，**key 前面加了 RMSNorm。**  
这是个很关键的小设计。因为如果不做归一化，量级大的层会天然在点积里占便宜，你得到的就不是“谁更 relevant”，而更像“谁声音更大”。报告正文也明确强调了这一点。

用 Rust 伪代码写出来，大概就是这样：

```rust
// Rust

fn attention_residual(
    sources: &[Tensor],   // embedding + all previous layer outputs
    pseudo_query: &Tensor, // current layer's learned vector w_l
    norm: &RmsNorm,
) -> Tensor {
    let keys: Vec<Tensor> = sources
        .iter()
        .map(|x| norm.forward(x))
        .collect();

    let logits: Vec<Tensor> = keys
        .iter()
        .map(|k| pseudo_query.dot(k))
        .collect();

    let weights = Tensor::stack(&logits, 0).softmax(0);

    weights
        .iter()
        .zip(sources.iter())
        .fold(Tensor::zeros_like(&sources[0]), |acc, (w, v)| acc + w * v)
}
```

这个式子看上去像是“把 attention 用在 residual 上”。但我觉得更准确的说法是：

**它把 residual connection 从“固定的累加器”改成了“可选择的深度检索器”。**

## 4. 这份报告最妙的地方：它不是只给想法，也给工程

如果报告只写到 Full AttnRes，这还只能算一个漂亮的 research idea。

Full AttnRes 让每一层都 attend 到前面所有层，理论上很好理解，实际上也不算太贵。因为网络深度 `L` 通常远小于序列长度 `T`，所以作者说，单纯算术量 `O(L^2 d)` 并不是最可怕的问题。

真正的问题出现在大训练里：

- activation recomputation 会把本来可以丢掉的中间层输出重新变成必须保存的对象
- pipeline parallelism 会让这些跨层表示需要跨 stage 传输
- 一旦每层都要看所有前层，通信和缓存压力会快速上去

所以他们又提出了 **Block AttnRes**。

做法是把 `L` 层切成 `N` 个 block。block 内部先用普通求和攒成一个 block representation，跨 block 再做 attention。这样一来：

- Full AttnRes：看的是所有历史层
- Block AttnRes：看的是所有历史 block 的摘要，再加当前 block 的部分和

本质上是用“摘要级跨层注意力”换取可扩展性。

这还没完。作者不是只说“我们分块了，所以省内存”，而是真把系统层的账也算清楚了：

- 训练阶段用 **cross-stage caching**，避免 pipeline 里重复传历史 block
- 推理阶段用 **two-phase computation**
- 第一阶段并行算 inter-block attention
- 第二阶段顺序算 intra-block lookback，再用 online softmax merge 合并

从附录和 `table/memory_access.tex` 里能看到最硬核的一组数字。按报告给的典型设定：

- 标准 residual：每层 residual 机制 I/O 是 `3d`
- naive Full AttnRes：`130d`
- 优化后的 Full AttnRes：`24d`
- Block AttnRes：`5.5d`
- mHC：`34d`

这组数字特别说明问题。Block AttnRes 不是“便宜到跟标准 residual 一样”，但它已经从“明显不现实”降到了“工程上值得试”。而且报告实测给出的代价也不大：

- 训练端 wall-clock overhead 小于 4%
- 推理端 latency overhead 小于 2%

这就是我说它像一篇真正的系统级技术报告的原因。很多 paper 的问题在于“idea 是新的，账是糊的”；这篇在账本上反而做得很用力。

## 5. 实验最该看什么

### 5.1 缩放定律：不是偶然赢一把

作者先做了五个模型规模的 scaling law 实验，对比 Baseline、Full AttnRes 和 Block AttnRes。

拟合出来的曲线是：

- Baseline：`1.891 × C^-0.057`
- Block AttnRes：`1.870 × C^-0.058`
- Full AttnRes：`1.865 × C^-0.057`

这三条曲线最重要的信息不是“斜率差了多少”，而是：

**AttnRes 在整个 compute 范围里都持续更低。**

报告给了一个很容易传播的结论：在 `5.6 PFLOP/s-days` 这个预算点，Block AttnRes 的 loss 相当于 baseline 多花 `1.25x` 算力才能达到的水平。

换句话说，这不是“在某个模型大小上碰巧调对了”，而是有比较稳定的规模收益。

### 5.2 大模型主实验：不是玩具规模

主实验不是小模型 toy benchmark，而是基于 Kimi Linear 的一个大配置：

- `48B total / 3B activated parameters`
- 27 个 Transformer blocks，也就是 54 层
- 8-of-256 routed experts + 1 个 shared expert
- 预训练 `1.4T tokens`

这说明作者不是只在“小模型上做漂亮曲线”，而是真把这个 residual 改造塞进了一个大训练配方里。

### 5.3 最能说明问题的图：输出量级不再失控

正文里最打动我的其实不是 benchmark 表，而是训练动态那张图。

Baseline 的 output magnitude 会随着深度一路涨上去。训练动态图里给的数值非常夸张：从前面 block 的 `0.04`、`0.06`、`0.10`，一直涨到后面 block 的 `10.47`、`12.15`。这就是 PreNorm dilution 的视觉化版本。

Block AttnRes 则完全不是这条曲线。它在 block 边界形成一种周期性重置，量级大致在 `0.21` 到 `1.91` 之间波动，没有出现一路失控上扬。

这非常重要，因为它说明 AttnRes 不是只在最后 benchmark 上“多拿了几分”，而是真正在训练动力学层面改变了表示如何沿深度堆积。

### 5.4 下游任务：提升最明显的是推理和代码

预训练后，AttnRes 在报告列出的全部评测上都不差于 baseline，几个最亮眼的点包括：

- MMLU：`73.5 -> 74.6`
- GPQA-Diamond：`36.9 -> 44.4`
- Math：`53.5 -> 57.1`
- HumanEval：`59.1 -> 62.2`
- C-Eval：`79.6 -> 82.5`

这里最值得注意的是 GPQA、Math、HumanEval 这种多步推理或程序生成任务涨幅更大。报告作者的解释是：如果后层能更有选择地回收前层表示，那么 compositional tasks 会更受益。我觉得这个解释是说得通的。

因为复杂推理最怕的不是“信息不存在”，而是“信息在网络很深的地方被埋住了”。

## 6. 消融实验告诉了我们什么

这份报告的消融做得不错，因为它不只是证明“有用”，还试图证明“为什么有用”。

几个最有意思的结论：

- **DenseFormer 1.767，几乎和 baseline 1.766 一样。**  
  这说明“能访问所有前层”本身还不够，关键在于权重是不是 input-dependent。

- **mHC 到了 1.747，已经明显变好。**  
  这说明深度维度上的动态混合确实有效。

- **Full AttnRes 到了 1.737。**  
  它比 baseline、DenseFormer、mHC 都更低，说明显式的 softmax depth attention 是更强的一条路。

- **SWA（只看最近窗口）只有 1.764。**  
  这很有价值。它说明 AttnRes 的收益不只是“多看最近几层”，而是“能选择性地看更远的层”。

- **Block size 从 2、4、8 变化时，loss 都在 1.746 左右。**  
  这就是为什么作者最后固定大约 8 个 blocks。不是拍脑袋，而是工程和效果之间一个相当好的 sweet spot。

- **input-dependent query 版本做到 1.731，比 Full AttnRes 还好。**  
  这一点非常耐人寻味。它说明当前报告里的 pseudo-query 设计并不是性能上限，而是一个为基础设施优化让路的折中。也就是说，作者不是不知道更强的写法，而是主动选了更容易扩展的写法。

这正是我觉得这份报告有意思的原因。你从正文、消融和系统设计里能更清楚地看到他们的真实取舍：不是盲目追求最低 loss，而是在追求“足够强，同时真能训起来”。

## 7. 我怎么看这份报告

第一，这份报告最重要的，不是它发明了一个新模块，而是它把 residual connection 从“训练稳定性工具”重新提升成了“信息路由机制”。

这个视角一旦建立起来，很多东西都会被重新理解。残差不再只是梯度 highway，它还是 depth aggregation rule。你会开始追问：

- 每一层到底能不能选择性地访问前层？
- 深度维度上有没有 attention sink？
- 旧的 residual 变体本质上是不是 depth-wise linear attention？

而这正是报告讨论部分真正厉害的地方。作者把一堆残差变体统一进了一个 `depth mixing matrix` 的视角里，进一步指出：

**很多已有方法，本质上都像是在深度维度上做 linear attention；AttnRes 做的是 depth-wise softmax attention。**

这个说法非常大胆，但也非常有启发性。它等于是在说：Transformer 当年把序列维度从 recurrence 推到了 softmax attention；AttnRes 试图把深度维度也推进一步。

第二，这篇技术报告的气质很像“先把问题提对，再把系统做顺”。它没有执着于把每个部件都做到最 fancy。比如 query 故意做成 layer-specific 参数，而不是 token-dependent 动态向量，性能上未必绝对最强，但它给了 batching、two-phase computation、pipeline cache 一个成立的基础。很多时候，一篇能落地的技术报告，靠的不是最激进的局部设计，而是整体约束下的取舍。

第三，我觉得这份报告真正值得记住的不是某个 benchmark，而是这句话：

**Why is depth-wise aggregation still fixed while everything else has become adaptive?**

这问得太对了。

## 8. 这份报告的边界

再夸一句之前，也得把边界说清楚。

第一，它目前是 **technical report / arXiv preprint**，不是已经过同行评审的会议论文。写这类文章时，最稳妥的态度不是“它已经证明了未来”，而是“它提出了一个很强的视角，并给出了一套有工程可行性的实现”。

第二，它的大规模结果主要建立在 Kimi Linear 这条架构线上：MoE、KDA/MLA 混合注意力、Moonlight / DeepSeek-V3 风格训练配方。虽然这不削弱结果本身，但也意味着我们还不能自动把结论外推到所有 dense decoder-only Transformer。

第三，报告自己也承认：Full AttnRes 其实更强，Block AttnRes 是今天硬件约束下的工程解。未来如果显存、带宽、interconnect 再往前走，或者更高效的 depth attention 变体出现，今天这版 Block 设计很可能不是终点。

所以我对它的判断是：

- 它已经足够强，值得认真读
- 它已经足够完整，值得认真做复现
- 它还没有强到可以立刻盖棺定论

## 9. 最后的感受

如果把过去十年大模型架构的主线粗暴地概括一下：

- Seq2Seq 在问：怎么把一个序列压成另一个序列？
- Bahdanau 在问：为什么生成时不能回头看输入的不同位置？
- Transformer 在问：为什么序列建模一定要靠递归？
- Chinchilla 在问：为什么更多算力一定主要砸到参数量上？

那《Attention Residuals》（注意力残差）问的是：

**为什么深度上的信息汇总，还停留在“所有历史层统一加总”的时代？**

这个问题问出来，本身就已经很有价值。

我不确定几年后 AttnRes 会不会像 PreNorm 一样成为默认配置，但我很确定，这篇技术报告把 residual connection 重新变成了一个值得被思考、被设计、被优化的对象。

以前大家说 attention 改写了序列建模。

这份技术报告在尝试改写 residual。

---

**延伸阅读**

- [《Sequence to Sequence Learning with Neural Networks》](/zh-hans/posts/sequence-to-sequence-learning-with-neural-networks/)（使用神经网络进行序列到序列学习） — 编码器-解码器范式的确立
- [《Neural Machine Translation by Jointly Learning to Align and Translate》](/zh-hans/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/)（通过联合学习对齐与翻译实现神经机器翻译） — 注意力机制的起源
- [《Attention Is All You Need》](/zh-hans/posts/attention-is-all-you-need/)（注意力就是你所需要的全部） — 注意力成为主角，Transformer 的诞生
- [《BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding》](/zh-hans/posts/bert/)（BERT：用于语言理解的深度双向 Transformer 预训练） — 预训练范式的确立
- [《Scaling Laws for Neural Language Models》](/zh-hans/posts/scaling-laws-for-neural-language-models/)（神经语言模型的缩放定律） — 规模的数学
- [《Language Models are Few-Shot Learners》](/zh-hans/posts/language-models-are-few-shot-learners/)（语言模型是少样本学习者） — 更大的模型，更善于从上下文中诱发能力
- [《Training Compute-Optimal Large Language Models》](/zh-hans/posts/training-compute-optimal-large-language-models/)（训练计算最优的大语言模型） — 怎样花算力最划算
