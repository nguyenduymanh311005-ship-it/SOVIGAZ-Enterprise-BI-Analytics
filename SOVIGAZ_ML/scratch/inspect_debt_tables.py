import os
import pandas as pd

output_lines = []

for root, dirs, files in os.walk('.'):
    for f in files:
        if f in ['Fact_AnalyticsDebit.csv', 'DM_AccountObjectDebt.csv', 'customer_credit_snapshot_20260731.parquet']:
            fpath = os.path.join(root, f)
            output_lines.append(f"=== Found {f} at: {fpath} ===")
            try:
                if f.endswith('.csv'):
                    df = pd.read_csv(fpath)
                else:
                    df = pd.read_parquet(fpath)
                output_lines.append(f"Shape: {df.shape}")
                output_lines.append(f"Columns: {list(df.columns)}")
                date_cols = [c for c in df.columns if any(k in c.lower() for k in ['date', 'time', 'ngay', 'year', 'month', 'period', 'snapshot'])]
                output_lines.append(f"Date/time columns: {date_cols}")
                for dc in date_cols:
                    output_lines.append(f"  {dc}: unique={df[dc].nunique()}, min={df[dc].min()}, max={df[dc].max()}, sample={list(df[dc].dropna().unique()[:5])}")
                output_lines.append(f"First 2 rows:")
                for r in df.head(2).to_dict(orient='records'):
                    output_lines.append(str(r))
            except Exception as e:
                output_lines.append(f"Error: {e}")
            output_lines.append("\n" + "="*60 + "\n")

with open('SOVIGAZ_ML/scratch/debt_inspection.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print("Saved inspection to SOVIGAZ_ML/scratch/debt_inspection.txt successfully.")
