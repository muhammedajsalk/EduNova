import * as yup from "yup";

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export const registerSceama=yup.object(
    {
        name:yup.string().min(3).max(15).required("please enter your name"),
        email:yup.string().email("please enter valid email").required("please enter your email"),
        password:yup.string().matches(passwordRegex,"Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character").required("please enter your password"),
        otp:yup.number().required("please enter your otp"),
    }
)


export const LoginSceama=yup.object(
    {
        email:yup.string().email("please enter valid email").required("please enter your email"),
        password:yup.string().matches(passwordRegex,"Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character").required("please enter your password"),
    }
)