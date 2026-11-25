$ErrorActionPreference = 'Continue'
$srcDir = "C:\Users\huang\AppData\Roaming\Tencent\xwechat\radium\users\67afec420de5861a4f6bd77427917610\applet\packages\wx244b1cb66c8ac4b4\37"
$dist = "d:\project\mp-wxapkg-unpacker\duck_unpacked"
Set-Location "d:\project\mp-wxapkg-unpacker"

$files = Get-ChildItem $srcDir -Filter "*.wxapkg" | Sort-Object Name
$total = $files.Count
$i = 0
foreach ($f in $files) {
    $i++
    Write-Host ""
    Write-Host "[$i/$total] 解密解包: $($f.Name) ($([math]::Round($f.Length/1KB)) KB)"
    node index.js decrypt -s $f.FullName -d $dist 2>&1 | Select-Object -Last 1
}
Write-Host ""
Write-Host "=== 全部完成 ==="
