import React from "react";
import './Modal.css';
import cancelIcon from "../../resources/cancel_icon.png";

interface Props {
    children: any;
    onClose: Function;
    show: boolean;
    className: string;
}


function Modal(props: Props){
    return (
        !props.show? null :
            <div className="Modal">
                <div className={props.className + 'content'}>
                    {props.children}
                    <div className="header">
                        <img className="annuler"
                             src={cancelIcon}
                             onClick={()=> props.onClose()} alt="Annuler"
                        />
                    </div>
                </div>
            </div>
    );
}

export default Modal;