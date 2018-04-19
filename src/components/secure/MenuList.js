/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {Dialog, FlatButton, RaisedButton} from "material-ui";
import SandwichCardDialog from "../SandwichCardDialog";
import SandwichCard from "../SandwichCard";

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
    },
};

class MenuList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            currentItem: null
        };
    }

    handleMenuItemClick(index) {
        this.setState({dialogOpen: true, currentItem: this.props.menuItems[index]});
    }

    handleCloseClick() {
        this.setState({dialogOpen: false, currentItem: null});
    }

    render() {

        return (
            <div>
                {/*<Dialog*/}
                    {/*open={this.state.dialogOpen}*/}
                    {/*onRequestClose={this.handleCloseClick.bind(this)}*/}
                {/*>*/}
                    {/*<SandwichCard/>*/}
                {/*</Dialog>*/}
                <SandwichCardDialog
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleCloseClick.bind(this)}
                    itemData={this.state.currentItem}
                />
                <div style={styles.root}>
                    <GridList
                        cols={2}
                        cellHeight={200}
                        padding={1}
                        style={styles.gridList}
                    >
                        {this.props.menuItems.map((item, i) => (
                            <GridTile
                                key={i}
                                title={item.title}
                                subtitle={item.description}
                                // actionIcon={<FlatButton label="Buy"></FlatButton>}
                                cols={item.featured ? 2 : 1}
                                rows={item.featured ? 2 : 1}
                                titleStyle={{textOverflow: '', whiteSpace: 'wrap'}}
                                onClick={this.handleMenuItemClick.bind(this, i)}

                            >
                                <img src={item.img}/>
                            </GridTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default MenuList;