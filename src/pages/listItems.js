import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Link from '@material-ui/core/Link';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Consulta from './Consulta';
import {
  NavLink as NavLinkBase,
  BrowserRouter as Router
} from "react-router-dom";
const classes = {
  activeLink: "activeLink"
};
const NavLink = React.forwardRef((props, ref) => (
  <NavLinkBase ref={ref} {...props} className={props.activeClassName} />
));
export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboards" />
    </ListItem>
    <ListItem
            component={NavLink}
            activeClassName={({ isActive }) =>
              isActive ? classes.activeLink : undefined
            }
            sx={{ color: "#8C8C8C" }}
            to="/consulta"
            end
          >
            <ListItemIcon></ListItemIcon>
         <ListItemText primary="Consulta" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItem>

{/*     <Switch>
          <Route exact path="/">
            <div>Dashboard</div>
          </Route>
          <Route path="/menu">
            <div>Consultas</div>
          </Route>
          <Route path="/reportes">
            <div>Reportes</div>
          </Route>
        </Switch> */}
  </div>
);
