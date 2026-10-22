import os
import json
import pandas as pd

for root, dirs, files in os.walk('.'):
    for f in files:
        if f == 'Fact_AnalyticsDebit.csv' and 'Data ETL' in root:
            debit_path = os.path.join(root, f)

df = pd.read_csv(debit_path)

acc_summary = df.groupby('Account').agg(
    rows=('Amount', 'count'),
    customers=('AccountObjectCode', 'nunique'),
    total_amount=('Amount', 'sum'),
    min_amount=('Amount', 'min'),
    max_amount=('Amount', 'max')
).reset_index()

records = []
for r in acc_summary.to_dict(orient='records'):
    records.append({k: (int(v) if isinstance(v, (int, pd.Int64Dtype)) else (float(v) if isinstance(v, float) else str(v))) for k, v in r.items()})

# Check specifically Account 131 (Phải thu của khách hàng)
df_131 = df[df['Account'] == 131]
desc_131 = df_131.groupby('DebtDescription').agg(
    rows=('Amount', 'count'),
    customers=('AccountObjectCode', 'nunique'),
    total_amount=('Amount', 'sum')
).reset_index()

with open('SOVIGAZ_ML/scratch/inspect_accounts_debit.txt', 'w', encoding='utf-8') as out_f:
    out_f.write("Accounts in Fact_AnalyticsDebit:\n")
    for r in records:
        out_f.write(str(r) + "\n")
    
    out_f.write("\nAccount 131 details:\n")
    out_f.write(f"Rows: {len(df_131)}\n")
    out_f.write(f"Unique customers: {df_131['AccountObjectCode'].nunique()}\n")
    out_f.write(f"Total Amount: {df_131['Amount'].sum()}\n")
    
    out_f.write("\nAccount 131 by DebtDescription:\n")
    for r in desc_131.to_dict(orient='records'):
        out_f.write(str(r) + "\n")

print("Saved output to SOVIGAZ_ML/scratch/inspect_accounts_debit.txt")
