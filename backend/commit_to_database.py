import sys
import sqlite3
import json


kW = json.loads(sys.argv[1])

kWperM2 = json.loads(sys.argv[2])

periode = json.loads(sys.argv[3])


conn = sqlite3.connect(
    "../../backend/Consumtion_Data.db"
)
cursor = conn.cursor()


for key, value in kW.items():
    year = periode[:4]
    quarter = periode[5:]

    print(f"value: {value}, key: {key}")
    print(f"kwm2: {kWperM2[key]}")

    cursor.execute(
        f"UPDATE Electricity_Consumption_{year}_{quarter} SET EC_ElectricityConsumption = {value} WHERE EC_AssetCode = {key}"
    )
    cursor.execute(
        f"UPDATE Electricity_Consumption_{year}_{quarter} SET EC_kW_m2 = {kWperM2[key]} WHERE EC_AssetCode = {key}"
    )
    conn.commit()
    print("executed successfully")
