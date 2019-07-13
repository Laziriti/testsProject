import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

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
        this.setState({ actualImg: response.data.img_field })
      }).catch(e => {
        console.log(e)
      })
  }

  firstTypeHandler(object, variantImg) {

    var formData = new FormData(document.forms.oneVariantForm);

    formData.forEach(function (value, key) {

      if (key === "answersArr") {
        let answersString = value.toUpperCase();
        object['answers_arr'] = answersString;
      }
      if (key === "answers_count") {
        object['answers_count'] = Number(value);
      }
    }
    );
    return object;
  }

  createQuestion(questions, setQuests, actualImg, variantImg, testType, editIndex, editVariants) {

    let questionsArray;
    if (questions !== undefined) {
      questionsArray = questions;
    }
    else questionsArray = [];

    var object = {};
    var formData = new FormData(document.forms.oneVariantForm);
    if (typeof editIndex === "number") {
      object["question_ID"] = editIndex + 1;
    }
    else {
      object["question_ID"] = questionsArray.length;
    }

    object["type_question"] = "write_by_yourself_answer";
    object["not_full_price_question"] = false;
    formData.forEach(function (value, key) {

      if (key === 'questImg') {
        object[key] = actualImg;
      }
      if (key === 'question') {
        object[key] = value;
      }
      if (key === 'priceQuestion') {
        object["price_question"] = Number(value);
      }
      if (key === 'groupName') {
        object["group"] = value;
      }
      if (key === 'timerQuestion') {
        if (value !== "0:0") {
          let timerArr = value.split(":");
          if (timerArr[1] > 60) {
            timerArr[0] = Math.floor(timerArr[1] / 60);
            timerArr[1] = timerArr[1] % 60;
          }
          let stringTimer = timerArr.join(":");
          object["timer_question"] = stringTimer;
        }
      }
      

    });

    if (testType === 'first') {
      object = this.firstTypeHandler(object, variantImg)
    }

    object["number_answers"] = 1;
    if (typeof editIndex === "number") {
      questionsArray[editIndex] = object;
    }
    else {
      questionsArray.push(object);
    }

    setQuests(questionsArray);
    console.log(object)
  }
  setCurrentQuestionImg() {
    this.setState({ actualImg: this.props.editQuest && this.props.editQuest.questImg ? this.props.editQuest.questImg : "" })
  }

  render() {
    const { handleSubmit,
      questions,
      setQuests,
      reset,
      testType,
      editVariants,
      editIndex,
      groupsObject,
      groupsState,
      groupsTimerState,
      editQuest } = this.props;

    return (
      <Container>
        <Modal trigger={<Button onClick={() => {
          this.setState({ checkArr: [] });
          this.handleOpen();
          this.setCurrentQuestionImg()
        }}
          className='oneVariantTrigger'>Самописный вопрос</Button>}
          open={this.state.modalOpen}
          centered={false}>

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
                        defaultValue={editQuest ? editQuest.question : ""}
                      >
                      </textarea>
                      <div>
                        <label>Количество баллов за ответ</label>
                        <input name="priceQuestion" defaultValue={editQuest && editQuest.price_question ? editQuest.price_question : 1}></input>
                      </div>
                      <input
                        name="questImg"
                        type="file"
                        onChange={this.FileSelectedHendler}
                      />

                      {groupsState ? <div>
                        <label>Номер/название группы</label>
                        <input
                          name="groupName"
                          type="string"
                          defaultValue={editQuest && editQuest.group ? editQuest.group : 0}
                          onLoad={(event) => { this.props.handleGroups(event.target.value, groupsObject, groupsTimerState) }}
                          onChange={(event) => { this.props.handleGroups(event.target.value, groupsObject, groupsTimerState) }}></input>
                      </div>
                        : ""}
                      {groupsTimerState ? <div>
                        <label>Таймер группы</label>
                        <input name="groupTimer"
                          id="groupTimer"
                          type="string"
                          placeholder="10:22 = 10 минут 22 секунды"
                          defaultValue={editQuest && editQuest.group ? this.props.groupsObject[editQuest.group] : "0:0"}></input>
                      </div> : ""}

                      <div>
                        <label>Таймер для вопроса</label>
                        <input name="timerQuestion"
                          type="string"
                          placeholder="10:22 = 10 минут 22 секунды"
                          defaultValue={editQuest && editQuest.timer_question ? editQuest.timer_question : "0:0"}></input>
                      </div>

                    </div>

                    <div>
                      <label>Количество ответов для ввода:</label>
                      <input type="number" name="answers_count" defaultValue={editQuest && editQuest.answers_count ? editQuest.answers_count : ""}></input>
                    </div>
                    <div className='quest'>
                      <textarea name="answersArr"
                        placeholder="Возможные ответы через запятую, регистр значения не имеет"
                        defaultValue={editQuest && editQuest.answers_arr ? editQuest.answers_arr : ""}>
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

            <Button type="sumbit" onClick={() => {
              this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, editIndex, editVariants);
              this.props.setGroups(new FormData(document.forms.writeByYourselfForm), this.props.groupsObject, this.props.setGroupObject);
              this.handleClose(); reset(); this.props.updateList();
            }}
              color="primary"
              autoFocus>
              Готово
            </Button>


          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}
export default reduxForm({
  form: 'writeByYourselfForm'

})(writeByYourselfQuest)
