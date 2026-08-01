$ErrorActionPreference = 'Stop'
$cfgDir = "d:\project\mp-wxapkg-unpacker\analysis\cfg"
$excelDir = "d:\project\mp-wxapkg-unpacker\analysis\excel"
$csvDir = "$excelDir\csv"
New-Item -ItemType Directory -Force -Path $csvDir | Out-Null

# ---------- Load original config (for mechanism Chinese labels) ----------
$srcJson = "d:\project\mp-wxapkg-unpacker\unpacked\_subpackages_resources_\subpackages\resources\import\ec\ecb05b2f-7d96-4c98-b82e-5c03455fd0f8.ff966.json"
$srcData = (Get-Content $srcJson -Raw -Encoding UTF8 | ConvertFrom-Json)[5][0][2]

# ---------- Field -> Chinese dictionary ----------
$fieldZh = @{
  id='编号'; name='名称'; title='标题'; text='说明文案'; desc='描述'; write='描述文案'
  img='图片资源'; icon='图标'; type='类型'; key='键值'; define='定义标识'; parameter='参数值'; value='值'
  # LevelData
  targetCount='目标消除数'; fruitTypeCount='水果种类数'; downType='掉落方向(0纵/1右/2左)'
  quistFlowerCount='问号花数量'; holeCount='洞口数量'; holeFruit='洞口水果数'; iceCount='冰块数量'; iceLog='冰块消除对数'
  scatterType='散布类型'; blockCount='多边形障碍数'; ropeCount='绳子数量'; fireCount='大火数量'
  isWood='树桩(阻挡下落)'; exchangeCount='交换次数'; hoodCount='帽子数量'
  # DDA
  cond1='条件1区间(难度比)'; cond2='条件2区间(挑战次数)'; cond3='条件3区间(留存天数)'
  base='基础分'; ratio='评分倍率'; itemCounts='道具数量'; resurrection='复活次数'; popCounts='弹出数量'
  # Difficulty curve
  point='分数阈值'; pointUpper='分数上限'; time='下落间隔(ms)'; speed='速度'; group='可用方块组'
  rate='权重/概率'; count='数量'; range='范围'; protect='保护数'; remove='移除数'; announcement='公告'
  # Tetris
  shape='形状矩阵(█=填充)'; shapeGroup='形状编号组'; surroundMax='最大环绕数'; block='方块'
  blockGroup='方块组'; blockID='方块编号列表'; area='区域'; line='行数'
  # Map
  map='地图'; mapData='地图数据(二维矩阵)'; begin='起始数据'; itemNum='道具数'; beginItemNum='起始道具数'
  condition='通关条件'; condition1='条件1'; condition2='条件2'
  # FruitData
  color='颜色'; radius='半径'; offsetX='X偏移'; offsetY='Y偏移'; points='碰撞器顶点(多边形)'
  # BlockColor
  itemID='道具ID'; puzzle='拼图模式'; drop='掉落模式'; classic='经典模式'
  # Adventure / Activity / Task
  sk='spine动画'; level='等级/关卡'; levelData='关卡数据'; rewardTheme='奖励主题'; groupId='组ID'
  target='目标值'; startTime='开始时间'; endTime='结束时间'; hiddenTime='隐藏时间'; themeId='主题ID'
  # Ads / Game / Sound / Views
  action='动作'; share='分享'; sdkSceneId='SDK场景ID'; path='路径'; sound='音效'; viewName='视图名'
  # NoviceGuide
  flag='标志位'; actionID='动作ID'; clickDelay='点击延迟'; content='内容'; mask='遮罩'; bgColor='背景色'
  viewsID='视图ID'; dialogPos='对话框位置'; maskSize='遮罩尺寸'; maskPos='遮罩位置'; touchSize='触摸区尺寸'; touchPos='触摸位置'; fingerPos='手指位置'
  # MoreRemove
  removeNum='移除数量'; shock='震动'; shockView='震动视图'; vibrate='震动开关'
  # RewardPuzzle / ThemeData / CityConfig / misc
  basis='基础值'; road='路径资源'; spine='spine动画'; itemName='道具名称'; secret='秘密关卡'; pot='锅'
  guide='引导文案'; v2Arr='v2数组'
}
# Merge mechanism table Chinese names (id -> name)
foreach ($p in $srcData.mechanism.PSObject.Properties) { $fieldZh[$p.Value.id] = $p.Value.name }

# ---------- Helpers ----------
function IsArr($x) { if ($null -eq $x) { return $false }; return [bool]($x.GetType().IsArray) }
function IsObj($x) { return ($x -is [pscustomobject]) }

function Format-Value($val) {
  if ($null -eq $val) { return $null }
  if ($val -is [string] -or $val -is [int] -or $val -is [long] -or $val -is [double] -or $val -is [bool] -or $val -is [decimal]) { return $val }
  if (IsArr $val) {
    $elems = @($val)
    if ($elems.Count -eq 0) { return '' }
    # array of objects?
    if (IsObj $elems[0]) {
      # points: {value:[x,y], Count}
      if ($elems[0].PSObject.Properties.Name -contains 'value') {
        $parts = @(); foreach ($e in $elems) { $v = $e.value; if (IsArr $v -and $v.Count -ge 2) { $parts += "($($v[0]),$($v[1]))" } else { $parts += ($e | ConvertTo-Json -Compress -Depth 5) } }
        return ($parts -join '')
      }
      return ($elems | ForEach-Object { $_ | ConvertTo-Json -Compress -Depth 5 }) -join ','
    }
    # 2D array?
    if (IsArr $elems[0]) {
      $all01 = $true
      foreach ($row in $elems) { foreach ($cell in $row) { if ($cell -ne 0 -and $cell -ne 1) { $all01 = $false } } }
      if ($all01) {
        $rows = @(); foreach ($row in $elems) { $line = -join ($row | ForEach-Object { if ($_ -eq 1) { '█' } else { '·' } }); $rows += $line }
        return ($rows -join "`n")
      } else {
        $rows = @(); foreach ($row in $elems) { $rows += (($row | ForEach-Object { "$_" }) -join ' ') }
        return ($rows -join "`n")
      }
    }
    # 1D scalar array
    return (($elems | ForEach-Object { "$_" }) -join ', ')
  }
  if (IsObj $val) { return ($val | ConvertTo-Json -Compress -Depth 10) }
  return "$val"
}

# ---------- Phase 1: build grids + CSV ----------
$jsonFiles = Get-ChildItem $cfgDir -Filter *.json | Sort-Object Name
$allTables = New-Object System.Collections.Generic.List[object]

foreach ($jf in $jsonFiles) {
  $name = $jf.BaseName
  $obj = Get-Content $jf.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  if ($obj -is [Array]) { $records = @($obj) } else { $records = @($obj.PSObject.Properties | ForEach-Object { $_.Value }) }

  $fields = New-Object System.Collections.Generic.List[string]
  $seen = @{}
  foreach ($r in $records) { if ($r -and $r.PSObject.Properties) { foreach ($p in $r.PSObject.Properties) { if (-not $seen.ContainsKey($p.Name)) { $seen[$p.Name] = $true; $fields.Add($p.Name) } } } }
  $ncols = $fields.Count; if ($ncols -eq 0) { $ncols = 1; $fields.Add('value') }
  $nrows = $records.Count + 2  # row1 English header, row2 Chinese, row3+ data
  $grid = New-Object 'object[,]' $nrows, $ncols
  $hasNL = $false
  for ($c = 0; $c -lt $ncols; $c++) {
    $fn = $fields[$c]
    $grid[0, $c] = $fn
    $grid[1, $c] = if ($fieldZh.ContainsKey($fn)) { $fieldZh[$fn] } else { '' }
  }
  for ($i = 0; $i -lt $records.Count; $i++) {
    $r = $records[$i]
    for ($c = 0; $c -lt $ncols; $c++) {
      $fn = $fields[$c]; $val = $null
      if ($r -and ($r.PSObject.Properties.Name -contains $fn)) { $val = $r.$fn }
      $fv = Format-Value $val
      $grid[($i + 2), $c] = $fv
      if ($fv -is [string] -and $fv.Contains("`n")) { $hasNL = $true }
    }
  }

  # write CSV
  $sb = New-Object System.Text.StringBuilder
  for ($rr = 0; $rr -lt $nrows; $rr++) {
    $row = @()
    for ($c = 0; $c -lt $ncols; $c++) {
      $v = $grid[$rr, $c]
      if ($null -eq $v) { $row += '""' } else { $row += '"' + (("$(($v))" -replace '"', '""') -replace "`r?`n", ' | ') + '"' }
    }
    [void]$sb.AppendLine($row -join ',')
  }
  [System.IO.File]::WriteAllText("$csvDir\$name.csv", $sb.ToString(), (New-Object System.Text.UTF8Encoding $true))

  $allTables.Add([pscustomobject]@{ Name = $name; Grid = $grid; Rows = $nrows; Cols = $ncols; Records = $records.Count; HasNL = $hasNL })
  Write-Output ("CSV  {0,-22} rows={1,-5} cols={2} multiline={3}" -f $name, $records.Count, $ncols, $hasNL)
}

Write-Output ""
Write-Output "===== Phase 1 done. Building XLSX with Chinese headers + expanded nested fields... ====="
Write-Output ""

# ---------- Phase 2: Excel COM ----------
$xlsxPath = "$excelDir\GameJsonCfg_tables.xlsx"
if (Test-Path $xlsxPath) { Remove-Item $xlsxPath -Force }
$excel = $null; $wb = $null
try {
  $excel = New-Object -ComObject Excel.Application
  $excel.DisplayAlerts = $false; $excel.Visible = $false; $excel.ScreenUpdating = $false
  $wb = $excel.Workbooks.Add()
  while ($wb.Worksheets.Count -gt 1) { $wb.Worksheets.Item($wb.Worksheets.Count).Delete() }
  $idx = 0
  foreach ($t in $allTables) {
    $idx++
    if ($idx -eq 1) { $ws = $wb.Worksheets.Item(1) } else { $ws = $wb.Worksheets.Add([System.Reflection.Missing]::Value, $wb.Worksheets.Item($wb.Worksheets.Count)) }
    $sheetName = $t.Name; if ($sheetName.Length -gt 31) { $sheetName = $sheetName.Substring(0, 31) }
    $ws.Name = ($sheetName -replace '[\[\]\:\*\?\/\\]', '_')
    $nrows = $t.Rows; $ncols = $t.Cols
    $range = $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item($nrows, $ncols))
    $range.Value2 = $t.Grid
    # Row1 English header (bold, green), Row2 Chinese (bold, light yellow)
    $r1 = $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item(1, $ncols)); $r1.Font.Bold = $true; $r1.Interior.Color = 13434828
    $r2 = $ws.Range($ws.Cells.Item(2, 1), $ws.Cells.Item(2, $ncols)); $r2.Font.Bold = $true; $r2.Interior.Color = 13421619; $r2.Font.Color = 8355711
    if ($t.HasNL) { $ws.UsedRange.WrapText = $true }
    try { $ws.UsedRange.EntireColumn.AutoFit() | Out-Null } catch {}
    # freeze top 2 rows
    try { $ws.Select(); $excel.ActiveWindow.SplitRow = 2; $excel.ActiveWindow.FreezePanes = $true } catch {}
    Write-Output ("Sheet {0,2}/53 {1,-22} rows={2,-5} cols={3} nl={4}" -f $idx, $t.Name, $t.Records, $ncols, $t.HasNL)
  }
  $wb.SaveAs($xlsxPath, 51); $wb.Close($false)
  Write-Output ""; Write-Output "===== XLSX saved: $xlsxPath ====="
}
finally {
  if ($wb) { try { $wb.Close($false) } catch {} }
  if ($excel) { try { $excel.Quit() } catch {} }
  if ($wb) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($wb) | Out-Null }
  if ($excel) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null }
  [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}
