# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Prototype decisions

- Preserve the Lingee new-task page's restrained gray-and-white visual language.
- Present 推荐主题 and 风格模板 as sibling tabs in the same content area for 企业数据分析; opening 风格模板 replaces the recommendation content instead of adding a second stacked section.
- A style template changes output presentation only; data, metric definitions, and analysis depth remain unchanged.
- Style examples must be continuous vertical reports, not dashboards.
- The report preview supports two modes: scrolling through the full long report and chapter-style page switching.
- The gallery itself shows compact visual thumbnails. Clicking the card body selects that template without rewriting the user's prompt; the separate preview action opens the report detail modal, where the 上下滑动/分页切换 mode switch lives.
- Template cards reuse the reference page's compact horizontal white-card anatomy: real thumbnail on the left, two-line copy on the right, rounded border, and a light selected state.
- Every report has four content parts distributed across six full-screen sections: cover, three data-performance modules, action recommendations, and risks/limitations.
- Every template's preview artwork must itself follow the same six-section order; do not reuse a longer seven- or eight-chapter source image and approximate sections with background-position cropping.
- All chapter preview images use the same 1420 × 1000 artboard and fill the modal preview stage edge to edge, so every chapter has identical content height in both scroll and paged modes.
- Render final chapter previews at 2× density (2840 × 2000) while preserving the 1420:1000 artboard ratio; use proportional fitting in the modal and never stretch artwork to fit.
- When the user supplies a report HTML as content evidence, keep all four template styles unchanged but regenerate every six-screen preview from that report's actual title, scope, KPIs, findings, actions, and limitations; never retain unrelated sample business content.
- In the 业务分析 composer, mirror the live Lingee interaction model: agent, topic, skill, and group controls use anchored mutually exclusive popovers; topic search replaces the popover heading; recommendation cards select the topic; outside click or Escape closes the active popover; send stays disabled until text, a skill, or an attachment is present.
- Confirming a report template in its preview modal or clicking a template card does not rewrite the user's prompt. Instead, show a compact report-style preview card at the top of the composer with the template thumbnail, name, mode, and a cancel action. Direct card selection uses 上下滑动 by default; cancelling removes only the selected template card and leaves the prompt unchanged.
- When sending, parse the prompt again: a recognized template name selects the corresponding template, 上下滑动/分页切换 selects the report behavior, a selected preview card supplies the template and mode without prompt text, no explicit or selected style uses the default template, and additional style descriptions retain the selected template as their base.
- The attachment control exposes both local uploads (image, HTML, PPT, Word, PDF) and existing-artifact references. Either path writes a custom-style recommendation prompt that names the source artifact and the current base template; this prototype represents the front-end handoff to a future parser rather than silently discarding the source.
- Scroll mode snaps one section per screen; paged mode uses a horizontal six-page carousel with previous/next navigation.
- In the template preview modal, scroll mode uses a fixed top report-directory tab row. Clicking a directory tab scrolls to that full-screen section and scrolling updates the active tab. Paged mode keeps its existing left/right carousel directory controls. Do not overlay chapter-title cards on report artwork in either mode.
- Supported prototype templates are 清爽简报、咨询报告、经营报告、深色报告.
- Clicking the primary composer send button enters a task result view that mirrors Lingee's three-column workflow: active history on the left, the generation conversation with a persistent follow-up composer in the center, and the currently selected six-section report template in an independently scrollable preview pane on the right.
- The report result toolbar includes a “切换风格” menu. It lists the same four existing report templates with thumbnails and a selected state; choosing one swaps all six right-pane report pages, scrolls the report back to its beginning, and updates template labels while leaving the report's business content unchanged.
- Report style switching uses a two-step preview-and-submit flow: selecting a template opens an editor in the same floating surface, previews that template in the right pane without committing it, pre-fills a style-modification prompt that can be customized, and commits the new template only after submission. Cancel, outside click, or Escape discards the draft preview; submission shows a regeneration state and creates a second report version.
- The report-toolbar “切换风格” floating surface also controls the report interaction effect. It exposes “上下滑动” and “左右切换” in both the template list and edit step; changing the effect updates the draft preview immediately, preserves custom prompt additions, and commits the selected effect only with “提交修改”.
- The 业务分析 composer distinguishes how an agent is entered. Choosing 企业数据分析 from the toolbar dropdown keeps it as the blue-purple agent dropdown beside the topic picker, matching the regular composer interaction. Choosing the 企业数据分析 quick-entry below the composer keeps the contextual treatment: a removable agent chip and topic picker at the top of the composer. Clearing the contextual chip restores both the toolbar-level “选择智能体” control and the quick-entry below the composer.
- In the toolbar-dropdown path, reopening the agent menu after a selection exposes an explicit “取消选择” action. Cancelling clears the agent and topic, then restores the empty-agent state with the toolbar-level “选择智能体” control and the quick-entry below the composer.
- Keep the Lingee page interaction accent fixed to the reference blue-purple across agent selection, topic selection, template galleries, preview dialogs, and report style switching. Report artwork may retain each template's own palette, but selecting a template must never recolor the surrounding application chrome.
