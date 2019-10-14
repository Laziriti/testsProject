import React, { Component } from 'react'
import './style.css';
class variantsInfo extends Component {


  render() {
    const { variant, answer_state, index, variant_img, results } = this.props;
    const varStatus=["Неверно","Верно"]
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
        <div className="variantsText">{variant}</div>
          
          <div className="variantsState">
            {results[answer_state] && results[answer_state].description 
              ? results[answer_state].description 
              : varStatus[answer_state]}
          </div>
        </div>
      </div>
    )
  }
}



export default variantsInfo