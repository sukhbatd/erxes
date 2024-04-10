import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(
  () =>
    import(/* webpackChunkName: "List - Dealmaps" */ './components/ListPage')
);

const dealmaps = () => <List />;

const routes = () => {
  return <Route path="/dealmaps" component={dealmaps} />;
};

export default routes;
