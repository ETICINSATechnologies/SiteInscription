import React, {useState, useRef} from 'react'
//import { Button } from "react-bootstrap"
import SignaturePad from 'react-signature-canvas'

import './Signature.css'

const Signature = (props) => {
    const [state, setState] = useState({ trimmedDataURL: null })
    const sigPad = useRef({});
    const clear = () => {
        sigPad.current.clear()
    }
    const trim = () => {
        setState({
            trimmedDataURL: sigPad.getTrimmedCanvas().toDataURL('image/png')
        })
        //props.handleValider(trimmedDataURL)
    }
    return (
        <div className={'bigContainer'}>
            <div className={'sigContainer'}>
                <SignaturePad canvasProps={{ className: 'sigPad' }} ref={sigPad} />
            </div>
            <div>
                <button onClick={clear}>Effacer</button>
                <button onClick={trim}>Sauvegarder</button>
            </div>
            {state.trimmedDataURL ? <img className={'sigImage'} src={state.trimmedDataURL} alt="Signature" /> : null}
        </div>
    )
}

export default Signature