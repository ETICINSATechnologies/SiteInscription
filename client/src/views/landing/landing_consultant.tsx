import React from "react";
import { Card } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

interface LandingState {
}

const Landing_Consultant = () => {

    return (
        <React.Fragment>
            <div className='container Landing' style={{ backgroundColor: '#005360', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card className='card' style={{ width: '95%', maxWidth: '28rem', margin: 'auto auto' }}>
                    <Card.Header>ETIC INSA Technologies</Card.Header>
                    <Card.Body style={{ textAlign: 'center' }}>
                        <Card.Title>Inscription</Card.Title>
                        <Card.Text>
                            Vos détails ont bien été prises en compte
                        </Card.Text>
                        <Card.Text>
                            Vous récevrez bientôt un mail pour la suite de votre inscription
                        </Card.Text>
                        <Card.Img src={Logo} alt='logo etic' className='logo'
                            style={{ width: '50px', filter: 'contrast(1.25)' }} />
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default Landing_Consultant;