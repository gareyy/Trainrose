import pandas as pd 

df = pd.read_csv("C:\\Users\\bryso\\Downloads\\202207(Jul) TL Org-Dest Trips.csv", low_memory=False)

df = df[df['operator']=="Queensland Rail"]
df = df[df['ticket_type']=="go card"]

df = df.reset_index()

del df['route'], df['direction'], df['index'], df['ticket_type'], df['operator']

uniqueStops = pd.concat([df['origin_stop'], df['destination_stop']]).unique()

df2 = pd.read_csv("C:\\Users\\bryso\\Downloads\\origin-destination-stops.csv")

print (df[df['destination_stop']==600637].to_string())

