<#
.SYNOPSIS
    تحميل جميع صور قوالب المتاجر من Unsplash وتنظيمها في مجلدات
.DESCRIPTION
    يستخرج معرّفات الصور من ملفات TypeScript الخاصة بكل قالب،
    ويحمّلها من Unsplash بدقة 1200px ويحفظها في:
    f:\rvios-next\template-images\<store-name>\<img-id>.jpg
.NOTES
    - الصور من Unsplash (https://images.unsplash.com)
    - كل مجلد باسم المتجر/القالب
    - يتخطى الصور المحمّلة مسبقاً
#>

$ErrorActionPreference = "Continue"
$BaseOutput = "f:\rvios-next\template-images"
$Width = 1200

$StoreImages = [ordered]@{

    "cx-asal" = @(
        "1587049352846-4a222e784d38",
        "1558642452-9d2a7deb7f62",
        "1471943311424-646960669fbc"
    )
    "cx-dahab" = @(
        "1515562141207-7a88fb7ce338",
        "1599643478518-a784e5dc4c8f",
        "1602173574767-37ac01994b2a",
        "1605100804763-247f67b3557e",
        "1611591437281-460bfbe1220a",
        "1617038220319-276d3cfab638"
    )
    "cx-khatwa" = @(
        "1542291026-7eec264c27ff",
        "1595950653106-6c9ebd614d3a",
        "1600185365926-3a2ce3cdb9eb",
        "1606107557195-0e29a4b5b4aa"
    )
    "cx-maida" = @(
        "1504674900247-0877df9cc836",
        "1512621776951-a57141f2eefd",
        "1540189549336-e6e99c3679fe",
        "1546069901-ba9599a7e63c",
        "1555939594-58d7cb561ad1",
        "1568901346375-23c9450c58cd"
    )
    "cx-marah" = @(
        "1515488042361-ee00e0ddd4e4",
        "1558060370-d644479cb6f7",
        "1566576912321-d58ddd7a6088",
        "1587654780291-39c9404d746b",
        "1596461404969-9ae70f2830c1"
    )
    "cx-nabd" = @(
        "1517836357463-d25dfeac3438",
        "1517963879433-6ad2b056d712",
        "1534438327276-14e5300c3a48",
        "1542291026-7eec264c27ff",
        "1571019613454-1cb2f99b2d8b",
        "1584735935682-2f2b69dff9d2",
        "1600185365926-3a2ce3cdb9eb"
    )
    "cx-nada" = @(
        "1556228578-8c89e6adf883",
        "1571781926291-c477ebfd024b",
        "1598440947619-2c35fc9aa908",
        "1608248543803-ba4f8c70ae0b",
        "1612817288484-6f916006741a",
        "1620916566398-39f1143ab7be"
    )
    "cx-qita" = @(
        "1449426468159-d96dbf08f19f",
        "1486262715619-67b85e0b08d3",
        "1492144534655-ae79c964c9d7",
        "1558981806-ec527fa84c39",
        "1619642751034-765dfdf7c58e"
    )
    "cx-satr" = @(
        "1434389677669-e08b4cac3105",
        "1485968579580-b6d095142e6e",
        "1490481651871-ab68de25d43d",
        "1496747611176-843222e1e57c",
        "1509631179647-0177331693ae",
        "1529139574466-a303027c1d8b",
        "1539109136881-3be0616acf4b"
    )
    "cx-turath" = @(
        "1493106641515-6b5631de4bb9",
        "1565193566173-7a0ee3dbe261",
        "1578749556568-bc2c40e68b61",
        "1610701596007-11502861dcfa"
    )
    "cx-waraq" = @(
        "1495446815901-a7297e633e8d",
        "1512820790803-83ca734da794",
        "1519682337058-a94d519337bc",
        "1531346878377-a5be20888e57",
        "1532012197267-da84d127e765",
        "1544947950-fa07a98d237f"
    )
    "cx-zahr" = @(
        "1416879595882-3373a0480b5b",
        "1459411552884-841db9b3cc2a",
        "1463936575829-25148e1db1b8",
        "1485955900006-10f4d324d411",
        "1487070183336-b863922373d4",
        "1490750967868-88aa4486c946"
    )
    "bayt" = @(
        "1555041469-a586c61ea9bc",
        "1567538096630-e0c55bd6374c",
        "1507473885765-e6ed057f782c",
        "1532372320572-cda25653a26d",
        "1578500494198-246f612d3b3d",
        "1503602642458-232111445657",
        "1513506003901-1e6a229e2d15",
        "1600166898405-da9535204843"
    )
    "essential" = @(
        "1559056199-641a0ac8b55e",
        "1447933601403-0c6688de566e",
        "1587049352846-4a222e784d38",
        "1558642452-9d2a7deb7f62",
        "1495474472287-4d71bcdd2085",
        "1497935586351-b67a49e012bf"
    )
    "maison" = @(
        "1617137968427-85924c800a22",
        "1591047139829-d91aecb6caea",
        "1596755094514-f87e34085b2c",
        "1523275335684-37898b6baf30",
        "1614252235316-8c857d38b5f4",
        "1572635196237-14b3f281503f",
        "1521572163474-6864f9cf17ab",
        "1548036328-c9fa89d128fa",
        "1507679799987-c73779587ccf",
        "1500648767791-00dcc994a43e",
        "1519085360753-af0119f7cbe7",
        "1488161628813-04466f872be2",
        "1506794778202-cad84cf45f1d",
        "1552374196-1ab2a1c593e8"
    )
    "noir" = @(
        "1594035910387-fea47794261f",
        "1541643600914-78b084683601",
        "1585386959984-a4155224a1ad",
        "1608571423902-eed4a5ad8108",
        "1549465220-1a8b9238cd48",
        "1592945403244-b3fbafd7f539",
        "1590736969955-71cc94901144",
        "1547887538-e3a2f32cb1cc"
    )
    "sukkar" = @(
        "1578985545062-69928b1d9587",
        "1499636136210-6f4ee915583e",
        "1551024601-bec78aea704b",
        "1533134242443-d4fd215305ad",
        "1558961363-fa8fdf82db35",
        "1486427944299-d1955d23e34d",
        "1527515545081-5db817172677",
        "1565958011703-44f9829ba187"
    )
    "volt" = @(
        "1505740420928-5e560c06d30e",
        "1546868871-7041f2a55e12",
        "1606220945770-b5b6c2c55bf1",
        "1517336714731-489689fd1ca8",
        "1526170375885-4d8ecf77b99f",
        "1583394838336-acd977736f90",
        "1511707171634-5f897ff02aa9",
        "1516035069371-29a1b244cc32"
    )
}

# ─── دالة تحميل صورة واحدة ───────────────────────────────────────────────
function Download-Image {
    param([string]$ImgId, [string]$DestDir)

    $OutFile = Join-Path $DestDir "$ImgId.jpg"

    if (Test-Path $OutFile) {
        Write-Host "  ⏭  موجودة: $ImgId" -ForegroundColor DarkGray
        return "skip"
    }

    $Url = "https://images.unsplash.com/photo-$ImgId`?w=$Width&q=85&auto=format&fit=crop"

    try {
        Invoke-WebRequest -Uri $Url -OutFile $OutFile -TimeoutSec 30 -ErrorAction Stop
        $SizeKb = [math]::Round((Get-Item $OutFile).Length / 1024)
        Write-Host "  ✅ $ImgId  ($SizeKb KB)" -ForegroundColor Green
        return "ok"
    }
    catch {
        Write-Host "  ❌ فشل: $ImgId  →  $($_.Exception.Message)" -ForegroundColor Red
        if (Test-Path $OutFile) { Remove-Item $OutFile -Force }
        return "fail"
    }
}

# ─── التنفيذ ──────────────────────────────────────────────────────────────
$TotalImages = ($StoreImages.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
$Downloaded  = 0; $Skipped = 0; $Failed = 0

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📥 تحميل صور قوالب المتاجر — $($StoreImages.Count) قالب / $TotalImages صورة" -ForegroundColor Cyan
Write-Host "  📁 $BaseOutput" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($Store in $StoreImages.Keys) {
    $Imgs     = $StoreImages[$Store]
    $StoreDir = Join-Path $BaseOutput $Store

    if (-not (Test-Path $StoreDir)) {
        New-Item -ItemType Directory -Path $StoreDir -Force | Out-Null
    }

    Write-Host "📂 $Store  ($($Imgs.Count) صور)" -ForegroundColor Yellow

    foreach ($ImgId in $Imgs) {
        $Result = Download-Image -ImgId $ImgId -DestDir $StoreDir
        switch ($Result) {
            "ok"   { $Downloaded++ }
            "skip" { $Skipped++ }
            "fail" { $Failed++ }
        }
    }
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ محمّلة جديدة  : $Downloaded" -ForegroundColor Green
Write-Host "  ⏭  موجودة مسبقاً : $Skipped"   -ForegroundColor DarkGray
Write-Host "  ❌ فاشلة         : $Failed"     -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
