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

export const ResetPasswordSceama=yup.object(
    {
        password:yup.string().matches(passwordRegex,"Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character").required("please enter your password"),
        cpassword:yup.string().oneOf([yup.ref("password")],"entered password do not match!").required("please enter conform password")
    }
)


export const instructorSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  bio: yup.string()
    .required("Bio is required")
    .min(20, "Bio should be more descriptive"),
  skills: yup.string()
    .required("Skills are required")
    .min(3, "Too short"),
  linkedInProfile: yup.string()
    .url("Invalid URL")
    .nullable()
    .notRequired(),

  avatar: yup.mixed()
    .required('Avatar is required')
    .test('fileSize', 'Image is too large (max 5MB)', value => !value || value.size <= 5 * 1024 * 1024)
    .test('fileType', 'Unsupported Format', value => 
      !value || ['image/jpeg', 'image/png'].includes(value.type)
    ),

  demoVideo: yup.mixed()
  .required('Demo video is required')
  .test('fileSize', 'Video is too large (max 15MB)', value => !value || value.size <= 15 * 1024 * 1024)
  .test('fileType', 'Unsupported Format', value => 
    !value || value.type.startsWith('video/')
  ),


  degreeCertificate: yup.mixed().required('Degree certificate is required'),
  experienceLetter:  yup.mixed().nullable(),
  certification:yup.mixed().nullable(),
  idProof: yup.mixed().required('ID proof is required'),
});
