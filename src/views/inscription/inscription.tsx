import React, {useState} from 'react';
import './inscription.css';
import Modal from "../../components/Modal/Modal";
import {Member, defaultMember} from "../../model/Member";
import {Consultant, defaultConsultant} from "../../model/Consultant";
import {Person} from "../../model/Person";
import {Card, Button, Form} from "react-bootstrap";

declare global {
    interface Window { Stripe: any; }
}

interface InscriptionState {
    person: Person
    showModal : boolean
}

interface InscriptionProps {
    isConsultant : boolean
}

const Inscription = (props : InscriptionProps) =>{
    const [state, setState]=useState({
                                    person: props.isConsultant? defaultConsultant:defaultMember,
                                    showModal: false,
                                } as InscriptionState);


    const onSubmit = () =>{
        // compose our own form data
        let form_data = new FormData();

        for ( let key in state.person ) {
            // console.log(key + ' : ' + (state.person[key]));
            form_data.append(key, state.person[key]);
        }

        if (props.isConsultant) {
            fetch('sg/consultant-inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
    
                body: form_data
            })
                .then(res => {
                    if (res.status === 201) {
                        console.log('success');
                        showModal();
                    } else {
                        
                    }
                });
        } else {
            fetch('sg/membre-inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
    
                body: form_data
            })
                .then(res => {
                    if (res.status === 201) {
                        console.log('success');
                        res.json()
                        .then (result => {
                            console.log(result);
                        })
                    } else {
                        alert('Veuillez-verifier vos informations');
                    }
                });
        }

        // payment();

    };

    const showModal = () => {
        setState({
            ...state,
            showModal : !state.showModal,
        })
    }

    const payment = () => {
        var stripe = window.Stripe('pk_test_O0FCm2559gZbRpWia2bR0yVm00Qc7SPLU0');
        stripe.redirectToCheckout({
            items: [
              {sku: 'sku_EuRlqkdKSw1RxK', quantity: 1}
            ],
            successUrl: 'https://www.google.sc/',
            cancelUrl: 'https://www.google.fr/',
          }).then(function (result: any) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
          });
    }

    return (
        <React.Fragment>
            <div className='container Inscription' style={{backgroundColor : '#005360'}}>
                <Card className='card' style={{ width: '95%', maxWidth: '25rem', margin : 'auto auto' }}>
                    <Card.Header>ETIC INSA Technologies</Card.Header>
                    <Card.Body style={{textAlign: 'center'}}>
                        <Card.Title>{props.isConsultant? 'Inscription Consultant' : 'Inscription Membre'}</Card.Title>
                        <Form>
                            <Form.Group controlId='firstName'>
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control type='text' placeholder="Denys" required 
                                                maxLength={20}/>
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Nom de famille</Form.Label>
                                <Form.Control type="text" placeholder="Chomel" required
                                                maxLength={20}/>
                            </Form.Group>
                            <Form.Group controlId="phoneNumber">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control type="tel" placeholder="0612345678" required
                                                pattern='[0]{1}[0-9]{9}'/>
                            </Form.Group>
                            <Form.Group controlId="department">
                                <Form.Label>Department</Form.Label>
                                <Form.Control as="select" required>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </Form.Group>
                            {props.isConsultant?
                                // all consultant specific fields here
                                <Form.Group controlId='document_vitale_card'>
                                    <Form.Label>Carte Vitale</Form.Label>
                                    <Form.Control type='file' required />
                                </Form.Group>
                                :
                                // all member specific fields here
                                null
                            }
                            <Button variant="primary" type="submit">
                                {props.isConsultant? 'Valider' : 'Valider et Payer'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    )
};

export default Inscription;
