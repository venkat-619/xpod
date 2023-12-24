import React, {useContext, useState, useEffect} from "react";
import { Card, Col, Input, Row, Button, Spinner, CardTitle } from "reactstrap";

import { MdOutlineImage, 
        MdOutlineGifBox, 
        MdOutlineMic, 
        MdOutlineEdit,
        MdDeleteOutline, } from "react-icons/md";

import { ImUndo2 } from "react-icons/im";

import { useMediaQuery } from 'react-responsive';
import Dropzone from "react-dropzone";

import UserImage from "./UserImage";
import { UserContext } from "../context/UserContext";
import { SET_LOADING, SET_SINGLE_POST, SET_UPDATED_POST } from "../context/action.types";
import Axios from "axios";
import API_BASE from "../helper/apiUrl";
import { toast } from "react-toastify";
import AppTheme from "../theme";

import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "../helper/config";



const PostBox = ({ edit=false, setEditPost, postId, description, postPath}) => {

    const {user, dispatch, state} = useContext(UserContext);
    const {isLoading, theme} = state;
    const currentTheme = AppTheme[theme];

    const [post, setPost] =useState("");
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);

    const isNonMobileScreens = useMediaQuery({ minWidth: 1000 });

    useEffect(() => {
        if (edit) {
            setPost(description);
    
            setIsImage(postPath ? !isImage : isImage);
        }
    }, [edit, description, postPath]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // here useEffect for storing image since,
    // To access the updated value of isImage, you can use a separate useEffect
    useEffect(() => {
        if (isImage && postPath) {

            try {
                const fetchFile = async () => {
                    const response = await fetch(postPath);
    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                    }
    
                    const imageBlob = await response.blob();
                    const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' });
    
                    return imageFile;
                };
    
                fetchFile()
                    .then(imageFile => {
                        setImage(imageFile);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }, [isImage, postPath]);

    const createPost = async () => {
        
        try {

            const formData = new FormData();
            formData.append("description", post);

            if (image) {
                let resizedImage = await readAndCompressImage(image, imageConfig);
                formData.append("postPhoto", resizedImage);
            }

            dispatch({
                type: SET_LOADING,
                payload: true
            });
        
            const {data} = await Axios.post(API_BASE + "/api/v1/createpost", formData, {
                withCredentials: true,
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            dispatch({
                type: SET_SINGLE_POST,
                payload: data.newPost
            });

            // console.log(data);

            setImage(null);
            setPost("");

            toast(`Posted Successfully...`, {type:"success", theme});
            
        } catch (error) {

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            toast(`Something went wrong...`, {type:"error", theme});
            console.log(error);
        }
    };

    const editOldPost = async () => {
        try {

            const formData = new FormData();
            formData.append("description", post);

            if (image) {
                formData.append("postPhoto", image);
            }

            dispatch({
                type: SET_LOADING,
                payload: true
            });
        
            const {data} = await Axios.put(`${API_BASE}/api/v1/editpost/${postId}`, formData, {
                withCredentials: true,
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            dispatch({
                type: SET_UPDATED_POST,
                payload: {
                    updatedPost: data.updatedPost
                }
            });

            setImage(null);
            setPost("");

            toast(`Edited Posted Successfully...`, {type:"success", theme});
            
        } catch (error) {

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            toast(`Something went wrong...`, {type:"error", theme});
            console.log(error);
        }
    }

    const handlePost = () => {
        if(edit) {
            editOldPost();
        } else {
            createPost();
        }

        setImage(null);
        setPost("");
    }

    if (isLoading) {
        return (
        <div className="Center">
            <Spinner color={ theme === "light" ? "dark" : "light"} />
            <div style={{color: `${currentTheme.textColor}`}}>Loading...</div>
        </div>
        );
    }

    return(
        <Card className="card-container" style={{backgroundColor: `${currentTheme.backgroundColor}`}}>
            {edit ? (
                <>
                    <Row>
                    <Col xs="10">
                        <CardTitle 
                            tag={"h5"} 
                            className="fw-bold d-flex align-items-center justify-content-center"
                            style={{color: `${currentTheme.textColor}`}}
                        >
                            Edit Post...
                        </CardTitle>
                    </Col>
                    <Col xs="2" className="cursor-pointer" onClick={() => setEditPost(!edit)}>
                        <ImUndo2 size={25} style={{color: `${currentTheme.textColor}`}} />
                    </Col>
                    </Row>
                    <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />
                </>
                ) : (<></>)}
            <Row>
                <Col xs="3" className="d-flex align-items-center justify-content-center">
                    <UserImage imageUrl={user.photo?.secure_url}/>
                </Col>
                <Col xs="9" className="ps-0 mt-2">
                    <Input 
                        className="input-box-style"
                        onChange={e => setPost(e.target.value)}
                        value={post}
                        style={{
                            backgroundColor: `${currentTheme.inputBGC}`,
                            color:`${currentTheme.inputColor}`,
                            boxShadow: `${currentTheme.boxShadow}`,
                            border: "none"
                        }}
                        placeholder="What's happening..." 
                    />
                </Col>
            </Row>

            {isImage && (
                <Row 
                    style={{
                        border:"1px solid #A3A3A3",
                        borderRadius:"5px",
                        marginTop:"1rem",
                        padding:"1rem",
                    }}
                >
                    <Dropzone
                        accept="image/*"
                        multiple={false}
                        onDrop={(acceptedFiles) => {
                            setImage(acceptedFiles[0]);
                            console.log(acceptedFiles[0]); 
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <>
                            <Col
                                xs="10"
                                {...getRootProps()}
                                className={`border ${theme === "light" ? "border-dark" : "border-white"} rounded p-4`}
                                style={{ cursor: "pointer"}}
                            >
                                <input {...getInputProps()} />
                                {!image ? (
                                    <p className="mb-0" style={{color: `${currentTheme.textColor}`}}>
                                        Add Image Here
                                    </p>
                                ) : (
                                    <Row>
                                        <Col xs="10">
                                            <span className="" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                                                {image.name}
                                            </span>
                                        </Col>
                                        <Col xs="2">
                                            <MdOutlineEdit 
                                                size={20}
                                                style={{color: `${currentTheme.textColor}`}}
                                            />
                                        </Col>
                                        
                                    </Row>
                                )}
                            </Col>
                            <Col xs="2" 
                                className="cursor-pointer d-flex align-items-center justify-content-center" 
                                onClick={() => setImage(null)}
                            >
                                <MdDeleteOutline 
                                    size={25} 
                                    style={{color: `${currentTheme.textColor}`}}
                                />
                            </Col>
                            </>
                        )}
                    </Dropzone>
                </Row>
            )}
            
            <hr className="my-4" style={{borderColor: `${currentTheme.textColor}`}} />

            <Row>
                {isNonMobileScreens ? (
                    <>
                    <Col xs="3" className="mt-1 cursor-pointer" onClick={() => setIsImage(!isImage)}>
                        <MdOutlineImage size={25} style={{color: `${currentTheme.textColor}`}}/>
                        <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                            Image
                        </span>
                    </Col>
                    <Col xs="3" className="mt-1 mobile-app">
                        <MdOutlineGifBox size={25} style={{color: `${currentTheme.textColor}`}}/>
                        <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                            Gif
                        </span>
                    </Col>
                    <Col xs="3" className="mt-1 mobile-app">
                        <MdOutlineMic size={25} style={{color: `${currentTheme.textColor}`}}/>
                        <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                            Audio
                        </span>
                    </Col>
                    <Col xs="3">
                        <Button
                            disabled={!post}
                            color={ theme === "light" ? "dark" : "light"}
                            block
                            className="text-uppercase"
                            style={{borderRadius:"2rem", fontSize:"0.8rem"}}
                            onClick={handlePost}
                        >
                            {edit ? "Edit" : "Post"}
                        </Button>
                    </Col>
                    </>
                ) : (
                    <>
                    <Col xs="9" className="mt-1 cursor-pointer" onClick={() => setIsImage(!isImage)}>
                        <MdOutlineImage size={25} style={{color: `${currentTheme.textColor}`}}/>
                        <span className="ms-2" style={{fontSize:"15px", color: `${currentTheme.textColor}`}}>
                            Image
                        </span>
                    </Col>
                    <Col xs="3">
                        <Button
                            disabled={!post}
                            color={ theme === "light" ? "dark" : "light"}
                            block
                            className="text-uppercase"
                            style={{borderRadius:"2rem", fontSize:"0.8rem"}}
                            onClick={handlePost}
                        >
                            {edit ? "Edit" : "Post"}
                        </Button>
                    </Col>
                    </>
                )
                }
            </Row>
        </Card>
    );
}

export default PostBox;