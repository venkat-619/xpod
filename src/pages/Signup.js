// bringing context and state
import React, {useContext, useState} from "react";

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

// context
import { UserContext } from "../context/UserContext";
import { SET_LOADING } from "../context/action.types";

import Axios from "axios";

// api base
import API_BASE from "../helper/apiUrl";
import AppTheme from "../theme";

// FIXME: Zoom out issue
const Signup = () => {

    const {state, dispatch, user, setUser} = useContext(UserContext);

    const {isLoading, theme} = state;
    const currentTheme = AppTheme[theme];

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(null);
    
    const [imagePreview, setImagePreview] = useState(null);

    // For handling signup
    const handleSignUp = async () => {
        try {

            const formData = new FormData();
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            formData.append('location', location);
            formData.append('occupation', occupation);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phoneNumber);
            formData.append('photo', photo);

            dispatch({
                type: SET_LOADING,
                payload: true
            });

            const {data} = await Axios.post(API_BASE + '/api/v1/signup', formData, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            // console.log(data);

            setUser(data.user);
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast('Registered successfully', {type: "success", theme});
            
        } catch (error) {
            dispatch({
                type: SET_LOADING,
                payload: false
            });
            console.log(error);
            toast('Something went wrong... Please fill again', {type: "error", theme});
        }
    }  

    // for handling submit button
    const handleSubmit = e => {
        e.preventDefault();
        handleSignUp();
    }

    // for handling image
    const handleImage = (e) => {
        const file = e.target.files[0];
        if(file) {
            setPhoto(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

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
                        <div className="text-center mb-3">
                            <div>
                            <label htmlFor="imagepicker" className="mb-3">
                                <img 
                                    src={imagePreview} 
                                    alt="" 
                                    className="profile" 
                                    style={{
                                        border: theme === "light" ? 
                                            "2px solid rgba(0, 0, 0, 0.2)" : 
                                            "2px solid rgba(255, 255, 255, 0.2)"
                                    }}
                                />
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="imagepicker"
                                accept="image/*"
                                multiple={false}
                                onChange={handleImage}
                                className="hidden"
                            />
                            </div>
                        </div>
                            <Row>
                                <Col md="6" >
                                    <FormGroup floating>
                                        <Input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            placeholder="First Name"
                                            value={firstname}
                                            onChange={e => setFirstName(e.target.value)}
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
                                            for="firstname"
                                            style={{ color: `${currentTheme.labelColor}`}}
                                        >
                                            firstname
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup floating>
                                        <Input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            placeholder="Last Name"
                                            value={lastname}
                                            onChange={e => setLastName(e.target.value)}
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
                                            for="lastname"
                                            style={{ color: `${currentTheme.labelColor}`}}
                                        >lastname</Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        <FormGroup floating>
                            <Input
                                type="text"
                                name="occupation"
                                id="occupation"
                                value={occupation}
                                onChange={e => setOccupation(e.target.value)}
                                placeholder="Occupation"
                                className=" mb-3 input-style input-form-style"
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: "none"
                                }}
                                required
                            />
                            <Label for="occupation" style={{ color: `${currentTheme.labelColor}`}}>
                                occupation
                            </Label>
                        </FormGroup>
                        <FormGroup floating>
                            <Input
                                type="text"
                                name="area"
                                id="area"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="Location"
                                className="mb-3 input-style input-form-style"
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: "none"
                                }}
                                required
                            />
                            <Label for="area" style={{ color: `${currentTheme.labelColor}`}}>
                            Location</Label>
                        </FormGroup>
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
                            <Label for="email" style={{ color: `${currentTheme.labelColor}`}}>
                            Email</Label>
                        </FormGroup>
                        <FormGroup floating>
                            <Input
                                type="number"
                                name="number"
                                id="phonenumber"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="phone number"
                                className="mb-3 input-style input-form-style"
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: "none"
                                }}
                                required
                            />
                            <Label for="phonenumber" style={{ color: `${currentTheme.labelColor}`}}>
                                phone number</Label>
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
                            <Label for="password" style={{ color: `${currentTheme.labelColor}`}}>
                                password</Label>
                        </FormGroup>
                        <Button
                        type="submit"
                        color={ theme === "light" ? "dark" : "light"}
                        block
                        className="text-uppercase mb-3"
                        >
                        {"Sign Up"}
                        </Button>
                    </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 

export default Signup;