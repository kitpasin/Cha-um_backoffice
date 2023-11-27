import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appActions } from '../store/app-slice';

import './main.scss';
import FooterComponent from './layout/footer/footer';
import NavbarComponent from './layout/navbar/navbar';
import SidebarComponent from './layout/sidebar/sidebar';

const MainLayout = (props) => {
  const dispatch = useDispatch()
  const isNavsideCollapse = useSelector((state) => state.app.isNavsideCollapse);

  const collapseHandler = (status = undefined) => { 
    dispatch(appActions.toggleNavsideCollapse(status))
  }

  return (
    <div className={`App ${(isNavsideCollapse)?"collapsed":""}`}>
      <NavbarComponent collapseHandler={collapseHandler} isCollapsed={isNavsideCollapse} />
      <SidebarComponent collapseHandler={collapseHandler}   />
      <div className='main-body'>
        <main>{props.children}</main>
      </div>
    </div>
  )
}

export default MainLayout; 