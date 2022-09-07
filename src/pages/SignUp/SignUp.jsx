import "./SignUp.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const SignUp = () => {
  const navigator = useNavigate();
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext()

  const initialvalues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).required("username is required"),
    email: Yup.string().email().required("email is required"),
    password: Yup.string().min(8).required("password is needed"),
    confirmPassword: Yup.string()
      .required("confirm your password")
      .oneOf([Yup.ref("password"), null], "passwords do not match"),
  });

  const submitResgistation = (data) => {
    setIsLoading(true);
    setIsError(null);

    axios
      .post(`${process.env.REACT_APP_API_DB}/api/user/signup`, data)
      .then((res) => {
        setIsLoading(false);
        navigator("/");
        localStorage.setItem('user', JSON.stringify(res.data))
        dispatch({type: 'LOGIN', payload: res.data})
        console.log(res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.error);
          setIsError(error.response.data.error);
          setIsLoading(false);
        }
      });
  };

  return (
    <div className="signup-page">
      <div className="signupform-container">
        <Formik
          initialValues={initialvalues}
          validationSchema={validationSchema}
          onSubmit={submitResgistation}
        >
          <Form className="signupform">
            <h1 className="signup-title">Sign Up to join the experience </h1>

            {isError && <p className="form-error">{isError}</p>}

            <ErrorMessage name="username" component="span" />
            <Field name="username" placeholder="make a username" />

            <ErrorMessage name="email" component="span" />
            <Field name="email" placeholder="put your email" />

            <ErrorMessage name="password" component="span" />
            <Field
              id="createPost"
              name="password"
              type="password"
              placeholder="make a password"
            />

            <ErrorMessage name="confirmPassword" component="span" />
            <Field
              id="confirmpass"
              name="confirmPassword"
              type="password"
              placeholder="confirm your password"
            />

            <button className="SignUpBtn" type="submit" disabled={isLoading}>
              register
            </button>

            <h3>
              Already have an account? <Link to="/login">Login In</Link>
            </h3>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
