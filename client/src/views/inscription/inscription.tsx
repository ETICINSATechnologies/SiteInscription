import React, { useState, useEffect } from 'react';
import './inscription.css';
import { Member, defaultMember, MemberInterface } from "../../model/Member";
import { Consultant, defaultConsultant, ConsultantInterface } from "../../model/Consultant";
import { Person } from "../../model/Person";
import { Card, Button, Form } from "react-bootstrap";
import { Department } from '../../model/Department';
import { Country } from '../../model/Country';
import { Pole } from '../../model/Pole';

declare global {
    interface Window { Stripe: any; }
}

interface InscriptionState {
    person: Person
    showModal: boolean
}

interface MetaInfo {
    departments: Department[]
    poles: Pole[]
    countries: Country[]
}

interface InscriptionProps {
    isConsultant: boolean
}

const Inscription = (props: InscriptionProps) => {
    const [state, setState] = useState({
        person: props.isConsultant ? defaultConsultant : defaultMember,
        showModal: false,
    } as InscriptionState);

    const [metaInfo, setMetaInfo] = useState({
        departments: [],
        poles: [],
        countries: []
    } as MetaInfo);

    // you added IF to test, remove it later
    useEffect(() => {
        let departmentsTemp:Department[];
        let polesTemp:Pole[];
        let countriesTemp:Country[];
        /* find a fucking better way to do this */
        // get departments
        fetch('core/department', {
            method: 'GET'
        })
            .then(res => {
                if (res.status == 200) {
                    res.json()
                        .then(result => {
                            departmentsTemp = result
                            departmentsTemp.push({id: 2, label :'IF' ,name :'Informatique'})
                            // get countries
                            fetch('core/country', {
                                method: 'GET'
                            })
                                .then(res => {
                                    if (res.status == 200) {
                                        res.json()
                                            .then(result => {
                                                countriesTemp = result
                                                // get poles
                                                fetch('core/pole', {
                                                    method: 'GET'
                                                })
                                                    .then(res => {
                                                        if (res.status == 200) {
                                                            res.json()
                                                                .then(result => {
                                                                    polesTemp = result
                                                                    setMetaInfo({
                                                                        poles : polesTemp,
                                                                        departments : departmentsTemp,
                                                                        countries : countriesTemp
                                                                    })
                                                                }
                                                                )
                                                        }
                                                    }
                                                    )
                                            }
                                            )
                                    }
                                }
                                )

                        }
                        )
                }
            }
            )

    }, []);

    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault();
        let form_data : FormData  = state.person.getFormData(state.person);

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
                    } else {
                        alert('Oh oh, vérifie tes informations');
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
                        payment();
                    } else {
                        alert('Oh oh, vérifie tes informations');
                    }
                });
        }
    };

    const onChange = (event: React.ChangeEvent) => {
        event.persist();
        let property : string=event.target.className.split(" ")[0];
        let value=(event.target as HTMLFormElement).value;
        if (state.person.hasOwnProperty(property)) {
            setState({
                ... state,
                person : {
                    ...state.person,
                    [property] : value,
                }
            })
        }
    };

    const payment = () => {
        var stripe = window.Stripe('pk_test_O0FCm2559gZbRpWia2bR0yVm00Qc7SPLU0');
        stripe.redirectToCheckout({
            items: [
                { sku: 'sku_EuRlqkdKSw1RxK', quantity: 1 }
            ],
            successUrl: 'https://www.google.sc/',
            cancelUrl: 'https://www.google.fr/',
        }).then(function (result: any) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        });
    }

    const makeOptions = (objectArray: any[]) => objectArray.map((option: any, index: any) => {
        return <option key={index} value={option.id}>{option.label}</option>
    });

    const makeYears = () => {
        //make array
        let dt = new Date();
        let years : number[] = [dt.getFullYear()];
        for (let i=1;i<6;++i) years.push(dt.getFullYear()+i);
        
        //make options
        let yearList = () => years.map((option: number, index: any) => {
            return <option key={index} value={option}>{option}</option>
        })

        return yearList();
    }

    return (
        <React.Fragment>
            <div className='container Inscription' style={{ backgroundColor: '#005360' }}>
                <Card className='card' style={{ width: '100%', maxWidth: '28rem', margin: '1rem auto' }}>
                    <Card.Header style={{ textAlign: 'center' }}>ETIC INSA Technologies</Card.Header>
                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center' }}>{props.isConsultant ? 'Inscription Consultant' : 'Inscription Membre'}</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='firstName'>
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control className='firstName' type='text' placeholder="Denys" required
                                    maxLength={20} onChange={onChange as any} />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Nom de famille</Form.Label>
                                <Form.Control className='lastName' type="text" placeholder="Chomel" required
                                    maxLength={20} onChange={onChange as any} />
                            </Form.Group>
                            <Form.Group controlId="phoneNumber">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control className='phoneNumber' type="tel" placeholder="0612345678"
                                    pattern='[0]{1}[0-9]{9}' onChange={onChange as any}/>
                            </Form.Group>
                            <Form.Group controlId="departmentId">
                                <Form.Label>Departement</Form.Label>
                                <Form.Control className='departmentId' as="select" onChange={onChange as any} required>
                                    {makeOptions(metaInfo.departments)};
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="outYear">
                                <Form.Label>Année de sortie</Form.Label>
                                <Form.Control className='outYear' as="select" onChange={onChange as any}>
                                    {makeYears()}
                                </Form.Control>
                            </Form.Group>
                            {props.isConsultant ?
                                // all consultant specific fields here
                                <Form.Group controlId='document_vitale_card'>
                                    <Form.Label>Carte Vitale</Form.Label>
                                    <Form.Control type='file' required />
                                </Form.Group>
                                :
                                // all member specific fields here
                                null
                            }
                            <div className="text-center"> 
                                <Button variant="primary" type='submit'>
                                    {props.isConsultant ? 'Valider' : 'Valider et Payer'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    )
};

export default Inscription;
