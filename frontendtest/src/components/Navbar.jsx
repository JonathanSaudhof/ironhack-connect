import React, { Component } from 'react'

import AppBar  from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'


class Navbar extends Component {
    render() {
        return (

 
                <AppBar>
                    <Toolbar>
                        <Button>Home</Button>
                        <Button>Login</Button>
                    </Toolbar>
                </AppBar>
   
            
        )
    }
}

export default Navbar
