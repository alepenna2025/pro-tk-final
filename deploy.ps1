# Script de Deploy Automatico para GitHub
# Execute este script no PowerShell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deploy Social Media Poster" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuracoes
$username = "alepenna2025"
$repoName = "social-media-poster"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "1. Verificando Git..." -ForegroundColor Yellow
git --version

Write-Host ""
Write-Host "2. Criando repositorio no GitHub..." -ForegroundColor Yellow
Write-Host "   Acesse: https://github.com/new" -ForegroundColor Green
Write-Host "   Nome do repositorio: $repoName" -ForegroundColor Green
Write-Host "   Deixe como Public" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER apos criar o repositorio"

Write-Host ""
Write-Host "3. Enviando codigo para GitHub..." -ForegroundColor Yellow

# Verificar se tem commits
$hasCommits = git rev-parse --verify HEAD 2>$null
if (-not $hasCommits) {
    Write-Host "   Criando commit inicial..." -ForegroundColor Gray
    git add .
    git commit -m "feat: Initial commit - Social Media Poster"
}

# Configurar branch main
git branch -M main

# Fazer push
Write-Host "   Fazendo push..." -ForegroundColor Gray
Write-Host "   Usuario: $username" -ForegroundColor Gray
Write-Host "   Senha: Use seu Personal Access Token" -ForegroundColor Gray
Write-Host ""
Write-Host "   Como criar token:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   2. Generate new token (classic)" -ForegroundColor White
Write-Host "   3. Selecione 'repo' (todas as opcoes)" -ForegroundColor White
Write-Host "   4. Generate token" -ForegroundColor White
Write-Host "   5. Copie o token e use como senha" -ForegroundColor White
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Codigo enviado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "4. Agora vamos fazer deploy na Vercel..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Acesse: https://vercel.com/new" -ForegroundColor Cyan
    Write-Host "   1. Faca login com GitHub" -ForegroundColor White
    Write-Host "   2. Importe o repositorio: $username/$repoName" -ForegroundColor White
    Write-Host "   3. Clique em Deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "✓ Seu app estara online em 2-3 minutos!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Link do repositorio:" -ForegroundColor Cyan
    Write-Host "https://github.com/$username/$repoName" -ForegroundColor White
    
    # Abrir no navegador
    Start-Process "https://github.com/$username/$repoName"
    Start-Sleep 2
    Start-Process "https://vercel.com/new"
} else {
    Write-Host ""
    Write-Host "✗ Erro ao enviar codigo" -ForegroundColor Red
    Write-Host "   Verifique suas credenciais e tente novamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Read-Host "Pressione ENTER para fechar"
