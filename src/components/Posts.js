import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import { SET_LOADING, SET_POST } from "../context/action.types";
import { Spinner, Pagination, PaginationItem, PaginationLink, Row, Col } from "reactstrap";

import Post from "./Post";
import AppTheme from "../theme";

const Posts = ({profile=false, userprofileId=""}) => {
    const {state, dispatch} = useContext(UserContext);
    const {theme} = state;
    const currentTheme = AppTheme[theme];

    const {posts, isLoading} = state;
    // const [postsCount, setPostsCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [curPage, setCurPage] = useState(1);
    
    const getPosts = async () => {
        try {

            dispatch({
                type:SET_LOADING,
                payload: true
            });

            // console.log(curPage);
            const {data} = await Axios.get(`${API_BASE}/api/v1/getallposts?page=${curPage}`, { withCredentials: true });

            dispatch({
                type:SET_POST,
                payload:data.posts
            });

            // setPostsCount(data.totalPosts);
            // console.log(postsCount);
            setPages(Math.ceil(data.totalPosts / 5));
            
            // console.log(pages);

            dispatch({
                type:SET_LOADING,
                payload: false
            });
            
        } catch (error) {

            dispatch({
                type:SET_LOADING,
                payload: false
            });

            console.log(error);
        }
    }

    const getUserPosts = async () => {
        try {

            dispatch({
                type:SET_LOADING,
                payload: true
            });

            const {data} = await Axios.get(`${API_BASE}/api/v1/getuserposts/${userprofileId}?page=${curPage}`, 
                            { withCredentials: true });

            setPages(Math.ceil(data.totalPosts / 5));

            dispatch({
                type:SET_POST,
                payload:data.userPosts
            });

            dispatch({
                type:SET_LOADING,
                payload: false
            });
            
        } catch (error) {

            dispatch({
                type:SET_LOADING,
                payload: false
            });

            console.log(error);
        }
    }

    
    useEffect(() => {
        if(profile){
            getUserPosts();
        } else {
            getPosts();
        }
        
    },[profile, userprofileId, curPage]); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
        <div className="Center">
            <Spinner color={ theme === "light" ? "dark" : "light"} />
            <div style={{color: `${currentTheme.textColor}`}}>Loading...</div>
        </div>
        );
    }

    return(
        <>
            {
                posts.map(({_id,
                userId,
                firstname,
                lastname,
                location,
                description,
                postImage,
                userImage,
                likes,
                comments,
                rePost,
                profile,
                userprofileId
                }) => (

                    <Post
                        key={_id}
                        postId={_id}
                        postUserId={userId}
                        name={`${firstname} ${lastname}`}
                        description={description}
                        location={location}
                        postPath={postImage?.secure_url}
                        userImage={userImage}
                        likes={likes}
                        comments={comments}
                        rePost={rePost}
                    />
                ))
            }
            <Row>
                <Col md="12" className="text-center">
                <Pagination 
                    className="d-flex align-items-center justify-content-center"
                    style={{boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", borderRadius: "8px"}}
                >
                    <PaginationItem>
                        <PaginationLink
                        href="#"
                        first
                        style={{backgroundColor: `${currentTheme.backgroundColor}`, color: `${currentTheme.textColor}` }}
                        />
                    </PaginationItem>
                    {[...Array(pages)].map((_, i) => (
                        <PaginationItem key={i} onClick={() => {
                            setCurPage(i+1);
                            // console.log(i+1);
                            // getPosts();
                            }}
                        >
                            <PaginationLink href="#" 
                                style={{backgroundColor: `${currentTheme.backgroundColor}`, 
                                        color: `${currentTheme.textColor}` 
                                    }}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationLink
                        href="#"
                        last
                        style={{backgroundColor: `${currentTheme.backgroundColor}`, color: `${currentTheme.textColor}` }}
                        />
                    </PaginationItem>
                </Pagination>
                </Col>
            </Row>
        </>
    );
}

export default Posts;