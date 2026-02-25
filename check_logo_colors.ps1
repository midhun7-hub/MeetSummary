Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\meeting\public\logo.png")
$bmp = New-Object System.Drawing.Bitmap($img)
$pixel1 = $bmp.GetPixel(0, 0)
$pixel2 = $bmp.GetPixel([int]($bmp.Width / 2), 5)
$pixel3 = $bmp.GetPixel(5, [int]($bmp.Height / 2))
"Pixel 1 (0,0): #{0:X2}{1:X2}{2:X2}" -f $pixel1.R, $pixel1.G, $pixel1.B
"Pixel 2 (mid,5): #{0:X2}{1:X2}{2:X2}" -f $pixel2.R, $pixel2.G, $pixel2.B
"Pixel 3 (5,mid): #{0:X2}{1:X2}{2:X2}" -f $pixel3.R, $pixel3.G, $pixel3.B
$bmp.Dispose()
$img.Dispose()
