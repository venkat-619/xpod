import React, {useContext} from "react";
import { UserContext } from "../context/UserContext";

import { Col, 
    Container, 
    Row } from "reactstrap";

import { Navigate } from "react-router-dom";

import { useMediaQuery } from "react-responsive";

// components
import UserWidget from "../components/UserWidget";
import PostBox from "../components/PostBox";
import TwitWidget from "../components/TwitWidget";
import Posts from "../components/Posts";
import FriendList from "../components/FriendList";



const Home = () => {

    const {user} = useContext(UserContext);
    const isNonMobileScreens = useMediaQuery({ minWidth: 1000 });

    if(!user?._id){
        return <Navigate replace to="/signin" />
    }

    return(
        <Container>
            <Row className="mt-5">
                <Col md="4" className="mb-4">
                    <Col xs="12">
                        <UserWidget />
                    </Col>
                    <Col xs="12" className="mt-3">
                        <FriendList />
                    </Col>
                </Col>
                <Col md="5" className="mb-4">
                    <Col xs="12">
                        <PostBox />
                    </Col>
                    <Col xs="12" className="mt-5">
                        <Posts />
                    </Col>
                </Col>
                <Col md="3" className="mb-4">
                    {isNonMobileScreens && (
                        <TwitWidget />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Home;