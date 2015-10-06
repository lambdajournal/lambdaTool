import React from 'react';

export default class LambdaVariable extends React.Component {
  render() {
    const {name, formatterProvider} = this.props;
    const format = formatterProvider.next(level).value();
    const style = {
      fontSize: format.fontSize,
      color: format.color
    }

    return <span style={style} className="variable"> {name} </span>
}
