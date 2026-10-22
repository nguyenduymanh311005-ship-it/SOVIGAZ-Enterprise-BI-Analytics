import pandas as pd
import numpy as np

def run_audit():
    sales = pd.read_parquet('SOVIGAZ_ML/data/processed/processed_sales.parquet')
    print('=== PROCESSED SALES REVENUE AUDIT ===')
    print('Total rows:', len(sales))
    neg_sales = sales[sales['Revenue'] < 0]
    neg_sum = neg_sales['Revenue'].sum()
    pos_sum = sales[sales['Revenue'] > 0]['Revenue'].sum()
    net_sum = sales['Revenue'].sum()
    print(f'Negative revenue rows: {len(neg_sales):,} ({len(neg_sales)/len(sales)*100:.2f}%)')
    print(f'Negative revenue sum: {neg_sum:,.0f} VND')
    print(f'Positive revenue sum: {pos_sum:,.0f} VND')
    print(f'Net total revenue:    {net_sum:,.0f} VND')

    print('\nTop items with negative revenue:')
    top_neg_items = neg_sales.groupby('InventoryItemCode_New')['Revenue'].agg(['count', 'sum']).sort_values(by='sum').head(10)
    print(top_neg_items)

    # Check Cluster 3 in 4B vs 4C
    rfm_primary = pd.read_parquet('SOVIGAZ_ML/outputs/customer_segmentation/rfm_segmentation_primary.parquet')
    c3_4b = rfm_primary[rfm_primary['cluster_id'] == 3]
    print('\n=== RFM PRIMARY (4B) CLUSTER 3 REVENUE ===')
    print('Cluster 3 customer count in 4B:', len(c3_4b))
    print(f'Cluster 3 total monetary in 4B: {c3_4b["Monetary"].sum():,.0f} VND')
    print('Cluster 3 customers with negative Monetary in 4B:', (c3_4b['Monetary'] < 0).sum())

    # Check Cluster 3 in 4C
    churn_feat = pd.read_parquet('SOVIGAZ_ML/outputs/churn/churn_features.parquet')
    churn_2025 = churn_feat[churn_feat['snapshot_date'] == '2025-12-31']
    merged_4c = churn_2025.merge(rfm_primary[['AccountObjectCode', 'cluster_id']], on='AccountObjectCode', how='inner')
    c3_4c = merged_4c[merged_4c['cluster_id'] == 3]
    print('\n=== CHURN 2025-12-31 (4C) CLUSTER 3 REVENUE ===')
    print('Cluster 3 customer count in 4C:', len(c3_4c))
    print(f'Cluster 3 monetary_365d sum in 4C: {c3_4c["monetary_365d"].sum():,.0f} VND')
    print('Cluster 3 customers with negative monetary_365d in 4C:', (c3_4c['monetary_365d'] < 0).sum())

    # Look into why 4B was -4.89B and 4C was -5.06B
    # In 4B, rfm_primary has 1,359 customers.
    # In 4C, churn_2025 has 1,174 customers.
    # Let's inspect customers in c3_4b vs c3_4c
    print('c3_4b count:', len(c3_4b), 'c3_4c count:', len(c3_4c))

    # Examine individual customers with largest negative monetary
    print('\nTop 5 customers with largest negative monetary in Cluster 3 (4C):')
    top_neg_custs = c3_4c.sort_values(by='monetary_365d').head(5)[['AccountObjectCode', 'CustomerName', 'monetary_365d', 'recency_days', 'frequency_365d']]
    print(top_neg_custs.to_string())

if __name__ == '__main__':
    run_audit()
