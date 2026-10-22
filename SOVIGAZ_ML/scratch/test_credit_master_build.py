import os
import pandas as pd
import numpy as np

# 1. Load credit snapshot
df_credit = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_credit_snapshot_20260731.parquet')

# 2. Load customer master
df_cust = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_master.parquet')
df_cust = df_cust.rename(columns={'CustomerCode': 'AccountObjectCode'})

# 3. Load cluster assignments
df_cluster = pd.read_csv('SOVIGAZ_ML/outputs/customer_segmentation/cluster_assignments.csv')
# latest snapshot in cluster assignments
df_cluster_latest = df_cluster[df_cluster['snapshot_date'] == '2025-12-31'].drop_duplicates('AccountObjectCode')

# 4. Load churn predictions / priority
df_churn = pd.read_csv('SOVIGAZ_ML/outputs/churn/churn_priority_customers.csv')

# 5. Load processed sales to calculate sales metrics over 365d, 90d, 30d as of 2026-06-30 / 2026-07-31
df_sales = pd.read_parquet('SOVIGAZ_ML/data/processed/processed_sales.parquet')
df_sales['RefDate'] = pd.to_datetime(df_sales['RefDate'])

print(f"Credit snapshot rows: {len(df_credit)}")
print(f"Customer master rows: {len(df_cust)}")
print(f"Cluster 2025-12-31 rows: {len(df_cluster_latest)}")
print(f"Churn priority rows: {len(df_churn)}")

# Test join
merged = df_credit.merge(
    df_cust[['AccountObjectCode', 'CustomerName', 'BranchCode', 'Region', 'Country']],
    on='AccountObjectCode',
    how='left'
)
print(f"Merged with Dim_Customer: {len(merged)}, CustomerName nulls: {merged['CustomerName'].isna().sum()}")

merged = merged.merge(
    df_cluster_latest[['AccountObjectCode', 'cluster_id', 'business_name']].rename(
        columns={'business_name': 'customer_segment'}
    ),
    on='AccountObjectCode',
    how='left'
)
print(f"Merged with Cluster: {len(merged)}, customer_segment nulls: {merged['customer_segment'].isna().sum()}")

merged = merged.merge(
    df_churn[['AccountObjectCode', 'churn_probability', 'risk_band', 'priority_score', 'priority_level']].rename(
        columns={'risk_band': 'churn_risk_band', 'priority_level': 'churn_priority_level'}
    ),
    on='AccountObjectCode',
    how='left'
)
print(f"Merged with Churn: {len(merged)}, churn_probability nulls: {merged['churn_probability'].isna().sum()}")

print("Sample joined row:")
print(merged[['AccountObjectCode', 'CustomerName', 'BranchCode', 'total_receivable_debt', 'customer_segment', 'churn_probability', 'churn_risk_band']].head(5))
