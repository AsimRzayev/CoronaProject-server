const Yup = require("yup");
const AuthValidationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .max(100, "Too long, maximum 50 characters"),

    email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    password: Yup.string().min(2, "Too short, minimum 2 characters"),
});

module.exports = AuthValidationSchema;
