param([string]$ItemsFile)
Add-Type -AssemblyName System.Drawing
$manifest=Get-Content -LiteralPath 'assets/new-image-manifest.json' -Raw | ConvertFrom-Json -AsHashtable
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$parameters=[System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0]=[System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]90)
foreach($item in (Get-Content -LiteralPath $ItemsFile -Raw | ConvertFrom-Json)){
 $parent=Split-Path $item.asset -Parent
 New-Item -ItemType Directory -Path $parent -Force | Out-Null
 $img=[System.Drawing.Image]::FromFile($item.path)
 $img.Save((Join-Path (Get-Location) $item.asset),$encoder,$parameters)
 $manifest[$item.id]=@{asset=$item.asset;width=$img.Width;height=$img.Height;columns=$item.columns;rows=$item.rows}
 $img.Dispose()
}
$manifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath 'assets/new-image-manifest.json' -Encoding utf8
Write-Output "$($manifest.Count) training assets staged."
