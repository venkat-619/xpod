import React, {useState, useContext} from "react";

import { MdLightMode, MdDarkMode, MdSearch, MdMessage, MdNotifications, MdHelp } from "react-icons/md";
import { FaBars } from "react-icons/fa6";

// router
import { Link } from "react-router-dom";

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
    InputGroup,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroupText,
} from "reactstrap";

import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import Axios from "axios";
import { SET_THEME_MODE, SET_LOADING } from "../context/action.types";
import API_BASE from "../helper/apiUrl";
import { toast } from "react-toastify";
import AppTheme from "../theme";

const Header = () => {
    const {state, user, setUser, dispatch}= useContext(UserContext);
    const {theme} = state;
    const currentTheme = AppTheme[theme];

    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [searchDropdown, setSearchDropdown] = useState(false);
    const [cancelToken, setCancelToken] = useState(null);
    const [searchData, setSearchData] = useState([]);

    const toggle = () => setIsOpen(!isOpen);
    const dropDowntoggle = () => setDropdownOpen(!dropdownOpen);
    const searchDropdowntoggle = () => {};
    

    const navigate = useNavigate();

    const handleLogOut = () => {
        setUser(null);

        try {
            const logOut = async () => {

                dispatch({
                    type: SET_LOADING,
                    payload: true
                });

                await Axios.get(API_BASE + '/api/v1/logout', {withCredentials: true});

                dispatch({
                    type: SET_LOADING,
                    payload: false
                });
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                toast('Logged out successfully...', {type:'success', theme})
            }

            logOut();
        } catch (error) {

            dispatch({
                type: SET_LOADING,
                payload: false
            });

            console.log(error);
        }
    }


    const onType = async (e) => {
      const search = e.target.value;

      if (search === "") {
        setSearchData([]);
        return;
      }

      if(cancelToken && cancelToken.token) {
        cancelToken.cancel("Canceling the previous req");
      }

      const newCancelToken = Axios.CancelToken.source();
      setCancelToken(newCancelToken);

      try {
        const result = await Axios.get(`${API_BASE}/api/v1/getusers?search=${search}`, 
        {cancelToken: newCancelToken.token, withCredentials: true}
        );
        // console.table(result.data);
        setSearchData(result.data?.newusers);
        // console.log(searchData);
      } catch (error) {
        console.log(error);
      }
      
    }

    return(
        <Navbar  expand="md" style={{backgroundColor:`${currentTheme.backgroundColor}`}}>
            <NavbarBrand className="ps-5 nav-header" tag={Link} to ="/" style={{color: `${currentTheme.textColor}`}}>
                XPOD
            </NavbarBrand>
            <NavbarText className="mobile-app">
                {user ? (
                    <>
                    <InputGroup>
                            <input 
                            className="input-style" 
                            placeholder="search..."
                            onChange={onType} 
                            style={{
                                backgroundColor: `${currentTheme.inputBGC}`,
                                color:`${currentTheme.inputColor}`,
                                boxShadow: `${currentTheme.boxShadow}`,
                                border: theme === "light" ? `${currentTheme.inputBorder}` : "none"
                            }}
                            />
                            <InputGroupText 
                                className="cursor-pointer" 
                                // style={{boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)"}}
                                style={{
                                    backgroundColor: `${currentTheme.inputBGC}`,
                                    color:`${currentTheme.inputColor}`,
                                    boxShadow: `${currentTheme.boxShadow}`,
                                    border: `${currentTheme.inputBorder}`
                                }}
                                onClick={() => {if(searchData.length > 0){
                                    const id = searchData[0]?._id;
                                    setSearchData([]);
                                    navigate(`/profile/${id}`);
                                }}}
                            >
                            <MdSearch color={currentTheme.textColor} />
                            </InputGroupText>
                    </InputGroup>
                    {searchData?.length > 0 && (
                        <Dropdown 
                            isOpen={true} 
                            toggle={searchDropdowntoggle} 
                            direction={"down"} 
                            className="dropdown-custom"
                        >
                            <DropdownToggle 
                                style={{
                                    backgroundColor:`${currentTheme.backgroundColor}`,
                                    border: "none",
                                    borderRadius:"0px", 
                                    boxShadow: "none",
                                    maxWidth:"150px",
                                    outline:"none !important",
                                }}
                            ></DropdownToggle>
                            <DropdownMenu style={{backgroundColor: currentTheme.dropdownMenu}}>
                            {searchData.map((data) => (
                                <DropdownItem
                                key={data._id}
                                className="cursor-pointer dropdown-custom-item"
                                onClick={() => {
                                    setSearchData([]);
                                    navigate(`/profile/${data?._id}`)
                                }}
                                style={{width:'250px', color: `${currentTheme.textColor}`}}
                                >
                                {`${data.firstname} ${data.lastname}`}
                                </DropdownItem>
                            ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}
                    </>
                    ) : null
                }
            </NavbarText>
            <NavbarToggler onClick={toggle}>
                <FaBars size={25} color={currentTheme.textColor} />
            </NavbarToggler>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ms-auto pe-5" navbar>
                    <NavItem 
                        className="ms-4 cursor-pointer" 
                        onClick={() => {
                            dispatch({type: SET_THEME_MODE, 
                                payload: theme ==="light" ? "dark" : "light"
                            });
                            localStorage.setItem("theme", theme);
                        }}
                    >
                        <NavLink>
                            { theme ==="light" ? (
                                <MdLightMode size={25} color={currentTheme.textColor} />) : (
                                <MdDarkMode size={25} color={currentTheme.textColor} />) }
                        </NavLink>
                    </NavItem>
                    {
                        user ? (
                            <>
                                <NavItem className="ms-4">
                                    <NavLink >
                                        <MdMessage size={25} color={currentTheme.textColor} />
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ms-4">
                                    <NavLink >
                                        <MdNotifications size={25} color={currentTheme.textColor} />
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ms-4">
                                    <NavLink >
                                        <MdHelp size={25} color={currentTheme.textColor} />
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ms-4">
                                    <Dropdown 
                                        isOpen={dropdownOpen} 
                                        toggle={dropDowntoggle} 
                                        direction={"down"} 
                                        style={{ backgroundColor: `${currentTheme.dropdownColor} `, 
                                            // border: "1px solid #ccc",
                                            border: "none",
                                            borderRadius:"5px", 
                                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                                            maxWidth:"150px",
                                            outline:"none !important",   
                                        }}
                                        className="dropdown-custom"
                                    >
                                        <DropdownToggle 
                                            caret 
                                            color={currentTheme.dropdownToggle}
                                            style={{
                                                color: `${currentTheme.textColor}`,
                                                backgroundColor: `${currentTheme.dropdownToggle}`,
                                            }}
                                        >
                                            {`${user.firstname} ${user.lastname}`}
                                        </DropdownToggle>
                                        <DropdownMenu style={{backgroundColor: currentTheme.dropdownMenu}}>
                                        <DropdownItem 
                                            className="dropdown-custom-item" 
                                            style={{ color: `${currentTheme.textColor}`}}
                                            onClick={() => navigate('/')}>
                                            {`${user.firstname} ${user.lastname}`}
                                        </DropdownItem>
                                        <DropdownItem 
                                            className="dropdown-custom-item" 
                                            style={{ color: `${currentTheme.textColor}`}}
                                            onClick={handleLogOut}
                                        >
                                            Logout
                                        </DropdownItem>
                                        
                                        </DropdownMenu>
                                    </Dropdown>
                                    
                                </NavItem>
                            </>
                        ) : (
                            <>
                                <NavItem className="ms-4">
                                    <NavLink tag={Link} to ="/signin" style={{color: `${currentTheme.textColor}`}}>
                                        Signin
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ms-4">
                                    <NavLink tag={Link} to ="/signup" style={{color: `${currentTheme.textColor}`}}>
                                        Signup
                                    </NavLink>
                                </NavItem>
                            </>
                        )
                    }
                </Nav>
            </Collapse>
        </Navbar>

    );
}

export default Header;