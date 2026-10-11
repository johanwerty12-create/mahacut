Add-Type -AssemblyName System.Drawing
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$parameters=[System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0]=[System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]80)
$files=Get-ChildItem assets/haircuts,assets/fades,assets/tools -Recurse -Filter '*.jpg' -File
$saved=0
foreach($file in $files){
 $image=[System.Drawing.Image]::FromFile($file.FullName)
 $scale=[Math]::Min([double]1,[double](1280.0/[double]$image.Width))
 $width=[int][Math]::Round($image.Width*$scale);$height=[int][Math]::Round($image.Height*$scale)
 if($width -ne $image.Width -or $height -ne $image.Height){$bitmap=[System.Drawing.Bitmap]::new($width,$height);$graphics=[System.Drawing.Graphics]::FromImage($bitmap);$graphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$graphics.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality;$graphics.DrawImage($image,0,0,$width,$height);$image.Dispose();$bitmap.Save($file.FullName,$encoder,$parameters);$bitmap.Dispose();$graphics.Dispose();$saved++}
 else {$image.Dispose();$image=[System.Drawing.Image]::FromFile($file.FullName);$image.Save($file.FullName+'.optimized',$encoder,$parameters);$image.Dispose();Move-Item -LiteralPath ($file.FullName+'.optimized') -Destination $file.FullName -Force}
}
Write-Output "Optimized $($files.Count) generated image sheets; resized $saved to a maximum 1280px width." 

