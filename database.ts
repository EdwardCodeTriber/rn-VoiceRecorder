import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('voice_notes.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS recordings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        uri TEXT,
        date TEXT
      );`
    );
  });
};

export const addRecording = (title: string, uri: string, date: string) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO recordings (title, uri, date) VALUES (?, ?, ?);`,
      [title, uri, date]
    );
  });
};

export const getRecordings = (setRecordings: Function) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM recordings;`,
      [],
      (_, { rows }) => {
        setRecordings(rows._array);
      }
    );
  });
};

export const deleteRecording = (id: number) => {
  db.transaction(tx => {
    tx.executeSql(`DELETE FROM recordings WHERE id = ?;`, [id]);
  });
};
