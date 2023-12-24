import React, {useContext, useEffect} from "react";
import { Card, CardText, CardTitle, Col, Row } from "reactstrap";

import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from "react-icons/md";

import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import UserImage from "./UserImage";
import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import { SET_FRIENDS } from "../context/action.types";
import { toast } from "react-toastify";
import AppTheme from "../theme";

const FriendList = ({profile=false, userprofileId=""}) => {

    const {state, dispatch, user} = useContext(UserContext);
    const {friends, theme} = state;
    const currentTheme = AppTheme[theme];


    const naviagte = useNavigate();

    const getFriends = async () => {
        try {
            
            const requestData = {
                userId: profile ? userprofileId : user._id,
            };

            const {data} = await Axios.post(`${API_BASE}/api/v1/getuserfriends`, requestData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            // console.log(data);

            dispatch({
                type: SET_FRIENDS,
                payload: {
                    friends: data.formattedFriends
                }
            });
        } catch (error) {
            console.log(error);
        }
      };

      const addRemoveFriend = async (friendId) => {
        try {

            const formData = new FormData();
            formData.append("friendId", friendId);

            const {data} = await Axios.put(`${API_BASE}/api/v1/addremovefriend`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            if(!friends.some(friend => friend["_id"] === friendId)){
                toast("Following as friend successfully...", {type:"success", theme});
            } else {
                toast("Removed following as a friend...", {type:"error", theme});
            }

            dispatch({
                type: SET_FRIENDS,
                payload: {
                    friends: data.formattedFriends
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    
      useEffect(() => {
        if(profile && user._id !== userprofileId){
            return;
        }
        getFriends();
      }, [profile, userprofileId]); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <>
        {profile && user._id !== userprofileId ? (<></>) : 
            (<Card className="card-container" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
                <Row>
                    <Col>
                        <CardTitle className="fw-bold" style={{fontSize:"1.2rem", color: `${currentTheme.textColor}`}}>
                            Friends List
                        </CardTitle>
                    </Col>
                </Row>
                {friends.map(({_id, firstname, lastname, occupation, userImage}) => (
                    <Row className="mt-3" key={_id}>
                        <Col xs="3" className="d-flex align-items-center justify-content-center">
                            <UserImage imageUrl={userImage}/>
                        </Col>
                        <Col xs="7" 
                            className="mt-1 cursor-pointer" 
                            onClick={() => {
                                naviagte(`/profile/${_id}`);
                                // naviagte(0);
                            }}
                        >
                            <CardTitle tag={"h5"} className="fw-bold" style={{color: `${currentTheme.textColor}`}}>
                                { `${firstname} ${lastname}` }
                            </CardTitle>
                            <CardText style={{fontSize:"14px", color: `${currentTheme.textColor}`}}>
                                {occupation}
                            </CardText>
                        </Col>
                        <Col xs="2" 
                            className=" cursor-pointer d-flex align-items-center justify-content-center"
                            
                        >
                            { profile && user._id !== userprofileId ? (<></>) : (
                                <span onClick={() => addRemoveFriend(_id)}>
                                    {
                                        !friends.some(friend => friend["_id"] === _id) ? (
                                            <MdPersonAddAlt1 size={23} style={{color: `${currentTheme.textColor}`}} />
                                        ) : (
                                            <MdPersonRemoveAlt1 size={23} style={{color: `${currentTheme.textColor}`}} />
                                        )
                                    }
                                </span>)
                            }
                        </Col>
                    </Row>
                ))}
            </Card>)
        }
        </>
    )
}

export default FriendList;