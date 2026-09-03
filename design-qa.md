# Design QA — 报告模板卡片与推荐提示词样式

## Target flow

`企业数据分析 → 报告模板 → 选择模板 → 聚焦编辑提示词 → 行内模板下拉保持可用 → 切换模板并保留自定义内容`

## User-visible behavior verified

- “报告模板”与“推荐主题”作为同级页签；仅企业数据分析智能体显示报告模板入口。
- 四张模板卡片改为参考图中的竖向结构：上方大幅报告缩略图，下方模板名称与两行说明；选中卡片使用固定蓝紫色勾选标识。
- 鼠标悬停模板缩略图显示独立“预览”按钮，点击卡片主体仍直接选择模板并回写默认“上下滑动”提示词。
- 推荐提示词为“生成 + 模板下拉 + 可编辑提示内容”的内嵌组合；下拉内显示四个模板并勾选当前项。
- 删除智能体与主题行中重复显示的模板标签，仅保留提示词正文里的模板下拉。
- 聚焦可编辑提示内容时，模板下拉持续显示且可操作；切换模板时保留用户已追加的自定义要求。
- 预览弹窗可切换“上下滑动”和“分页切换”；点击“使用此模板”按当前查看模式回写推荐提示词。
- 推荐提示词可继续编辑；发送时重新识别模板名称、浏览模式和额外样式描述。
- 增加样式描述后进入“预置模板 + 自定义风格”路径；无风格描述时使用默认清爽简报模板。
- 添加风格参考浮窗支持本地文件入口和已有 HTML/PPT/Word 产物引用；引用后生成带来源名称的自定义风格提示词。
- 结果页按解析后的模式显示：上下滑动为连续报告，分页切换为六页左右轮播。
- 报告右上角“切换风格”浮窗在模板列表和编辑步骤都提供“上下滑动 / 左右切换”；切换后右侧即时预览，提交才写入新版本，关闭浮窗则恢复已提交模式。

## Runtime checks

- URL: `http://127.0.0.1:4173/`
- Browser: Codex in-app browser, 1280 × 720 application viewport.
- Page identity: `Prototype`，内容非空。
- Framework overlay: none.
- Console warnings/errors: none.
- Build: passed.
- Sites worker tests: 4/4 passed（首次受 Windows 沙箱 `spawn EPERM` 限制，允许创建测试子进程后同命令通过）。

## Interaction evidence

- 点击“咨询报告”卡片：内嵌提示词的无障碍文本精确回写为 `生成【咨询报告】风格的分析报告，报告支持上下滑动，包含现状概览、表现分析、结论建议。`，发送按钮启用。
- 点击提示词内的“咨询报告”下拉：菜单显示清爽简报、咨询报告、经营报告、深色报告，并勾选咨询报告。
- 聚焦提示词编辑框并追加“请突出重大风险”：编辑框正常工作，行内模板下拉没有消失。
- 编辑状态下从“深色报告”切换为“咨询报告”：提示词更新为 `生成【咨询报告】...请突出重大风险。`，自定义内容保持不变。
- `.selected-template-chip` 数量为 0，顶部重复模板标签已移除。
- 点击“预览咨询报告”：模板详情弹窗正常打开，关闭后推荐提示词与模板选择状态保持一致。
- 预览“经营报告”并切换分页：弹窗显示六页轮播；点击“使用此模板”后提示词使用“分页切换”。
- 在推荐提示词后添加排版要求并发送：结果标识为“经营报告 + 自定义风格 · 分页切换”，右侧出现六页轮播，下一章节从 1/6 切换为 2/6。
- 仅输入“生成一份应付管理分析报告”：结果使用“清爽简报 · 上下滑动”，未误判为自定义风格。
- 引用 `report_应付管理分析_20260814.html`：显示附件芯片并回写来源、基础模板和上下滑动模式，发送按钮启用。
- 在“切换风格”中从上下滑动改为左右切换并选择咨询报告：右侧立即出现分页箭头；编辑提示词追加“封面增加管理层摘要”后切回上下滑动，自定义内容未丢失；再次切回左右切换并提交后，版本更新为“咨询报告 · 左右切换”。

## Visual review

- Reference screenshot: `C:\Users\kingdee\AppData\Local\Temp\codex-clipboard-f9a56262-0b62-41c6-8ff4-9aecfd8294b9.png`（3844 × 2164）。
- Implementation screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-template-cards-prompt-after.png`（1280 × 720，等比例 16:9）。
- Side-by-side comparison: `C:\Users\kingdee\AppData\Local\Temp\lingee-template-card-comparison.png`。
- Latest annotation fix screenshot: `C:\Users\kingdee\AppData\Local\Temp\lingee-template-prompt-edit-fixed.png`（1280 × 720）。
- 对照参考图检查：四张卡片均为上图下文、同高同宽；模板下拉与提示词处于同一行；层级、圆角、留白和阴影接近参考图。
- 报告模板本身的配色仅出现在缩略图和报告内容，不会改变外围页面主题色。
- 当前视口无水平或垂直溢出，卡片、提示词下拉和发送按钮没有截断或重叠。

## Latest annotation comparison

- Earlier P1: 聚焦推荐提示词后切换成普通文本框，导致行内模板下拉消失。Fix: 将下拉后的提示内容改为持续可编辑的受控文本框，模板下拉始终保留。Post-fix evidence: `lingee-template-prompt-edit-fixed.png`。
- Earlier P2: 模板名称在智能体上下文行和提示词正文重复出现。Fix: 删除上下文行的 `.selected-template-chip`。Post-fix DOM count: 0。
- Typography: 延续现有 14px 提示词字号与 1.65 行高；模板名称保持 13px 半粗体。
- Spacing: 删除顶部标签后，企业数据分析与主题选择间距恢复为现有 8px 节奏；正文下拉与编辑区保持 5px 间距。
- Colors: 继续使用固定蓝紫界面强调色，未随模板颜色变化。
- Image quality: 模板缩略图资源及裁切未改动，无新增压缩或拉伸。
- Copy: 默认推荐提示词文案不变，自定义追加文字在模板切换后完整保留。

## Remaining boundary

- 本原型实现文件类型选择、已有产物引用和自定义风格提示词生成；真实解析 PPT/Word/HTML 内容仍需后端文件解析服务接入。

## Final result

final result: passed
