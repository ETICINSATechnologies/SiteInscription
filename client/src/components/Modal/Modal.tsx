import React, { ReactNode } from "react";
import './Modal.css';
import cancelIcon from "../../resources/cancel_icon.png";

interface Props {
    children: ReactNode;
    onClose: Function;
    show: boolean;
    additionalClass: string;
}

function stopPropagation (e : React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
}

function Modal(props: Props) {
    return (
        !props.show ? null :
            <div className={"Modal " + props.additionalClass} onClick={()=>props.onClose()}>
                <div className="content" onClick={stopPropagation}>
                    <div className="header">
                        <img className="annuler"
                            src={cancelIcon}
                            onClick={() => props.onClose()} alt="Annuler"
                        />
                    </div>
                    {props.children}
                </div>
            </div>
    );
}

export default Modal;