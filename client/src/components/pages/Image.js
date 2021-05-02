import React, {useState, useEffect} from "react";

function Image(props){
    const [imageSrc, setImageSrc] = useState("");

    useEffect(()=>{
        const reader = new FileReader();
        reader.readAsDataURL(props.blob);
        reader.onloaded = function () {
            setImageSrc(reader.result);
        }
    }, [props.blob]);
    return (
        <img style={{width:150, height: "auto"}} src={imageSrc} alt={props.fileName}></img>
    );
};

export default Image;