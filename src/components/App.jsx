import React from 'react';
import LambdaExpression from './LambdaExpression';
//import LambdaRender from './LambdaRender';
import InputLambdaTerm from './InputLambdaTerm';

export default class App extends React.Component {

  getInitialState() {

    return {expression: `\\x.((x x) ((x (x x)) (\\x.(x x))))`}
  }

  evaluate() {

  }

  renderLambda(event) {

  }

  render() {
    // let lambdaRender = this.state.steps.map((step) => {
    //   <LambdaTerm node={step} level={1} />
    // });
    let lambdaRender;
    return (
      <div>
        <InputLambdaTerm
          expression={() => this.state.expression}
          render={() => this.evaluate}
          />
        {lambdaRender}
      </div>
    );
  }
}
