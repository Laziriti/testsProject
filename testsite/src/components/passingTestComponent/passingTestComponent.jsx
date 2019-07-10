import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import "./style.css"
import TimerComponent from '../timerComponent/timerContainer'
import PassingQuestion from '../passingQuestionComponent/passingQuestionContainer'

class passForm extends Component {
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
  componentWillMount() {
    let url = 'https://psychotestmodule.herokuapp.com/tests/' + this.props.match.params.testId+'/';
    axios.get(url).then(response => {
      let test = response.data;
      console.log(test)
      let content = eval(test.test_content);
      eval(content).forEach(elem => {
        if (elem.type_question !== "write_by_yourself_answer") {
          elem.variants.forEach(variant => {
            variant.answer_state = 0;
          })
        }
        else {
          elem.answers_arr = "";
        }

      });
      test.test_content = content;
      console.log(test);
      this.props.setPassingTest(test)
    })

  }
  componentWillUnmount() {
    // this.props.setPassingTest({});
    clearInterval(this.state.timerInterval);
    clearInterval(this.state.groupTimerInterval);
    this.props.setGroupTimer([0, 0]);
    this.props.setQuestionTimer([0, 0]);
    this.props.clearPassingTest();
    this.props.setIndexOfQuestion(0);
    this.setState({ superObj: {} });

  }

  resultAxios(testContent) {
    this.props.passingTest.test_content = JSON.stringify(testContent);
    console.log(JSON.stringify(this.props.passingTest))
    let url = null;

    if (this.props.passingTest.test_type === "first") {
      url = 'https://psychotestmodule.herokuapp.com/arr/';
    }
    else {
      url = 'https://psychotestmodule.herokuapp.com/class/';
    }
    axios.post(url, this.props.passingTest)
      .then((response) => {
        console.log(response);
        document.getElementById("id1").remove();
        document.getElementById("questionMap").remove();
        document.getElementById("resultBlock").style.display = "block";
        if (this.props.passingTest.test_type === "first") {
          this.setState({ resultIndex: response.data })
          console.log(this.state.resultIndex)
        }
        else {
          let result = eval(response.data).indexOf(Math.max.apply(null, eval(response.data)))
          console.log(result)
          this.setState({ resultIndex: result })
        }

      }).catch(e => {
        console.log(e)
      })
  }

  changeSuperObj() {
    let currentSuperObj = this.state.superObj;
    currentSuperObj[this.props.questIndex] = 1;
    this.setState({ superObj: currentSuperObj })
  }
  checkAnswerState(question) {
    console.log(typeof question.answers_arr)

    if (typeof question.answers_arr !== 'string') {
      for (let i = 0; i < question.variants.length; i++) {
        if ((question.variants[i].answer_state && question.variants[i].answer_state !== 0)) {
          document.getElementById(this.props.questIndex).classList.add("passing-block__question-map-item_answered");
          break;
        }
      }
    }
    else {
      if (question.answers_arr !== 0) {
        document.getElementById(this.props.questIndex).classList.add("passing-block__question-map-item_answered");
      }
    }
  }
  changeCurrentQuestion(nextQuest) {
    let index = 0;

    if (this.props.testContent[this.props.questIndex].timer_question) {
      this.props.testContent[this.props.questIndex].timerState = false;
    }

    // document.getElementById(this.props.questIndex).classList.remove("passing-block__question-map-item_active")
    this.checkAnswerState(this.props.testContent[this.props.questIndex]);
    clearInterval(this.state.timerInterval);
    this.props.setQuestionTimer([0, 0]);
    this.changeSuperObj(this.props.questIndex)
    this.props.setIndexOfQuestion(nextQuest);

    setTimeout(() => document.querySelectorAll(".passing-block__variant-item").forEach(elem => {
      if (this.props.testContent[this.props.questIndex].type_question === "write_by_yourself_answer") {
        elem.value = this.props.testContent[nextQuest].answers_arr;
      }
      else {
        console.log(index)
        console.log(this.props.testContent[nextQuest].variants[index])
        elem.checked = this.props.testContent[nextQuest].variants[index].answer_state;
        elem.value = this.props.testContent[nextQuest].variants[index].answer_state;
      }
      index++;
    }), 0);


  }

  startQuestionTimer(index) {
    let questionTimerArr = this.props.testContent[this.props.questIndex].timer_question.split(":");
    this.props.setQuestionTimer([Number(questionTimerArr[0]), Number(questionTimerArr[1])]);

    this.tickQuestionTimer();
  }
  startGroupTimer(index, group) {
    let groupTimerArr = this.props.testContent[this.props.questIndex].groups_object[group].split(":");
    this.props.setGroupTimer([Number(groupTimerArr[0]), Number(groupTimerArr[1])]);
    this.tickGroupTimer()
  }
  tickQuestionTimer() {
    let questionTimer = null;
    setTimeout(() => {
      questionTimer = [Number(this.props.questionMinutes), Number(this.props.questionSeconds)];

      this.setState({
        timerInterval: setInterval(() => {

          this.props.setQuestionTimer(questionTimer);
          // this.props.setQuestionTimer(questionTimer)
          if (questionTimer[1] === 0) {
            if (questionTimer[0] === 0) {
              clearInterval(this.state.timerInterval);
              if (this.props.questIndex < this.props.testContent.length - 1) {

                this.props.testContent[this.props.questIndex].timerState = false;
                this.changeCurrentQuestion(this.props.questIndex + 1);
              }
              else {
                this.resultAxios(this.props.testContent); this.changeSuperObj(this.props.questIndex);
              }
            }
            else {
              questionTimer[0]--;
              questionTimer[1] = 60;
            }
          }
          questionTimer[1]--;

        }, 1000)
      })
    }, 0)
  }
  tickGroupTimer() {

    let groupTimer = null;
    setTimeout(() => {
      groupTimer = [Number(this.props.questionGroupMinutes), Number(this.props.questionGroupSeconds)];
      this.setState({
        groupTimerInterval: setInterval(() => {

          this.props.setGroupTimer(groupTimer);
          // this.props.setQuestionTimer(questionTimer)
          if (groupTimer[1] === 0) {
            if (groupTimer[0] === 0) {
              clearInterval(this.state.groupTimerInterval);
              this.changeCurrentQuestion(this.props.questIndex + 1);

              for (let i = this.props.questIndex; i < this.props.testContent.length; i++) {
                if (i === this.props.testContent.length - 1) {

                  this.resultAxios(this.props.testContent);
                  this.changeSuperObj(this.props.questIndex);
                  break;
                }
                if (this.props.testContent[i].group_number !== this.state.currentGroup) {
                  clearInterval(this.state.groupTimerInterval);
                  this.changeCurrentQuestion(i);
                  break;
                }
              }

            }
            else {
              groupTimer[0]--;
              groupTimer[1] = 60;
            }
          }
          groupTimer[1]--;

        }, 1000)
      })
    }, 0)
  }

  initializeQuestion(testContent, index) {
    document.querySelectorAll(".passing-block__question-map-item").forEach(elem => {
      elem.classList.remove("passing-block__question-map-item_active");
    })

    if (document.getElementById(this.props.questIndex)) {
      document.getElementById(this.props.questIndex).classList.add("passing-block__question-map-item_active")
    }
    //ПОМЕТКА УСЛОВИЕ !
    if (testContent) {

      let inputsArr = document.querySelectorAll(".passing-block__container input");
      inputsArr.forEach(element => {
        if (testContent[this.props.questIndex].timerState === false) {
          element.disabled = true;
        }
        else {
          element.disabled = false;
        }

      });

    }
    if (!this.state.superObj.hasOwnProperty(this.props.questIndex)) {
      console.log(testContent);
      console.log("сработало")

      this.changeSuperObj(this.props.questIndex);

      if (testContent) {
        console.log("стартуем")
        if (testContent[this.props.questIndex].timer_question) {
          this.startQuestionTimer(index)
        }
        if (testContent[this.props.questIndex].groups_object) {

          console.log(this.state.previuoseGroups)
          console.log(testContent[this.props.questIndex].group_number)
          if (testContent[this.props.questIndex].group_number !== this.state.currentGroup) {
            testContent.forEach(elem => {
              if (elem.group_number === this.state.currentGroup) {
                console.log(elem.group_number)
                elem.timerState = false;
              }
            })
            if (testContent[this.props.questIndex].timerState !== false) {
              // let prevGroupsArr = this.state.previuoseGroups;
              // prevGroupsArr[testContent[this.props.questIndex].group_number] = true;
              // this.setState({ previuoseGroups: prevGroupsArr });
              this.setState({ currentGroup: testContent[this.props.questIndex].group_number });
            }


            // this.setState({ currentGroup: testContent[this.props.questIndex].group_number });
            clearInterval(this.state.groupTimerInterval);
            this.startGroupTimer(index, testContent[this.props.questIndex].group_number);
          }
        }
      }
    }

  }
  createQuestionMap(testContnet) {
    let items = [];
    testContnet.forEach((elem, elemIndex) => {
      items.push(<li className="passing-block__question-map-item"
        id={elemIndex}
        onClick={() => { this.changeCurrentQuestion(elemIndex); }} >{elemIndex + 1}</li>)
    })
    return items;
  }

  componentDidUpdate() {
    if (this.props.testContent) {
      //УДАЛИЛ ПОКА РАБОТАЕТ
      // if (!this.props.questIndex) {
      //     this.props.questIndex = 0;
      // }
      this.initializeQuestion(this.props.testContent)
    }
  }
  componentDidMount() {
    this.initializeQuestion(this.props.testContent)
  }
  render() {

    const { setIndexOfQuestion,
      questIndex,
      passingTestResults,
      testContent,
    } = this.props;

    return (
      !testContent ? <div className="lds-facebook"><div></div><div></div><div></div></div> :
        <Container className="passing-block">
          <ul className="passing-block__question-map" id="questionMap">
            {this.createQuestionMap(testContent)}
          </ul>
          <div className="passing-block__container" id="id1">

            <PassingQuestion></PassingQuestion>

            <div className="passing-block__btn-div">
              {this.props.questIndex === 0 ?
                ""
                : <button className="passing-block__button passing-block__button_first" onClick={() => {
                  this.changeCurrentQuestion(this.props.questIndex - 1)
                }}>Предыдущий</button>
              }
              {this.props.questIndex < testContent.length - 1 ?
                <button className="passing-block__button" onClick={() => {
                  this.changeCurrentQuestion(this.props.questIndex + 1)
                }}>Следующий</button>
                : ""}
              {this.props.questIndex === testContent.length - 1 ?
                <button className="passing-block__button" onClick={() => { this.resultAxios(testContent); this.changeSuperObj(this.props.questIndex); }}>Готово</button>
                : ""}

              <img className="passing-block__decorate" src={require('../../img/questions.png')} alt="asdsadasdsad" />
            </div>

          </div>
          <div className="passing-block__results" id="resultBlock">
            <img src={passingTestResults[this.state.resultIndex].result_img} alt='' />
            <p>
              {passingTestResults[this.state.resultIndex].result}
            </p>
            <Link to="/" onClick={() => { this.setState({ superObj: {} }); setIndexOfQuestion(0); }}>Завершить</Link>
          </div>
        </Container >

    )
  }
}

export default reduxForm({
  form: 'PassingForm' // a unique identifier for this form
})(passForm)
