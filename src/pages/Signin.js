// bringing context and state
import React, {useState, useContext} from "react";

// importing all bootstrap
import {
    Container,
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    Spinner,
    Row,
    Col
  } from "reactstrap";

// here Redirect was deprecated so using Navigate
import {Navigate} from "react-router-dom";

import {toast} from "react-toastify";

import { UserContext } from "../context/UserContext";
import { SET_LOADING } from "../context/action.types";
import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import AppTheme from "../theme";

// FIXME: Zoom out issue
const Signin = () => {

    const {state, dispatch, user, setUser} = useContext(UserContext);

    const {isLoading, theme} = state;
    const currentTheme = AppTheme[theme];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // For handling signup
    const handleSignIn = async() => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // setting loading
            dispatch({
                type: SET_LOADING,
                payload: true
            });

            const {data} = await Axios.post(API_BASE + '/api/v1/signin', formData, {
                withCredentials: true,
            });

            // console.log(data);

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            setUser(data.user);
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast('Signed in successfully', {type: "success", theme});

        } catch (error) {
            dispatch({
                type: SET_LOADING,
                payload: false
            });
            console.log(error);
            toast(`Enter valid Email and password...`, {type: 'error', theme});
        }
        
    }  

    // for handling submit button
    const handleSubmit = e => {
        e.preventDefault();
        handleSignIn();
    }

    // return loading spinner
    if (isLoading) {
        return (
        <div className="Center">
            <Spinner color={ theme === "light" ? "dark" : "light"} />
            <div style={{color: `${currentTheme.textColor}`}}>Loading...</div>
        </div>
        );
    }

    // if user is already signed up
    if(user?._id) {
        // Here navigating to home route
        return <Navigate replace to="/" />
    }
    
    // here returning form for Signup

    return (
        <Container fluid className="mt-5">
            <Row>
                <Col md="6" className="offset-md-3 p-2">
                    <Card className="card-container mb-3" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
                    <CardBody className="mb-3 card-body-text" style={{color: `${currentTheme.textColor}`}}>
                        Welcome to XPOD, the tweet app!
                    </CardBody>
                    <Form onSubmit={handleSubmit} className="form-container">
                        <FormGroup floating>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                                className="mb-3 input-style input-form-style"
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: "none"
                                }}
                                required
                            />
                            <Label 
                                for="email"
                                style={{ 
                                    color: `${currentTheme.labelColor}`
                                }}
                            >Email</Label>
                        </FormGroup>
                        <FormGroup floating>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="password"
                                className="mb-3 input-style input-form-style"
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: "none"
                                }}
                                required
                            />
                            <Label 
                                for="password" 
                                style={{ 
                                    color: `${currentTheme.labelColor}`
                                    
                                }}
                            >password</Label>
                        </FormGroup>
                        <Button
                        type="submit"
                        color={ theme === "light" ? "dark" : "light"}
                        block
                        className="text-uppercase mb-3"
                        >
                        {"Sign In"}
                        </Button>
                    </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 

export default Signin;