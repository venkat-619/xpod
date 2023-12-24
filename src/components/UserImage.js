import React from "react";


// TODO: image handle better way
const UserImage = ({imageUrl}) => {

    return (
        <div style={{ 
            width: 60, 
            height: 60, 
            overflow: 'hidden', 
            borderRadius: '50%' }}
        >
            {imageUrl ? (<img
                style={{ 
                    objectFit: 'cover', 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%'
                }}
                alt="user"
                src={imageUrl}
            />) : (
                <img alt="empty"  src="/empty.png" style={{ 
                    objectFit: 'contain', 
                    width: '100%', 
                    height: '100%',
                    border: "1px solid rgba(0, 0, 0, 0.2)", 
                    borderRadius: '50%'
                }} />
            )}
            
        </div>
    );
}

export default UserImage;