import React, { Component } from 'react'
import './style.css';
class variantsInfo extends Component {


  render() {
    const { variant, answer_state, index, variant_img, answers_arr, results } = this.props
    return (

      <div className="variantBlock">
        <div className="variantsLogo">
          <div className="variantNumber">
            <p>{index + 1}</p>
          </div>
          {variant_img !== "null" ? <div className="variantsImg">
            <img className="variantImg" src={variant_img} alt="" />
          </div> : ""}
        </div>
        <div className="variantsContent">
          <textarea className="variant" disabled value={answers_arr ? answers_arr : variant}></textarea>
          <div className="variantsState">
            {results[answer_state] && results[answer_state].description ? results[answer_state].description : answer_state}
          </div>
        </div>
      </div>
    )
  }
}



export default variantsInfo