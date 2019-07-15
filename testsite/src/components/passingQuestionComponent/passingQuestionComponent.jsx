import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import "./style.css"
import TimerComponent from '../timerComponent/timerContainer'


class passQuest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: ``,
      shouldShowElem: false,
      selectedFile: null,
      isOpen: false,
      questionID: 0,
      actualImg: null,
      resultIndex: 0,
      resultArr: [],
      superObj: {},
      questionTimer: [],
      timerInterval: null,
      groupTimerInterval: null,
      currentGroup: "",
      previuoseGroups: {},
      activeInputsArr: [],
      prevQuestIndex: null
    };
  }

  saveFunc(varIndex, testContent) {
    let currentContent = testContent;
    if (currentContent[this.props.questIndex].variants[varIndex].answer_state === 1) {
      currentContent[this.props.questIndex].variants[varIndex].answer_state = 0;
    }
    else {
      currentContent[this.props.questIndex].variants[varIndex].answer_state = 1;
    }
    this.props.saveVariantState(currentContent)
  }

  saveFuncRadio(varIndex, testContent) {

    let inputsStateArr = this.state.activeInputsArr;
    let currentContent = testContent;
    if (currentContent[this.props.questIndex].variants[varIndex].answer_state === 0) {
      currentContent[this.props.questIndex].variants.forEach((elem, index) => {
        elem.answer_state = 0;
        inputsStateArr[index] = 0;
      })
      currentContent[this.props.questIndex].variants[varIndex].answer_state = 1;
      inputsStateArr[varIndex] = 1;
    }
    this.setState({ activeInputsArr: inputsStateArr })
    this.props.saveVariantState(currentContent);
  }

  saveFuncNumber(varIndex, value, testContent) {
    let currentContent = testContent;
    currentContent[this.props.questIndex].variants[varIndex].answer_state = Number(document.getElementById(this.props.questIndex + ":" + varIndex).value);
    this.props.saveVariantState(currentContent)
  }

  saveFuncString(value, testContent) {
    let currentContent = testContent;
    currentContent[this.props.questIndex].answers_arr = document.getElementById(this.props.questIndex + ":").value.toUpperCase();
    this.props.saveVariantState(currentContent)
  }

  render() {

    const { testContent } = this.props;

    return (
      !testContent ? <div className="lds-facebook"><div></div><div></div><div></div></div> :
        <Container className="passing-block">

          <div className="passing-block__pass">
            <TimerComponent></TimerComponent>
            <form name="passingForm" >
              <div className="passing-block__form">
                <div className="passing-block__info-left">
                  <p className="passing-block__index">
                    {this.props.questIndex > 8 ? this.props.questIndex + 1 : "0" + (this.props.questIndex + 1)}
                  </p>
                </div>
                <div className="passing-block__info-right">
                  <p className="passing-block__question">{this.props.questIndex ? testContent[this.props.questIndex].question : ""}</p>

                  {
                    testContent[this.props.questIndex].questImg ?
                      <img src={testContent[this.props.questIndex].questImg} alt=""></img>
                      : ""
                  }
                  <div>
                    {testContent[this.props.questIndex].type_question !== "write_by_yourself_answer" ?
                      testContent[this.props.questIndex].variants.map((item, index) =>

                        <div className="passing-block__variants">
                          {item.variant_img ?
                            <div><img className="passing-block__variant-img" src={item.variant_img} alt="" /></div>
                            : ""}
                          {testContent[this.props.questIndex].type_question === "many_answers" ?
                            <input type="checkbox"
                              id={this.props.questIndex + ":" + index}
                              name={this.props.questIndex}
                              className="passing-block__variant-item"
                              onChange={() => this.saveFunc(index, testContent)} />
                            : testContent[this.props.questIndex].type_question === "one_answer" ?
                              <input type="radio"
                                id={this.props.questIndex + ":" + index}
                                name="radioAnswer"
                                className=" passing-block__variant-item passing-block__variant-item_radio"
                                onChange={() => this.saveFuncRadio(index, testContent)} />
                              : testContent[this.props.questIndex].type_question === "sequence_answer" ?
                                <input type="number"
                                  id={this.props.questIndex + ":" + index}
                                  name="numberAnswer"
                                  className="passing-block__variant-item"
                                  onChange={() => this.saveFuncNumber(index, this.value, testContent)} />
                                : ""
                          }

                          <label
                            htmlFor={this.props.questIndex + ":" + index}
                            className={document.getElementById(this.props.questIndex + ":" + index)
                              ? document.getElementById(this.props.questIndex + ":" + index).checked === true
                                ? "passing-block__variant-text passing-block__variant-text_active"
                                : "passing-block__variant-text"
                              : "passing-block__variant-text"
                            }>
                            {item.variant}</label>
                        </div>
                      ) : <input
                        type="text"
                        id={this.props.questIndex + ":"}
                        name="stringAnswer"
                        className="passing-block__variant-item passing-block__variant-item_byYourself"
                        onChange={() => this.saveFuncString(this.value, testContent)} />
                    }
                  </div>

                </div>
              </div>
            </form>
          </div>
        </Container >

    )
  }
}

export default reduxForm({
  form: 'PassingQuestion' // a unique identifier for this form
})(passQuest)
