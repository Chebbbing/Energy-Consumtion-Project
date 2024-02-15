import sys
import json
import pandas as pd
import sqlite3
import os

# PowerBI ODBC   database=C:\Users\carlo\Documents\ITU\Enterprise Systems and Information Management\backend\Consumtion_Data.db

# extracting the path from the data (react file)
file_name = sys.argv[1]
format = sys.argv[2]
periode = sys.argv[3]

formatted_dataset = []


# reading datasets
dataset = pd.read_excel(f'../server/uploads/{file_name}')




# converting dataframe to correct format [(E_ID, E_Location, E_Weight)]
dataset = dataset.values.tolist()


# connecting to database
conn = sqlite3.connect(
    "../../backend/Consumtion_Data.db"
)
cursor = conn.cursor()


# inserts the data into the correct table if it is excel from energy provider
def create_insert_EP1(period, formatted_dataset):
    year = period[:4]
    quarter = period[5:]
    cursor.execute(
        f"CREATE TABLE IF NOT EXISTS Electricity_Consumption_{year}_{quarter} (EC_AssetCode INTEGER, EC_Region TEXT, EC_Country TEXT, EC_City TEXT, EC_Address TEXT, EC_Subtype TEXT, EC_LeaseAgreementStart TEXT, EC_LeaseAgreementExperation TEXT, EC_TotalAreaSQM INTEGER, EC_ElectricityConsumption INTEGER, EC_ManualInput TEXT, EC_kW_m2 REAL, EC_Periode TEXT)"
    )
    formatted_dataset = [
        (tup + (tup[9] / tup[8],) + (f"{year} {quarter}",)) for tup in formatted_dataset
    ]
    print(formatted_dataset)
    cursor.executemany(
        f"INSERT INTO Electricity_Consumption_{year}_{quarter} VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        formatted_dataset,
    )
    conn.commit()


# inserts the data into the Energy cost rapport from energy cost rapport excel
def create_insert_ECR(period, formatted_dataset):
    year = period[:4]
    quarter = period[5:]
    cursor.execute(
        f"CREATE TABLE IF NOT EXISTS Energy_Cost_Rapport_{year}_{quarter} (ECR_AssetCode INTEGER, ECR_AccountDocumentNumber INTEGER, ECR_Periode TEXT)"
    )
    cursor.executemany(
        f"INSERT INTO Energy_Cost_Rapport_{year}_{quarter} VALUES (?,?,?)",
        formatted_dataset,
    )
    conn.commit()


# Detects format and start insertion proccess
def format_dataset(format_of_data):
    global format_dataset
    if format_of_data == "RCP":
        formatted_dataset = [(item[0], item[1], item[2]) for item in dataset]
        create_insert_ECR(periode, formatted_dataset)

    elif format_of_data == "StoreReadable":
        formatted_dataset = [
            (
                item[0],
                item[1],
                item[2],
                item[3],
                item[4],
                item[5],
                item[6],
                item[7],
                item[8],
                item[9],
                "yes",
            )
            for item in dataset
        ]
        create_insert_EP1(periode, formatted_dataset)

    else:
        formatted_dataset = [
            (
                item[0],
                item[1],
                item[2],
                item[3],
                item[4],
                item[5],
                item[6],
                item[7],
                item[8],
                item[9],
                "no",
            )
            for item in dataset
        ]
        create_insert_EP1(periode, formatted_dataset)


format_dataset(format)
