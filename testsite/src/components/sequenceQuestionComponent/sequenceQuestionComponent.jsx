import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class sequenceQuestion extends Component {
  state = {
    notFullPriceState: false || this.props.editPriceState,
    modalOpen: false,
    actualImg: null,
    variantImg: [],
    currentIndexVariantImg: null,
    editState: false,
    editStateArray: [],
    currentVarIndex: null,
    notFullPriceArr: []

  }
  handleEdit = () => {
    this.setState({ editState: true });
  }
  handleEditClose = () => {
    this.setState({ editState: false });
  }
  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }) }

  FileSelectedHendler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })

    let files = event.target.files[0];
    let formData = new FormData();
    formData.append("img_field", files);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        this.setState({ actualImg: response.data.img_field })
      }).catch(e => {
        console.log(e)
      })
  }

  FileSelectedHendlerVariants = ee => {

    let imgVarArr = this.state.variantImg;
    let files = ee;
    let formData = new FormData();
    formData.append("img_field", files);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        imgVarArr[this.state.currentIndexVariantImg] = response.data.img_field;
        this.setState({ variantImg: imgVarArr })
      }).catch(e => {
        console.log(e)
      })
  }

  FileVariantsRemove = index => {
    let imgVarArr = this.state.variantImg;
    imgVarArr.splice(index, 1);
    this.setState({ variantImg: imgVarArr });
  }
  firstTypeHandler(object, variantImg) {
    var object1 = {};
    var allVariants = [];
    var roll = 0;
    var index = 0;
    var formData = new FormData(document.forms.sequenceForm);
    var variantIndex = 0;

    formData.forEach(function (value, key) {

      if (key === "variant_img" + index) {

        object1["variant_Id"] = variantIndex;
        variantIndex++;
        object1["variant_img"] = variantImg[index];
        if (variantImg[index] == null) {
          object1["variant_img"] = "null";
        }
      }
      if (key === "variants[" + index + "]priceVar") {
        object1["price_var"] = Number(value);
      }
      if (key === "variants[" + index + "]variant") {
        object1["variant"] = value;

      }

      if (key === "variants[" + index + "]answerState") {
        object1["answer_state"] = Number(value);
        allVariants[roll] = object1;
        index++;
        object1 = {};
        roll++;
      }

    }

    );
    object["variants"] = allVariants;

    return object;
  }

  createQuestion(questions, setQuests, actualImg, variantImg, testType, editIndex, variantsCount) {

    let questionsArray;
    if (questions !== undefined) {
      questionsArray = questions;
    }
    else questionsArray = [];
    var object = {};
    var formData = new FormData(document.forms.sequenceForm);
    var variantIndex = 0;
    object["question_ID"] = questionsArray.length;
    object["type_question"] = "sequence_answer";

    formData.forEach(function (value, key) {

      if (variantIndex === variantsCount) {
        variantIndex = 0;
      }
      if (key === 'questImg') {
        object[key] = actualImg;
      }
      if (key === 'question') {
        object[key] = value;
      }

      if (key === 'priceQuestion') {
        object["price_question"] = Number(value);
      }
      if (key === 'notFullPriceQuestion') {
        object["not_full_price_question"] = true;
      }
    });
    if (!object.hasOwnProperty("not_full_price_question")) {
      object["not_full_price_question"] = false;
    }
    if (testType === 'first') {
      object = this.firstTypeHandler(object, variantImg);
    }

    object["number_answers"] = variantsCount;

    if (typeof editIndex === "number") {
      questionsArray[editIndex] = object;
    }
    else {
      questionsArray.push(object);
    }

    setQuests(questionsArray);
    variantsCount = 0;
    console.log(JSON.stringify(object))
  }
  insertCurrentData(editVariants) {
    if (typeof editVariants !== "undefined") {
      setTimeout(() => {
        document.getElementById("insertDataSequenceVariant").click();
      }, 0);
      document.querySelectorAll("input").forEach(elem => {
        elem.focus()
      })
    }
  }

  deleteFromEditArr(index) {
    if (index < this.props.editCount) {
      this.handleEditClose();
    }
  }

  changeArr(index, value) {
    let editIndexArr = this.state.editStateArray;
    editIndexArr[index] = value;
    this.setState({ editStateArray: editIndexArr })
    return value;
  }

  saveDataPriceArr(index, value) {
    let arr = this.state.notFullPriceArr;
    arr[index] = value;
    this.setState({ notFullPriceArr: arr })
  }

  addToArrPriceArr(value) {
    let arr = this.state.notFullPriceArr;
    arr.push(value);
    this.setState({ notFullPriceArr: arr })
  }

  delFromArrPriceArr(index) {
    let arr = this.state.notFullPriceArr;
    arr.splice(index, 1);
    this.setState({ notFullPriceArr: arr })
  }

  render() {

    const { handleSubmit,
      questions,
      setQuests,
      reset,
      testType,
      variantsCount,
      setVariantsCount,
      editIndex,
      groupsObject,
      groupsState,
      groupsTimerState,
      editQuest } = this.props

    const renderField = ({ input, label, type, answer, index, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>
          <input type="number" name={answer + "priceVar"}
            onChange={(e) => this.saveDataPriceArr(index, e.target.value)}
            disabled={!this.state.notFullPriceState}
            defaultValue={this.state.notFullPriceArr[index] ? this.state.notFullPriceArr[index] : null}>
          </input>
          <textarea {...input} type={type} placeholder={label} />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderFieldInput = ({ input, label, type, editCount, editVariants, index, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>
          {
            this.state.editState && editCount > index ?
              delete input.value && <input {...input} type={type} placeholder={label} defaultValue={editVariants[index].answer_state} />
              : <input {...input} type={type} placeholder={label} />
          }
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderAnswers = ({ fields, editIndex, editVariants, editCount, variantsImgArray }) => (
      <div>
        {typeof editVariants !== "undefined" ?
          <button type="button" id="insertDataSequenceVariant" onClick={() => {
            setVariantsCount(editVariants.length);
            this.setState({ actualImg: editQuest.questImg })
            if (fields.length <= editVariants.length) {
              editVariants.forEach((elem, index) => {

                this.setState({ currentVarIndex: index })
                if (elem.priceVar) {
                  this.addToArrPriceArr(elem.priceVar)
                }
                this.handleEdit();
                fields.push(elem);
                let imgVarArr = this.state.variantImg;
                if (fields.length > 0) {
                  imgVarArr[fields.length + index + 1] = editVariants[elem.variant_Id].variant_img;
                }
                else {
                  if (index === 0) {
                    imgVarArr[fields.length] = editVariants[elem.variant_Id].variant_img;
                  }
                  else {
                    imgVarArr[fields.length + index] = editVariants[elem.variant_Id].variant_img;
                  }

                }
                this.setState({ variantImg: imgVarArr })
              });

            };

          }}> Загрузить свои ответы </button> :
          ""
        }

        <button type="button" onClick={() => {
          fields.push({});
          setVariantsCount(variantsCount + 1);
          this.addToArrPriceArr(0)
        }}>Добавить вариант ответа</button>
        <ul>

          {fields.map((answer, index, item) =>
            <li key={index}>
              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"

                onClick={() => {
                  fields.remove(index);
                  setVariantsCount(variantsCount - 1);
                  this.FileVariantsRemove(index);
                  this.deleteFromEditArr(index);
                  this.delFromArrPriceArr(index)
                }}>Удалить</button>
              <img src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <input type="file"
                name={"variant_img" + index}
                onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target.files[0]); }}></input>
              <div className='answerFeild'>

                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  index={index}
                  answer={answer}
                  component={renderField}
                />
                <Field
                  className="answerVar"
                  type="number"
                  name={answer + "answerState"}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  index={index}
                  component={renderFieldInput}
                />

              </div>

            </li>
          )}
        </ul>
      </div>
    )

    return (
      <Container>

        <Modal trigger={<Button onClick={() => {
          this.handleOpen();
          this.insertCurrentData(editQuest && editQuest.variants ? editQuest.variants : undefined)
        }}
          className='sequenceTrigger'>Последовательность</Button>}
          open={this.state.modalOpen}
          centered={false}>
          <Modal.Header>{"Последовательность"}</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='small' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
              <div>
                <form onSubmit={handleSubmit} name='sequenceForm'>
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
                        <input name="priceQuestion" defaultValue={editQuest && editQuest.price_question ? editQuest.price_question : 1} disabled={this.state.notFullPriceState}></input>
                      </div>
                      <div>
                        <label>Неполный ответ</label>
                        <input name="notFullPriceQuestion"
                          defaultChecked={editQuest && editQuest.not_full_price_question ? editQuest.not_full_price_question : false}
                          type="checkBox"
                          onClick={() => { this.setState({ notFullPriceState: !this.state.notFullPriceState }) }}></input>
                      </div>
                      <input
                        name="questImg"
                        type="file"
                        onChange={this.FileSelectedHendler}
                      />

                      {groupsState ? <div>
                        <label>Номер/название группы</label>
                        <input
                          name="groupNumber"
                          type="string"
                          defaultValue={editQuest && editQuest.group_number ? editQuest.group_number : 0}
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
                          defaultValue={editQuest && editQuest.group_number ? this.props.groupsObject[editQuest.group_number] : "0:0"}></input>
                      </div> : ""}

                      <div>
                        <label>Таймер для вопроса</label>
                        <input name="timerQuestion"
                          type="string"
                          placeholder="10:22 = 10 минут 22 секунды"
                          defaultValue={editQuest && editQuest.timer_question ? editQuest.timer_question : "0:0"}></input>
                      </div>

                    </div>
                  </div>
                  <label>Варианты ответа</label>
                  <div className='answers'>
                    <FieldArray name="variants"
                      component={renderAnswers}
                      editIndex={editIndex}
                      editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                      editCount={editQuest ? editQuest.number_answers : ""}
                      variantsImgArray={this.state.variantImg} />

                  </div>
                </form>
              </div>
            </Modal.Description>

          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose(); reset(); this.setState({ notFullPriceState: false }) }} color="primary">
              Отмена
            </Button>
            <Button type="sumbit" onClick={() => {
              this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, editIndex, variantsCount);
              this.props.setGroups(new FormData(document.forms.SequenceVariantForm), this.props.groupsObject, this.props.setGroupObject);
              this.handleClose();
              this.setState({ notFullPriceState: false });
              reset();
              this.props.updateList();
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
  form: 'SequenceVariantForm'

})(sequenceQuestion)