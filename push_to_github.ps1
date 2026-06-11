# GitHub推送脚本
# 当网络可以访问GitHub时，在项目根目录运行此脚本

# 设置Git路径
$git = "C:\Program Files\Git\bin\git.exe"

Write-Host "正在推送到GitHub..." -ForegroundColor Green

# 推送到远程仓库
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "推送成功！" -ForegroundColor Green
    Write-Host "请访问 https://github.com/L7k7/-CampusFindl 验证代码" -ForegroundColor Cyan
} else {
    Write-Host "推送失败，请检查网络连接" -ForegroundColor Red
}
