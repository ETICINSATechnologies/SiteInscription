import React, { useState, useEffect } from "react";
import { Card, Nav } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

interface LandingState {
    hasPaid: boolean
}

const Landing_Membre = () => {
    const [state, setState] = useState({
        hasPaid: false
    } as LandingState);

    useEffect(() => {

    }, []);

    return (
        <React.Fragment>
            <div className='container Landing' style={{ backgroundColor: '#005360' }}>
                <Card className='card' style={{ width: '95%', maxWidth: '28rem', margin: 'auto auto' }}>
                    <Card.Header>ETIC INSA Technologies</Card.Header>
                    <Card.Body style={{ textAlign: 'center' }}>
                        <Card.Title>Inscription</Card.Title>
                        <Card.Text>
                            Vous avez bien été inscrit comme membre à ETIC INSA Technologies
                        </Card.Text>
                        <Card.Text>
                            Veuillez-complétéz la fiche d'inscription ci-dessous et la renvoyez à secretaire.generale@etic-insa.com
                        </Card.Text>
                        <Card.Text>
                        <Nav.Item>
                            <Nav.Link href="/api/fiche-inscription">Fiche d'inscription</Nav.Link>
                        </Nav.Item>
                        </Card.Text>
                        <Card.Img src={Logo} alt='logo etic' className='logo' 
                            style={{width:'50px', filter : 'contrast(1.25)'}}/>
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default Landing_Membre;