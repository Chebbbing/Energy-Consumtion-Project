import sqlite3
import json
import sys

# PowerBI ODBC   database=C:\Users\carlo\Desktop\Energy-Consumtion-Project-main\backend\Consumtion_Data.db

periode = sys.argv[1]

keys = [
    "Asset_ID",
    "Region",
    "Country",
    "City",
    "Address",
    "Asset_type",
    "Lease_start",
    "Lease_end",
    "Square_meters",
    "Electricity_consumption",
    "Manual_input",
]

keys_ECR = ["Asset_ID", "Account_Document_Number", "Periode"]

assetID_to_check = []


conn = sqlite3.connect(
    "../../backend/Consumtion_Data.db"
)
cursor = conn.cursor()

def get_data_EC():
    year = periode[:4]
    quarter = periode[5:]
    cursor.execute(
        f"SELECT * FROM Electricity_Consumption_{year}_{quarter} WHERE EC_ManualInput = 'yes';"
    )
    results = cursor.fetchall()
    for entry in results:
        assetID_to_check.append(entry[0])
    data_dict_EC = [dict(zip(keys, values)) for values in results]
    return data_dict_EC


def get_data_ECR():
    year = periode[:4]
    quarter = periode[5:]
    assetID_to_str = ", ".join(map(str, assetID_to_check))
    cursor.execute(
        f"SELECT * FROM Energy_Cost_Rapport_{year}_{quarter} WHERE ECR_AssetCode IN ({assetID_to_str});"
    )
    results = cursor.fetchall()
    data_dict_ECR = [dict(zip(keys_ECR, values)) for values in results]
    return data_dict_ECR


def send_data_to_node(EC_data, ECR_data):
    response_data = {
        "ElectricityConsumptionData": EC_data,
        "EnergyCostRapportData": ECR_data,
    }
    json_data = json.dumps(response_data, indent=4)
    print(json_data)


send_data_to_node(get_data_EC(), get_data_ECR())
