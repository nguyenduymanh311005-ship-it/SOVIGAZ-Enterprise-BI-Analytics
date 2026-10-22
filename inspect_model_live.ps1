$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files\Microsoft Power BI Desktop\bin\Microsoft.PowerBI.AdomdClient.dll')
$connType = $asm.GetType('Microsoft.AnalysisServices.AdomdClient.AdomdConnection')
$conn = [Activator]::CreateInstance($connType, "Data Source=localhost:63402;")
$conn.Open()

function Execute-Query($query) {
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $query
    $adapterType = $asm.GetType('Microsoft.AnalysisServices.AdomdClient.AdomdDataAdapter')
    $adapter = [Activator]::CreateInstance($adapterType, $cmd)
    $dt = New-Object System.Data.DataTable
    $adapter.Fill($dt) | Out-Null
    return $dt
}

Write-Host "=================== 1. LIVE TABLES ==================="
$tables = Execute-Query "SELECT [ID], [Name], [IsHidden] FROM `$SYSTEM.TMSCHEMA_TABLES"
$tableMap = @{}
foreach ($t in $tables.Rows) {
    $tableMap[$t["ID"]] = $t["Name"]
    if (-not $t["IsHidden"]) {
        Write-Host " - $($t['Name']) (ID: $($t['ID']))"
    }
}

Write-Host "`n=================== 2. LIVE COLUMNS ==================="
$cols = Execute-Query "SELECT [ID], [TableID], [ExplicitName] FROM `$SYSTEM.TMSCHEMA_COLUMNS"
$colMap = @{}
foreach ($c in $cols.Rows) {
    $colMap[$c["ID"]] = $c["ExplicitName"]
}
Write-Host "Total columns loaded: $($cols.Rows.Count)"

Write-Host "`n=================== 3. LIVE RELATIONSHIPS ==================="
$rels = Execute-Query "SELECT [ID], [FromTableID], [FromColumnID], [ToTableID], [ToColumnID], [IsActive], [CrossFilteringBehavior], [FromCardinality], [ToCardinality] FROM `$SYSTEM.TMSCHEMA_RELATIONSHIPS"
Write-Host "Total relationships: $($rels.Rows.Count)"
foreach ($r in $rels.Rows) {
    $fromT = $tableMap[$r["FromTableID"]]
    $fromC = $colMap[$r["FromColumnID"]]
    $toT = $tableMap[$r["ToTableID"]]
    $toC = $colMap[$r["ToColumnID"]]
    $active = if ($r["IsActive"] -eq 1 -or $r["IsActive"] -eq $true) { "ACTIVE" } else { "INACTIVE" }
    $dir = if ($r["CrossFilteringBehavior"] -eq 2) { "Both" } else { "Single" }
    Write-Host "$active | $fromT [$fromC] -> $toT [$toC] | Filter: $dir"
}

Write-Host "`n=================== 4. LIVE MEASURES ==================="
$measures = Execute-Query "SELECT [ID], [TableID], [Name], [Expression] FROM `$SYSTEM.TMSCHEMA_MEASURES"
Write-Host "Total measures: $($measures.Rows.Count)"
foreach ($m in $measures.Rows) {
    $tName = $tableMap[$m["TableID"]]
    Write-Host "[$tName] - [$($m['Name'])]"
}

$conn.Close()
