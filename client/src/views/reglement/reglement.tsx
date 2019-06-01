import React from "react";
import { Card, Nav } from "react-bootstrap";


const Reglement = () => {

    return (
        <React.Fragment>
            <div className='container Landing' style={{
                backgroundColor: '#005360', height: '100vh', display: 'flex',
                flexDirection: 'column', alignItems: 'center'
            }}>
                <Card className='card' style={{ width: '100%', maxWidth: '1000px', margin: 'auto auto' }}>
                    <Card.Header style={{ textAlign: 'center' }}>Règlements</Card.Header>
                    <Card.Body style={{ textAlign: 'justify' }}>
                        <Card.Title style={{ textAlign: 'center' }}>Droit à l'image</Card.Title>
                        <Card.Text>
                            Vous autorisez que des photos de vous puissent être prises dans le cadre
                            de votre poste à ETIC INSA Technologies.
                            Vous autorisez également ETIC INSA Technologies et ses partenaires proches à
                            publier des photos de vous prises lors d’événements sur tous ses canaux de communication
                            internes ou externes.
                        </Card.Text>
                        <Card.Text>
                            L’œuvre demeurera la propriété exclusive de ETIC INSA Technologies qui s’interdit
                            expressément de céder les présentes autorisations à un tiers.
                            L’association s’interdit également de procéder à une exploitation illicite, ou non prévue de
                            votre image susceptible de porter atteinte à votre dignité, votre réputation ou à votre vie privée et
                            toute autre exploitation préjudiciable selon les lois et règlements en vigueur
                            (vu le Code civil et le Code de la propriété intellectuelle). Dans le cadre associatif défini,
                            l’oeuvre ne pourra donner lieu à aucune rémunération ou contrepartie sous quelque forme
                            que ce soit. Cette acceptation expresse est définitive et exclut toute demande de rémunération
                            ultérieure.
                        </Card.Text>
                        <Card.Text>
                            Pour toutes demandes complémentaires, n’hésitez pas à vous adresser à responsable.dsi@etic-insa.com
                        </Card.Text>
                        <Card.Title style={{ textAlign: 'center' }}>Charte RSE</Card.Title>
                        <Card.Text>
                            Lerem Ipsum
                        </Card.Text>
                        <Card.Title style={{ textAlign: 'center' }}>Règlement Intérieur</Card.Title>
                        <Card.Text>
                            Lerem Ipsum
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default Reglement;