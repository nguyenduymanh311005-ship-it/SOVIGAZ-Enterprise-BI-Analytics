import os
import json
import pandas as pd

keywords = [
    'due', 'pay', 'paid', 'settle', 'invoice', 'outstanding', 'remain', 'overdue',
    'debt', 'debit', 'credit', 'aging', 'bad', 'writeoff', 'limit', 'term', 'ar', 'ap',
    'receivable', 'balance'
]

results = []

for root, dirs, files in os.walk('.'):
    if '.git' in root or '.gemini' in root:
        continue
    for f in files:
        if f.endswith(('.csv', '.parquet')):
            fpath = os.path.join(root, f)
            try:
                if f.endswith('.csv'):
                    try:
                        df = pd.read_csv(fpath, nrows=5, encoding='utf-8')
                    except UnicodeDecodeError:
                        df = pd.read_csv(fpath, nrows=5, encoding='latin1')
                elif f.endswith('.parquet'):
                    df = pd.read_parquet(fpath)
                
                cols = [str(c) for c in df.columns if any(k in str(c).lower() for k in keywords)]
                file_match = any(k in f.lower() for k in keywords)
                if cols or file_match:
                    # check actual row count and date range if possible
                    row_cnt = None
                    date_range = None
                    try:
                        if f.endswith('.parquet'):
                            full_df = pd.read_parquet(fpath)
                            row_cnt = len(full_df)
                            date_cols = [c for c in full_df.columns if 'date' in c.lower() or 'ngay' in c.lower()]
                            if date_cols:
                                date_range = {dc: [str(full_df[dc].min()), str(full_df[dc].max())] for dc in date_cols}
                        elif f.endswith('.csv') and 'Fact_AnalyticsDebit' in f:
                            full_df = pd.read_csv(fpath)
                            row_cnt = len(full_df)
                            date_cols = [c for c in full_df.columns if 'date' in c.lower() or 'ngay' in c.lower()]
                            if date_cols:
                                date_range = {dc: [str(full_df[dc].min()), str(full_df[dc].max())] for dc in date_cols}
                    except Exception:
                        pass

                    results.append({
                        'file': f,
                        'relpath': os.path.relpath(fpath, '.'),
                        'matched_cols': cols,
                        'all_cols': [str(c) for c in df.columns],
                        'row_count': row_cnt,
                        'date_range': date_range
                    })
            except Exception as e:
                pass

with open('SOVIGAZ_ML/scratch/credit_discovery_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Scanned successfully. Total matches: {len(results)}. Saved to SOVIGAZ_ML/scratch/credit_discovery_results.json")
