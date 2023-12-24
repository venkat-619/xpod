import React, {useContext} from "react";
import { Card, CardText, CardTitle, Col, Row, Spinner } from "reactstrap";

import {  TwitterFollowButton } from "react-twitter-embed";

import { UserContext } from "../context/UserContext";
import AppTheme from "../theme";


const TwitWidget = () => {

    const {state} = useContext(UserContext);
    const {theme} = state;

    const currentTheme = AppTheme[theme];
    
    return(
        <Card className="card-container" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
            
            <Row>
                <Col md="12" className="mt-2">
                    <Row>
                        <Col xs="7" className="fw-bold" style={{fontSize:"1rem", color: `${currentTheme.textColor}`}}>
                            Sponsered
                        </Col>
                        <Col xs="5" style={{fontSize:"0.9rem", color: `${currentTheme.textColor}`}}>
                            Create Ad
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <img
                            width="100%"
                            height="auto"
                            alt="advert"
                            src="/tshirt_1.webp"
                            style={{ borderRadius: "1rem", margin: "0.75rem 0" }}
                        />
                    </Row>
                    <Row>
                        <Col xs="6" className="fw-bold" style={{fontSize:"0.9rem", color: `${currentTheme.textColor}`}}>
                            AniStore
                        </Col>
                        <Col xs="6" style={{fontSize:"0.9rem", color: `${currentTheme.textColor}`}}>
                            Anistore.com
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <CardText style={{fontSize:"0.8rem", color: `${currentTheme.textColor}`}}>
                            Immerse yourself in a spectrum of colors that pop! 
                            Our T-shirts are printed using high-quality inks to ensure long-lasting, 
                            vivid designs that capture the essence of your beloved anime.
                        </CardText>
                    </Row>
                </Col>

                <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />

                <Col md="12" className="d-flex align-items-center justify-content-center">
                    <Row>
                    <Col>
                        <CardTitle className="fw-bold" style={{fontSize:"1rem", color: `${currentTheme.textColor}`}}>
                            Follow me on X...
                        </CardTitle>
                    </Col>
                    <Col className="mt-2">
                        <TwitterFollowButton 
                            backgroundColor="white"
                            onLoad={function noRefCheck(){}}
                            options = {{ size: 'large' }}
                            screenName="Venkat87436105"
                            placeholder={
                                <div className="Center">
                                    <Spinner color={ theme === "light" ? "dark" : "light"} />
                                    <div style={{color: `${currentTheme.textColor}`}}>Loading...</div>
                                </div>
                                    
                            }
                        />
                    </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default TwitWidget;