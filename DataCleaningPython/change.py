import pandas as pd

df = pd.read_csv("./EditedDatasets/finalDataset2.csv")

print (df)
df = df[df["month"] != "2016-02"]
df = df[df["month"] != "2016-03"]
df = df[df["month"] != "2016-04"]
df = df[df["month"] != "2016-05"]
df = df[df["month"] != "2016-06"]
df = df[df["month"] != "2016-07"]
df = df[df["month"] != "2016-08"]
df = df[df["month"] != "2016-09"]
df = df[df["month"] != "2016-10"]

df.to_csv("./EditedDatasets/finalDataset3.csv", index=False) 

