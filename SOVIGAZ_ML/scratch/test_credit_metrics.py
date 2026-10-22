import os
import pandas as pd
import numpy as np

# Load source files
df_credit = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_credit_snapshot_20260731.parquet')
df_cust = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_master.parquet').rename(columns={'CustomerCode': 'AccountObjectCode'})
df_sales = pd.read_parquet('SOVIGAZ_ML/data/processed/processed_sales.parquet')
df_cluster = pd.read_csv('SOVIGAZ_ML/outputs/customer_segmentation/cluster_assignments.csv')
df_cluster_latest = df_cluster[df_cluster['snapshot_date'] == '2025-12-31'].drop_duplicates('AccountObjectCode')
df_churn = pd.read_csv('SOVIGAZ_ML/outputs/churn/churn_priority_customers.csv')

print("Loaded all sources successfully.")

# Calculate recent sales as of 2026-06-30
df_sales['RefDate'] = pd.to_datetime(df_sales['RefDate'])
cutoff_date = pd.Timestamp('2026-06-30')

sales_365 = df_sales[df_sales['RefDate'].between(cutoff_date - pd.Timedelta(days=365), cutoff_date)]
sales_180 = df_sales[df_sales['RefDate'].between(cutoff_date - pd.Timedelta(days=180), cutoff_date)]
sales_90 = df_sales[df_sales['RefDate'].between(cutoff_date - pd.Timedelta(days=90), cutoff_date)]
sales_30 = df_sales[df_sales['RefDate'].between(cutoff_date - pd.Timedelta(days=30), cutoff_date)]

rev_365 = sales_365.groupby('AccountObjectCode')['Revenue'].sum().rename('revenue_365d')
rev_180 = sales_180.groupby('AccountObjectCode')['Revenue'].sum().rename('revenue_180d')
rev_90 = sales_90.groupby('AccountObjectCode')['Revenue'].sum().rename('revenue_90d')
rev_30 = sales_30.groupby('AccountObjectCode')['Revenue'].sum().rename('revenue_30d')
orders_365 = sales_365.groupby('AccountObjectCode')['RefNo'].nunique().rename('transaction_count_365d')
days_365 = sales_365.groupby('AccountObjectCode')['RefDate'].nunique().rename('active_days_365d')

sales_metrics = pd.concat([rev_365, rev_180, rev_90, rev_30, orders_365, days_365], axis=1).reset_index()

# Join with credit snapshot
master = df_credit.merge(sales_metrics, on='AccountObjectCode', how='left')
for col in ['revenue_365d', 'revenue_180d', 'revenue_90d', 'revenue_30d', 'transaction_count_365d', 'active_days_365d']:
    master[col] = master[col].fillna(0.0)

# Check total debt reconciliation
print(f"Total debt in master: {master['total_receivable_debt'].sum():,.0f} VND")
print(f"Total overdue in master: {master['total_overdue_amount'].sum():,.0f} VND")
print(f"Total current in master: {master['total_current_amount'].sum():,.0f} VND")
