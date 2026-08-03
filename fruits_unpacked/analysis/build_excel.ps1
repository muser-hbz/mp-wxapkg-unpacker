$ErrorActionPreference = 'Stop'
$csvDir = 'd:\project\mp-wxapkg-unpacker\fruits_unpacked\cfg_csv'
$xlsxPath = 'd:\project\mp-wxapkg-unpacker\fruits_unpacked\cfg_csv\GameConfig_tables.xlsx'
$csvFiles = Get-ChildItem -Path $csvDir -Filter '*.csv' | Sort-Object Name
Write-Host "Found $($csvFiles.Count) CSV files"

$excelAvailable = $false
try {
    $excel = New-Object -ComObject Excel.Application
    $excelAvailable = $true
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    Write-Host "Using Excel COM automation"
}
catch {
    Write-Host "Excel COM not available"
}

if ($excelAvailable) {
    try {
        $workbook = $excel.Workbooks.Add()
        while ($workbook.Sheets.Count -gt 1) {
            $workbook.Sheets.Item($workbook.Sheets.Count).Delete()
        }
        $firstSheet = $true
        foreach ($csvFile in $csvFiles) {
            $sheetName = [System.IO.Path]::GetFileNameWithoutExtension($csvFile.Name)
            if ($sheetName.Length -gt 31) { $sheetName = $sheetName.Substring(0, 31) }
            if ($firstSheet) {
                $sheet = $workbook.Sheets.Item(1)
                $sheet.Name = $sheetName
                $firstSheet = $false
            }
            else {
                $sheet = $workbook.Sheets.Add([Type]::Missing, $workbook.Sheets.Item($workbook.Sheets.Count))
                $sheet.Name = $sheetName
            }
            Write-Host "  Processing: $sheetName"
            $lines = Get-Content $csvFile.FullName -Encoding UTF8
            for ($rowIdx = 0; $rowIdx -lt $lines.Count; $rowIdx++) {
                $line = $lines[$rowIdx]
                if ($rowIdx -eq 0) { $line = $line -replace "^\xEF\xBB\xBF", "" }
                $fields = @()
                $cur = ''
                $inQuote = $false
                for ($ci = 0; $ci -lt $line.Length; $ci++) {
                    $ch = $line[$ci]
                    if ($inQuote) {
                        if ($ch -eq '"') {
                            if ($ci + 1 -lt $line.Length -and $line[$ci + 1] -eq '"') { $cur += '"'; $ci++ }
                            else { $inQuote = $false }
                        }
                        else { $cur += $ch }
                    }
                    else {
                        if ($ch -eq '"') { $inQuote = $true }
                        elseif ($ch -eq ',') { $fields += $cur; $cur = '' }
                        else { $cur += $ch }
                    }
                }
                $fields += $cur
                for ($colIdx = 0; $colIdx -lt $fields.Count; $colIdx++) {
                    $sheet.Cells.Item($rowIdx + 1, $colIdx + 1) = $fields[$colIdx]
                }
            }
            $usedRange = $sheet.UsedRange
            $colCount = $usedRange.Columns.Count
            if ($colCount -gt 0) {
                $lastCol = [char](64 + $colCount)
                $headerRange = $sheet.Range("A1:${lastCol}1")
                $headerRange.Font.Bold = $true
                $headerRange.Interior.Color = 13434828
                if ($lines.Count -gt 1) {
                    $cnRange = $sheet.Range("A2:${lastCol}2")
                    $cnRange.Font.Bold = $true
                    $cnRange.Interior.Color = 10092544
                }
            }
            $usedRange.EntireColumn.AutoFit() | Out-Null
        }
        $workbook.SaveAs($xlsxPath, 51)
        $workbook.Close()
        $excel.Quit()
        Write-Host ""
        Write-Host "Excel workbook generated: $xlsxPath"
    }
    catch {
        Write-Host "Excel error: $_"
        if ($excel) { $excel.Quit() }
        $excelAvailable = $false
    }
}

if (-not $excelAvailable) {
    $summaryPath = 'd:\project\mp-wxapkg-unpacker\fruits_unpacked\cfg_csv\ALL_TABLES_SUMMARY.csv'
    $summaryLines = @()
    $summaryLines += '"TableName","RowCount","FileName"'
    foreach ($csvFile in $csvFiles) {
        $lineCount = (Get-Content $csvFile.FullName -Encoding UTF8).Count - 2
        $summaryLines += "`"$($csvFile.BaseName)`",`"$lineCount`",`"$($csvFile.Name)`""
    }
    $summaryLines | Out-File -FilePath $summaryPath -Encoding UTF8
    Write-Host "Summary generated: $summaryPath"
}

if ($excelAvailable) {
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
