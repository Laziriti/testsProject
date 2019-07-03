import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { func } from 'prop-types';

class writeByYourselfQuest extends Component {
    state = {
        modalOpen: false,
        actualImg: null,
        actualImgVariant: null,
        variantImg: [1],
        currentIndexVariantImg: null,
        editState: false,
        imgArr: [],
        checkArr: []
    }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    FileSelectedHendler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })

        let files = event.target.files[0];
        let formData = new FormData();

        // var blob = event.target.files[0].slice(0, event.target.files[0].size, 'image/jpeg');
        // let newFile = new File([blob], 'imageforneuron.jpg', { type: 'image/jpeg' });

        formData.append("img_field", files);

        axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
            .then((response) => {
                console.log(response);
                this.setState({ actualImg: response.data.img_field })
            }).catch(e => {
                console.log(e)
            })
    }

    firstTypeHandler(object, variantImg) {

        var formData = new FormData(document.forms.oneVariantForm);

        formData.forEach(function (value, key) {

            if (key === "answersArr") {
                console.log(value)
                let answersString = value.toUpperCase();
                let answersArray = answersString.split(',');
                object['answers_arr'] = answersArray;
            }
        }
        );
        return object;
    }

    createQuestion(questions, setQuests, actualImg, variantImg, testType, currentIndex, currentVariants) {

        let arr = questions;
        var object = {};
        var formData = new FormData(document.forms.oneVariantForm);
        if (typeof currentIndex === "number") {
            object["question_ID"] = currentIndex + 1;
        }
        else {
            object["question_ID"] = questions.length;
        }

        object["type_question"] = "write_by_yourself_answer";

        formData.forEach(function (value, key) {
            console.log(key);

            if (key === 'questImg') {
                object[key] = actualImg;
            }
            if (key === 'question') {
                object[key] = value;
            }
            if (key === 'priceQuestion') {
                object["price_question"] = Number(value);
            }

        });

        // formData.forEach(function (value, key) {
        //   console.log(key);
        // })

        if (testType === 'first') {
            object = this.firstTypeHandler(object, variantImg)
        }

        object["number_answers"] = 1;
        if (typeof currentIndex === "number") {
            arr[currentIndex] = object;
        }
        else {
            arr.push(object);
        }

        setQuests(arr);
        var json = JSON.stringify(questions);
        console.log(json);
    }
    setCurrentQuestionImg() {
        this.setState({ actualImg: this.props.currentQuestImg })
        console.log(this.props.currentQuestImg)
    }

    render() {
        const { handleSubmit,
            questions,
            setQuests,
            answers_arr,
            reset,
            testType,
            currentVariants,
            currentQuestion,
            currentIndex,
            currentPrice,
            currentQuestImg } = this.props;

        return (
            <Container>
                <Modal trigger={<Button onClick={() => { this.setState({ checkArr: [] }); this.handleOpen(); this.setCurrentQuestionImg() }} className='oneVariantTrigger'>Самописный вопрос</Button>} open={this.state.modalOpen} centered={false}>
                    <Modal.Header>{"Одновариантный вопрос"}</Modal.Header>
                    <Modal.Content image>
                        <Image wrapped size='small' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
                        <Modal.Description>
                            <div>
                                <form onSubmit={handleSubmit} name='oneVariantForm'>
                                    <div className='inputQuest'>
                                        <label>Введите вопрос:</label>
                                        <div className='quest'>
                                            <textarea
                                                name="question"
                                                placeholder="Текст результата"
                                            >
                                                {currentQuestion}
                                            </textarea>
                                            <div>
                                                <label>Количество баллов за ответ</label>
                                                <input name="priceQuestion" defaultValue={currentPrice ? currentPrice : 1}></input>
                                            </div>
                                            <input
                                                name="questImg"
                                                type="file"
                                                onChange={this.FileSelectedHendler}
                                            />
                                        </div>
                                        <div className='quest'>
                                            <textarea name="answersArr" placeholder="Возможные ответы через запятую, регистр значения не имеет">
                                                {answers_arr ? answers_arr.join(',') : ""}
                                            </textarea>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => { this.handleClose(); reset(); }} color="primary">
                            Отмена
            </Button>
                        {typeof currentIndex === "number" ?
                            <Button type="sumbit" onClick={() => { this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex, currentVariants); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
                                Готово
            </Button>
                            :
                            <Button type="sumbit" onClick={() => { console.log(this.state.variantImg); this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex, currentVariants); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
                                Готово
            </Button>
                        }
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}
export default reduxForm({
    form: 'writeByYourselfForm',     // a unique identifier for this form

})(writeByYourselfQuest)