import React from 'react';
import {TextField, RaisedButton} from 'material-ui';

export default class InputLambdaTerm extends React.Component {

  renderLambda() {
    this.props.renderLambda(this.refs.term.getValue());
  }

  render() {
    return (
      <div>
        <TextField
          id='Lambda Term'
          ref='term'
          hintText={this.props.lambdaExpression}
        />
        <RaisedButton
          label='Evaluate'
          onClick={this.props.evaluate}
          />
        <RaisedButton
          label='Render'
          onClick={this.renderLambda}
          />
      </div>
      );
    }
}
