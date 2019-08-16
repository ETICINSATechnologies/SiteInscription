import React from "react";
import { Card, Nav } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

const Landing_Membre = () => {

    return (
        <Card className='card has-max-width-500'>
            <Card.Header>ETIC INSA Technologies</Card.Header>
            <Card.Body className='text-center'>
                <Card.Title>Inscription</Card.Title>
                <Card.Text>Vous avez bien été inscrit comme membre à ETIC INSA Technologies</Card.Text>
                <Card.Text>Veuillez-compléter la fiche d'inscription ci-dessous et la renvoyer à secretaire.general@etic-insa.com</Card.Text>
                <Nav.Item>
                    <Nav.Link href="/api/file/fiche_inscription_membre">Fiche d'inscription</Nav.Link>
                </Nav.Item>
                <Card.Img src={Logo} alt='logo etic' className='logo' />
            </Card.Body>
        </Card>
    );
}

export default Landing_Membre;