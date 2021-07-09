const yup = require("yup");
const memoryValidationSchema = yup.object({
    title: yup
        .string()
        .min(2, "Too short, minimum 2 characters")
        .max(150, "Too long, maximum 150 characters")
        .required("Title is required"),
    description: yup
        .string()
        .min(2, "Too short, minimum 2 characters")
        .required("Description is required"),
    tags: yup.string().min(2, "Too short, minimum 2 characters"),
});

module.exports = memoryValidationSchema;
