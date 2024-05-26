const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


main()
  .then(() => {
    console.log("Connected DB");
  })
  .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, owner:"661b74bb99b64827621270e5",
  }))
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};


initDB();
