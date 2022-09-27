import pandas as pd

df = pd.read_csv("./EditedDatasets/combinedDataset.csv")

print (df["month"].unique()) # no issues
print (df["time"].unique()) # no issues 

print (df["origin_stop"].unique()) # has issues 
# Invalid origin_stop "C30624" removed
df = df[df["origin_stop"]!="C30624"]
# Convert strings to integer for consistency
df["origin_stop"] = df["origin_stop"].astype(int)
print (df["origin_stop"].unique()) #issues fixed

print (df["destination_stop"].unique()) # has issues 
# Invalid destination_stop "C600827" converted to "600827"
df['destination_stop'] = df['destination_stop'].replace({'C600827':'600827'})
# Invalid destination_stop "C30129" removed
df = df[df["destination_stop"]!="C30129"]
# Invalid destination_stop "C30624" removed
df = df[df["destination_stop"]!="C30624"]
# Invalid destination_stop "##EXEC_UNKNOWN##" removed
df = df[df["destination_stop"]!="##EXEC_UNKNOWN##"]
# Invalid destination_stop "nan" removed
df = df.dropna()
# Convert strings to integer for consistency
df["destination_stop"] = pd.to_numeric(df["destination_stop"])
df["destination_stop"] = df["destination_stop"].astype(int)
print (df["destination_stop"].unique()) #issues fixed 

quantitydf = pd.DataFrame(df["quantity"].unique()) #too large to do manually 
print (quantitydf.max()) # no issue
print (quantitydf.min()) # no issue 
print (quantitydf.isnull().values.any()) # no issue 

#next we need to check that for the origin and destination stops we have longnitude and latitude data available
lldf = pd.read_csv("./EditedDatasets/origin-destination-stops.csv") #ll = long lat

for stop in df["origin_stop"].unique():
    if not stop in lldf["stop_id"].unique():
        print (stop)
# nothing prints, meaning we have the data 

for stop in df["destination_stop"].unique():
    if not stop in lldf["stop_id"].unique():
        print (stop)
# nothing prints, meaning we have the data 

df = df.reset_index()
df = df.drop(columns=["index"])

# the dataset is now cleaned
df.to_csv("./EditedDatasets/cleanedDataset.csv", index=False) 