import os
import pandas as pd

df_credit = pd.read_parquet('SOVIGAZ_ML/data/processed/customer_credit_snapshot_20260731.parquet')
df_sales = pd.read_parquet('SOVIGAZ_ML/data/processed/processed_sales.parquet')
df_rfm = pd.read_parquet('SOVIGAZ_ML/outputs/customer_segmentation/rfm_segmentation_primary.parquet')
df_churn = pd.read_csv('SOVIGAZ_ML/outputs/churn/churn_priority_customers.csv')

c_credit = set(df_credit['AccountObjectCode'])
c_sales = set(df_sales['AccountObjectCode'])
c_rfm = set(df_rfm['AccountObjectCode'])
c_churn = set(df_churn['AccountObjectCode'])

print(f"Credit customers (Account 131): {len(c_credit)}")
print(f"Sales customers: {len(c_sales)}")
print(f"Overlap Credit & Sales: {len(c_credit.intersection(c_sales))} / {len(c_credit)}")
print(f"Credit customers NOT in Sales: {len(c_credit - c_sales)}")
print(f"Overlap Credit & RFM 2025: {len(c_credit.intersection(c_rfm))} / {len(c_credit)}")
print(f"Overlap Credit & Churn 2025: {len(c_credit.intersection(c_churn))} / {len(c_credit)}")

# Check who are the credit customers NOT in sales
if len(c_credit - c_sales) > 0:
    print("Credit customers not in sales:", list(c_credit - c_sales)[:10])
