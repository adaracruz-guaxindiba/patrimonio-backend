# PowerShell script to fix ES module imports by adding .js extensions
$distPath = ".\dist"

# Get all .js files in the dist directory
$jsFiles = Get-ChildItem -Path $distPath -Filter "*.js" -Recurse

foreach ($file in $jsFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace import statements that don't have .js extension
    # Pattern: import ... from './path' or import ... from '../path' (but not already ending with .js)
    $pattern = "import\s+.*?\s+from\s+['`"](\.\.?\/[^'`"]*?)(?<!\.js)['`"]"
    $replacement = {
        param($match)
        $importPath = $match.Groups[1].Value
        return $match.Value -replace [regex]::Escape($importPath), "$importPath.js"
    }
    
    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    # Only write if content changed
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "  Fixed imports in: $($file.Name)"
    } else {
        Write-Host "  No changes needed: $($file.Name)"
    }
}

Write-Host "Import fixing completed!"

