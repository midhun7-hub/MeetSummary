Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\meeting\public\logo.png")
$bmp = New-Object System.Drawing.Bitmap($img)
$p1 = $bmp.GetPixel(0, 0)
$p2 = $bmp.GetPixel($bmp.Width - 1, 0)
$p3 = $bmp.GetPixel(0, $bmp.Height - 1)
$p4 = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1)
$res = "P1: #{0:X2}{1:X2}{2:X2}`r`nP2: #{1:X2}{3:X2}{4:X2}`r`nP3: #{2:X2}{5:X2}{6:X2}`r`nP4: #{3:X2}{6:X2}{7:X2}" -f $p1.R, $p1.G, $p1.B, $p2.R, $p2.G, $p2.B, $p3.R, $p3.G, $p3.B, $p4.R, $p4.G, $p4.B
$res | Out-File -FilePath "d:\meeting\logo_colors.txt"
$bmp.Dispose()
$img.Dispose()
