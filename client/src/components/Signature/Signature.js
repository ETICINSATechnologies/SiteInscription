import React, { useState, useRef } from 'react'
import { Button } from "react-bootstrap"
import SignaturePad from 'react-signature-canvas'

import './Signature.css'

const Signature = (props) => {
    const [state, setState] = useState({ trimmedDataURL: null })
    const sigPad = useRef({});
    const clear = () => {
        sigPad.current.clear()
    }
    const trim = () => {
        if (sigPad) {
            const trimmedDataURL = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
            setState({
                trimmedDataURL
            })
            props.handleValider(trimmedDataURL)
        }
    }
    return (
        <>
            <p>Signe dans le cadre ci-dessous :</p>
            <SignaturePad canvasProps={{ className: 'sigPad' }} ref={sigPad} />
            <div className='signature_button_container'>
                <Button onClick={clear}>Effacer</Button>
                <Button onClick={trim}>Sauvegarder</Button>
            </div>
            {state.trimmedDataURL ? <img className={'sigImage'} src={state.trimmedDataURL} alt="Signature" /> : null}
        </>
    )
}

export default Signature