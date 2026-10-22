import os
import pandas as pd

df_debit = pd.read_csv('Project Sovigaz/1. Giới thiệu và khảo sát dự án/Nguồn dữ liệu/Datamart/Fact_AnalyticsDebit.csv')
df_debt = pd.read_csv('Project Sovigaz/1. Giới thiệu và khảo sát dự án/Nguồn dữ liệu/Datamart/DM_AccountObjectDebt.csv')

debit_131 = df_debit[df_debit['Account'] == 131]
debt_131 = df_debt[df_debt['ReceivableAccountCode'] == 131.0]

c_debit = set(debit_131['AccountObjectCode'])
c_debt = set(debt_131['AccountObjectCode'])

print(f"Unique customers in Fact_AnalyticsDebit (131): {len(c_debit)}")
print(f"Unique customers in DM_AccountObjectDebt (131): {len(c_debt)}")
print(f"Overlap: {len(c_debit.intersection(c_debt))}")
print(f"Debit only: {len(c_debit - c_debt)}")
print(f"Debt only: {len(c_debt - c_debit)}")

# Check what the debt_only customers look like in DM_AccountObjectDebt
sample_debt_only = debt_131[debt_131['AccountObjectCode'].isin(c_debt - c_debit)]
print("\nSample debt-only in DM_AccountObjectDebt:")
print(sample_debt_only[['AccountObjectCode', 'ReceiptableDebtAmount', 'OpeningBalance', 'PeriodAmount', 'PaidAmount']].head(10))
print(f"Total ReceiptableDebtAmount of debt_only: {sample_debt_only['ReceiptableDebtAmount'].sum()}")
print(f"ReceiptableDebtAmount == 0 count in debt_only: {(sample_debt_only['ReceiptableDebtAmount'] == 0).sum()}")

# Check what debit_only customers look like in Fact_AnalyticsDebit
sample_debit_only = debit_131[debit_131['AccountObjectCode'].isin(c_debit - c_debt)]
print(f"\nTotal Amount of debit_only in Fact_AnalyticsDebit: {sample_debit_only['Amount'].sum()}")
print(sample_debit_only[['AccountObjectCode', 'DebtDescription', 'Amount']].head(10))
