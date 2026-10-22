import pandas as pd
import json

df = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_credit_snapshot_20260731.parquet')

res = {
    'shape': df.shape,
    'columns': list(df.columns),
    'total_receivable_debt': float(df['total_receivable_debt'].sum()),
    'total_overdue_amount': float(df['total_overdue_amount'].sum()),
    'total_current_amount': float(df['total_current_amount'].sum()),
    'overdue_ratio_mean': float(df['overdue_ratio'].mean()),
    'top_5': df.sort_values('total_receivable_debt', ascending=False)[
        ['AccountObjectCode', 'total_receivable_debt', 'total_overdue_amount', 'overdue_ratio']
    ].head(5).to_dict(orient='records')
}

with open('SOVIGAZ_ML/scratch/credit_snapshot_metrics.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=2)

print("Saved credit snapshot metrics successfully.")
