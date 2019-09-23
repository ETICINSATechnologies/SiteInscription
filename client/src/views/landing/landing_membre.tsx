import React from "react";
import { Card, Nav } from "react-bootstrap";
import Logo from '../../resources/logo_etic_flashy.gif';

const Landing_Membre = () => {

    return (
        <Card className='card has-max-width-500'>
            <Card.Header>ETIC INSA Technologies</Card.Header>
            <Card.Body className='text-center'>
                <Card.Title>Félicitations !</Card.Title>
                <Card.Text>Vous avez bien été inscrit comme membre d'ETIC INSA Technologies</Card.Text>
                {/* <Card.Text>Merci de compléter et renvoyer la fiche d'inscription ci-dessous à secretaire.general@etic-insa.com</Card.Text>
                <Nav.Item>
                    <Nav.Link href="/api/file/fiche_inscription_membre">Fiche d'inscription</Nav.Link>
                </Nav.Item> */}
                <Card.Text>
                    Tu rencontres un problème ? Contacte nous : responsable.dsi@etic-insa.com
                </Card.Text>
                <a href='https://www.etic-insa.com/'><Card.Img src={Logo} alt='logo etic' className='logo' /></a>
            </Card.Body>
        </Card>
    );
}

export default Landing_Membre;