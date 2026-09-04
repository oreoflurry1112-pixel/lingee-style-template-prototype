# Design QA — 风格模板选择与顶部预览卡片

## Target flow

`企业数据分析 → 风格模板 → 选择模板 → 顶部显示风格预览卡片且输入框保持原文 → 取消模板 → 卡片消失且输入框不变`

## User-visible behavior verified

- “风格模板”与“推荐主题”作为同级页签；仅企业数据分析智能体显示风格模板入口。
- 四张模板卡片改为参考图中的竖向结构：上方大幅报告缩略图，下方模板名称与两行说明；选中卡片使用固定蓝紫色勾选标识。
- 鼠标悬停模板缩略图显示独立“预览”按钮；点击卡片主体选择模板，并在输入框顶部显示包含缩略图、模板名称、上下滑动模式与取消按钮的风格预览卡片。
- 选择模板和取消模板均不改写输入框；仅模板卡片不能启用发送按钮，用户仍需输入实际分析需求。
- 推荐提示词为“生成 + 模板下拉 + 可编辑提示内容”的内嵌组合；下拉内显示四个模板并勾选当前项。
- 删除智能体与主题行中重复显示的模板标签，仅保留提示词正文里的模板下拉。
- 聚焦可编辑提示内容时，模板下拉持续显示且可操作；切换模板时保留用户已追加的自定义要求。
- 预览弹窗可切换“上下滑动”和“分页切换”；点击“使用此模板”按当前查看模式生成顶部风格预览卡片，不回写推荐提示词。
- 推荐提示词可继续编辑；发送时重新识别模板名称、浏览模式和额外样式描述。
- 增加样式描述后进入“预置模板 + 自定义风格”路径；无风格描述时使用默认清爽简报模板。
- 添加风格参考浮窗支持本地文件入口和已有 HTML/PPT/Word 产物引用；引用后生成带来源名称的自定义风格提示词。
- 结果页按解析后的模式显示：上下滑动为连续报告，分页切换为六页左右轮播。
- 报告右上角“切换风格”浮窗在模板列表上方显示“上下滚动 / 左右切换”；模板列表完整显示四个风格，当前正在生效的风格以勾选态标识。浮窗初次打开时修改要求为空，点击展示方式或任一模板后才联动生成推荐提示词，并即时更新右侧预览。

## Runtime checks

- URL: `http://127.0.0.1:4173/`
- Browser: Codex in-app browser, 1280 × 720 application viewport.
- Page identity: `Prototype`，内容非空。
- Framework overlay: none.
- Console warnings/errors: none.
- Build: passed.
- Sites worker tests: 4/4 passed（首次受 Windows 沙箱 `spawn EPERM` 限制，允许创建测试子进程后同命令通过）。

## Interaction evidence

- 点击“咨询报告”卡片：顶部出现“咨询报告 / 咨询长报 · 上下滑动”预览卡片；任务描述仍为空，发送按钮保持禁用。
- 点击预览卡片的“取消选择咨询报告模板”：卡片数量变为 0，任务描述仍为空。
- 再次选择“经营报告”并输入“请分析供应商集中度并给出行动建议”：输入内容保持原文，发送按钮启用；发送后右侧正确显示经营报告完整预览。
- 点击提示词内的“咨询报告”下拉：菜单显示清爽简报、咨询报告、经营报告、深色报告，并勾选咨询报告。
- 聚焦提示词编辑框并追加“请突出重大风险”：编辑框正常工作，行内模板下拉没有消失。
- 编辑状态下从“深色报告”切换为“咨询报告”：提示词更新为 `生成【咨询报告】...请突出重大风险。`，自定义内容保持不变。
- `.selected-template-chip` 数量为 0，顶部重复模板标签已移除。
- 点击“预览咨询报告”：模板详情弹窗正常打开，关闭后推荐提示词与模板选择状态保持一致。
- 预览“经营报告”并切换分页：弹窗显示六页轮播；点击“使用此模板”后提示词使用“分页切换”。
- 在推荐提示词后添加排版要求并发送：结果标识为“经营报告 + 自定义风格 · 分页切换”，右侧出现六页轮播，下一章节从 1/6 切换为 2/6。
- 仅输入“生成一份应付管理分析报告”：结果使用“清爽简报 · 上下滑动”，未误判为自定义风格。
- 引用 `report_应付管理分析_20260814.html`：显示附件芯片并回写来源、基础模板和上下滑动模式，发送按钮启用。
- 打开“切换风格”：模板列表上方显示“上下滚动 / 左右切换”，当前报告模式具有选中态。
- 在同一浮窗选择“深色报告”：右侧即时预览深色报告，`aria-pressed=true`，多行输入框默认回写对应修改提示词。
- 编辑多行修改要求并提交：浮窗关闭，报告重新生成，版本链从 1 个版本更新为 2 个版本，报告保持原有“上下滑动”方式。
- 当前报告使用“咨询报告”时打开浮窗：模板列表显示四个风格，“咨询报告”具有 `aria-pressed=true` 和可见勾选态，修改要求仍为空。
- 点击当前“咨询报告”风格：生成包含“咨询报告 + 上下滑动”的推荐提示词并启用提交按钮。
- 初次打开浮窗：修改要求值为 `''`、长度为 0；未选新模板时提交按钮禁用。
- 点击“左右切换”：右侧由连续报告切换为“咨询报告分页报告预览”，修改要求生成包含“咨询报告 + 左右切换”的推荐提示词，提交按钮启用。
- 随后选择“深色报告”：右侧即时切换深色分页预览，推荐提示词中的模板名称同步替换为深色报告。
- 在推荐提示词后追加“请减少装饰元素”，再切回“上下滚动”：模式词更新为“上下滑动”，自定义补充内容完整保留。

## Visual review

- Source visual truth: 当前用户浏览器标注截图（1291 × 909 CSS px），目标区域为业务分析输入框和风格模板页签。
- Implementation screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-selected-template-card.png`（1280 × 720，桌面视口，浏览器 1× CSS 像素）。
- Side-by-side comparison: `C:\Users\kingdee\AppData\Local\Temp\lingee-template-card-comparison.png`。
- Latest annotation fix screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-template-prompt-edit-fixed.png`（1280 × 720）。
- Report style dropdown fix screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-menu-textarea-fixed.png`（1280 × 720）。
- Latest annotation implementation screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-menu-hide-current-empty-prompt.png`（1280 × 720）。
- Side-by-side annotation comparison: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-menu-annotation-comparison.png`（1920 × 540；左侧为上一状态，右侧为修正状态）。
- Latest empty-state screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-mode-empty-default.png`（1280 × 720）。
- Latest linked-prompt screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-mode-prompt-linked.png`（1280 × 720）。
- Latest interaction comparison: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-mode-interaction-comparison.png`（1920 × 540；左侧初始空白状态，右侧联动推荐提示词状态）。
- Latest current-style screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-style-menu-current-active.png`（1280 × 720；四个风格完整显示，咨询报告为当前选中态）。
- Latest selected-template card screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-selected-template-card.png`（1280 × 720；咨询报告缩略图卡片位于输入框顶部，带取消按钮，正文为空）。
- 对照参考图检查：四张卡片均为上图下文、同高同宽；模板下拉与提示词处于同一行；层级、圆角、留白和阴影接近参考图。
- 报告模板本身的配色仅出现在缩略图和报告内容，不会改变外围页面主题色。
- 当前视口无水平或垂直溢出，卡片、提示词下拉和发送按钮没有截断或重叠。

## Latest annotation comparison

- Earlier P1: 聚焦推荐提示词后切换成普通文本框，导致行内模板下拉消失。Fix: 将下拉后的提示内容改为持续可编辑的受控文本框，模板下拉始终保留。Post-fix evidence: `lingee-template-prompt-edit-fixed.png`。
- Earlier P2: 模板名称在智能体上下文行和提示词正文重复出现。Fix: 删除上下文行的 `.selected-template-chip`。Post-fix DOM count: 0。
- Earlier P1: 上一轮按标注删除展示模式开关。Latest correction: 在模板列表上方恢复双选项切换，并将它纳入推荐提示词联动；仅打开浮窗不预填提示词。
- Latest P1: 风格修改要求与模板选择分成两步，交互割裂。Fix: 将受控多行输入框与“取消 / 提交修改”操作合并到模板列表下方；选择模板时即时预览，修改要求独立选填。
- Earlier P1: 上一轮按标注过滤当前风格，仅保留三个切换目标。Latest correction: 恢复四个完整风格，并用勾选态明确当前正在生效的风格。Post-fix evidence: 咨询报告、清爽简报、经营报告、深色报告均可见，咨询报告 `aria-pressed=true`。
- Latest P1: 修改要求预填系统提示词，不符合“先空白、交互后推荐”的输入预期。Fix: 打开浮窗时保持空值；第一次点击展示方式或新模板时生成推荐提示词，后续切换只替换模板与模式字段并保留自定义补充内容。
- Latest P1: 选择模板会直接把推荐提示词写入正文，用户无法区分风格选择和实际分析需求。Fix: 把模板选择状态改为输入框顶部独立预览卡片，并提供取消按钮；选择和取消均不触碰任务描述。Post-fix evidence: 选择咨询报告后正文值为 `''`、发送按钮禁用；取消后卡片消失且正文仍为 `''`。
- Typography: 延续现有 14px 提示词字号与 1.65 行高；模板名称保持 13px 半粗体。
- Spacing: 删除顶部标签后，企业数据分析与主题选择间距恢复为现有 8px 节奏；正文下拉与编辑区保持 5px 间距。
- Colors: 继续使用固定蓝紫界面强调色，未随模板颜色变化。
- Image quality: 模板缩略图资源及裁切未改动，无新增压缩或拉伸。
- Copy: 页签文案由“报告模板”改为“风格模板”；模板选择不再生成或改写推荐提示词，用户自定义任务描述完整保留。
- Accessibility: 风格选择浮窗使用 `role="dialog"`，模板按钮提供 `aria-pressed`，多行输入框可通过“风格修改提示词”标签定位。

## Remaining boundary

- 本原型实现文件类型选择、已有产物引用和自定义风格提示词生成；真实解析 PPT/Word/HTML 内容仍需后端文件解析服务接入。

## Final result

final result: passed
