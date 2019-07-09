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

    saveFunc(varIndex, globalIndex, testContent) {
        let currentContent = testContent;
        console.log(currentContent[globalIndex].variants[varIndex])
        console.log("--------------------------------------------------------------------------------")
        if (currentContent[globalIndex].variants[varIndex].answer_state === 1) {
            currentContent[globalIndex].variants[varIndex].answer_state = 0;
        }
        else {
            currentContent[globalIndex].variants[varIndex].answer_state = 1;
        }
        this.props.saveVariantState(currentContent)
        // console.log(testContent[globalIndex].variants[varIndex])
        console.log(currentContent[globalIndex].variants[varIndex])
    }

    saveFuncRadio(varIndex, globalIndex, testContent) {
        let currentContent = testContent;
        if (currentContent[globalIndex].variants[varIndex].answer_state === 0) {
            currentContent[globalIndex].variants.forEach(elem => {
                elem.answer_state = 0;
            })
            currentContent[globalIndex].variants[varIndex].answer_state = 1;
            console.log(currentContent[globalIndex].variants)
        }
        this.props.saveVariantState(currentContent)
    }

    saveFuncNumber(varIndex, globalIndex, value, testContent) {
        let currentContent = testContent;
        console.log(document.getElementById(globalIndex + "" + varIndex).value);
        currentContent[globalIndex].variants[varIndex].answer_state = Number(document.getElementById(globalIndex + "" + varIndex).value);
        this.props.saveVariantState(currentContent)
    }

    saveFuncString(varIndex, globalIndex, value, testContent) {
        let currentContent = testContent;
        console.log(document.getElementById(globalIndex + "" + varIndex).value);
        currentContent[globalIndex].answers_arr = document.getElementById(globalIndex + "" + varIndex).value.toUpperCase();
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

    changeSuperObj(globalIndex) {
        let currentSuperObj = this.state.superObj;
        currentSuperObj[globalIndex] = 1;
        this.setState({ superObj: currentSuperObj })
    }
    checkAnswerState(question, globalIndex) {
        console.log(typeof question.answers_arr)
        if (typeof question.answers_arr !== 'string') {
            for (let i = 0; i < question.variants.length; i++) {
                if ((question.variants[i].answer_state && question.variants[i].answer_state !== 0)) {
                    document.getElementById(globalIndex).classList.add("passing-block__question-map-item_answered");
                    break;
                }
            }
        }
        else {

            if (question.answers_arr !== 0) {
                document.getElementById(globalIndex).classList.add("passing-block__question-map-item_answered");

            }
        }
    }
    changeCurrentQuestion(nextQuest, globalIndex, index) {
        document.getElementById(globalIndex).classList.remove("passing-block__question-map-item_active")

        if (this.props.testContent[globalIndex].timer_question) {
            this.props.testContent[globalIndex].timerState = false;
        }

        this.checkAnswerState(this.props.testContent[globalIndex], globalIndex);
        clearInterval(this.state.timerInterval);
        this.changeSuperObj(globalIndex)
        this.props.setIndexOfQuestion(nextQuest);
        setTimeout(() => document.querySelectorAll(".passing-block__variant-item").forEach(elem => {
            if (this.props.testContent[globalIndex].type_question === "write_by_yourself_answer") {
                elem.value = this.props.testContent[nextQuest].answers_arr;
            }
            else {
                elem.checked = this.props.testContent[nextQuest].variants[index].answer_state;
                elem.value = this.props.testContent[nextQuest].variants[index].answer_state;
            }
            index++;
        }), 0);

    }

    startQuestionTimer(globalIndex, index) {
        let questionTimerArr = this.props.testContent[globalIndex].timer_question.split(":");
        this.props.setQuestionTimer([Number(questionTimerArr[0]), Number(questionTimerArr[1])]);

        this.tickQuestionTimer(globalIndex, index);
    }
    startGroupTimer(globalIndex, index, group) {
        let groupTimerArr = this.props.testContent[globalIndex].groups_object[group].split(":");
        this.props.setGroupTimer([Number(groupTimerArr[0]), Number(groupTimerArr[1])]);
        this.tickGroupTimer(globalIndex, index)
    }
    tickQuestionTimer(globalIndex, index) {
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
                            if (globalIndex < this.props.testContent.length - 1) {
                                this.props.testContent[globalIndex].timerState = false;
                                this.changeCurrentQuestion(globalIndex + 1, globalIndex, index);
                            }
                            else {
                                this.resultAxios(this.props.testContent); this.changeSuperObj(globalIndex);
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
    tickGroupTimer(globalIndex, index) {

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
                            this.changeCurrentQuestion(globalIndex + 1, globalIndex, index);

                            for (let i = globalIndex; i < this.props.testContent.length; i++) {
                                if (i === this.props.testContent.length - 1) {

                                    this.resultAxios(this.props.testContent);
                                    this.changeSuperObj(globalIndex);
                                    break;
                                }
                                if (this.props.testContent[i].group_number !== this.state.currentGroup) {
                                    clearInterval(this.state.groupTimerInterval);
                                    this.changeCurrentQuestion(i, globalIndex, index);
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
    initializeQuestion(testContent, globalIndex, index) {
        if (document.getElementById(globalIndex)) {
            document.getElementById(globalIndex).classList.add("passing-block__question-map-item_active")
        }
        //ПОМЕТКА УСЛОВИЕ !
        if (testContent) {

            // console.log(testContent[globalIndex])
            let inputsArr = document.querySelectorAll(".passing-block__container input");
            inputsArr.forEach(element => {
                if (testContent[globalIndex].timerState === false) {
                    element.disabled = true;
                }
                else {
                    element.disabled = false;
                }

            });

        }
        if (!this.state.superObj.hasOwnProperty(globalIndex)) {
            console.log(testContent);
            console.log("сработало")

            this.changeSuperObj(globalIndex);

            if (testContent) {
                if (testContent[globalIndex].timer_question) {
                    this.startQuestionTimer(globalIndex, index)
                }
                if (testContent[globalIndex].groups_object) {
                    console.log("стартуем")
                    console.log(this.state.previuoseGroups)
                    console.log(testContent[globalIndex].group_number)
                    if (testContent[globalIndex].group_number !== this.state.currentGroup) {
                        testContent.forEach(elem => {
                            if (elem.group_number === this.state.currentGroup) {
                                console.log(elem.group_number)
                                elem.timerState = false;
                            }
                        })
                        if (testContent[globalIndex].timerState !== false) {
                            // let prevGroupsArr = this.state.previuoseGroups;
                            // prevGroupsArr[testContent[globalIndex].group_number] = true;
                            // this.setState({ previuoseGroups: prevGroupsArr });
                            this.setState({ currentGroup: testContent[globalIndex].group_number });
                        }


                        // this.setState({ currentGroup: testContent[globalIndex].group_number });
                        clearInterval(this.state.groupTimerInterval);
                        this.startGroupTimer(globalIndex, index, testContent[globalIndex].group_number);
                    }
                }
            }
        }

    }
    createQuestionMap(testContnet, globalIndex, index) {
        let items = [];
        testContnet.forEach((elem, elemIndex) => {
            items.push(<li className="passing-block__question-map-item"
                id={elemIndex}
                onClick={() => { this.changeCurrentQuestion(elemIndex, globalIndex, index); }} >{elemIndex + 1}</li>)
        })
        return items;
    }
    render() {

        const { setIndexOfQuestion,
            questIndex,
            passingTestResults,
            testContent,
        } = this.props;
        var globalIndex = questIndex;
        var index = 0;
        if (testContent) {
            if (!globalIndex) {
                globalIndex = 0;
            }
            this.initializeQuestion(testContent, globalIndex, index)
        }


        return (
            !testContent ? <div className="lds-facebook"><div></div><div></div><div></div></div> :
                <Container className="passing-block">
                    <ul className="passing-block__question-map" id="questionMap">
                        {this.createQuestionMap(testContent, globalIndex, index)}
                    </ul>
                    <div className="passing-block__container" id="id1">
                        <div className="passing-block__pass">
                            <TimerComponent></TimerComponent>
                            <form name="passingForm" >
                                <div className="passing-block__form">
                                    <div className="passing-block__info-left">
                                        <p className="passing-block__index">{globalIndex > 8 ? globalIndex + 1 : "0" + (globalIndex + 1)}</p>
                                    </div>
                                    <div className="passing-block__info-right">
                                        <p className="passing-block__question">{testContent[globalIndex].question}</p>

                                        {
                                            testContent[globalIndex].questImg !== "null" ?
                                                <img src={testContent[globalIndex].questImg} alt=""></img>
                                                : "asd"
                                        }
                                        {testContent[globalIndex].type_question !== "write_by_yourself_answer" ?
                                            testContent[globalIndex].variants.map((item, index) =>
                                                <div className="passing-block__variants">
                                                    {item.variant_img !== null ?
                                                        <div><img className="passing-block__variant-img" src={item.variant_img} alt="" /></div>
                                                        : ""}
                                                    {testContent[globalIndex].type_question === "many_answers" ?
                                                        <input type="checkbox"
                                                            id={globalIndex + "" + index}
                                                            name={globalIndex}
                                                            className="passing-block__variant-item"
                                                            onChange={() => this.saveFunc(index, globalIndex, testContent)} />
                                                        : testContent[globalIndex].type_question === "one_answer" ?
                                                            <input type="radio"
                                                                id={globalIndex + "" + index}
                                                                name="radioAnswer"
                                                                className="passing-block__variant-item"
                                                                onChange={() => this.saveFuncRadio(index, globalIndex, testContent)} />
                                                            : testContent[globalIndex].type_question === "sequence_answer" ?
                                                                <input type="number"
                                                                    id={globalIndex + "" + index}
                                                                    name="numberAnswer"
                                                                    className="passing-block__variant-item"
                                                                    onChange={() => this.saveFuncNumber(index, globalIndex, this.value, testContent)} />
                                                                : ""
                                                    }

                                                    <label className="passing-block__variant-text">{item.variant}</label>
                                                </div>

                                            ) : <input type="text" id={globalIndex + "" + index} name="stringAnswer" className="passing-block__variant-item" onChange={() => this.saveFuncString(index, globalIndex, this.value, testContent)} />
                                        }
                                    </div>
                                </div>

                            </form>
                        </div>
                        {globalIndex === 0 ?
                            ""
                            : <button className="passing-block__button" onClick={() => {
                                this.changeCurrentQuestion(globalIndex - 1, globalIndex, index)
                            }}>Предыдущий</button>
                        }
                        {globalIndex < testContent.length - 1 ?
                            <button className="passing-block__button" onClick={() => {
                                this.changeCurrentQuestion(globalIndex + 1, globalIndex, index)
                            }}>Следующий</button>
                            : ""}
                        {globalIndex === testContent.length - 1 ?
                            <button className="passing-block__button" onClick={() => { this.resultAxios(testContent); this.changeSuperObj(globalIndex); }}>Готово</button>
                            : ""}

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
