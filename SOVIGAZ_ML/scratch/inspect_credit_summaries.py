import os
import json
import pandas as pd

files = [
    'credit_risk_summary_stats.csv',
    'credit_concentration_hhi.csv',
    'credit_segment_crosstab.csv',
    'credit_churn_crosstab.csv',
    'credit_priority_matrix_summary.csv'
]

results = {}
for f in files:
    p = os.path.join('SOVIGAZ_ML', 'outputs', 'credit', f)
    if os.path.exists(p):
        df = pd.read_csv(p)
        results[f] = df.to_dict(orient='records')

with open('SOVIGAZ_ML/scratch/credit_results_summary.json', 'w', encoding='utf-8') as out_f:
    json.dump(results, out_f, ensure_ascii=False, indent=2)

print("Saved credit summary results.")
