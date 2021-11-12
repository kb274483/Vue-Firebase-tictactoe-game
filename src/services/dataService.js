import firebase from "../firebase";

const db = firebase.ref("/playerList");
const gameDB = firebase.ref("/gameSet");
class dataService {
  getAll() {
    return db;
  }

  getAllGame() {
    return gameDB;
  }

  create(data) {
    return gameDB.push(data);
  }

  updateList(key, value) {
    return db.child(key).update(value);
  }

  updateGame(key, value) {
    return gameDB.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAllList() {
    return db.remove();
  }
}

export default new dataService();
