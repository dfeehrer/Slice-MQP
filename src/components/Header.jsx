/**
 * Created by Derek on 10/31/17.
 */
import React from 'react';

export const Header = (props) => (
    <div className="Header">
        <span className="Header-logo">{props.title}</span>
    </div>
);