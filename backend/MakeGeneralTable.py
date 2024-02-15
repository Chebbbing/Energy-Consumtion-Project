import sqlite3

# connecting to database
conn = sqlite3.connect(
    "C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\Consumtion_Data.db"
)
cursor = conn.cursor()


cursor.execute(
    f"CREATE TABLE IF NOT EXISTS General_Electricity_Consumption_Table (EC_AssetCode INTEGER, EC_Region TEXT, EC_Country TEXT, EC_City TEXT, EC_Address TEXT, EC_Subtype TEXT, EC_LeaseAgreementStart TEXT, EC_LeaseAgreementExperation TEXT, EC_TotalAreaSQM INTEGER, EC_ElectricityConsumption INTEGER, EC_ManualInput TEXT, EC_kW_m2 REAL, EC_Periode TEXT)"
)

conn.commit()
