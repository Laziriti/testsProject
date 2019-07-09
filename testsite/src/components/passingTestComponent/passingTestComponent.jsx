import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import "./style.css"
import TimerComponent from '../../containers/timerContainer'


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
            activeInputsArr: []
        };
    }

    componentWillUnmount() {
        // this.props.setPassingTest({});
        clearInterval(this.state.timerInterval);
        clearInterval(this.state.groupTimerInterval);
        this.props.clearPassingTest();
        this.props.setIndexOfQuestion(0);
        this.setState({ superObj: {} });

    }

    OpenHandler = () => this.setState({ isOpen: true })

    saveFunc(varIndex, testContent) {
        let currentContent = testContent;
        console.log(currentContent[this.props.questIndex].variants[varIndex])
        console.log("--------------------------------------------------------------------------------")
        if (currentContent[this.props.questIndex].variants[varIndex].answer_state === 1) {
            currentContent[this.props.questIndex].variants[varIndex].answer_state = 0;
        }
        else {
            currentContent[this.props.questIndex].variants[varIndex].answer_state = 1;
        }
        this.props.saveVariantState(currentContent)
        // console.log(testContent[this.props.questIndex].variants[varIndex])
        console.log(currentContent[this.props.questIndex].variants[varIndex])
    }

    saveFuncRadio(varIndex, testContent) {

        let inputsStateArr = this.state.activeInputsArr;
        let currentContent = testContent;
        console.log(currentContent[this.props.questIndex].variants[varIndex].answer_state)
        if (currentContent[this.props.questIndex].variants[varIndex].answer_state === 0) {
            currentContent[this.props.questIndex].variants.forEach((elem, index) => {
                elem.answer_state = 0;
                inputsStateArr[index] = 0;
            })
            currentContent[this.props.questIndex].variants[varIndex].answer_state = 1;
            inputsStateArr[varIndex] = 1;
            console.log(currentContent[this.props.questIndex].variants)
        }
        this.setState({ activeInputsArr: inputsStateArr })
        this.props.saveVariantState(currentContent);
    }

    saveFuncNumber(varIndex, value, testContent) {
        let currentContent = testContent;
        console.log(document.getElementById(this.props.questIndex + "" + varIndex).value);
        currentContent[this.props.questIndex].variants[varIndex].answer_state = Number(document.getElementById(this.props.questIndex + "" + varIndex).value);
        this.props.saveVariantState(currentContent)
    }

    saveFuncString(value, testContent) {
        let currentContent = testContent;
        console.log(document.getElementById(this.props.questIndex).value);
        currentContent[this.props.questIndex].answers_arr = document.getElementById(this.props.questIndex + ":").value.toUpperCase();
        this.props.saveVariantState(currentContent)
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
        document.getElementById(this.props.questIndex).classList.remove("passing-block__question-map-item_active")

        if (this.props.testContent[this.props.questIndex].timer_question) {
            this.props.testContent[this.props.questIndex].timerState = false;
        }

        this.checkAnswerState(this.props.testContent[this.props.questIndex]);
        clearInterval(this.state.timerInterval);
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
        var a = document.querySelectorAll(".passing-block__container input");
        a.forEach(element => {
            console.log(element.checked)
        });

        if (document.getElementById(this.props.questIndex)) {
            document.getElementById(this.props.questIndex).classList.add("passing-block__question-map-item_active")
        }
        //ПОМЕТКА УСЛОВИЕ !
        if (testContent) {

            // this.test(this.props.questIndex)


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
                if (testContent[this.props.questIndex].timer_question) {
                    this.startQuestionTimer(index)
                }
                if (testContent[this.props.questIndex].groups_object) {
                    console.log("стартуем")
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
                        <div className="passing-block__pass">
                            <TimerComponent></TimerComponent>
                            <form name="passingForm" >
                                <div className="passing-block__form">
                                    <div className="passing-block__info-left">
                                        <p className="passing-block__index">{this.props.questIndex > 8 ? this.props.questIndex + 1 : "0" + (this.props.questIndex + 1)}</p>
                                    </div>
                                    <div className="passing-block__info-right">
                                        <p className="passing-block__question">{testContent[this.props.questIndex].question}</p>

                                        {
                                            testContent[this.props.questIndex].questImg !== "null" ?
                                                <img src={testContent[this.props.questIndex].questImg} alt=""></img>
                                                : "asd"
                                        }
                                        {testContent[this.props.questIndex].type_question !== "write_by_yourself_answer" ?
                                            testContent[this.props.questIndex].variants.map((item, index) =>
                                                <div className="passing-block__variants">
                                                    {item.variant_img !== null ?
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
                                                                className=" passing-block__variant-item passing-block__radio"
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
                                                className="passing-block__variant-item"
                                                onChange={() => this.saveFuncString(this.value, testContent)} />
                                        }



                                    </div>

                                </div>

                            </form>

                        </div>

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
