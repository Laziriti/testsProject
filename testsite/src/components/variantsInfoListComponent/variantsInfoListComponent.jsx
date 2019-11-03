import React, { Component } from 'react'
import './style.css';
class variantsInfo extends Component {


  render() {
    const { variant, answer_state, index, variant_img, results, price_var } = this.props;
    const varStatus = ["Неверно", "Верно"]
    return (
      <div className="variant-block">
        <div className="variant-block__container">

          <div className="variant-block__content">

            <div className="variant-block__left">
              <div className="variant-block__number">
                Вариант: {index + 1}
              </div>
              <div className="variant-block__img-container">
                {
                  variant_img ? <img className="variant-block__img" src={variant_img} alt="" /> : null
                }

              </div>
            </div>

            <div className="variant-block__right">
              <div className="variant-block__text">{variant}</div>

              <div className="variant-block__nfPrice">
                {price_var}
              </div>
              <div className="variant-block__state">
                {results[answer_state] && results[answer_state].description
                  ? results[answer_state].result
                  : varStatus[answer_state]}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default variantsInfo