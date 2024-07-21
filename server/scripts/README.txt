// Local //

mongoimport --uri='mongodb+srv://antidoteTranscribe:CAf4SS7bH48fbh0e@cluster0.f7fkxds.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0' --collection=validMedications --type=csv --headerline --file=Products_test.csv

// Prod //

*Note* cd into ./server/scripts/ProductionData

CPT's: mongoimport --uri='mongodb+srv://antidoteTranscribe:CAf4SS7bH48fbh0e@cluster0.f7fkxds.mongodb.net/Production?retryWrites=true&w=majority&appName=Cluster0' --collection=cptCodes --type=csv --headerline --file=cpt.csv

ICD10's:  mongoimport --uri='mongodb+srv://antidoteTranscribe:CAf4SS7bH48fbh0e@cluster0.f7fkxds.mongodb.net/Production?retryWrites=true&w=majority&appName=Cluster0' --collection=icd10Codes --type=csv --headerline --file=ICD10.csv

Medications's: mongoimport --uri='mongodb+srv://antidoteTranscribe:CAf4SS7bH48fbh0e@cluster0.f7fkxds.mongodb.net/Production?retryWrites=true&w=majority&appName=Cluster0' --collection=validMedications --type=csv --headerline --file=Medications.csv