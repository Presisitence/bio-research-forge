# Bio Research Forge：中文详细说明

[English](README.md) | 中文

Bio Research Forge 是一个面向生命科学研究的 Codex 插件。它不是简单堆叠数据库链接，而是把研究设计、公共数据查询、组学分析、统计、科研出图、论文写作、可复现性和独立审查组织成一套有边界、可追踪的工作流。

插件尤其重视四件事：

1. 先判断数据能不能回答问题，再决定是否分析；
2. 严格区分直接数据、外部证据、候选证据和假说；
3. 图像在对话框中直接预览，同时保留 PDF、代码和绘图数据；
4. 最终结果交给独立 Review 检查引用、数字、图、代码和结论是否一致。

## 一、功能分类

插件提供 12 个技能。

| 类别 | 技能 | 主要作用 |
|---|---|---|
| 总控 | `bio-research-orchestrator` | 拆解复杂研究任务，明确每个模块的输入、输出、停止条件和审查责任 |
| 公共数据库 | `public-bio-databases` | 调用经过允许的公共生物学 API，并返回来源网址和检索时间 |
| 实验设计 | `experimental-design-gate` | 判断问题、数据、对照、重复和统计单位是否匹配，给出 Go、Revise-and-Go 或 No-Go |
| 组学流程 | `omics-workflow` | 规划和审查测序、表达组及其他组学流程，不用下游分析掩盖设计缺陷 |
| RNA 出图 | `rna-figure-workflow` | 从用户选择的表格生成火山图、PCA、热图、表达箱线图和富集气泡图 |
| 统计 | `quantitative-research` | 明确估计目标、模型、诊断、敏感性分析和可报告统计量 |
| 本地工具 | `local-bio-toolkit` | 安全检测和选择性调用 PyMOL、SnapGene、Cytoscape、Fiji |
| 计算环境 | `secure-compute-routing` | 在本机、受控 HPC 或云计算之间选择运行位置，并审查数据传输边界 |
| 论文写作 | `manuscript-argument` | 构建 Introduction 和 Discussion 的论证链，不虚构文献或结果 |
| 科研作图 | `scientific-figure-delivery` | 制作投稿级图，保留源数据、代码、导出文件和对话框预览 |
| 可复现性 | `reproducible-analysis` | 记录环境、参数、随机种子、来源和干净重跑证据 |
| 独立审查 | `evidence-review` | 审查结论、引用、数字追溯、图与代码一致性、隐私和复现能力 |

## 二、三个 MCP 服务

### 1. 公共生物数据库服务

提供以下工具：

- `bio_api_catalog`：查看允许调用的数据源、支持操作和证据限制；
- `bio_api_query`：执行一次只读、有限结果量的公共数据库查询；
- `bio_api_health`：检查服务状态或做一次小型在线连通测试。

当前允许的数据源包括 NCBI、UniProt、InterPro、Ensembl、AlphaFold DB、RCSB PDB、Europe PMC、STRING、JASPAR，以及 Sol Genomics Network 的通用公共茄科元数据接口。

每个结果都包含检索时间、来源网址和证据说明。任意网址、个人文件、凭据和辣椒专用查询不会通过这一接口发送。

### 2. RNA 本地出图服务

提供以下工具：

- `rna_figure_status`：检查 R、绘图脚本和所需 R 包；
- `rna_figure_create`：从本地 CSV、TSV 或 TXT 表格生成图。

每次成功出图都会产生：

- `<名称>.png`：用于对话框直接预览；
- `<名称>.pdf`：用于论文排版或矢量后期处理；
- `<名称>.plot-data.csv`：实际进入图中的数据，便于数字追溯和 Review。

所有输入均在本机处理，不会上传到公共数据库或第三方网站。

### 3. 本地生命科学工具服务

提供以下工具：

- `local_bio_tool_status`：检测 PyMOL、SnapGene、Cytoscape、Fiji 是否存在；
- `pymol_render`：用固定、安全的模板渲染结构 PNG；
- `local_bio_open`：在用户明确要求后，用兼容的软件打开已有文件。

这一接口不会下载安装软件，不接受任意命令、宏、插件或 Shell 参数，也不会修改原始文件。

## 三、RNA 出图的详细输入要求

### 火山图

输入表至少需要：

- 基因或特征标识列；
- 效应量列，例如 `log2FoldChange`、`log2FC` 或 `logFC`；
- 多重检验校正后的 P 值列，例如 `padj`、`FDR` 或 `adj.P.Val`。

默认参考阈值为 `padj < 0.05` 且 `|log2FC| >= 1`，但只有在这些阈值与原分析合同一致时才应使用。图中阈值、比较方向和标记基因数量必须在结果说明中写清楚。

### PCA

输入矩阵一般为：第一列基因 ID，后续每列为一个样本。可额外提供包含 `sample` 和 `group` 的样本信息表。

工具会选择高变基因用于样本层面 PCA。对明显属于非负高计数的数据，`auto` 模式会使用 `log2(x+1)`；这不是 DESeq2 的 VST 替代品，因此正式 RNA-seq 分析优先传入已经按分析设计正确变换的数据。

PCA 解释必须关注样本是否按处理分离、是否存在离群样本和批次效应，不能把聚类外观直接解释为机制。

### 聚类热图

输入格式与 PCA 相同。工具按照方差选择前若干基因，对每个基因做行 z-score，再聚类样本和基因。

热图颜色表示一个基因在不同样本之间的相对高低，不表示不同基因之间的绝对表达量可直接比较。必须报告选择了多少基因、使用何种变换以及聚类对象。

### 表达量箱线图

使用长表格式，至少包含：

- 分组列，例如 `group`、`condition` 或 `treatment`；
- 数值列，例如 `value`、`expression` 或 `abundance`；
- 可选的基因或特征列，用于分面。

散点代表真实独立观测单位。技术重复不能被当作生物学重复来扩大样本量。

### 富集气泡图

输入表至少需要：

- 条目名称，例如 `Description`；
- 富集比例，例如 `GeneRatio`；
- 命中基因数量，例如 `Count`；
- 校正后的显著性，例如 `padj`；
- 可选类别，例如 GO 本体或通路类别。

横轴表示富集比例，点大小表示命中数量，颜色表示校正后显著性。富集属于候选证据，必须同时说明背景基因集、输入基因集、数据库版本和多重检验方法，不能直接写成已验证机制。

## 四、PyMOL、SnapGene、Cytoscape 和 Fiji

### PyMOL

PyMOL 接口支持读取常用结构文件，并输出 PNG。可以选择：

- 表示方式：cartoon、surface、sticks、cartoon-and-sticks；
- 着色：光谱、按链、按二级结构；
- 背景：白色、黑色或透明；
- 输出宽度和高度。

接口内部只生成固定命令，不允许外部传入 PyMOL 脚本。生成后应把 PNG 直接显示在对话框，并说明模型来源、置信度、显示方式和证据边界。结构图本身不能证明结合、功能或抑制机制。

### SnapGene

SnapGene 只用于打开用户指定的已有序列或载体文件，例如 `.dna`、GenBank 和 FASTA。插件不会自动编辑、保存、覆盖或导出载体，也不会根据局部荧光或测序结果自行宣布构建正确。

### Cytoscape

Cytoscape 只打开兼容的网络文件，例如 `.cys`、`.xgmml`、`.sif`、`.graphml` 和 `.cyjs`。共表达或功能关联网络应被标记为候选证据，而不是直接的物理互作证明。

### Fiji/ImageJ

Fiji 用于打开已有显微图像。当前桥接不执行任意宏，也不自动批量修改原图。涉及定量时，应另行确定标定、阈值、盲法、批次和原始图像保留规则。

## 五、推荐使用方式

用户不需要手工填写 MCP JSON。可以直接对 Codex 说：

- “用 RNA Figure Workflow 根据这张差异表达表画火山图，PNG 直接显示在对话框。”
- “检查这个表达矩阵和分组表，然后画 PCA 和热图，并给我 PDF 和绘图数据。”
- “把这个富集结果做成气泡图，但先检查 GeneRatio、Count 和 padj 列。”
- “用 PyMOL 把这个 PDB 渲染成白底 cartoon-and-sticks，并在对话框里展示。”
- “用 SnapGene 打开这个 `.dna` 文件。”
- “以 reviewer 角度检查图、代码、数字和正文结论是否一致。”

## 六、证据和 Review 规则

插件使用四级证据标签：

- `Direct data`：来自用户数据的直接观察或计算结果；
- `External evidence`：经过核验的公共记录或论文；
- `Candidate evidence`：相关性、预测、富集、网络、对接或模型重要性；
- `Hypothesis`：待实验检验的解释。

提交前 Review 至少检查：

1. 每个主要结论是否能追溯到图、表或文献；
2. 引用是否真的支持对应句子；
3. 正文数字是否与源表和代码输出一致；
4. 图是否与绘图数据、代码和图注一致；
5. 样本量、统计单位、误差线和检验方法是否明确；
6. 是否把候选证据夸大成因果或机制；
7. 是否意外包含个人路径、凭据、私有数据或未授权材料。

## 七、隐私与明确排除项

插件源码和发布仓库不得包含：

- 任何个人实验测量、测序文件、表达矩阵或样本信息；
- 用户自己的基因组、转录组、注释数据库或内部标识映射；
- 辣椒专用数据门户、私有查询助手或辣椒数据集；
- API 密钥、Token、Cookie、内部主机名和个人绝对路径；
- 用户 PPT、毕业论文、稿件、图片或其复制段落。

允许用户在某次任务中明确选择本地文件进行本机处理，但文件内容不得被写回插件源码、测试夹具或公开仓库。

Sol Genomics Network 只保留通用、公开的茄科元数据入口，不提供辣椒专用操作。

## 八、运行要求

基本要求：

- Codex；
- Node.js 18 或更高版本。

可选能力：

- RNA 出图需要 R，以及 `jsonlite`、`ggplot2`、`pheatmap`；`ggrepel` 用于改善标签；
- PyMOL、SnapGene、Cytoscape、Fiji 需要用户已经合法安装对应软件；
- 可以通过 `RSCRIPT_EXE`、`PYMOL_EXE`、`SNAPGENE_EXE`、`CYTOSCAPE_EXE`、`FIJI_EXE` 指定可执行文件；
- 未找到工具时只报告缺失，不会静默安装。

## 九、本地安装与验证

在包含 `.agents/plugins/marketplace.json` 的仓库根目录执行：

```powershell
codex plugin marketplace add "<仓库根目录>"
codex plugin add bio-research-forge@bio-research-forge
```

然后新建 Codex 任务。

开发者验证：

```powershell
npm test
npm run test:render
npm run test:live
```

其中真实渲染测试只使用运行时创建的合成表格和最小结构，不包含用户研究数据。

## 十、来源、引用与许可证

本项目的角色边界和研究工作台思想部分参考了开源项目 [DAWN Science](https://github.com/Jiawang1209/DAWN-Science)，并在 [ATTRIBUTION.md](ATTRIBUTION.md) 中记录了审查版本、许可证和改写范围。

RNA 图和本地工具桥接由本项目重新实现，只参考了用户本地 Plant Science 配置中的功能类别，没有复制其中的硬编码路径、私有数据、专用映射或模块源码。

PyMOL、SnapGene、Cytoscape、Fiji/ImageJ、R 及其 R 包均为独立第三方软件，本仓库不重新分发它们。

本插件采用 GNU AGPL-3.0-or-later。使用公共数据库时，用户仍需遵守各数据提供方的最新条款、署名要求、速率限制和数据许可证。
