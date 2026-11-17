# output.ps1
$projectPath = Get-Location
$skipDirs = @("node_modules", ".git", "dist", "build", "test-results", "playwright-report", "coverage", "logs", "temp", "tmp", "output", ".vercel")
$skipExts = @("jpg", "jpeg", "png", "gif", "bmp", "tiff", "ico", "svg", "psd", "eps", "raw", "heif", "heic")

function Get-FileContent {
    param (
        [string]$path,
        [bool]$recursive = $true
    )

    $items = Get-ChildItem -Path $path

    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            if ($item.Name -notin $skipDirs) {
                Write-Output "Directory: $($item.FullName)"
                if ($recursive) {
                    Get-FileContent -path $item.FullName
                }
            }
        } elseif ($item.Name -ne "output.txt") {
            $ext = $item.Extension.TrimStart('.')
            if ($ext -notin $skipExts) {
                Write-Output "$($item.Name)"
                $fileContent = Get-Content -Path $item.FullName -Raw
                Write-Output "`n````$ext`n$fileContent`n````"
            }
        }
    }
}

do {
    $scope = Read-Host "Print [1] root-level contents only or [2] the src/ tree?"
    if ($scope -notin @("1", "2")) {
        Write-Host "Please enter 1 or 2."
    }
} while ($scope -notin @("1", "2"))

if ($scope -eq "1") {
    Get-FileContent -path $projectPath -recursive $false > output.txt
} else {
    $srcPath = Join-Path -Path $projectPath -ChildPath "src"
    if (-not (Test-Path -Path $srcPath -PathType Container)) {
        throw "src/ directory not found."
    }
    Get-FileContent -path $srcPath > output.txt
}
