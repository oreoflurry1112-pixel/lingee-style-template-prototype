import { useEffect, useRef, useState } from 'react';
import {
  ArrowCounterClockwise,
  ArrowSquareOut,
  ArrowsOut,
  ArrowsDownUp,
  ArrowsClockwise,
  Atom,
  Brain,
  Briefcase,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartBar,
  Check,
  Clock,
  Code,
  Database,
  DownloadSimple,
  FileHtml,
  FolderSimple,
  GridFour,
  Eye,
  Kanban,
  ListBullets,
  MagicWand,
  MagnifyingGlass,
  Megaphone,
  Microphone,
  PaintBrush,
  PaperPlaneRight,
  PencilSimple,
  Plus,
  Robot,
  SlidersHorizontal,
  Sparkle,
  SquaresFour,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trash,
  UserCircle,
  X,
} from '@phosphor-icons/react';

const navItems = [
  { icon: ArrowsClockwise, label: '新任务', active: true },
  { icon: Clock, label: '定时任务' },
  { icon: Robot, label: '智能体' },
  { icon: Atom, label: '技能' },
];

const histories = [
  '运营流程数据分析报告',
  '提醒与艺艺沟通需求设计稿排期',
  '苍穹平台应用权限授权表单名称',
  '运营共享流程审批看板生成',
  '运营共享流程审批看板',
  '运营流程审批趋势看板',
  '运营共享流程审批看板生成',
  '运营共享流程审批看板生成',
  '运营共享流程审批看板',
  '运营共享流程审批看板',
  '运营共享流程审批看板',
];

const recommendations = [
  { icon: ChartBar, tone: 'blue', title: '营销费用分析', owner: '黄蓝林 · 黄蓝林的工作室' },
  { icon: Kanban, tone: 'orange', title: 'CS看板-规模战', owner: '黄蓝林 · 黄蓝林的工作室' },
  { icon: CalendarBlank, tone: 'purple', title: '运营流程数据分析', owner: '张雯祺 · 张雯祺的工作室' },
  { icon: Target, tone: 'green', title: '项目财务分析', owner: '张雯祺 · 张雯祺的工作室' },
];

const topicOptions = [
  ...recommendations.map(({ title }) => title),
  '测试',
  '客户到款查询',
  '【示例数据】销售数据分析',
  '【示例数据】库存数据分析',
];

const agentOptions = ['费报智能体', '企业数据分析'];
const interfaceAccent = '#7367f5';

const skillOptions = [
  { initial: 'P', name: 'PPT生成' },
  { initial: '营', name: '营销活动规划' },
  { initial: '用', name: '用户研究' },
  { initial: '更', name: '更新结账任务状态' },
  { initial: '项', name: '项目管理' },
  { initial: '竞', name: '竞品分析简报' },
];

const reportModeLabels = { scroll: '上下滑动', paged: '分页切换' };
const reportModeSwitchLabels = { scroll: '上下滑动', paged: '左右切换' };
const reportModePromptPattern = /【(?:上下滑动|左右切换|分页切换)】/;
const createTemplatePrompt = (templateName, reportMode = 'scroll') => `生成【${templateName}】风格的分析报告，报告支持${reportModeLabels[reportMode]}，包含现状概览、表现分析、结论建议。`;
const createSourceStylePrompt = (sourceName, templateName, reportMode = 'scroll') => `参考【${sourceName}】的视觉风格，在【${templateName}】模板基础上生成自定义分析报告，报告支持${reportModeLabels[reportMode]}，包含现状概览、表现分析、结论建议。`;
const createStyleModificationPrompt = (templateName, reportMode) => `将当前报告切换为【${templateName}】风格，并采用【${reportModeSwitchLabels[reportMode]}】效果，保留现有数据、指标与六章节结构，仅调整版式、配色和信息层级。`;
const updateStyleModeInPrompt = (prompt, reportMode) => reportModePromptPattern.test(prompt)
  ? prompt.replace(reportModePromptPattern, `【${reportModeSwitchLabels[reportMode]}】`)
  : `${prompt} 展示采用【${reportModeSwitchLabels[reportMode]}】效果。`;

const existingArtifacts = [
  'report_应付管理分析_20260814.html',
  '投标报价流程与超期分析报告.pptx',
  '运营流程数据分析报告.docx',
];

const createReportPages = (name) => Array.from(
  { length: 6 },
  (_, index) => `/assets/templates/${name}-pages/page-${index + 1}.png?v=5`,
);

const templates = [
  {
    id: 'brief',
    icon: ListBullets,
    name: '清爽简报',
    description: '章节连续、重点清晰，适合应付风险监控与业务复盘',
    accent: '#d7b81d',
    image: '/assets/templates/clean-equal-height-report-pages/page-1.png?v=5',
    pages: createReportPages('clean-equal-height-report'),
    tag: '长报告',
  },
  {
    id: 'consulting',
    icon: Briefcase,
    name: '咨询报告',
    description: '结论先行、逻辑严谨，适合管理层决策汇报',
    accent: '#2678e8',
    image: '/assets/templates/consulting-equal-height-report-pages/page-1.png?v=5',
    pages: createReportPages('consulting-equal-height-report'),
    tag: '咨询长报',
  },
  {
    id: 'dashboard',
    icon: GridFour,
    name: '经营报告',
    description: '叙事从容、图表舒展，适合年度经营与组织复盘',
    accent: '#4e795d',
    image: '/assets/templates/editorial-equal-height-report-pages/page-1.png?v=5',
    pages: createReportPages('editorial-equal-height-report'),
    tag: '叙事长报',
  },
  {
    id: 'presentation',
    icon: SquaresFour,
    name: '深色报告',
    description: '高对比、层级鲜明，适合高层会议与重点项目汇报',
    accent: '#21bde8',
    image: '/assets/templates/dark-equal-height-report-pages/page-1.png?v=5',
    pages: createReportPages('dark-equal-height-report'),
    tag: '高层汇报',
  },
];

function resolveReportRequest(input) {
  const normalized = input.trim();
  const matchedTemplate = templates.find((option) => normalized.includes(`【${option.name}】`) || normalized.includes(option.name));
  const template = matchedTemplate || templates[0];
  const reportMode = /分页切换|分页轮播|左右切换/.test(normalized)
    ? 'paged'
    : 'scroll';
  const recommendedPrompt = createTemplatePrompt(template.name, reportMode);
  return {
    template,
    reportMode,
    isCustomStyle: Boolean(normalized.includes('参考【') || (matchedTemplate && normalized !== recommendedPrompt)),
    prompt: normalized || recommendedPrompt,
  };
}

const reportSections = [
  {
    id: 'cover',
    part: '报告封面',
    title: '报告封面',
    description: '应付分析名称、统计口径与关键风险 KPI',
  },
  {
    id: 'performance-overview',
    part: '数据表现',
    title: '逾期应付集中度',
    description: '供应商集中度、逾期规模与时间信号',
  },
  {
    id: 'performance-structure',
    part: '数据表现',
    title: '30 天到期压力',
    description: '大额到期款项、供应商集中与付款准备',
  },
  {
    id: 'performance-efficiency',
    part: '数据表现',
    title: '未到票与预付',
    description: '未到票构成、暂估供应商与预付核销',
  },
  {
    id: 'actions',
    part: '行动建议',
    title: '行动建议',
    description: '优先级明确、可执行的下一步行动方案',
  },
  {
    id: 'risks',
    part: '风险与局限',
    title: '风险与局限',
    description: '风险信号、数据边界与结论适用范围',
  },
];

function Sidebar({ onNewTask, resultActive = false }) {
  const visibleHistories = resultActive ? ['财务应付管理分析报告', ...histories] : histories;

  return (
    <aside className="sidebar">
      <div className="window-row"><span /><span /><span /><SquaresFour size={17} /></div>
      <div className="brand">Lingee</div>
      <div className="mode-switch" role="tablist" aria-label="工作模式">
        <button className="active" type="button"><ListBullets size={16} weight="bold" />工作</button>
        <button type="button"><Code size={16} />开发</button>
      </div>
      <nav className="main-nav" aria-label="主导航">
        {navItems.map(({ icon: Icon, label }) => {
          const active = label === '新任务' && !resultActive;
          return (
          <button className={active ? 'active' : ''} type="button" key={label} onClick={label === '新任务' ? onNewTask : undefined}>
            <Icon size={18} weight={active ? 'bold' : 'regular'} /><span>{label}</span>
          </button>
          );
        })}
        <button type="button"><CalendarBlank size={18} /><span>日历·会议·速记</span></button>
      </nav>
      <div className="history-tabs">
        <button className="active" type="button">历史对话</button>
        <button type="button">定时任务</button>
      </div>
      <div className="history-scroll">
        <div className="history-label">置顶</div>
        <button type="button">云之家待办事项定时提醒</button>
        <div className="history-label default">默认</div>
        {visibleHistories.map((item, index) => (
          <button className={index === 0 ? 'current' : ''} type="button" key={`${item}-${index}`}>
            {index === 0 && <span className="history-dot" />}{item}
          </button>
        ))}
      </div>
      <footer className="sidebar-footer">
        <button className="profile" type="button"><UserCircle size={22} weight="fill" /><strong>张雯祺</strong><em>高级</em></button>
        <button type="button"><Megaphone size={18} />反馈</button>
        <button aria-label="设置" type="button"><SlidersHorizontal size={18} /></button>
      </footer>
    </aside>
  );
}

const resultOutline = [
  ['一、报告封面', '名称、统计口径与关键 KPI 指标卡'],
  ['二、逾期应付集中度', '供应商集中度、逾期规模与账龄信号'],
  ['三、30 天到期压力', '大额到期款项、付款节奏与资金准备'],
  ['四、未到票与预付', '暂估供应商、未到票构成与预付核销'],
  ['五、行动建议', '按优先级拆解的可执行行动方案'],
  ['六、风险与局限', '风险边界、数据限制与使用说明'],
];

function ReportModeSwitch({ value, onChange }) {
  return (
    <div className="report-style-mode-switch" role="tablist" aria-label="报告切换效果">
      <button className={value === 'scroll' ? 'active' : ''} role="tab" aria-selected={value === 'scroll'} type="button" onClick={() => onChange('scroll')}><ArrowsDownUp size={14} />上下滑动</button>
      <button className={value === 'paged' ? 'active' : ''} role="tab" aria-selected={value === 'paged'} type="button" onClick={() => onChange('paged')}><SquaresFour size={14} />左右切换</button>
    </div>
  );
}

function ResultWorkspace({ prompt, template, topic, reportMode, isCustomStyle, onTemplateChange, onReportModeChange }) {
  const [reportOpen, setReportOpen] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [styleMenuView, setStyleMenuView] = useState('select');
  const [draftTemplate, setDraftTemplate] = useState(null);
  const [draftReportMode, setDraftReportMode] = useState(reportMode);
  const [stylePrompt, setStylePrompt] = useState('');
  const [styleRevision, setStyleRevision] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const [followUpSent, setFollowUpSent] = useState('');
  const [resultPage, setResultPage] = useState(0);
  const styleMenuRef = useRef(null);
  const reportScrollRef = useRef(null);
  const regenerationTimerRef = useRef(null);
  const fileName = 'report_应付管理分析_20260814.html';
  const displayTemplate = draftTemplate || template;
  const displayReportMode = styleMenuOpen ? draftReportMode : reportMode;
  const reportPageCount = reportSections.length;

  useEffect(() => {
    if (!styleMenuOpen) return undefined;
    const closeStyleMenu = (event) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target)) dismissStyleMenu();
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') dismissStyleMenu();
    };
    document.addEventListener('pointerdown', closeStyleMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeStyleMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [styleMenuOpen]);

  useEffect(() => () => {
    if (regenerationTimerRef.current) window.clearTimeout(regenerationTimerRef.current);
  }, []);

  useEffect(() => {
    setResultPage(0);
  }, [displayReportMode, displayTemplate.id]);

  function submitFollowUp() {
    const message = followUp.trim();
    if (!message) return;
    setFollowUpSent(message);
    setFollowUp('');
  }

  function dismissStyleMenu() {
    setStyleMenuOpen(false);
    setStyleMenuView('select');
    setDraftTemplate(null);
    setDraftReportMode(reportMode);
    setStylePrompt('');
  }

  function toggleStyleMenu() {
    if (styleMenuOpen) {
      dismissStyleMenu();
      return;
    }
    setStyleMenuView('select');
    setDraftTemplate(null);
    setDraftReportMode(reportMode);
    setStylePrompt('');
    setStyleMenuOpen(true);
  }

  function chooseReportStyle(nextTemplate) {
    setDraftTemplate(nextTemplate);
    setStylePrompt(createStyleModificationPrompt(nextTemplate.name, draftReportMode));
    setStyleMenuView('edit');
    reportScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chooseDraftReportMode(nextMode) {
    setDraftReportMode(nextMode);
    if (draftTemplate) setStylePrompt((current) => updateStyleModeInPrompt(current, nextMode));
    reportScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitStyleModification() {
    const modification = stylePrompt.trim();
    if (!draftTemplate || !modification) return;
    const nextTemplate = draftTemplate;
    const nextReportMode = draftReportMode;
    if (regenerationTimerRef.current) window.clearTimeout(regenerationTimerRef.current);
    onTemplateChange(nextTemplate);
    onReportModeChange(nextReportMode);
    setStyleRevision({ templateName: nextTemplate.name, reportMode: nextReportMode, prompt: modification, status: 'generating' });
    setStyleMenuOpen(false);
    setStyleMenuView('select');
    setDraftTemplate(null);
    setStylePrompt('');
    reportScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    regenerationTimerRef.current = window.setTimeout(() => {
      setStyleRevision((revision) => revision ? { ...revision, status: 'done' } : null);
    }, 1500);
  }

  return (
    <main className={`result-workspace${reportOpen ? '' : ' preview-closed'}${previewExpanded ? ' preview-expanded' : ''}`}>
      <section className="conversation-pane" aria-label="报告生成对话">
        <header className="conversation-header">
          <strong>财务应付管理分析报告</strong>
          <button type="button" aria-label="更多操作"><SlidersHorizontal size={17} /></button>
        </header>

        <div className="conversation-scroll">
          <div className="user-request-bubble">{prompt}</div>
          <p className="generation-note">已完成数据口径校验，正在{isCustomStyle ? `结合“${template.name}”模板与自定义样式描述` : `按“${template.name}”风格`}生成支持{reportModeLabels[reportMode]}的六章节报告。</p>
          <button className="task-complete-row" type="button">
            <span><Check size={14} weight="bold" />任务已完成</span>
            <small>生成 1 份分析报告</small>
            <CaretRight size={15} />
          </button>

          <button className="generated-file-card" type="button" onClick={() => setReportOpen(true)}>
            <span className="html-file-icon"><FileHtml size={25} weight="duotone" /></span>
            <span><strong>{fileName}</strong><small>HTML · {isCustomStyle ? `${template.name} + 自定义风格` : template.name} · {reportModeLabels[reportMode]} · 6 个章节</small></span>
            <CaretRight size={16} />
          </button>

          <div className="assistant-result-copy">
            <p>报告生成完成。已依据应付管理分析内容，将现状、成因、行动与风险整理为 6 个等高章节；右侧已打开报告，可{reportMode === 'paged' ? '左右切换分页' : '上下滑动'}查看完整内容。</p>
            <p>本次报告使用 <code>{template.name}</code> 模板{isCustomStyle ? '并结合自定义样式描述' : ''}，采用{reportModeLabels[reportMode]}方式，数据和分析口径保持不变。</p>

            <h2>报告结构：</h2>
            <div className="result-outline-table" role="table" aria-label="报告结构">
              <div className="result-outline-head" role="row"><strong role="columnheader">板块</strong><strong role="columnheader">内容</strong></div>
              {resultOutline.map(([section, content]) => (
                <div role="row" key={section}><span role="cell">{section}</span><span role="cell">{content}</span></div>
              ))}
            </div>
            <p className="result-footnote">当前主题：{topic || '未选择主题'}。报告预览在右侧独立运行，不影响中间对话记录。</p>
          </div>

          {followUpSent ? (
            <div className="follow-up-record">
              <div>{followUpSent}</div>
              <p><Check size={13} weight="bold" />已记录追问，可继续基于当前报告调整。</p>
            </div>
          ) : null}

          {styleRevision ? (
            <div className="style-revision-record" aria-live="polite">
              <div>{styleRevision.prompt}</div>
              <p className={styleRevision.status}>
                {styleRevision.status === 'generating' ? <ArrowsClockwise size={14} /> : <Check size={14} weight="bold" />}
                {styleRevision.status === 'generating' ? `正在按“${styleRevision.templateName}”风格和${reportModeSwitchLabels[styleRevision.reportMode]}效果重新生成报告` : `报告已重新生成 · ${styleRevision.templateName} · ${reportModeSwitchLabels[styleRevision.reportMode]}`}
              </p>
            </div>
          ) : null}

          <div className="message-actions" aria-label="消息操作">
            <span>08-31 18:26</span>
            <button type="button" aria-label="重新生成"><ArrowCounterClockwise size={16} /></button>
            <button type="button" aria-label="赞同"><ThumbsUp size={16} /></button>
            <button type="button" aria-label="不赞同"><ThumbsDown size={16} /></button>
            <button type="button" aria-label="打开报告" onClick={() => setReportOpen(true)}><ArrowSquareOut size={16} /></button>
            <button type="button" aria-label="删除消息"><Trash size={16} /></button>
          </div>
        </div>

        <div className="follow-up-composer">
          <textarea aria-label="继续追问" placeholder="问问题或者布置任务，输入 @ 唤起技能或选择智能体" value={followUp} onChange={(event) => setFollowUp(event.target.value)} />
          <div className="follow-up-toolbar">
            <div>
              <button type="button" aria-label="添加附件"><Plus size={23} /></button>
              <button type="button" aria-label="选择技能"><span className="at-symbol">@</span></button>
              <button className="agent-pill" type="button"><Robot size={16} weight="duotone" />企业数据分析<CaretDown size={12} /></button>
              <button className="source-pill" type="button"><Database size={15} weight="duotone" />{topic}<CaretDown size={12} /></button>
            </div>
            <div>
              <button type="button" aria-label="语音输入"><Microphone size={20} /></button>
              <button className="follow-up-send" type="button" aria-label="发送追问" disabled={!followUp.trim()} onClick={submitFollowUp}><PaperPlaneRight size={17} weight="fill" /></button>
            </div>
          </div>
        </div>
        <footer className="result-ai-note">内容由 AI 生成，请注意甄别</footer>
      </section>

      {reportOpen ? (
        <aside className="result-report-pane" aria-label="报告预览">
          <header className="result-report-toolbar">
            <span className="toolbar-file-icon"><FileHtml size={18} weight="duotone" /></span>
            <strong title={fileName}>{fileName}</strong>
            <div className="report-style-control" ref={styleMenuRef}>
              <button className={`style-switch-button${styleMenuOpen ? ' active' : ''}`} type="button" aria-label="切换报告风格" aria-haspopup="dialog" aria-expanded={styleMenuOpen} onClick={toggleStyleMenu}>
                <PaintBrush size={15} weight="duotone" /><span>切换风格</span><CaretDown size={11} />
              </button>
              {styleMenuOpen && styleMenuView === 'select' ? (
                <div className="report-style-menu" role="menu" aria-label="选择报告风格">
                  <header><strong>切换报告风格</strong><small>选择展示效果和模板后，可预览并编辑修改要求</small></header>
                  <ReportModeSwitch value={draftReportMode} onChange={chooseDraftReportMode} />
                  <div>
                    {templates.map((option) => {
                      const OptionIcon = option.icon;
                      const selected = option.id === displayTemplate.id;
                      return (
                        <button className={selected ? 'selected' : ''} type="button" role="menuitemradio" aria-checked={selected} key={option.id} style={{ '--item-accent': interfaceAccent }} onClick={() => chooseReportStyle(option)}>
                          <span className="report-style-thumbnail"><img src={option.image} alt="" /></span>
                          <span className="report-style-copy"><strong>{option.name}</strong><small><OptionIcon size={11} weight="duotone" />{option.tag}</small></span>
                          {selected ? <Check size={15} weight="bold" /> : <CaretRight size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {styleMenuOpen && styleMenuView === 'edit' && draftTemplate ? (
                <section className="report-style-editor" role="dialog" aria-label="编辑报告风格" style={{ '--item-accent': interfaceAccent }}>
                  <header>
                    <button type="button" aria-label="返回风格列表" onClick={() => setStyleMenuView('select')}><CaretLeft size={16} /></button>
                    <div><strong>编辑风格</strong><small>预览效果并补充修改要求</small></div>
                    <button type="button" aria-label="关闭风格编辑" onClick={dismissStyleMenu}><X size={16} /></button>
                  </header>
                  <div className="style-editor-body">
                    <div className="style-editor-preview">
                      <img src={draftTemplate.image} alt={`${draftTemplate.name}封面预览`} />
                      <div><span><Eye size={13} />当前预览</span><strong>{draftTemplate.name}</strong><small>右侧已临时展示{reportModeSwitchLabels[draftReportMode]}效果</small></div>
                    </div>
                    <ReportModeSwitch value={draftReportMode} onChange={chooseDraftReportMode} />
                    <label htmlFor="style-modification-prompt"><strong>修改提示词</strong><small>可在默认内容基础上补充颜色、排版或重点信息要求</small></label>
                    <textarea id="style-modification-prompt" aria-label="风格修改提示词" maxLength={300} value={stylePrompt} onChange={(event) => setStylePrompt(event.target.value)} />
                    <span className="style-prompt-count">{stylePrompt.length} / 300</span>
                  </div>
                  <footer>
                    <button type="button" onClick={dismissStyleMenu}>取消</button>
                    <button className="submit-style-change" type="button" disabled={!stylePrompt.trim()} onClick={submitStyleModification}><PaperPlaneRight size={14} weight="fill" />提交修改</button>
                  </footer>
                </section>
              ) : null}
            </div>
            <button type="button" aria-label="下载报告"><DownloadSimple size={17} /></button>
            <button type="button" aria-label="编辑报告"><PencilSimple size={17} /></button>
            <button type="button" aria-label="在新窗口打开"><ArrowSquareOut size={17} /></button>
            <button type="button" aria-label={previewExpanded ? '退出全屏预览' : '放大预览'} onClick={() => setPreviewExpanded((value) => !value)}><ArrowsOut size={17} /></button>
            <button type="button" aria-label="关闭报告预览" onClick={() => { setReportOpen(false); setPreviewExpanded(false); dismissStyleMenu(); }}><X size={18} /></button>
          </header>
          <button className="report-version-row" type="button"><span>{styleRevision ? '版本链（共 2 个版本）' : '版本链（共 1 个版本）'}</span>{styleRevision?.status === 'done' ? <em><Check size={12} weight="bold" />已更新</em> : <CaretDown size={15} />}</button>
          {displayReportMode === 'paged' ? (
            <div className="result-report-paged" ref={reportScrollRef} aria-label={`${displayTemplate.name}分页报告预览`}>
              <div className="result-report-paged-track" style={{ transform: `translateX(-${resultPage * 100}%)` }}>
                {displayTemplate.pages.map((page, index) => (
                  <div className="result-report-paged-slide" key={page}><img src={page} alt={`${displayTemplate.name}报告第${index + 1}章：${reportSections[index].title}`} /></div>
                ))}
              </div>
              <button className="result-report-page-arrow previous" type="button" aria-label="上一章节" disabled={resultPage === 0} onClick={() => setResultPage((page) => Math.max(0, page - 1))}><CaretLeft size={21} weight="bold" /></button>
              <button className="result-report-page-arrow next" type="button" aria-label="下一章节" disabled={resultPage === reportPageCount - 1} onClick={() => setResultPage((page) => Math.min(reportPageCount - 1, page + 1))}><CaretRight size={21} weight="bold" /></button>
              <div className="result-report-page-status">第 {resultPage + 1} / {reportPageCount} 页 · {reportSections[resultPage].title}</div>
            </div>
          ) : (
            <div className="result-report-scroll" ref={reportScrollRef} aria-label={`${displayTemplate.name}报告完整预览`}>
              {displayTemplate.pages.map((page, index) => (
                <img src={page} alt={`${displayTemplate.name}报告第${index + 1}章：${reportSections[index].title}`} key={page} />
              ))}
            </div>
          )}
          {styleRevision?.status === 'generating' ? (
            <div className="report-regeneration-overlay" role="status" aria-live="polite">
              <span><ArrowsClockwise size={24} /></span>
              <strong>正在重新生成报告</strong>
              <p>正在应用“{styleRevision.templateName}”风格、{reportModeSwitchLabels[styleRevision.reportMode]}效果及修改提示词</p>
              <div><i /></div>
            </div>
          ) : null}
        </aside>
      ) : null}
    </main>
  );
}

function TemplatePreviewModal({ template, onClose, onSelect, selected }) {
  const [viewMode, setViewMode] = useState('scroll');
  const [reportPage, setReportPage] = useState(0);
  const [activeScrollSection, setActiveScrollSection] = useState(0);
  const scrollScreensRef = useRef(null);
  const reportPageCount = reportSections.length;

  useEffect(() => {
    if (!template) return undefined;
    setViewMode('scroll');
    setReportPage(0);
    setActiveScrollSection(0);
    return undefined;
  }, [template]);

  useEffect(() => {
    if (!template) return undefined;
    const handleKeyboard = (event) => {
      if (event.key === 'Escape') onClose();
      if (viewMode !== 'paged') return;
      if (event.key === 'ArrowLeft') setReportPage((page) => Math.max(0, page - 1));
      if (event.key === 'ArrowRight') setReportPage((page) => Math.min(reportPageCount - 1, page + 1));
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [template, onClose, viewMode]);

  if (!template) return null;
  const Icon = template.icon;
  const active = selected.id === template.id;

  function changeReportPage(nextPage) {
    setReportPage(Math.min(reportPageCount - 1, Math.max(0, nextPage)));
  }

  function changeScrollSection(nextSection) {
    const container = scrollScreensRef.current;
    setActiveScrollSection(nextSection);
    if (!container) return;
    container.scrollTo({ top: nextSection * container.clientHeight, behavior: 'smooth' });
  }

  function syncScrollDirectory(event) {
    const container = event.currentTarget;
    const nextSection = Math.min(reportPageCount - 1, Math.max(0, Math.round(container.scrollTop / container.clientHeight)));
    setActiveScrollSection((current) => current === nextSection ? current : nextSection);
  }

  return (
    <div className="preview-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="preview-modal" style={{ '--template-accent': interfaceAccent }} role="dialog" aria-modal="true" aria-label={`${template.name}完整报告预览`} onMouseDown={(event) => event.stopPropagation()}>
        <header className="preview-modal-header">
          <div className="preview-modal-title" style={{ '--template-accent': interfaceAccent }}>
            <span><Icon size={20} weight="duotone" /></span>
            <div><strong>{template.name}</strong><small>4 类内容 · 6 个板块 · 每个板块独占一屏</small></div>
          </div>
          <div className="preview-mode-switch" role="tablist" aria-label="预览方式">
            <button className={viewMode === 'scroll' ? 'active' : ''} role="tab" aria-selected={viewMode === 'scroll'} type="button" onClick={() => setViewMode('scroll')}><ArrowsDownUp size={15} />上下滑动</button>
            <button className={viewMode === 'paged' ? 'active' : ''} role="tab" aria-selected={viewMode === 'paged'} type="button" onClick={() => setViewMode('paged')}><SquaresFour size={15} />分页切换</button>
          </div>
          <button type="button" aria-label="关闭预览" onClick={onClose}><X size={19} /></button>
        </header>

        {viewMode === 'scroll' ? (
          <>
            <nav className="preview-scroll-directory" aria-label={`${template.name}报告目录`}>
              <span><ListBullets size={15} weight="bold" />报告目录</span>
              <div role="tablist" aria-label="报告章节">
                {reportSections.map((section, index) => (
                  <button className={activeScrollSection === index ? 'active' : ''} role="tab" aria-selected={activeScrollSection === index} type="button" key={section.id} onClick={() => changeScrollSection(index)}>
                    {['一', '二', '三', '四', '五', '六'][index]}、{section.title}
                  </button>
                ))}
              </div>
            </nav>
            <div className="preview-scroll-stage">
              <div className="preview-modal-screens" ref={scrollScreensRef} tabIndex="0" aria-label={`${template.name}六板块上下滑动报告预览`} onScroll={syncScrollDirectory}>
              {reportSections.map((section, index) => (
                  <article className="preview-report-screen" aria-label={`第${index + 1}板块：${section.title}`} key={section.id} style={{ backgroundImage: `url(${template.pages[index]})` }} />
              ))}
              </div>
            </div>
          </>
        ) : (
          <div className="preview-modal-paged" aria-label={`${template.name}分页报告预览`}>
            <div className="preview-carousel-track" style={{ transform: `translateX(-${reportPage * 100}%)` }}>
              {reportSections.map((section, index) => (
                <article className="preview-carousel-slide" aria-label={`${template.name}第${index + 1}页：${section.title}`} key={section.id} style={{ backgroundImage: `url(${template.pages[index]})` }} />
              ))}
            </div>
            <button className="preview-page-arrow previous" type="button" aria-label="上一页" disabled={reportPage === 0} onClick={() => changeReportPage(reportPage - 1)}><CaretLeft size={22} weight="bold" /></button>
            <button className="preview-page-arrow next" type="button" aria-label="下一页" disabled={reportPage === reportPageCount - 1} onClick={() => changeReportPage(reportPage + 1)}><CaretRight size={22} weight="bold" /></button>
            <div className="preview-page-controls">
              <span>第 {reportPage + 1} / {reportPageCount} 页 · {reportSections[reportPage].title}</span>
              <div>{Array.from({ length: reportPageCount }, (_, index) => <button className={index === reportPage ? 'active' : ''} type="button" aria-label={`第${index + 1}页`} key={index} onClick={() => setReportPage(index)} />)}</div>
            </div>
          </div>
        )}

        <footer className="preview-modal-footer">
          <span>{viewMode === 'scroll' ? <><ArrowsDownUp size={16} />按板块逐屏浏览完整报告</> : <><SquaresFour size={16} />轮播浏览 6 个报告板块</>}</span>
          <button className={active ? 'selected' : ''} type="button" onClick={() => { onSelect(template, viewMode); onClose(); }}>
            {active ? <Check size={15} weight="bold" /> : null}使用此模板
          </button>
        </footer>
      </section>
    </div>
  );
}

function StyleTemplateGallery({ selected, selectedMode, onSelect }) {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  return (
    <section className="style-gallery" aria-label="选择报告模板">
      <header className="template-gallery-summary">
        <p><PaintBrush size={15} weight="duotone" />点击卡片直接使用上下滑动；预览后可按当前浏览模式使用</p>
        <span className="gallery-selected-label"><Check size={13} weight="bold" />已选：{selected.name} · {reportModeLabels[selectedMode]}</span>
      </header>

      <div className="template-thumbnail-grid" aria-label="预置报告模板">
        {templates.map((template) => {
          const isSelected = selected.id === template.id;
          return (
            <article className={`template-thumbnail-card${isSelected ? ' selected' : ''}`} style={{ '--item-accent': interfaceAccent }} key={template.id}>
              <button className="template-card-select" type="button" aria-label={`选择${template.name}模板，默认上下滑动`} aria-pressed={isSelected && selectedMode === 'scroll'} onClick={() => onSelect(template, 'scroll')}>
                <span className="template-thumbnail-image">
                  <img src={template.image} alt={`${template.name}报告缩略图`} />
                </span>
                <span className="template-thumbnail-meta">
                  <span className="template-card-copy"><strong>{template.name}</strong><small>{template.description}</small></span>
                </span>
              </button>
              <button className={`template-card-action${isSelected ? ' selected' : ''}`} type="button" aria-label={`预览${template.name}`} onClick={() => setPreviewTemplate(template)}>{isSelected ? <Check size={14} weight="bold" /> : <Eye size={15} />}</button>
            </article>
          );
        })}
      </div>

      <p className="style-gallery-note"><MagicWand size={15} weight="duotone" />6 个板块：封面、数据表现 × 3、行动建议、风险与局限。</p>

      <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} onSelect={onSelect} selected={selected} />
    </section>
  );
}

export function App() {
  const [category, setCategory] = useState('业务分析');
  const [resourceTab, setResourceTab] = useState('topics');
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedReportMode, setSelectedReportMode] = useState('scroll');
  const [selectedAgent, setSelectedAgent] = useState('企业数据分析');
  const [agentEntryMode, setAgentEntryMode] = useState('quick');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [attachedFile, setAttachedFile] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [topicSearching, setTopicSearching] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const [recording, setRecording] = useState(false);
  const [workspaceView, setWorkspaceView] = useState('new');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [submittedReportMode, setSubmittedReportMode] = useState('scroll');
  const [submittedCustomStyle, setSubmittedCustomStyle] = useState(false);
  const composerRef = useRef(null);
  const fileInputRef = useRef(null);

  const canSend = Boolean(prompt.trim() || selectedSkill || attachedFile);
  const visibleTopics = topicSearching
    ? (topicSearch.trim() ? topicOptions.filter((topic) => topic.toLowerCase().includes(topicSearch.trim().toLowerCase())) : [])
    : topicOptions;

  useEffect(() => {
    const closeMenus = (event) => {
      if (composerRef.current && !composerRef.current.contains(event.target)) {
        setOpenMenu(null);
        setTopicSearching(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setTopicSearching(false);
      }
    };
    document.addEventListener('pointerdown', closeMenus);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeMenus);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function toggleMenu(name) {
    setOpenMenu((current) => (current === name ? null : name));
    if (name !== 'topics') setTopicSearching(false);
  }

  function submitTask() {
    if (!canSend) return;
    const request = resolveReportRequest(prompt);
    setSelectedTemplate(request.template);
    setSelectedReportMode(request.reportMode);
    setSubmittedPrompt(request.prompt);
    setSubmittedReportMode(request.reportMode);
    setSubmittedCustomStyle(request.isCustomStyle);
    setOpenMenu(null);
    setWorkspaceView('result');
  }

  function chooseRecommendation(title) {
    setSelectedTopic(title);
    setOpenMenu(null);
  }

  function chooseAgent(agent, entryMode = 'dropdown') {
    setSelectedAgent(agent);
    setAgentEntryMode(entryMode);
    if (agent !== '企业数据分析') setResourceTab('topics');
    setOpenMenu(null);
  }

  function clearAgent() {
    setSelectedAgent(null);
    setAgentEntryMode(null);
    setSelectedTopic('');
    setResourceTab('topics');
    setOpenMenu(null);
    setTopicSearching(false);
  }

  function chooseTemplate(template, reportMode = 'scroll') {
    setSelectedTemplate(template);
    setSelectedReportMode(reportMode);
    setPrompt(createTemplatePrompt(template.name, reportMode));
  }

  function useStyleSource(sourceName) {
    setAttachedFile(sourceName);
    setSelectedReportMode('scroll');
    setPrompt(createSourceStylePrompt(sourceName, selectedTemplate.name, 'scroll'));
    setOpenMenu(null);
  }

  function handleFileSelection(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    useStyleSource(file.name);
  }

  return (
    <div className={`app-shell${workspaceView === 'result' ? ' result-mode' : ''}`} style={{ '--active-template': interfaceAccent }}>
      <Sidebar resultActive={workspaceView === 'result'} onNewTask={() => setWorkspaceView('new')} />
      {workspaceView === 'result' ? (
        <ResultWorkspace prompt={submittedPrompt} template={selectedTemplate} topic={selectedTopic} reportMode={submittedReportMode} isCustomStyle={submittedCustomStyle} onTemplateChange={setSelectedTemplate} onReportModeChange={setSubmittedReportMode} />
      ) : (
      <main className="workspace">
        <div className="content-wrap">
          <section className="hero">
            <div className="eyebrow"><Sparkle size={16} weight="fill" /> AI 工作空间</div>
            <h1>灵基一动，工作轻松</h1>
            <div className="category-tabs" role="tablist" aria-label="任务类型">
              {['日常办公', '业务分析', '业务执行'].map((item) => (
                <button className={category === item ? 'active' : ''} type="button" key={item} onClick={() => { setCategory(item); setOpenMenu(null); }}>{item}</button>
              ))}
            </div>
          </section>

          <section className="composer-wrap" ref={composerRef}>
            <div className={`composer${selectedAgent && agentEntryMode === 'quick' ? ' with-agent' : ''}`}>
              {selectedAgent && agentEntryMode === 'quick' && (
                <div className="agent-context-row" aria-label="当前智能体与主题">
                  <span className="agent-selection-chip"><Robot size={17} weight="duotone" />{selectedAgent}<button type="button" aria-label={`取消选择${selectedAgent}`} onClick={clearAgent}><X size={14} /></button></span>
                  <button className={`source-pill${openMenu === 'topics' ? ' active' : ''}`} aria-label={selectedTopic || '选择主题'} aria-expanded={openMenu === 'topics'} type="button" onClick={() => toggleMenu('topics')}><Database size={16} weight="duotone" />{selectedTopic || '选择主题'}<CaretDown size={13} /></button>
                </div>
              )}
              {(selectedSkill || attachedFile) && (
                <div className="composer-selection-row" aria-label="已选择内容">
                  {selectedSkill && <span className="composer-selection-chip"><span>{selectedSkill.initial}</span>{selectedSkill.name}<button type="button" aria-label={`移除${selectedSkill.name}`} onClick={() => setSelectedSkill(null)}><X size={13} /></button></span>}
                  {attachedFile && <span className="composer-selection-chip file"><FolderSimple size={14} />{attachedFile}<button type="button" aria-label={`移除附件${attachedFile}`} onClick={() => setAttachedFile('')}><X size={13} /></button></span>}
                </div>
              )}
              <textarea aria-label="任务描述" placeholder="快速开展企业数据分析，如查询财务数据、开展经营分析" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
              <div className="composer-toolbar">
                <div className="composer-actions">
                  <input ref={fileInputRef} className="composer-file-input" type="file" accept=".png,.jpg,.jpeg,.webp,.html,.htm,.ppt,.pptx,.doc,.docx,.pdf" onChange={handleFileSelection} />
                  <button className={openMenu === 'attachments' ? 'toolbar-icon active' : 'toolbar-icon'} aria-label="添加风格参考" aria-expanded={openMenu === 'attachments'} type="button" onClick={() => toggleMenu('attachments')}><Plus size={24} /></button>
                  <button className={openMenu === 'skills' ? 'toolbar-icon active' : 'toolbar-icon'} aria-label="选择技能" aria-expanded={openMenu === 'skills'} type="button" onClick={() => toggleMenu('skills')}><span className="at-symbol">@</span></button>
                  {agentEntryMode !== 'quick' && <button className={`agent-pill${openMenu === 'agents' ? ' active' : ''}`} aria-label="选择智能体" aria-expanded={openMenu === 'agents'} type="button" onClick={() => toggleMenu('agents')}><Robot size={17} weight="duotone" />{selectedAgent || '选择智能体'}<CaretDown size={13} /></button>}
                  {selectedAgent && agentEntryMode === 'dropdown' && <button className={`source-pill${openMenu === 'topics' ? ' active' : ''}`} aria-label={selectedTopic || '选择主题'} aria-expanded={openMenu === 'topics'} type="button" onClick={() => toggleMenu('topics')}><Database size={16} weight="duotone" />{selectedTopic || '选择主题'}<CaretDown size={13} /></button>}
                </div>
                <div className="send-actions">
                  <button className="depth" type="button" disabled title="当前主题暂不支持切换分析深度"><Brain size={17} weight="duotone" />深度<CaretDown size={13} /></button>
                  <button className={recording ? 'recording' : ''} aria-label={recording ? '停止语音输入' : '语音输入'} aria-pressed={recording} type="button" onClick={() => setRecording((value) => !value)}><Microphone size={21} /></button>
                  <button className="send" aria-label="发送任务" type="button" onClick={submitTask} disabled={!canSend}><PaperPlaneRight size={18} weight="fill" /></button>
                </div>
              </div>

              {openMenu === 'attachments' && (
                <div className="composer-popover attachment-popover" role="dialog" aria-label="添加风格参考">
                  <header><strong>添加风格参考</strong><small>上传文件或引用已有产物，生成自定义风格提示词</small></header>
                  <div role="menu">
                    <button role="menuitem" type="button" onClick={() => { if (fileInputRef.current) { fileInputRef.current.value = ''; fileInputRef.current.click(); } }}>
                      <span><FolderSimple size={15} weight="duotone" /></span><div><strong>上传本地文件</strong><small>支持截图、HTML、PPT、Word 等</small></div><CaretRight size={14} />
                    </button>
                    <p className="attachment-menu-label">引用已有产物</p>
                    {existingArtifacts.map((artifact) => (
                      <button role="menuitem" type="button" key={artifact} onClick={() => useStyleSource(artifact)}>
                        <span><FileHtml size={15} weight="duotone" /></span><div><strong>{artifact}</strong><small>提取布局、配色与信息层级</small></div><CaretRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {openMenu === 'skills' && (
                <div className="composer-popover skill-popover" role="dialog" aria-label="选择技能">
                  {skillOptions.map((skill) => <button type="button" key={skill.name} onClick={() => { setSelectedSkill(skill); setOpenMenu(null); }}><span>{skill.initial}</span>{skill.name}</button>)}
                </div>
              )}
              {openMenu === 'agents' && (
                <div className="composer-popover agent-popover" role="dialog" aria-label="选择智能体">
                  <div role="menu">
                    {agentOptions.map((agent) => <button className={selectedAgent === agent && agentEntryMode === 'dropdown' ? 'selected' : ''} role="menuitem" type="button" key={agent} onClick={() => chooseAgent(agent, 'dropdown')}><span><Robot size={15} weight="duotone" /></span>{agent}{selectedAgent === agent && agentEntryMode === 'dropdown' && <Check size={14} weight="bold" />}</button>)}
                    {selectedAgent && agentEntryMode === 'dropdown' && (
                      <>
                        <div className="agent-menu-divider" aria-hidden="true" />
                        <button className="agent-cancel-option" role="menuitem" type="button" onClick={clearAgent}><span><X size={15} /></span>取消选择</button>
                      </>
                    )}
                  </div>
                </div>
              )}
              {selectedAgent && openMenu === 'topics' && (
                <div className="composer-popover topic-popover" role="dialog" aria-label="主题">
                  {topicSearching ? (
                    <input autoFocus aria-label="搜索主题" value={topicSearch} placeholder="搜索主题" onChange={(event) => setTopicSearch(event.target.value)} />
                  ) : (
                    <header><strong>主题</strong><button aria-label="搜索主题" type="button" onClick={() => { setTopicSearching(true); setTopicSearch(''); }}><MagnifyingGlass size={17} /></button></header>
                  )}
                  <div className="popover-menu" role="menu">
                    {visibleTopics.length ? visibleTopics.map((topic) => <button className={selectedTopic === topic ? 'selected' : ''} role="menuitem" type="button" key={topic} onClick={() => setSelectedTopic(topic)}><span><Database size={15} weight="duotone" /></span>{topic}{selectedTopic === topic && <Check size={14} weight="bold" />}</button>) : <p>暂无主题</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="composer-footer">
              <button className={openMenu === 'groups' ? 'active' : ''} aria-expanded={openMenu === 'groups'} type="button" onClick={() => toggleMenu('groups')}><FolderSimple size={16} />{selectedGroup || '选择分组'}<CaretRight size={13} /></button>
            </div>
            {openMenu === 'groups' && <div className="composer-popover group-popover" role="dialog" aria-label="选择分组"><div role="menu"><button role="menuitem" type="button" onClick={() => { setSelectedGroup('新建分组'); setOpenMenu(null); }}><Plus size={15} />新建分组</button></div></div>}
            {!selectedAgent && <button className="agent-quick-entry" type="button" onClick={() => chooseAgent('企业数据分析', 'quick')}><Robot size={17} weight="duotone" />企业数据分析</button>}
          </section>

          {selectedAgent && <section className="recommendations resource-library">
            <div className="resource-tabs" role="tablist" aria-label="内容选择">
              <button className={resourceTab === 'topics' ? 'active' : ''} role="tab" aria-selected={resourceTab === 'topics'} type="button" onClick={() => setResourceTab('topics')}>推荐主题</button>
              {selectedAgent === '企业数据分析' ? <button className={resourceTab === 'templates' ? 'active' : ''} role="tab" aria-selected={resourceTab === 'templates'} type="button" onClick={() => setResourceTab('templates')}>报告模板</button> : null}
            </div>
            {resourceTab === 'topics' ? (
              <div role="tabpanel" aria-label="推荐主题">
                <div className="recommendation-grid">
                  {recommendations.map(({ icon: Icon, tone, title, owner }) => (
                    <button type="button" className="recommendation-card" key={title} onClick={() => chooseRecommendation(title)}>
                      <span className={`recommendation-icon ${tone}`}><Icon size={17} weight="duotone" /></span>
                      <span><strong>{title}</strong><small>{owner}</small></span>
                    </button>
                  ))}
                </div>
                <button className="topic-center" type="button"><Sparkle size={18} weight="duotone" /><strong>主题中心</strong><span>创建和管理分析主题，汇聚数据、沉淀业务语义，为智能分析构建统一可信的数据基础。</span><CaretRight size={16} /></button>
              </div>
            ) : (
              <div role="tabpanel" aria-label="报告模板">
                <StyleTemplateGallery selected={selectedTemplate} selectedMode={selectedReportMode} onSelect={chooseTemplate} />
              </div>
            )}
          </section>}
        </div>
        <footer className="ai-note">内容由 AI 生成，请注意甄别</footer>
      </main>
      )}
    </div>
  );
}
