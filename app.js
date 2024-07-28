if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const searchRouter = require('./routes/search');
const autocompleteRouter = require('./routes/autoComplete.js'); // Import the router

const { log } = require("console");


main()
.then((res) => {
    console.log("Server Connected");
})
.catch(err => console.log(err));

// async function main() {
// //   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//   await mongoose.connect(process.env.ATLASDB_URL);

// }
const dbURL = process.env.ATLASDB_URL;
async function main() {
    const dbURL = process.env.ATLASDB_URL; 
    if (!dbURL) {
        throw new Error("ATLASDB_URL is not set in environment variables");
    }
    console.log('Connecting to MongoDB at:', dbURL);
    await mongoose.connect(dbURL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
})

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}
// Get all listings in the database
// app.get("/", (req, res) => {
//     res.send("HIIIII!")
// })



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// // Retrieve a single listing by its
// app.get("/testListing", async (req, res) => {
//     let sampleListing =  new Listing({
//     title: "My New Villa" ,
//     description:"By the beach" ,
//     price: 1200,
//     location: "Calangute, Goa" ,
//     country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample Was Saved");
//     res.send("Successful Testing")
// });


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "deltaStudent"
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/", searchRouter);


// Add this line to use the router
app.use("/", autocompleteRouter);


app.all( "*", ( req, res, next ) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something went wrong:("} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message})
})





app.listen(8080, () =>{
    console.log("Listening to port 8080");
})

