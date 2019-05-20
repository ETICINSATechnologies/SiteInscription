import React from 'react';
import Logo from '../../resources/logo_etic_flashy.gif';
import { Card, Button } from "react-bootstrap";


const Home = () => {

    return (
        <React.Fragment>
            <div className='container Home' style={{ backgroundColor: '#005360', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card className='card' style={{ width: '95%', maxWidth: '28rem', margin: 'auto auto' }}>
                    <Card.Header>ETIC INSA Technologies</Card.Header>
                    <Card.Body style={{ textAlign: 'center' }}>
                        <Card.Title>Inscription</Card.Title>
                        <Card.Text>
                            Bienvenue sur le site d'inscription en ligne pour rejoindre la Junior-Entreprise de l'INSA : ETIC INSA Technologies
                        </Card.Text>
                        <Button href="/member" variant="primary" style={{ width: '100%', margin: '0.2rem auto 0.2rem auto' }}>
                            Devenir Membre Actif
                        </Button>
                        <Button href="/consultant" variant="primary" style={{ width: '100%', margin: '0.2rem auto 1rem auto' }}>
                            Devenir Consultant
                        </Button>
                        <Card.Text>
                            Tu rencontres un problème ? Contacte nous : responsable-dsi@etic-insa.com
                        </Card.Text>
                        <Card.Img src={Logo} alt='logo etic' className='logo'
                            style={{ width: '50px', filter: 'contrast(1.25)' }} />
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    )
};


export default Home;