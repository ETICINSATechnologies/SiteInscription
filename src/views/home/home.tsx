import React from 'react';
import './home.css';
import Logo from '../../resources/logo_etic_flashy.gif';
import {Link} from "react-router-dom";


const Home = () => {

    return (
        <React.Fragment>
            <div className='Home'>
                <div className='content'>
                    <h1>ETIC INSA Technologies</h1>
                    <p>Bienvenue sur le site d'inscription en ligne pour rejoindre la Junior-Entreprise de l'INSA : ETIC INSA Technologies</p>
                    <Link className="redirect" to="/member">
                        Devenir Membre Actif
                    </Link>
                    <Link className="redirect" to="/consultant">
                        Devenir Consultant
                    </Link>
                    <p>Tu rencontres un problème ? Contacte nous : responsable-dsi@etic-insa.com </p>
                    <img className='logo' src={Logo} alt='logo etic'/>
                </div>
            </div>
        </React.Fragment>
    )
};


export default Home;