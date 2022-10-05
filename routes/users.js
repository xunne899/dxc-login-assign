const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// create hashed password in database
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};
// import in User Model

const { User } = require("../models");
const dataLayer = require("../dal/users");
const { createRegistrationForm, createLoginForm, createUserForm, bootstrapField } = require("../forms");
const { checkIfAuthenticated } = require("../middlewares");

router.get("/", checkIfAuthenticated, async (req, res) => {
  const user = await User.collection().fetch();
  res.render("users/index", {
    user: user.toJSON(),
  });
});

  // show the registration form
router.get("/register", checkIfAuthenticated,(req, res) => {
  const registerForm = createRegistrationForm();
  res.render("users/register", {
    form: registerForm.toHTML(bootstrapField),
  });
});

// post registration form after filling 
router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      const user = new User({
        name:form.data.name,
        role:form.data.role,
        username: form.data.username,
        password: getHashedPassword(form.data.password),
        email: form.data.email,
      });
      await user.save();
      req.flash("success_messages", "Signed up successfully!");
      res.redirect("/");
    },
    error: (form) => {
      res.render("users/register", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});


// get users update data
router.get("/:user_id/update",checkIfAuthenticated, async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);

  const UpdateForm = createUserForm();
  UpdateForm.fields.name.value = user.get("name");
  UpdateForm.fields.username.value = user.get("username");
  UpdateForm.fields.email.value = user.get("email");
  UpdateForm.fields.role.value = user.get("role");

  res.render("users/update", {
    UpdateForm: UpdateForm.toHTML(bootstrapField),
    user: user.toJSON(),
  });
});


// post amended user data
router.post("/:user_id/update", async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);
  const userUpdateForm = createUserForm();
  userUpdateForm.handle(req, {
    success: async (form) => {
      let { ...Data } = form.data;
      console.log(Data);
      user.set(Data);
      user.save();

      req.flash("success_messages", `User Successfully Updated`);
      res.redirect("/users");
    },

  });
});


// get delete prompt
router.get("/:user_id/delete",checkIfAuthenticated, async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);

  res.render("users/delete", {
    user: user.toJSON(),
  });
});


// confirm after deleting
router.post("/:user_id/delete", async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);
  await user.destroy();
  res.redirect("/users");
});


// logout route
router.get("/logout", (req, res) => {
  req.session.user = null;
  req.flash("success_messages", "Logout Successfully");
  res.redirect("/");
});
module.exports = router;