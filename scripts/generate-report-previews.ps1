param(
  [string]$OutputRoot = (Join-Path $PSScriptRoot '..\public\assets\templates')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$script:W = 2840
$script:H = 2000
$script:FontName = 'Microsoft YaHei UI'

function Color([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function AlphaColor([int]$alpha, [System.Drawing.Color]$color) {
  return [System.Drawing.Color]::FromArgb($alpha, $color.R, $color.G, $color.B)
}

function Rect([float]$x, [float]$y, [float]$w, [float]$h) {
  return [System.Drawing.RectangleF]::new($x, $y, $w, $h)
}

function RoundedPath([System.Drawing.RectangleF]$rect, [float]$radius) {
  $diameter = $radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($rect.Right - $diameter, $rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($rect.Right - $diameter, $rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($rect.X, $rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function FillRoundRect($g, [System.Drawing.Brush]$brush, [System.Drawing.RectangleF]$rect, [float]$radius) {
  $path = RoundedPath $rect $radius
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function StrokeRoundRect($g, [System.Drawing.Pen]$pen, [System.Drawing.RectangleF]$rect, [float]$radius) {
  $path = RoundedPath $rect $radius
  $g.DrawPath($pen, $path)
  $path.Dispose()
}

function DrawText($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size, [System.Drawing.Color]$color, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular, [string]$align = 'Near') {
  $font = [System.Drawing.Font]::new($script:FontName, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = [System.Drawing.SolidBrush]::new($color)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::$align
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  $g.DrawString($text, $font, $brush, (Rect $x $y $w $h), $format)
  $format.Dispose(); $brush.Dispose(); $font.Dispose()
}

function DrawImageCover($g, [System.Drawing.Image]$image, [System.Drawing.RectangleF]$target) {
  $sourceRatio = $image.Width / $image.Height
  $targetRatio = $target.Width / $target.Height
  if ($sourceRatio -gt $targetRatio) {
    $cropW = [float]($image.Height * $targetRatio)
    $cropX = [float](($image.Width - $cropW) / 2)
    $source = Rect $cropX 0 $cropW $image.Height
  } else {
    $cropH = [float]($image.Width / $targetRatio)
    $cropY = [float](($image.Height - $cropH) / 2)
    $source = Rect 0 $cropY $image.Width $cropH
  }
  $g.DrawImage($image, $target, $source, [System.Drawing.GraphicsUnit]::Pixel)
}

function DrawPageHeader($g, $style, [int]$page, [string]$part, [string]$title, [string]$subtitle) {
  $accentBrush = [System.Drawing.SolidBrush]::new($style.Accent)
  $mutedBrush = [System.Drawing.SolidBrush]::new($style.Muted)
  $g.FillRectangle($accentBrush, 150, 128, 18, 18)
  DrawText $g ('0' + $page) 188 82 240 120 66 $style.Accent ([System.Drawing.FontStyle]::Regular)
  DrawText $g $part 440 106 980 70 30 $style.Muted ([System.Drawing.FontStyle]::Bold)
  DrawText $g $title 150 220 2320 130 76 $style.Text ([System.Drawing.FontStyle]::Bold)
  DrawText $g $subtitle 154 365 2240 92 28 $style.Muted
  $g.FillRectangle($mutedBrush, 150, 475, 2540, 2)
  $accentBrush.Dispose(); $mutedBrush.Dispose()
}

function DrawCard($g, $style, [System.Drawing.RectangleF]$rect, [string]$title, [string]$value, [string]$note, [System.Drawing.Color]$tone) {
  $shadow = [System.Drawing.SolidBrush]::new((AlphaColor 24 ([System.Drawing.Color]::Black)))
  FillRoundRect $g $shadow (Rect ($rect.X + 8) ($rect.Y + 12) $rect.Width $rect.Height) 34
  $shadow.Dispose()
  $fill = [System.Drawing.SolidBrush]::new($style.Card)
  $stroke = [System.Drawing.Pen]::new($style.Stroke, 3)
  FillRoundRect $g $fill $rect 34
  StrokeRoundRect $g $stroke $rect 34
  $dot = [System.Drawing.SolidBrush]::new($tone)
  $g.FillEllipse($dot, $rect.X + 42, $rect.Y + 46, 16, 16)
  DrawText $g $title ($rect.X + 78) ($rect.Y + 34) ($rect.Width - 110) 62 26 $style.Muted ([System.Drawing.FontStyle]::Bold)
  DrawText $g $value ($rect.X + 42) ($rect.Y + 108) ($rect.Width - 84) 102 60 $style.Text ([System.Drawing.FontStyle]::Regular)
  DrawText $g $note ($rect.X + 44) ($rect.Bottom - 82) ($rect.Width - 88) 48 24 $tone ([System.Drawing.FontStyle]::Bold)
  $dot.Dispose(); $stroke.Dispose(); $fill.Dispose()
}

function DrawPanel($g, $style, [System.Drawing.RectangleF]$rect, [string]$title) {
  $fill = [System.Drawing.SolidBrush]::new($style.Card)
  $stroke = [System.Drawing.Pen]::new($style.Stroke, 3)
  FillRoundRect $g $fill $rect 38
  StrokeRoundRect $g $stroke $rect 38
  $fill.Dispose(); $stroke.Dispose()
  $accent = [System.Drawing.SolidBrush]::new($style.Accent)
  $g.FillEllipse($accent, $rect.X + 46, $rect.Y + 45, 18, 18)
  $accent.Dispose()
  DrawText $g $title ($rect.X + 82) ($rect.Y + 30) ($rect.Width - 120) 64 30 $style.Text ([System.Drawing.FontStyle]::Bold)
}

function DrawBars($g, $style, [System.Drawing.RectangleF]$rect, [double[]]$values, [string[]]$labels) {
  $gridPen = [System.Drawing.Pen]::new((AlphaColor 80 $style.Stroke), 2)
  for ($i = 0; $i -lt 5; $i++) {
    $y = $rect.Bottom - 72 - ($i * (($rect.Height - 160) / 4))
    $g.DrawLine($gridPen, $rect.X + 72, $y, $rect.Right - 48, $y)
  }
  $gridPen.Dispose()
  $max = ($values | Measure-Object -Maximum).Maximum
  $barW = [float](($rect.Width - 210) / ($values.Count * 2))
  for ($i = 0; $i -lt $values.Count; $i++) {
    $height = [float](($rect.Height - 210) * $values[$i] / $max)
    $x = $rect.X + 120 + ($i * $barW * 2)
    $bar = [System.Drawing.SolidBrush]::new($(if ($i -eq 0) { $style.Accent } else { AlphaColor 135 $style.Accent }))
    FillRoundRect $g $bar (Rect $x ($rect.Bottom - 105 - $height) $barW $height) 18
    $bar.Dispose()
    DrawText $g ([string]$values[$i]) ($x - 20) ($rect.Bottom - 155 - $height) ($barW + 40) 46 22 $style.Text ([System.Drawing.FontStyle]::Bold) 'Center'
    DrawText $g $labels[$i] ($x - 35) ($rect.Bottom - 74) ($barW + 70) 40 22 $style.Muted ([System.Drawing.FontStyle]::Regular) 'Center'
  }
}

function DrawLineChart($g, $style, [System.Drawing.RectangleF]$rect, [double[]]$values, [string[]]$labels) {
  $gridPen = [System.Drawing.Pen]::new((AlphaColor 80 $style.Stroke), 2)
  for ($i = 0; $i -lt 5; $i++) {
    $y = $rect.Bottom - 80 - ($i * (($rect.Height - 170) / 4))
    $g.DrawLine($gridPen, $rect.X + 72, $y, $rect.Right - 62, $y)
  }
  $gridPen.Dispose()
  $max = ($values | Measure-Object -Maximum).Maximum * 1.08
  $min = ($values | Measure-Object -Minimum).Minimum * 0.92
  $points = [System.Collections.Generic.List[System.Drawing.PointF]]::new()
  for ($i = 0; $i -lt $values.Count; $i++) {
    $x = $rect.X + 92 + ($i * (($rect.Width - 184) / ($values.Count - 1)))
    $y = $rect.Bottom - 92 - (($values[$i] - $min) / ($max - $min) * ($rect.Height - 230))
    $points.Add([System.Drawing.PointF]::new([float]$x, [float]$y))
  }
  $linePen = [System.Drawing.Pen]::new($style.Accent, 10)
  $linePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawLines($linePen, $points.ToArray())
  $linePen.Dispose()
  for ($i = 0; $i -lt $points.Count; $i++) {
    $dot = [System.Drawing.SolidBrush]::new($style.Accent)
    $g.FillEllipse($dot, $points[$i].X - 12, $points[$i].Y - 12, 24, 24)
    $dot.Dispose()
    DrawText $g $labels[$i] ($points[$i].X - 60) ($rect.Bottom - 66) 120 36 21 $style.Muted ([System.Drawing.FontStyle]::Regular) 'Center'
  }
}

function DrawProgress($g, $style, [float]$x, [float]$y, [float]$w, [string]$label, [string]$value, [float]$percent, [System.Drawing.Color]$tone) {
  DrawText $g $label $x $y ($w * .58) 42 25 $style.Text ([System.Drawing.FontStyle]::Bold)
  DrawText $g $value ($x + ($w * .58)) $y ($w * .42) 42 25 $tone ([System.Drawing.FontStyle]::Bold) 'Far'
  $track = [System.Drawing.SolidBrush]::new((AlphaColor 90 $style.Stroke))
  $fill = [System.Drawing.SolidBrush]::new($tone)
  FillRoundRect $g $track (Rect $x ($y + 56) $w 18) 9
  FillRoundRect $g $fill (Rect $x ($y + 56) ($w * $percent) 18) 9
  $track.Dispose(); $fill.Dispose()
}

function DrawCover($g, $style) {
  DrawPageHeader $g $style 1 '报告封面' '财务应付管理分析报告' '聚焦逾期、到期、未到票与预付核销，识别供应商集中风险。'
  DrawText $g '统计口径' 160 560 300 60 28 $style.Accent ([System.Drawing.FontStyle]::Bold)
  DrawText $g "数据范围：2024-08-01 至 2026-08-14`n覆盖主体：星空旗舰科技有限公司`n币种：人民币（本位币）`n数据来源：应付主题分析" 160 640 1060 360 31 $style.Text
  $titles = @('逾期应付账款','30 天内到期','已入库未到票','预付未核销')
  $values = @('2,161.61 万','10,000.13 万','10,042.40 万','2,239 元')
  $notes = @('A 供应商占 92.5%','单一供应商占 99.99%','财务应付占 99.6%','最早未核销约 23 个月')
  for ($i=0; $i -lt 4; $i++) {
    DrawCard $g $style (Rect (1330 + (($i % 2) * 670)) (570 + ([math]::Floor($i / 2) * 360)) 620 300) $titles[$i] $values[$i] $notes[$i] $(if($i -eq 0 -or $i -eq 1){Color '#ef5b5b'}else{Color '#f0b429'})
  }
  $panel = Rect 150 1370 2540 410
  $panelFill = [System.Drawing.SolidBrush]::new($(if($style.Dark){Color '#091a32'}else{Color '#26272b'}))
  FillRoundRect $g $panelFill $panel 42
  $panelFill.Dispose()
  DrawText $g '核心风险' 220 1430 500 50 26 $style.Accent ([System.Drawing.FontStyle]::Bold)
  DrawText $g '短期付款与未到票金额同时高度集中' 220 1515 2260 72 43 ([System.Drawing.Color]::White) ([System.Drawing.FontStyle]::Bold)
  DrawText $g '逾期应付 92.5% 集中于 A 供应商；未来 30 天 1 亿元到期款几乎来自单一供应商。' 220 1615 2260 90 28 (Color '#c8cbd2')
}

function DrawOverview($g, $style) {
  DrawPageHeader $g $style 2 '数据表现 · 01' '逾期应付集中度' '逾期规模集中于少数供应商，8 月出现集中到期未付。'
  $titles = @('逾期应付总额','涉及供应商','A 供应商逾期','最长逾期天数')
  $values = @('2,161.61 万','22 家','2,000.54 万','976 天')
  $notes = @('截至 2026-08-14','Top 2 占 98.8%','12 笔 · 占 92.5%','供应商 1 遗留款项')
  for ($i=0; $i -lt 4; $i++) { DrawCard $g $style (Rect (150 + $i * 650) 555 590 286) $titles[$i] $values[$i] $notes[$i] $(if($i -eq 0 -or $i -eq 2){Color '#ef5b5b'}else{$style.Accent}) }
  $left = Rect 150 920 1510 820
  DrawPanel $g $style $left '逾期金额供应商分布（万元）'
  DrawBars $g $style (Rect ($left.X + 40) ($left.Y + 100) ($left.Width - 80) ($left.Height - 130)) @(2000.54,135.07,21.33,3.0) @('A供应商','供应商1','SRM供应商','其他')
  $right = Rect 1720 920 970 820
  DrawPanel $g $style $right '集中度与时间信号'
  DrawProgress $g $style 1790 1060 820 'A 供应商逾期占比' '92.5%' .925 (Color '#ef5b5b')
  DrawProgress $g $style 1790 1245 820 'Top 2 供应商占比' '98.8%' .988 (Color '#f0b429')
  DrawProgress $g $style 1790 1430 820 '2026 年 8 月逾期' '2,001.23 万' .926 $style.Accent
  DrawText $g '7 月仅 2.21 万，8 月集中爆发' 1790 1605 820 60 24 $style.Muted ([System.Drawing.FontStyle]::Bold)
}

function DrawStructure($g, $style) {
  DrawPageHeader $g $style 3 '数据表现 · 02' '30 天到期付款压力' '单笔 1 亿元款项即将到期，若未妥善安排将显著推高逾期规模。'
  $left = Rect 150 560 1110 1170
  DrawPanel $g $style $left '当前逾期与即将到期对比（万元）'
  DrawBars $g $style (Rect ($left.X + 45) ($left.Y + 125) ($left.Width - 90) 710) @(2161.61,10000.13) @('当前逾期','30天内到期')
  DrawText $g '近 5 倍' 330 1450 740 100 72 (Color '#ef5b5b') ([System.Drawing.FontStyle]::Bold) 'Center'
  DrawText $g '若未按时支付，逾期规模可能快速放大' 260 1560 880 68 28 $style.Muted ([System.Drawing.FontStyle]::Bold) 'Center'
  $rightTop = Rect 1320 560 1370 520
  DrawPanel $g $style $rightTop '核心到期事项'
  DrawText $g '山东雅因子生物科技有限公司' 1400 710 1190 70 38 $style.Text ([System.Drawing.FontStyle]::Bold)
  DrawText $g '2026 年 9 月到期 CNY 10,000.00 万，占即将到期应付的 99.99%。' 1400 815 1190 120 28 $style.Muted
  $rightBottom = Rect 1320 1130 1370 600
  DrawPanel $g $style $rightBottom '付款准备核查'
  DrawProgress $g $style 1400 1280 1190 '大额供应商集中度' '99.99%' .9999 (Color '#ef5b5b')
  DrawProgress $g $style 1400 1435 1190 '当前已识别到期金额' '10,000.13 万' .96 (Color '#f0b429')
  DrawProgress $g $style 1400 1590 1190 '资金来源 / 审批 / 展期方案' '待确认' .34 $style.Accent
}

function DrawEfficiency($g, $style) {
  DrawPageHeader $g $style 4 '数据表现 · 03' '未到票与预付核销' '未到票规模集中于财务应付单，预付款金额虽小但存在长期未核销。'
  $left = Rect 150 560 1610 1170
  DrawPanel $g $style $left '已入库未到票构成'
  $financePen = [System.Drawing.Pen]::new($style.Accent, 92)
  $estimatePen = [System.Drawing.Pen]::new((Color '#f0b429'), 92)
  $g.DrawArc($financePen, 520, 790, 820, 820, -90, 358.6)
  $g.DrawArc($estimatePen, 520, 790, 820, 820, 268.6, 1.4)
  $financePen.Dispose(); $estimatePen.Dispose()
  DrawText $g '99.6%' 700 1055 460 110 76 $style.Text ([System.Drawing.FontStyle]::Bold) 'Center'
  DrawText $g '财务应付未到票占比' 650 1170 560 55 28 $style.Muted ([System.Drawing.FontStyle]::Regular) 'Center'
  DrawText $g '未到票合计 10,042.40 万' 310 1510 1290 62 33 $style.Text ([System.Drawing.FontStyle]::Bold) 'Center'
  DrawText $g '财务应付 10,000.54 万 · 暂估应付 41.86 万' 310 1595 1290 60 27 $style.Muted ([System.Drawing.FontStyle]::Regular) 'Center'
  $right = Rect 1820 560 870 1170
  DrawPanel $g $style $right '暂估未到票与预付信号'
  DrawProgress $g $style 1900 760 710 '评多多 · 暂估未到票' '32.4%' .324 $style.Accent
  DrawProgress $g $style 1900 990 710 '清风公司 · 暂估未到票' '17.2%' .172 (Color '#48a868')
  DrawProgress $g $style 1900 1220 710 '税号供应商 · 暂估未到票' '15.4%' .154 (Color '#f0b429')
  DrawProgress $g $style 1900 1450 710 'A 供应商 · 预付未核销' '2,200 元 / 98.3%' .983 (Color '#ef5b5b')
  DrawText $g '最早一笔自 2024-09-07 起未核销' 1900 1608 710 70 23 $style.Muted ([System.Drawing.FontStyle]::Bold)
}

function DrawActions($g, $style) {
  DrawPageHeader $g $style 5 '行动建议' '三项优先处置行动' '先保障大额到期资金，再清理逾期与未到票，降低供应商集中风险。'
  $cards = @(
    @{No='P0';Title='落实 1 亿元到期资金';Body='确认山东雅因子生物科技款项的资金来源、审批进度及分期或展期预案。';Metric='避免逾期规模在 30 天内放大';Tone=(Color '#ef5b5b')},
    @{No='P0';Title='清理 A 供应商逾期';Body='逐笔核对 12 笔逾期单据，区分无争议、争议与历史遗留款项并制定清偿计划。';Metric='覆盖 2,000.54 万逾期敞口';Tone=(Color '#f0b429')},
    @{No='P1';Title='跟进大额未到票';Body='核查采购订单与合同，确认发票预计到达时间，推动已到票单据及时核销。';Metric='跟进 10,000.54 万财务应付';Tone=$style.Accent}
  )
  for($i=0;$i -lt 3;$i++){
    $x = 150 + ($i * 855)
    $rect = Rect $x 620 790 980
    $fill = [System.Drawing.SolidBrush]::new($(if($style.Dark){Color '#091a32'}else{Color '#24262a'}))
    FillRoundRect $g $fill $rect 48
    $fill.Dispose()
    DrawText $g $cards[$i].No ($x + 60) 690 300 110 70 $cards[$i].Tone ([System.Drawing.FontStyle]::Regular)
    DrawText $g $cards[$i].Title ($x + 60) 860 660 82 39 ([System.Drawing.Color]::White) ([System.Drawing.FontStyle]::Bold)
    DrawText $g $cards[$i].Body ($x + 60) 1000 660 210 28 (Color '#c9ccd3')
    DrawText $g $cards[$i].Metric ($x + 60) 1420 660 64 27 $cards[$i].Tone ([System.Drawing.FontStyle]::Bold)
  }
  DrawText $g '同步动作：清理 A 供应商 2,200 元长期预付 · 建立单供应商占比与单笔大额预警' 150 1690 2540 60 26 $style.Muted ([System.Drawing.FontStyle]::Bold) 'Center'
}

function DrawRisks($g, $style) {
  DrawPageHeader $g $style 6 '风险与局限' '风险信号与数据边界' '明确当前暴露、缺失信息和结论适用范围，避免对逾期成因过度推断。'
  $left = Rect 150 560 1240 1130
  DrawPanel $g $style $left '风险信号'
  $risks = @(
    @('单一供应商集中','逾期 92.5% 与到期 99.99% 均集中于单一供应商。','#ef5b5b'),
    @('历史款项长期未清','供应商 1 最长逾期 976 天，可能存在遗留或争议。','#f0b429'),
    @('预付核销流程滞后','A 供应商 3 笔预付超过 17 个月仍未核销。','#4f87e8')
  )
  for($i=0;$i -lt 3;$i++){
    $y=740+$i*280
    $tone=Color $risks[$i][2]
    $dot=[System.Drawing.SolidBrush]::new($tone); $g.FillEllipse($dot,230,$y,30,30); $dot.Dispose()
    DrawText $g $risks[$i][0] 300 ($y-10) 920 60 31 $style.Text ([System.Drawing.FontStyle]::Bold)
    DrawText $g $risks[$i][1] 300 ($y+72) 920 100 25 $style.Muted
  }
  $right = Rect 1450 560 1240 1130
  DrawPanel $g $style $right '数据局限'
  $limits=@(
    '缺少合同付款条件、逾期原因备注与催收记录。',
    '缺少现金流预测、可用资金及融资安排数据。',
    '缺少发票预计到达时间与差异处理跟进记录。',
    '仅覆盖星空旗舰科技，无法开展跨公司对比。'
  )
  for($i=0;$i -lt $limits.Count;$i++){
    $y=745+$i*205
    $badge=[System.Drawing.SolidBrush]::new((AlphaColor 36 $style.Accent))
    FillRoundRect $g $badge (Rect 1530 $y 64 64) 18
    $badge.Dispose()
    DrawText $g ([string]($i+1)) 1530 ($y+10) 64 48 24 $style.Accent ([System.Drawing.FontStyle]::Bold) 'Center'
    DrawText $g $limits[$i] 1640 ($y-2) 920 105 27 $style.Text
  }
  DrawText $g '结论适用范围：2024-08-01 至 2026-08-14 · 星空旗舰科技有限公司 · 人民币本位币' 150 1750 2540 54 24 $style.Muted ([System.Drawing.FontStyle]::Bold) 'Center'
}

function NewPage($style, [int]$page) {
  $bitmap = [System.Drawing.Bitmap]::new($script:W, $script:H, [System.Drawing.Imaging.PixelFormat]::Format32bppPArgb)
  $bitmap.SetResolution(144, 144)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $base = [System.Drawing.Image]::FromFile($style.Base)
  DrawImageCover $g $base (Rect 0 0 $script:W $script:H)
  $base.Dispose()
  $wash = [System.Drawing.SolidBrush]::new((AlphaColor $style.WashAlpha $style.Background))
  $g.FillRectangle($wash, 0, 0, $script:W, $script:H)
  $wash.Dispose()
  switch($page) {
    1 { DrawCover $g $style }
    2 { DrawOverview $g $style }
    3 { DrawStructure $g $style }
    4 { DrawEfficiency $g $style }
    5 { DrawActions $g $style }
    6 { DrawRisks $g $style }
  }
  $g.Dispose()
  return $bitmap
}

$baseRoot = Join-Path $OutputRoot 'generated-bases'
$styles = @(
  @{Name='clean-equal-height-report';Base=(Join-Path $baseRoot 'clean-base.png');Background=(Color '#fffaf0');Text=(Color '#242936');Muted=(Color '#667085');Accent=(Color '#d0aa00');Card=(Color '#fffefb');Stroke=(Color '#e7dfca');WashAlpha=40;Dark=$false},
  @{Name='consulting-equal-height-report';Base=(Join-Path $baseRoot 'consulting-base.png');Background=(Color '#f8fbff');Text=(Color '#102b5f');Muted=(Color '#5a6f92');Accent=(Color '#1266d6');Card=(Color '#ffffff');Stroke=(Color '#cddcf4');WashAlpha=35;Dark=$false},
  @{Name='editorial-equal-height-report';Base=(Join-Path $baseRoot 'editorial-base.png');Background=(Color '#fbfaf5');Text=(Color '#244b3b');Muted=(Color '#65756e');Accent=(Color '#3e755b');Card=(Color '#fffefa');Stroke=(Color '#d7ded6');WashAlpha=55;Dark=$false},
  @{Name='dark-equal-height-report';Base=(Join-Path $baseRoot 'dark-base.png');Background=(Color '#06152d');Text=(Color '#f2f7ff');Muted=(Color '#91a8c2');Accent=(Color '#22c3f1');Card=(Color '#0c223e');Stroke=(Color '#1b5272');WashAlpha=18;Dark=$true}
)

foreach($style in $styles) {
  $pageDir = Join-Path $OutputRoot ($style.Name + '-pages')
  New-Item -ItemType Directory -Force -Path $pageDir | Out-Null
  for($page=1; $page -le 6; $page++) {
    $bitmap = NewPage $style $page
    $pagePath = Join-Path $pageDir ('page-' + $page + '.png')
    $bitmap.Save($pagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
  }

  $long = [System.Drawing.Bitmap]::new($script:W, ($script:H * 6), [System.Drawing.Imaging.PixelFormat]::Format32bppPArgb)
  $long.SetResolution(144, 144)
  $longGraphics = [System.Drawing.Graphics]::FromImage($long)
  $longGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  for($page=1; $page -le 6; $page++) {
    $pageImage = [System.Drawing.Image]::FromFile((Join-Path $pageDir ('page-' + $page + '.png')))
    $longGraphics.DrawImageUnscaled($pageImage, 0, (($page - 1) * $script:H))
    $pageImage.Dispose()
  }
  $longGraphics.Dispose()
  $long.Save((Join-Path $OutputRoot ($style.Name + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
  $long.Dispose()
}

Write-Output 'Generated four report previews: 2840x12000 composites and 24 pages at 2840x2000.'
