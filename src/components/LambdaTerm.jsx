import React from 'react';
import {formatterProvider} from '../utils/lambdaUtils';

export default class LambdaTerm extends React.Component {
  render() {
    const {node, level} = this.props;
    const format = formatterProvider.next(level).value();
    switch (node.type) {
      case 'var':
        return <LambdaVariable level={level} name={node.name} format={format} />;
      case 'expr':
        return <LambdaExpression level={level} vars={node.vars} body={node.body} format={format} />;
      case 'app':
        return <LambdaApplication level={level} first={node.first} second={node.second} format={format} />;
    }
}
