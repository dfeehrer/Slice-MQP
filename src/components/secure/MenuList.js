/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {FlatButton, RaisedButton} from "material-ui";

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 700,
        height: '100%',
        overflowY: 'auto',
    },
};

const tilesData = [
    {
        img: 'grilled-cheese1.jpg',
        title: 'Classic Grilled Cheese',
        subtitle: 'jill111',
        featured: true
    },
    {
        img: 'grilled-cheese2.jpg',
        title: 'Extra Crispy Grilled Cheese',
        subtitle: 'pashminu',
    },
    {
        img: 'grilled-cheese3.jpg',
        title: 'Loaded Grilled Cheese',
        subtitle: 'Danson67',
    },
    {
        img: 'grilled-cheese4.jpg',
        title: 'Crispy Loaded',
        subtitle: 'fancycrave1',
    }
];
/*
const MenuList = () => (
    <div style={styles.root}>
        <GridList
            cellHeight={180}
            style={styles.gridList}
        >
            <Subheader>December</Subheader>
            {tilesData.map((tile) => (
                <GridTile
                    key={tile.img}
                    title={tile.title}
                    subtitle={tile.subtitle}
                    actionIcon={<RaisedButton label="Buy"></RaisedButton>}
                >
                    <img src={tile.img} />
                </GridTile>
            ))}
        </GridList>
    </div>
 );
*/
const MenuList = () => (
    <div style={styles.root}>
        <GridList
            cols={2}
            cellHeight={200}
            padding={1}
            style={styles.gridList}
        >
            {tilesData.map((tile) => (
                <GridTile
                    key={tile.img}
                    title={tile.title}
                    actionIcon={<RaisedButton label="Buy"></RaisedButton>}
                    actionPosition="left"
                    titlePosition="top"
                    titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                    cols={tile.featured ? 2 : 1}
                    rows={tile.featured ? 2 : 1}
                >
                    <img src={tile.img} />
                </GridTile>
            ))}
        </GridList>
    </div>

);

export default MenuList;