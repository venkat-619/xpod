import React, {useContext} from "react";
import { UserContext } from "../context/UserContext";

import { Card, CardTitle, Col, 
    Container, 
    Row } from "reactstrap";

import { Navigate, useParams } from "react-router-dom";


// components
import UserWidget from "../components/UserWidget";
// import PostBox from "../components/PostBox";
import Posts from "../components/Posts";
import FriendList from "../components/FriendList";
import AppTheme from "../theme";



const ProfilePage = () => {

    const { userprofileId } = useParams();
    const {state, user} = useContext(UserContext);
    const {theme} = state;

    const currentTheme = AppTheme[theme];

    if(!user?._id){
        return <Navigate replace to="/signin" />
    }

    return(
        <Container>
            <Row className="mt-5">
                <Col md="4" className="mb-4">
                    <Col xs="12">
                        <Card className="card-container" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
                        <CardTitle 
                            tag={"h5"} 
                            className="fw-bold d-flex align-items-center justify-content-center"
                            style={{color: `${currentTheme.textColor}`}}
                        >
                            Profile...
                        </CardTitle>
                        </Card>
                    </Col>
                    <Col xs="12" className="mt-3">
                        <UserWidget profile={true} userprofileId={userprofileId}/>
                    </Col>
                    <Col xs="12" className="mt-3">
                        <FriendList profile={true} userprofileId={userprofileId} />
                    </Col>
                </Col>
                <Col md="5" className="mb-4">
                    <Col xs="12">
                        <Posts profile={true} userprofileId={userprofileId} />
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;