import React, { Component } from 'react'
import { Field, FieldArray, reduxForm, getFormValues } from 'redux-form'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Container } from 'semantic-ui-react';
import "./style.css"
var resultObj = {};
var resultObj1 = {};
var obj;
var superObj = {};
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
            resultArr: []
        };
    }


    OpenHandler = () => this.setState({ isOpen: true })

    saveFunc(varIndex, globalIndex) {

        if (obj[globalIndex].variants[varIndex].answer_state === 1) {
            obj[globalIndex].variants[varIndex].answer_state = 0;
        }
        else {
            obj[globalIndex].variants[varIndex].answer_state = 1;
        }
        console.log(obj[globalIndex].variants[varIndex])
    }
    saveFuncRadio(varIndex, globalIndex) {

        if (obj[globalIndex].variants[varIndex].answer_state === 0) {
            obj[globalIndex].variants.forEach(elem => {
                elem.answer_state = 0;
            })
            obj[globalIndex].variants[varIndex].answer_state = 1;
            console.log(obj[globalIndex].variants)
        }
    }
    saveFuncNumber(varIndex, globalIndex, value) {
        console.log(document.getElementById(globalIndex + varIndex).value);
        obj[globalIndex].variants[varIndex].answer_state = Number(document.getElementById(globalIndex + varIndex).value);
    }

    resultAxios() {
        resultObj.test_content = JSON.stringify(obj);
        console.log(JSON.stringify(resultObj))
        let url = null;


        if (resultObj.test_type === "first") {
            url = 'https://psychotestmodule.herokuapp.com/a/';
        }
        else {
            url = 'https://psychotestmodule.herokuapp.com/class/';
        }
        axios.post(url, resultObj)
            .then((response) => {
                console.log(response);
                document.getElementById("id1").remove();
                document.getElementById("resultBlock").style.display = "block";
                if (resultObj.test_type === "first") {
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

    render() {


        var globalIndex = 0;
        const { passingTest, indexReady, setIndexOfQuestion, questIndex, testType, setPassingTest } = this.props;
        globalIndex = questIndex;

        if (!superObj.hasOwnProperty(0)) {
            resultObj = passingTest;
            resultObj1 = eval(passingTest.test_check_sum);
            console.log(passingTest)
            obj = eval(passingTest.test_content)
            console.log("записалось")
        }
        console.log(obj)
        if (!superObj.hasOwnProperty(globalIndex)) {

            console.log("сработало")
            obj[globalIndex].variants.forEach(elem => {
                elem.answer_state = 0
            })
        }
        var i = 0;


        console.log(obj[globalIndex].variants)

        return (
            <Container>
                <div className="mainBlock" id="id1">
                    <div className="passingBlock">
                        <form name="passingForm" >
                            <div>
                                <label>{obj[globalIndex].question}</label>
                                {
                                    obj[globalIndex].questImg !== "null" ?
                                        <img src={obj[globalIndex].questImg} alt=""></img>
                                        : ""
                                }

                                {obj[globalIndex].variants.map((item, index) =>
                                    <div className="variantBlock">
                                        {item.variant_img !== "null" ?
                                            <div><img class="passImg" src={item.variant_img} alt="" /></div>
                                            : ""}
                                        {obj[globalIndex].type_question === "many_answers" ?
                                            <input type="checkbox" id={globalIndex + index} name={globalIndex} className="testol" onChange={() => this.saveFunc(index, globalIndex)} />
                                            : obj[globalIndex].type_question === "one_answer" ?
                                                <input type="radio" id={globalIndex + index} name="radioAnswer" className="testol" onChange={() => this.saveFuncRadio(index, globalIndex)} />
                                                :
                                                <input type="number" id={globalIndex + index} name="numberAnswer" className="testol" onChange={() => this.saveFuncNumber(index, globalIndex, this.value)} />}
                                                
                                        <label>{item.variant}</label>

                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    {globalIndex === 0 ? "" :
                        <button onClick={() => {
                            superObj[globalIndex] = 1;
                            setIndexOfQuestion(questIndex - 1);
                            setTimeout(() => document.querySelectorAll(".testol").forEach(elem => {
                                elem.checked = obj[globalIndex - 1].variants[i].answer_state;
                                elem.value = obj[globalIndex - 1].variants[i].answer_state;
                                console.log(questIndex)
                                console.log("пред")
                                i++;
                            }), 0);


                        }}>Предыдущий</button>
                    }
                    {globalIndex < obj.length - 1 ? <button onClick={() => {
                        superObj[globalIndex] = 1;
                        setIndexOfQuestion(questIndex + 1);
                        setTimeout(() => document.querySelectorAll(".testol").forEach(elem => {
                            elem.checked = obj[globalIndex + 1].variants[i].answer_state;
                            elem.value = obj[globalIndex + 1].variants[i].answer_state;
                            console.log(questIndex)
                            console.log("след")
                            i++;
                        }), 0)

                    }}>Следующий</button>
                        : ""}
                    {globalIndex === obj.length - 1 ? <button onClick={() => { this.resultAxios(); superObj[globalIndex] = 1; }}>Готово</button>
                        : ""}

                </div>
                <div className="resultBlock" id="resultBlock">
                    <img src={resultObj1[this.state.resultIndex].result_img} alt='' />
                    <p>
                        {resultObj1[this.state.resultIndex].result}
                    </p>
                    <Link to="/" onClick={() => { setPassingTest({}); superObj = {}; setIndexOfQuestion(0); }}>Завершить</Link>
                </div>
            </Container>




        )
    }
}



export default reduxForm({
    form: 'PassingForm' // a unique identifier for this form
})(passForm)

// "[{"question_ID":0,"type_question":"many_answers","question":"ыфв","price_question":"1","not_full_price_question":"0","questImg":null,"variants":[{"variant_Id":0,"variant_img":"null","variant":"1","answer_state":0},{"variant_Id":1,"variant_img":"null","variant":"2","answer_state":1}],"number_answers":2,"count":2},{"question_ID":1,"type_question":"many_answers","question":"ыфвфы","price_question":1,"not_full_price_question":"0","questImg":null,"variants":[{"variant_Id":0,"variant_img":"null","variant":"1","answer_state":0},{"variant_Id":1,"variant_img":"null","variant":"2","answer_state":1}],"number_answers":4,"count":4}]"
// "[{"question_ID":0,"question":"Вопрос 1","price_question":1,"type_question":"many_answer","number_answers":3,"variants":[{"variant_Id":0,"variant_text":"Вариант с ответом1","answer_state":0},{"variant_Id":1,"variant_text":"Вариант с ответом2","answer_state":1},{"variant_Id":2,"variant_text":"Вариант с ответом3","answer_state":2}]},{"question_ID":1,"question":"Вопрос 2","price_question":2,"type_question":"many_answer","number_answers":3,"variants":[{"variant_Id":0,"variant_text":"Вариант с ответом1","answer_state":0},{"variant_I":1,"variant_text":"Вариант с ответом2","answer_state":1},{"variant_Id":2,"variant_text":"Вариант с ответом3","answer_state":2}]},{"question_ID":2,"question":"Вопрос 3","price_question":3,"type_question":"many_answer","number_answers":3,"variants":[{"variant_Id":0,"variant_text":"Вариант с ответом1","answer_state":0},{"variant_Id":1,"variant_text":"Вариант с ответом2","answer_state":1},{"variant_Id":2,"variant_text":"Вариант с ответом3","answer_state":2}]}]"