Write-Host "=== Testing News Portal Real-Time Connection ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET
Write-Host "   Backend Status: $($health.status)" -ForegroundColor Green

Write-Host ""
Write-Host "2. Fetching all news from database..." -ForegroundColor Yellow
$news = Invoke-RestMethod -Uri "http://localhost:3002/news" -Method GET
Write-Host "   Found $($news.Count) news articles" -ForegroundColor Green
foreach ($item in $news) {
    Write-Host "     - ID: $($item.id) | Title: $($item.title)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "3. Fetching users from database..." -ForegroundColor Yellow
$users = Invoke-RestMethod -Uri "http://localhost:3002/users" -Method GET
Write-Host "   Found $($users.Count) users" -ForegroundColor Green
foreach ($user in $users) {
    Write-Host "     - ID: $($user.id) | Name: $($user.name)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "4. Creating a new test article..." -ForegroundColor Yellow
$newNews = @{
    title = "Real-Time Test - $(Get-Date -Format 'HH:mm:ss')"
    body = "This is a test article to verify real-time database updates."
    author_id = 1
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:3002/news" -Method POST -Body $newNews -ContentType "application/json"
Write-Host "   Created article ID: $($created.id)" -ForegroundColor Green
$testId = $created.id

Write-Host ""
Write-Host "5. Verifying article in database..." -ForegroundColor Yellow
$article = Invoke-RestMethod -Uri "http://localhost:3002/news/$testId" -Method GET
Write-Host "   Article found: $($article.title)" -ForegroundColor Green

Write-Host ""
Write-Host "6. Deleting test article..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3002/news/$testId`?author_id=1" -Method DELETE
Write-Host "   Test article deleted" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Tests Complete ===" -ForegroundColor Cyan
Write-Host "Backend (http://localhost:3002) and Database are working in real-time!" -ForegroundColor Green
Write-Host "Frontend is running on http://localhost:3001" -ForegroundColor Green
