import React, {useState, useContext} from "react";
import { Card, CardTitle, CardText, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { MdOutlineFavoriteBorder, 
            MdOutlineFavorite, 
            MdChatBubbleOutline,
            MdRepeat,
            MdRepeatOn,
            MdOutlineShare,
            MdPersonAddAlt1,
            MdPersonRemoveAlt1} from "react-icons/md";

import { BsThreeDotsVertical } from "react-icons/bs";

import PostBox from "./PostBox";

import UserImage from "./UserImage";
import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import { DELETE_POST, SET_FRIENDS, SET_UPDATED_POST } from "../context/action.types";
import { toast } from "react-toastify";
import AppTheme from "../theme";

const Post = ({
    postId,
    postUserId,
    name,
    description,
    location,
    postPath,
    userImage,
    likes,
    comments,
    rePost,
    profile,
    userprofileId}) => {

        const {state, user, dispatch} = useContext(UserContext);
        const {friends, theme} = state;
        const currentTheme = AppTheme[theme];

        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [editPost, setEditPost] = useState(false);

        const dropDowntoggle = () => setDropdownOpen(!dropdownOpen);

        const naviagte = useNavigate();

        const isLiked = Boolean(likes[user._id]);
        const likeCount = Object.keys(likes).length;

        const isrePosted = Boolean(rePost[user._id]);
        const rePostCount = Object.keys(rePost).length;


        const likePost = async () => {
            try {

                const formData = new FormData();
                formData.append("postId", postId);

                const {data} = await Axios.post(`${API_BASE}/api/v1/likepost/${postId}`, formData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                
                if(isLiked){
                    toast("DisLiked the post", {type:"success", theme});
                } else {
                    toast("Liked the post", {type:"success", theme});
                }

                dispatch({
                    type: SET_UPDATED_POST,
                    payload: {
                        updatedPost: data.updatedPost
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }

        const deletePost = async () => {
            try {
                
                await Axios.delete(`${API_BASE}/api/v1/deletepost/${postId}`, {withCredentials: true});
                
                dispatch({
                    type: DELETE_POST,
                    payload: {
                        postId
                    }
                })
                toast('Deleted post successfully...', {type: "error", theme});
            } catch (error) {
                console.log(error);
            }
        }

        const addRemoveFriend = async () => {
            try {

                const formData = new FormData();
                formData.append("friendId", postUserId);

                const {data} = await Axios.put(`${API_BASE}/api/v1/addremovefriend`, formData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                if(!friends.some(friend => friend["_id"] === postUserId)){
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

        return(
            <>
            {
                editPost ? (
                    <PostBox 
                        edit={editPost}
                        setEditPost={setEditPost}
                        postId={postId}
                        description={description}
                        postPath={postPath}
                    />
                ) : (
                    <Card className="card-container mb-3" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
                        <Row>
                            <Col xs="3" className="d-flex align-items-center justify-content-center">
                                <UserImage imageUrl={userImage}/>
                            </Col>
                            <Col xs="7" className="mt-1 cursor-pointer" onClick={() => naviagte(`/profile/${postUserId}`)}>
                                <CardTitle tag={"h5"} className="fw-bold" style={{color: `${currentTheme.textColor}`}}>
                                    { name }
                                </CardTitle>
                                <CardText style={{fontSize:"14px", color: `${currentTheme.textColor}`}} >
                                    {location}
                                </CardText>
                            </Col>
                            <Col xs="2" 
                                className="d-flex align-items-center justify-content-center"
                            >
                                { 
                                    postUserId === user._id ? (
                                        <Dropdown 
                                            isOpen={dropdownOpen} 
                                            toggle={dropDowntoggle} 
                                            direction={"right"} 
                                            className="dropdown-custom"
                                        >
                                            <DropdownToggle color="white"> 
                                                <BsThreeDotsVertical 
                                                    size={20} 
                                                    style={{color: `${currentTheme.textColor}`}}
                                                />
                                            </DropdownToggle>
                                            <DropdownMenu color="light" 
                                                style={{backgroundColor: currentTheme.dropdownMenu}}
                                            >
                                                <DropdownItem 
                                                    className="dropdown-custom-item"
                                                    style={{ color: `${currentTheme.textColor}`}}
                                                    onClick={() => setEditPost(!editPost)}
                                                >
                                                    Edit post
                                                </DropdownItem>
                                                <DropdownItem 
                                                    className="dropdown-custom-item"
                                                    style={{ color: `${currentTheme.textColor}`}} 
                                                    onClick={deletePost}
                                                >
                                                    Delete post
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    ) : (
                                        <span 
                                            className="cursor-pointer" 
                                            onClick={addRemoveFriend}
                                        >
                                            {
                                                !friends.some(friend => friend["_id"] === postUserId) ? (
                                                    // <MdOutlinePersonAddAlt size={23} />
                                                    <MdPersonAddAlt1 
                                                        size={23}
                                                        style={{color: `${currentTheme.textColor}`}} 
                                                    />
                                                ) : (
                                                    <MdPersonRemoveAlt1 
                                                        size={23}
                                                        style={{color: `${currentTheme.textColor}`}} 
                                                    />
                                                    // <MdOutlinePersonRemove size={23} />
                                                )
                                            }
                                        </span>
                                    )
                                }
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <span style={{fontSize:"14px", fontWeight:"bold", color: `${currentTheme.textColor}`}}>
                                    {description}
                                    </span>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                            {postPath && (
                                <img
                                width="100%"
                                height="auto"
                                alt="post"
                                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                                src={postPath}
                                />
                            )}
                            </Col>
                        </Row>
                        <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />
                        <Row>
                            <Col xs="3" 
                            className="mt-1 cursor-pointer d-flex alig-items-center justify-content-center" 
                            onClick={() => {likePost()}}
                            >
                                {isLiked ? (
                                    <MdOutlineFavorite size={25} style={{color: `${currentTheme.textColor}`}} />
                                ) : (
                                    <MdOutlineFavoriteBorder size={25} style={{color: `${currentTheme.textColor}`}} />
                                )}
                                <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                                    {likeCount}
                                </span>
                            </Col>
                            <Col xs="3" className="mt-1 d-flex align-items-center justify-content-center">
                                <MdChatBubbleOutline size={25} style={{color: `${currentTheme.textColor}`}} />
                                <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                                    {comments.length}
                                </span>
                            </Col>
                            <Col xs="3" className="mt-1 d-flex align-items-center justify-content-center">
                                {isrePosted ? (
                                    <MdRepeatOn size={25} style={{color: `${currentTheme.textColor}`}} />
                                ) : (
                                    <MdRepeat size={25} style={{color: `${currentTheme.textColor}`}} />
                                )}
                                <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                                    {rePostCount}
                                </span>
                            </Col>
                            <Col xs="3" className="mt-1 d-flex align-items-center justify-content-center">
                                <MdOutlineShare size={25} style={{color: `${currentTheme.textColor}`}} />
                            </Col>
                        </Row>

                    </Card>
                )
            }
            </>
        );
}

export default Post;