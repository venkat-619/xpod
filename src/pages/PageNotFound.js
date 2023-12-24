import React, {useContext} from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col } from "reactstrap";
import { UserContext } from "../context/UserContext";
import AppTheme from "../theme";

const PageNotFound = () => {

    const {state} = useContext(UserContext);
    const {theme} = state;

    const currentTheme = AppTheme[theme];

    return(
        <Container >
            <Row> 
                <Col sm={{ size: 10, offset: 1 }} className="text-center">
                    <div className="four_zero_four_bg">
                        <h1 className="text-center" >404</h1>
                    </div>

                    <div className="contant_box_404">
                        <h3 className="h2" >Look like you're lost</h3>
                        <p>
                            The page you are looking for is not available!
                        </p>
                        <Link 
                            to="/" 
                            className="link_404" 
                            style={{background: `${currentTheme.textColor}`, color: `${currentTheme.bgc}`}}
                        >
                            Go to Home
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PageNotFound;