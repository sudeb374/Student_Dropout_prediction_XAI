import pandas as pd
import joblib

model = joblib.load('exported_assets/voting_classifier.pkl')
target_encoder = joblib.load('exported_assets/target_encoder.pkl')

df = pd.read_csv('studentdropout.csv')
for idx in [92, 140]:
    row = df.iloc[idx:idx+1].copy()
    actual = row['Target'].values[0]
    row = row.drop(columns=['Target'])
    pred_num = model.predict(row)[0]
    pred = target_encoder.inverse_transform([pred_num])[0]
    print(f"ID {idx}: Actual='{actual}', Predicted='{pred}'")
