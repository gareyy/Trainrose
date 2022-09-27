import os 
import pandas as pd

df = pd.DataFrame()

for datasetName in os.listdir("./OriginalDatasets"):
    newdf = pd.read_csv(f"./OriginalDatasets/{datasetName}", low_memory=False)
    newdf.columns = ["operator", "month", "route", "direction", "time", "ticket_type", "origin_stop", "destination_stop", "quantity"]
    newdf = newdf[newdf["operator"]=="Queensland Rail"]
    newdf = newdf[newdf["ticket_type"]=="go card"]
    newdf = newdf.drop(columns=["route", "direction", "ticket_type", "operator"])
    df = pd.concat([df, newdf])

df = df.reset_index()
df = df.drop(columns=["index"])

df.to_csv("./EditedDatasets/combinedDataset.csv", index=False) 