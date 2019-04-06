import React, {useState} from 'react';
import './inscription.css';
import {Member, defaultMember} from "../../model/Member";
import {Consultant, defaultConsultant} from "../../model/Consultant";
import {Person} from "../../model/Person";

interface InscriptionState {
    person: Person
}

interface InscriptionProps {
    isConsultant : boolean
}

const Inscription = (props : InscriptionProps) =>{
    const [state, setState]=useState({person: props.isConsultant? defaultConsultant:defaultMember} as InscriptionState);


    const onSubmit = () =>{
        // compose our own form data
        let form_data = new FormData();

        for ( let key in state.person ) {
            console.log(key + ' : ' + (state.person[key]));
            form_data.append(key, state.person[key]);
        }

    };

    const onChange = (event: React.ChangeEvent) => {
        event.persist();
        let property=event.target.className;
        let value=(event.target as any).value;
        if (state.person.hasOwnProperty(property)) {
            setState({
                person : {
                    ...state.person,
                    [property] : value,
                }
            })
        }
    };

    const onChangeFile = (event: React.ChangeEvent) => {
        event.persist();
        let property=event.target.className;
        let file=(event.target as any).files[0];
        if (state.person.hasOwnProperty(property)) {
            setState({
                person : {
                    ...state.person,
                    [property] : file,
                }
            })
        }
    };

    return (
        <React.Fragment>
            <div className='Inscription'>
                <div className='content'>
                    <h1>ETIC INSA Technologies</h1>
                    <p>I am a {props.isConsultant? 'consultant':'member'}</p>
                    <form className='inscription form'>
                        <label>
                            Prénom
                            <input type='text' className='firstName' value={state.person.firstName} onChange={onChange}/>
                        </label>
                        <label>
                            Nom
                            <input type='text' className='lastName' value={state.person.lastName} onChange={onChange}/>
                        </label>
                        {props.isConsultant?
                            // all consultant specific fields here
                            <label>
                                Carte Vitale
                                <input className='document_vitale_card' type='file' onChange={onChangeFile}/>
                            </label>

                            :
                            // all member specific fields here
                            null
                        }
                        <input type='button' value='Valider' onClick={()=>onSubmit()}/>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
};

export default Inscription;
