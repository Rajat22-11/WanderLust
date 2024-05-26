const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signUp.ejs");
}

module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("Success", "Welcome to WanderLust!");
        res.redirect("/listings");
    })
    }catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("Success", "Welcome back to WanderLust");
    res.redirect(res.locals.redirectUrl  || "/listings");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("Success", "You are logged out!");
        res.redirect("/listings");
    })
}