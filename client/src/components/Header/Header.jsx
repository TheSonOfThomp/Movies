import React from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from "react-router-dom";
import './Header.scss';

const Header = (props) => {

  return (
    <header>
      <div className="header-content">
        <h1>
          <Link to="/">
            {props.title}
          </Link>
        </h1>

        {props.isSearchBarVisible && 
          <input
            type="text"
            placeholder="Find a movie..."
            value={props.searchQuery}
            onChange={props.handleInput}
          ></input>
        }
      </div>
      {/* 
        TODO
        Add filtering by genre.
        <nav>...genres</nav>
      */}
    </header>
  )
};

Header.propTypes = {
  title: PropTypes.string,
  isSearchBarVisible: PropTypes.bool,
  searchQuery: PropTypes.string,
  handleInput: PropTypes.func 
};

Header.defaultProps = {
  isSearchBarVisible: false,
};

export default Header;
