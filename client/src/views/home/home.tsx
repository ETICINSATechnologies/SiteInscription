import React from 'react';
import Logo from '../../resources/logo_etic_flashy.gif';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';


const Home = () => {

    return (
        <Card className='card has-max-width-500'>
            <Card.Header>ETIC INSA Technologies</Card.Header>
            <Card.Body className="text-center">
                <Card.Title>Inscription</Card.Title>
                <Card.Text>
                    Bienvenue sur le site d'inscription en ligne pour rejoindre la Junior-Entreprise de l'INSA : ETIC INSA Technologies
                </Card.Text>
                <Link to="/member">
                    <Button variant="primary" className="full-width" style={{ margin: '0.2rem auto 0.2rem auto' }}>
                        Devenir Membre Actif
                    </Button>
                </Link>
                <Link to="/consultant">
                    <Button variant="primary" className="full-width" style={{ margin: '0.2rem auto 1rem auto' }}>
                        Devenir Consultant
                    </Button>
                </Link>
                <Card.Text>
                    Tu rencontres un problème ? Contacte nous : responsable-dsi@etic-insa.com
                </Card.Text>
                <Card.Img src={Logo} alt='logo etic' className='logo' />
            </Card.Body>
        </Card>
    )
};


export default Home;