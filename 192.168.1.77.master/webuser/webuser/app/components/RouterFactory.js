  import React from 'react';

  import {BrowserRouter as Route,Switch} from 'react-router-dom';
  import components from './ListPages';
  import datamenu from '../utils/dataMenuFake'
  class RouterFactory extends React.Component{
      render(){
          return(
                <Switch>
                     {
                         datamenu && datamenu.length && datamenu.map((i,index)=>{

                          return(
                            i.listItem.map((item,ix)=>{
                              return(
                                <Route key={ix} path={item.link} component={components[item.Component]} 
                                    />
                                )
                            })
                          //  <div key={index}> {that.renderRouter(i.listItem)}</div>
                            
                        )
                        })
                     }
                </Switch>


          )
      }
  }
module.exports = RouterFactory;