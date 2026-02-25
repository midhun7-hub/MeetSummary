Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\meeting\public\logo.png")
$bmp = New-Object System.Drawing.Bitmap($img)
"Format: $($img.PixelFormat)"
"Size: $($img.Width)x$($img.Height)"
$p1 = $bmp.GetPixel(0, 0)
$p2 = $bmp.GetPixel($bmp.Width - 1, 0)
$p3 = $bmp.GetPixel(0, $bmp.Height - 1)
$p4 = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1)
$p5 = $bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2))

"P1 (0,0): R:$($p1.R) G:$($p1.G) B:$($p1.B) A:$($p1.A) - #{0:X2}{1:X2}{2:X2}" -f $p1.R, $p1.G, $p1.B
"P2 (W,0): R:$($p2.R) G:$($p2.G) B:$($p2.B) A:$($p2.A) - #{0:X2}{1:X2}{2:X2}" -f $p2.R, $p2.G, $p2.B
"P3 (0,H): R:$($p3.R) G:$($p3.G) B:$($p3.B) A:$($p3.A) - #{0:X2}{1:X2}{2:X2}" -f $p3.R, $p3.G, $p3.B
"P4 (W,H): R:$($p4.R) G:$($p4.G) B:$($p4.B) A:$($p4.A) - #{0:X2}{1:X2}{2:X2}" -f $p4.R, $p4.G, $p4.B
"P5 (Mid): R:$($p5.R) G:$($p5.G) B:$($p5.B) A:$($p5.A) - #{0:X2}{1:X2}{2:X2}" -f $p5.R, $p5.G, $p5.B

$bmp.Dispose()
$img.Dispose()
