import sys

# Get the format and periode values from command line arguments
filepath = sys.argv[1]
format = sys.argv[2]
periode = sys.argv[3]


# Open the file in write mode and write the received data
with open('C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\output.txt', 'w') as file:
    file.write(f'path: {filepath}\n')
    file.write(f'Format: {format}\n')
    file.write(f'Periode: {periode}\n')

print("Data has been written to the file")
