// \x. xx

import React from 'react';

export default class LambdaExpression extends React.Component {

  propTypes: {
    vars: React.PropTypes.Object.isRequired,
    body: React.PropTypes.Object.isRequired,
    level: React.PropTypes.Number.isRequired
  }

  render() {
    const {vars, body, level} = this.props;
    const style = {
      fontSize: format.fontSize,
      color: format.color
    };

    return (
      <span style={style}>
        <span className='vars'>
          {`&lambda;${vars.join(',')}.`}
        </span>
        <LambdaTerm node={body} level={level} />
      </span>
      );
    }
}
