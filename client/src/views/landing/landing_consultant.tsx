import React from "react";
import { Card } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

const Landing_Consultant = () => {

    return (
        <Card className='card has-max-width-500'>
            <Card.Header>ETIC INSA Technologies</Card.Header>
            <Card.Body className='text-center'>
                <Card.Title>Inscription</Card.Title>
                <Card.Text>
                    Vos détails ont bien été prises en compte
                        </Card.Text>
                <Card.Text>
                    Vous récevrez bientôt un mail pour la suite de votre inscription
                        </Card.Text>
                <Card.Img src={Logo} alt='logo etic' className='logo' />
            </Card.Body>
        </Card>
    );
}

export default Landing_Consultant;