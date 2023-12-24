import { DELETE_POST, 
        SET_FRIENDS, 
        SET_THEME_MODE, 
        SET_LOADING, 
        SET_POST,
        SET_PROFILE_FRIENDS,
        SET_SINGLE_POST,
        SET_UPDATED_POST,
        SET_USER_POST } from "./action.types";

const reducer = (state, action) => {
    
    switch (action.type) {
        case SET_POST:
            return action.payload == null ? {...state, posts: []} : {...state, posts: action.payload}
        case SET_USER_POST:
            return action.payload == null ? {...state, userPosts: []} : {...state, userPosts: action.payload}
        case SET_SINGLE_POST:
            return action.payload == null ? {...state, posts: []} : {...state, 
                posts: [action.payload, ...state.posts]}
        case SET_UPDATED_POST:
            return {...state,
                    posts: state.posts.map((post) => {if(post._id === action.payload.updatedPost._id) {
                                    return action.payload.updatedPost;
                                }
                                return post;
                            })
                    }
        case DELETE_POST:
            return {...state,
                    posts: state.posts.filter((post) => post._id !== action.payload.postId)
                    }
        case SET_LOADING:
            return {...state, isLoading: action.payload};
        case SET_FRIENDS:
            return {...state, friends: action.payload.friends, profileFriends:action.payload.friends};
        case SET_PROFILE_FRIENDS:
            return {...state, profileFriends: action.payload.friends};
        case SET_THEME_MODE:
            return {...state, theme: action.payload};
        default:
            return state;
    }
}

export default reducer;
