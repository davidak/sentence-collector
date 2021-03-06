import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import ProfileWidget from '../containers/profile-widget';
import logoURL from '../../img/white-mozilla.svg';

const Header = (props) => {
  return (
    <header>
      <Link to="/" href=""><img src={logoURL} /></Link>
      <nav>
        <NavLink to="/" exact>Home</NavLink>
        <NavLink to="/how-to" exact>How-to</NavLink>
        <NavLink to="/add" exact key="add">Add</NavLink>
        <NavLink to="/review" key="review">Review</NavLink>
        { props.authed ? (
          <NavLink to="/profile" exact key="profile">Profile</NavLink>
        ) : (
          <NavLink to="/login" exact>Login</NavLink>
        )}
      </nav>
      <ProfileWidget />
      <section id="external-links">
        <a target="_blank" rel="noopener" href="https://voice.mozilla.org/en/privacy">Privacy</a>
        <a target="_blank" rel="noopener" href="https://voice.mozilla.org/en/terms">Terms</a>
        <a target="_blank" rel="noopener" href="https://www.mozilla.org/en-US/privacy/websites/#cookies">Cookies</a>
      </section>
    </header>
  );
};

export default Header;
