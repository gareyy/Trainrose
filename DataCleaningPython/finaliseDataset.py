import pandas as pd
from geographiclib.geodesic import Geodesic

df = pd.read_csv("./EditedDatasets/cleanedDataset.csv")
# creating two new empty columns 
df["distance"] = 0
df["direction"] = 0 

lldf = pd.read_csv("./EditedDatasets/origin-destination-stops.csv") #ll = long lat 

cardinalDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "S", "SSW", "SW",
"WSW", "W", "WNW", "NW", "NNW"]

angles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, -180, -157.5, -135, -112.5, -90, 
-67.5, -45, -22.5]

for origin in df["origin_stop"].unique():
    for destination in df["destination_stop"].unique():
        if len(df[(df["origin_stop"]==origin)&(df["destination_stop"]==destination)]) != 0:
            originLongitude = lldf[lldf["stop_id"]==origin]["stop_lon"].values[0]
            originLatitude = lldf[lldf["stop_id"]==origin]["stop_lat"].values[0]
            destinationLongitude = lldf[lldf["stop_id"]==destination]["stop_lon"].values[0]
            destinationLatitude = lldf[lldf["stop_id"]==destination]["stop_lat"].values[0]

            g = Geodesic.WGS84.Inverse(originLatitude, originLongitude, destinationLatitude, destinationLongitude)
            df.loc[(df["origin_stop"]==origin)&(df["destination_stop"]==destination), "distance"] = round(g['s12']/1000, 1)
            df.loc[(df["origin_stop"]==origin)&(df["destination_stop"]==destination), "direction"] = cardinalDirections[angles.index(round(g['azi1']*2/45)/(2/45))]

df = df.drop(columns=["destination_stop"])

df.to_csv("./EditedDatasets/finalDataset.csv", index=False) 