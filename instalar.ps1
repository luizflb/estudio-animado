# Instalador do Estúdio Animado (Windows).
# Uso:  powershell -ExecutionPolicy Bypass -File instalar.ps1 [-WhisperX] [-SemSkills] [-Raiz <pasta>]
#   -WhisperX : instala também o WhisperX (transcrição mais precisa; só vale em PC com placa NVIDIA; download grande)
#   -SemSkills: não copia as skills para ~/.claude/skills (use quando instalou o pacote como plugin)
#   -Raiz     : pasta-base no lugar do seu usuário (para testes)
param([switch]$WhisperX, [switch]$SemSkills, [string]$Raiz = $HOME)
$ErrorActionPreference = "Stop"
$Pac = $PSScriptRoot
$Dest = Join-Path $Raiz ".animador"
Write-Host "Estúdio Animado -> $Dest"

# 1. Ferramentas: scripts, motor e guias são atualizados; o perfil da pessoa nunca é sobrescrito
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
foreach ($d in @("scripts", "guias")) {
  Copy-Item -Recurse -Force (Join-Path $Pac "ferramentas\$d") $Dest
}
$PerfOrig = Join-Path $Pac "ferramentas\perfil"
Get-ChildItem -Recurse -File $PerfOrig | ForEach-Object {
  $rel = $_.FullName.Substring($PerfOrig.Length + 1)
  $alvo = Join-Path (Join-Path $Dest "perfil") $rel
  $pessoal = @("estilo.js", "voz.md", "pecas\rig2\pessoas_svg_def.js") -contains $rel
  if (-not (Test-Path $alvo) -or -not $pessoal) {
    New-Item -ItemType Directory -Force -Path (Split-Path $alvo) | Out-Null
    Copy-Item -Force $_.FullName $alvo
  }
}
foreach ($d in @("perfil\referencias", "perfil\analises", "perfil\personagem", "perfil\biblioteca", "sons", "musicas")) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Dest $d) | Out-Null
}
$env_ = Join-Path $Dest ".env"
if (-not (Test-Path $env_)) { Set-Content -Encoding utf8 $env_ "# chaves (ex.: ELEVENLABS_API_KEY=...)" }

# 2. Skills
if (-not $SemSkills) {
  $sk = Join-Path $Raiz ".claude\skills"
  New-Item -ItemType Directory -Force -Path $sk | Out-Null
  Get-ChildItem (Join-Path $Pac "skills") -Directory | ForEach-Object { Copy-Item -Recurse -Force $_.FullName $sk }
  Write-Host "Skills copiadas para $sk"
}

# 3. Python próprio + bibliotecas
$py = $null
foreach ($c in @("py -3", "python", "python3")) {
  try { $v = & cmd /c "$c --version" 2>$null; if ($LASTEXITCODE -eq 0 -and $v -match "Python 3\.(1[0-9])") { $py = $c; break } } catch {}
}
if (-not $py) { Write-Host "FALTA: Python 3.10 ou mais novo (https://www.python.org/downloads/ ; marque 'Add to PATH')."; exit 1 }
$venv = Join-Path $Dest "venv"
if (-not (Test-Path (Join-Path $venv "Scripts\python.exe"))) { & cmd /c "$py -m venv `"$venv`"" }
$vpy = Join-Path $venv "Scripts\python.exe"
& $vpy -m pip install --upgrade pip --quiet
& $vpy -m pip install --quiet -r (Join-Path $Pac "ferramentas\requirements.txt")
if ($WhisperX) {
  Write-Host "Instalando WhisperX (download grande)..."
  & $vpy -m pip install --quiet whisperx
  # o whisperx puxa o PyTorch sem placa de vídeo: troca pela versão com CUDA, por último, sem mexer nas outras dependências
  & $vpy -m pip install --quiet --force-reinstall --no-deps torch torchaudio --index-url https://download.pytorch.org/whl/cu128
  & $vpy -c "import torch; print('WhisperX com placa de vídeo:', torch.cuda.is_available())"
}

# 4. Conferências
$ok = $true
function Tem($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
if (-not (Tem "ffmpeg")) { Write-Host "FALTA: ffmpeg (winget install Gyan.FFmpeg)"; $ok = $false }
if (-not (Tem "node"))   { Write-Host "FALTA: Node.js 18+ (winget install OpenJS.NodeJS.LTS) - usado pelo HyperFrames"; $ok = $false }
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Host "FALTA: Google Chrome ou Microsoft Edge (para conferir os desenhos)"; $ok = $false } else { Write-Host "Navegador: $chrome" }
if ((Tem "nvidia-smi") -and -not $WhisperX) { Write-Host "Dica: este PC tem placa NVIDIA. Para a transcrição mais precisa, rode de novo com -WhisperX." }
Write-Host ""
Write-Host "Python do pacote: $vpy"
if ($ok) { Write-Host "PRONTO. Abra o Claude Code numa pasta vazia com o nome do vídeo e digite /animador" } else { Write-Host "Instale o que falta e rode o instalador de novo." }
