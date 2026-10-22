import os
import json
import pandas as pd
import numpy as np

# Load debt files
debit_path = None
debt_path = None
for root, dirs, files in os.walk('.'):
    for f in files:
        if f == 'Fact_AnalyticsDebit.csv' and 'Data ETL' in root:
            debit_path = os.path.join(root, f)
        elif f == 'DM_AccountObjectDebt.csv' and 'Data ETL' in root:
            debt_path = os.path.join(root, f)

df_debit = pd.read_csv(debit_path)
df_debt = pd.read_csv(debt_path)

summary = {
    'Fact_AnalyticsDebit': {
        'rows': int(len(df_debit)),
        'unique_customers': int(df_debit['AccountObjectCode'].nunique()),
        'unique_accounts': [int(x) for x in df_debit['Account'].unique()],
        'debt_types': int(df_debit['DebtType'].nunique()),
        'debt_descriptions': [str(x) for x in df_debit['DebtDescription'].unique()],
        'total_amount': float(df_debit['Amount'].sum()),
        'positive_amount': float(df_debit[df_debit['Amount'] > 0]['Amount'].sum()),
        'negative_amount': float(df_debit[df_debit['Amount'] < 0]['Amount'].sum()),
        'zero_amount': int((df_debit['Amount'] == 0).sum())
    },
    'DM_AccountObjectDebt': {
        'rows': int(len(df_debt)),
        'unique_customers': int(df_debt['AccountObjectCode'].nunique()),
        'unique_receivable_accounts': [float(x) for x in df_debt['ReceivableAccountCode'].dropna().unique()],
        'total_receiptable_debt': float(df_debt['ReceiptableDebtAmount'].sum()),
        'total_paid_amount': float(df_debt['PaidAmount'].sum()),
        'total_opening_balance': float(df_debt['OpeningBalance'].sum()),
        'total_period_amount': float(df_debt['PeriodAmount'].sum())
    }
}

# Cross check customer overlap
cust_debit = set(df_debit['AccountObjectCode'].dropna())
cust_debt = set(df_debt['AccountObjectCode'].dropna())

summary['overlap'] = {
    'debit_in_debt': len(cust_debit.intersection(cust_debt)),
    'debit_only': len(cust_debit - cust_debt),
    'debt_only': len(cust_debt - cust_debit)
}

# Breakdown of DebtDescription in Fact_AnalyticsDebit
desc_breakdown = df_debit.groupby('DebtDescription').agg(
    count=('Amount', 'count'),
    customers=('AccountObjectCode', 'nunique'),
    total_amount=('Amount', 'sum'),
    mean_amount=('Amount', 'mean'),
    min_amount=('Amount', 'min'),
    max_amount=('Amount', 'max')
).reset_index()

records = []
for r in desc_breakdown.to_dict(orient='records'):
    records.append({k: (int(v) if isinstance(v, (np.integer, int)) else (float(v) if isinstance(v, (np.floating, float)) else str(v))) for k, v in r.items()})

summary['debt_descriptions_breakdown'] = records

with open('SOVIGAZ_ML/scratch/debt_reconciliation_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print("Reconciliation summary saved to SOVIGAZ_ML/scratch/debt_reconciliation_summary.json")
