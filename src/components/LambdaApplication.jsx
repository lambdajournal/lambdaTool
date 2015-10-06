import React from 'react';

export default class LambdaApplication extends React.Component {
  const {first, second, level, format} = this.props;
  render() {
    const style = {
      fontSize: format.fontSize,
      color: format.color
    };

    return (
      <span style={style} className="application">
        {format.brackets.open}
        <sub style={fontSize: '50%' }>{level}</sub>
        <LambdaTerm node={first} level={level + 1} />
        &nbsp;
        <LambdaTerm node={second} level={level + 1} />
        {format.brackets.close}
      </span>
    )
}
