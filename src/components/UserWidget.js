import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../context/UserContext";

import { Card, Row, Col, CardTitle,             CardText } from "reactstrap";
import { MdOutlineManageAccounts, 
        MdOutlineLocationOn, 
        MdOutlineWorkOutline, 
        MdOutlinePhone,
        MdOutlineEdit } from "react-icons/md";

import { FaLinkedin } from "react-icons/fa";

import UserImage from "./UserImage";

import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import AppTheme from "../theme";

const UserWidget = ({ profile = false, userprofileId=""}) => {
    
    const {state, user} = useContext(UserContext);

    const {theme} = state;
    const currentTheme = AppTheme[theme];

    const [profileDetails, setProfileDetails] = useState(null);

    const navigate = useNavigate();

    useEffect( () => {
        if(profile) {
            try {
                const fetchProfile = async () => {
    
                    const {data} = await Axios.get(`${API_BASE}/api/v1/userprofile/${userprofileId}`, 
                        { withCredentials: true });
    
                    setProfileDetails(data.profileuser);
                }
    
                fetchProfile();
                
            } catch (error) {
                console.log(error);
            }
        } else {
            setProfileDetails(user);
        }
    }, [profile, userprofileId, user]);


    return (
        <Card className="card-container" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
            <Row onClick={() => navigate(`/profile/${profileDetails?._id}`)}>
                <Col xs="3">
                    <UserImage imageUrl={profileDetails?.photo?.secure_url}/>
                </Col>
                <Col xs="7" className="mt-1 cursor-pointer">
                    <CardTitle tag={"h5"} className="fw-bold" style={{color: `${currentTheme.textColor}`}}>
                        {profileDetails?.firstname} {profileDetails?.lastname}
                    </CardTitle>
                    <CardText style={{fontSize:"14px", color: `${currentTheme.textColor}`}} >
                        {profileDetails?.friends?.length} friends
                    </CardText>
                </Col>
                <Col xs="2" className="mt-3">
                    <MdOutlineManageAccounts style={{color: `${currentTheme.textColor}`}} />
                </Col>
            </Row>

            <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />

            <Row>
                <CardText>
                    <MdOutlineLocationOn size={25} style={{color: `${currentTheme.textColor}`}}/>
                    <span className="ms-3" style={{fontSize:"14px"}}>
                        <Link className={`text-decoration-none ${theme === "light" ? "text-dark" : "text-white"}`}
                        to={`https://maps.google.com/?=${profileDetails?.location}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        // style={{color: theme === "light" ? "dark" : "white"}}
                        >{profileDetails?.location}</Link>
                    </span>
                </CardText>
                <CardText>
                    <MdOutlinePhone size={25} style={{color: `${currentTheme.textColor}`}}/>
                    <span className="ms-3" style={{fontSize:"14px", color: `${currentTheme.textColor}`}}>
                        {profileDetails?.phoneNumber}
                    </span>
                </CardText>
                <CardText>
                    <MdOutlineWorkOutline size={25} style={{color: `${currentTheme.textColor}`}}/>
                    <span className="ms-3" style={{fontSize:"14px", color: `${currentTheme.textColor}`}}>
                        {profileDetails?.occupation}
                    </span>
                </CardText>
            </Row>

            <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />

            <Row>
                <CardText className="ms-3" style={{fontSize:"14px", color: `${currentTheme.textColor}`}}>
                    Number of Profile views <span className="ms-5 fw-bold" style={{color: `${currentTheme.textColor}`}}>
                        {profileDetails?.viewedProfile}</span>
                </CardText>
            </Row>

            <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />

            <Row>
                <CardTitle tag={"h6"} className="fw-bold mb-3" style={{color: `${currentTheme.textColor}`}}>
                    Social Profiles
                </CardTitle>
                <Col xs="2" className="mt-1">
                    <FaLinkedin size={25} style={{color: `${currentTheme.textColor}`}}/>
                </Col>
                <Col xs="7">
                    <p className="fw-bold mb-0" style={{fontSize:"13px", color: `${currentTheme.textColor}`}}>
                        Linkedin
                    </p>
                    <p className="" style={{fontSize:"12px", fontWeight:"300px", color: `${currentTheme.textColor}`}}>
                        Network Platform
                    </p>
                </Col>
                <Col xs="3">        
                    <MdOutlineEdit size={20} style={{color: `${currentTheme.textColor}`}} />
                </Col>
            </Row>
        </Card>
    );
}

export default UserWidget;