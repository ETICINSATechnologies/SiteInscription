import { Database } from 'sqlite3'

// export interface MemberInscription {
//   firstName: string,
//   lastName: string,
//   genderId: string,
//   birthday: string,
//   departmentId: string,
//   email: string,
//   phoneNumber: string,
//   outYear: string,
//   nationalityId: string,
//   wantedPoleId: string,
//   line1: string,
//   line2: string,
//   city: string,
//   postalCode: string,
//   countryId: string,
//   hasPaid: string,
//   droitImage: string,
//   [key: string]: string
// }

export interface StringObject {
  [key: string]: string
}

class DBHandler {

  dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  createConnection(): Database {
    const db = new Database(this.dbPath, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database');
      }
    });
    return db;
  }

  closeConnection(db: Database) {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }

  insertToTable(stringObject: StringObject, tableName: string, db: Database) {

    db.run(this.createInsertFromParams(stringObject, tableName), ['C'], function (err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    });

  }

  createInsertFromParams(stringObject: StringObject, tableName: string) {
    const statement = `INSERT INTO ${tableName}(${this.createKeys(stringObject)}) VALUES (${this.createValues(stringObject)})`
    return statement;
  }

  createKeys(stringObject: StringObject) {
    let keyArray = "";

    for (const key in stringObject) {
      if (keyArray !== "") keyArray += ',';
      keyArray += key;
    }

    return keyArray;

  }

  createValues(stringObject: StringObject) {
    let valueArray = "";

    for (const key in stringObject) {
      if (stringObject.hasOwnProperty(key)) {
        if (valueArray !== "") valueArray += ',';
        valueArray += stringObject[key];
      }
    }

    return valueArray;
  }


}

export default DBHandler;
