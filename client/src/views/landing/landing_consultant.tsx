import React from "react";
import { Card } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

const Landing_Consultant = () => {

    return (
        <Card className='card has-max-width-500'>
            <Card.Header>ETIC INSA Technologies</Card.Header>
            <Card.Body className='text-center'>
                <Card.Title>Félicitations !</Card.Title>
                <Card.Text>Merci pour ton inscription et pour ta confiance</Card.Text>
                <Card.Text>Notre Secrétaire Générale revient vers toi rapidement pour finaliser ton inscription</Card.Text>
                <Card.Text>Tu rencontres un problème ? Contacte nous : responsable.dsi@etic-insa.com</Card.Text>
                <a href='https://www.etic-insa.com/'><Card.Img src={Logo} alt='logo etic' className='logo' /></a>
            </Card.Body>
        </Card>
    );
}

export default Landing_Consultant;