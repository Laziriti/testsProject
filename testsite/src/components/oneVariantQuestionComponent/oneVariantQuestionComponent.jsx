import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class oneVarQuest extends Component {
  state = {
    modalOpen: false,
    actualImg: null,
    variantImg: [1],
    currentIndexVariantImg: null,
    imgArr: [],
    checkArr: [],
    questionsCount: 0
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }); console.log(index) }


  FileSelectedHendler = event => {

    let files = event.target.files[0];
    let formData = new FormData();
    formData.append("img_field", files);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        console.log(response);
        this.setState({ actualImg: response.data.img_field })
      }).catch(e => {
        console.log(e)
      })
  }


  FileSelectedHendlerVariants = event => {

    let imgVarArr = this.state.variantImg;
    let files = event.files[0];
    let formData = new FormData();
    formData.append("img_field", files);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        console.log(response);
        imgVarArr[this.state.currentIndexVariantImg] = response.data.img_field;
        this.setState({ variantImg: imgVarArr })
      }).catch(e => {
        console.log(e)
      })
    console.log(this.state.variantImg)
  }


  FileVariantsRemove = index => {
    let imgVarArr = this.state.variantImg;
    imgVarArr.splice(index, 1);
    this.setState({ variantImg: imgVarArr });
  }
  firstTypeHandler(object, variantImg, variantsCount) {
    var objectVariant = {};

    var allVariants = [];
    var roll = 0;
    var i = 0;

    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;
    objectVariant = {}
    formData.forEach(function (value, key) {

      if (key !== 'questImg' && key !== 'question' && key !== 'priceQuestion' && key !== 'groupNumber' && key !== 'timerQuestion') {

        if (key === "variant_img" + i) {
          console.log(variantsCount)
          // console.log(!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && i !== variantsCount)
          if (!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && i !== variantsCount) {
            console.log(i)
            objectVariant["answer_state"] = 0;
            allVariants[roll] = objectVariant;
            console.log(objectVariant)
            console.log(allVariants[roll])
            objectVariant = {};
            roll++;
          }

          objectVariant["variant_Id"] = variantIndex;
          variantIndex++;

          objectVariant["variant_img"] = variantImg[i];
          if (variantImg[i] == null) {
            objectVariant["variant_img"] = "null"
          }
        }

        if (key === "variants[" + i + "]variant") {
          console.log(key)
          objectVariant["variant"] = value;
          i++;
        }

        if (key === "answerState") {
          console.log(objectVariant)
          objectVariant["answer_state"] = 1;
          allVariants[roll] = objectVariant;
          objectVariant = {};
          console.log(allVariants[roll])
          roll++;
        }

        if (!objectVariant.hasOwnProperty("answer_state") && i === variantsCount && key === "variants[" + Number(i - 1) + "]variant") {
          // console.log(objectVariant.hasOwnProperty("answer_state"))
          // console.log(objectVariant)
          objectVariant["answer_state"] = 0;
          allVariants[roll] = objectVariant;
          console.log(allVariants)
        }
      }
    }
    );
    object["variants"] = allVariants;
    return object;
  }
  secondTypeHandler(object, variantImg) {
    var objectVariant = {};
    var allVariants = [];
    var roll = 0;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;
    var i = 0;
    formData.forEach(function (value, key) {

      if (key === "variant_img" + i) {
        objectVariant["variant_Id"] = variantIndex;
        variantIndex++;
        objectVariant["variant_img"] = variantImg[i];
        if (variantImg[i] == null) {
          objectVariant["variant_img"] = "null"
        }
      }
      if (key === "variants[" + i + "]variant") {
        objectVariant["variant"] = value;
        i++;
      }

      if (key === "answerState") {
        objectVariant["answer_state"] = Number(value);
        allVariants[roll] = objectVariant;
        objectVariant = {};
        roll++;
      }
    }

    );
    object["variants"] = allVariants;
    return object;
  }

  createQuestion(questions, setQuests, actualImg, variantImg, testType, editIndex) {

    let arr;
    if (questions !== undefined) {
      arr = questions;
    }
    else arr = [];
    var object = {};
    var formData = new FormData(document.forms.oneVariantForm);
    if (typeof editIndex === "number") {
      object["question_ID"] = editIndex + 1;
    }
    else {
      object["question_ID"] = arr.length;
    }

    object["type_question"] = "one_answer";


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
      if (key === 'groupNumber') {

        object["group_number"] = Number(value);
      }
      if (key === 'timerQuestion') {
        if (value !== "0:0") {
          object["timer_question"] = value;
        }

      }
    });

    if (testType === 'first') {
      object = this.firstTypeHandler(object, variantImg, this.props.variantsCount)
    }
    else if (testType === 'second') {
      object = this.secondTypeHandler(object, variantImg);
    }
    else if (testType === 'third') {
      object = this.thirdTypeHandler(object, variantImg)
    }
    object["number_answers"] = this.props.variantsCount;
    console.log(editIndex);
    if (typeof editIndex === "number") {
      console.log("ВЫПАЛО")
      arr[editIndex] = object;
    }
    else {
      arr.push(object);
    }

    setQuests(arr);
    this.props.setVariantsCount(0);

    var json = JSON.stringify(questions);

    console.log(json);
  }

  createSelectItems(results, editVariants, index, editCount) {
    let items = [];

    for (let i = 0; i < results.length; i++) {
      let item = <option key={i} value={i} >{results[i].result} </option>;
      console.log(this.state.checkArr[index])

      if (this.state.checkArr[index] === i) {
        item = <option key={i} value={i} selected>{results[i].result} </option>;
      }
      items.push(item);
    }

    console.log(this.state.checkArr)
    return items;
  }
  insertCurrentData(editVariants) {
    if (typeof editVariants !== "undefined") {
      setTimeout(() => {
        document.getElementById("insertDataOneVariant").click();
      }, 0);

    }
  }
  saveDataSelect(index, value) {
    // console.log(value.target.value)
    let arr = this.state.checkArr;
    arr[index] = value.target.value;
    this.setState({ checkArr: arr })
  }
  saveData(index) {
    let arr = this.state.checkArr;
    arr[index] = !arr[index];
    this.setState({ checkArr: arr })
  }
  addToArr(value) {
    let arr = this.state.checkArr;
    arr.push(value);
    this.setState({ checkArr: arr })
  }
  delFromArr(index) {
    let arr = this.state.checkArr;
    arr.splice(index, 1);
    this.setState({ checkArr: arr })
  }

  render() {
    const {
      groupsObject,
      handleSubmit,
      questions,
      setQuests,
      reset,
      testType,
      results,
      variantsCount,
      setVariantsCount,
      editIndex,
      groupsState,
      groupsTimerState,
      editQuest } = this.props;

    const renderField = ({ input, label, type, editVariants, index, meta: { touched, error } }) => (
      <div>

        <label>{label}</label>
        <div>
          <textarea {...input} type={type} ></textarea>
          {
            testType === 'first' ?
              <input type="radio"
                name="answerState"
                onChange={() => this.saveData(index)}
                defaultChecked={this.state.checkArr[index] ? this.state.checkArr[index] : ""} />
              : ""
          }
          {
            testType === 'second' ?
              <select name="answerState" className="groupClass" onChange={(e) => this.saveDataSelect(index, e)}>
                {this.createSelectItems(results, editVariants, index, editQuest ? editQuest.number_answers : "")}
              </select>
              : ""
          }
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderAnswers = ({ fields, editIndex, editVariants, editCount, variantsImgArray }) => (
      <div>
        {typeof editVariants !== "undefined" ?
          <button type="button" id="insertDataOneVariant" onClick={() => {
            setVariantsCount(editVariants.length);
            this.setState({ actualImg: editQuest.questImg })
            if (fields.length <= editVariants.length) {
              editVariants.forEach((elem, index) => {
                this.setState({ questionsCount: this.state.questionsCount + 2 });
                fields.push(elem);
                if (testType === "second") {
                  this.addToArr(elem.answer_state)
                }
                else {
                  this.addToArr(elem.answer_state ? true : false)
                }
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
                this.setState({ variantImg: imgVarArr });
                console.log(this.state.variantImg);

              });
            };
          }}> Загрузить свои ответы </button> :
          ""
        }

        <button type="button"
          onClick={() => {
            fields.push({});
            setVariantsCount(variantsCount + 1);
            this.setState({ questionsCount: this.state.questionsCount + 1 });
            this.addToArr(false)
          }}>Добавить вариант ответа</button>
        <ul>
          {fields.map((answer, index) =>
            <div>
              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"
                onClick={() => {
                  fields.remove(index);
                  setVariantsCount(variantsCount - 1);
                  this.FileVariantsRemove(index);
                  this.delFromArr(index)
                }}
              >Удалить</button>
              <img src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <input type="file" id={index} name={"variant_img" + index} onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target); }} />
              <div className='answerFeild'>
                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  type="text"
                  index={index}
                  component={renderField}
                />
              </div>
            </div>
          )}
        </ul>
      </div>
    )

    return (
      <Container>
        <Modal trigger={<Button onClick={() => {
          this.setState({ checkArr: [] });
          this.handleOpen();
          this.insertCurrentData(editQuest && editQuest.variants ? editQuest.variants : undefined);
        }}
          className='oneVariantTrigger'>Одновариантный вопрос</Button>}
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
                          name="groupNumber"
                          type="string"
                          defaultValue={editQuest && editQuest.group_number ? editQuest.group_number : 0}
                          onLoad={(event) => { this.props.handleGroups(event.target.value, groupsObject) }}
                          onChange={(event) => { this.props.handleGroups(event.target.value, groupsObject) }}></input>
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
                      variantsImgArray={this.state.variantImg}
                    />
                  </div>
                </form>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose(); reset(); }} color="primary">
              Отмена
            </Button>

            {
              this.state.questionsCount > 1 ?

                <Button type="sumbit" onClick={() => {
                  this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, editIndex);
                  this.props.setGroups(new FormData(document.forms.oneVariantForm), this.props.groupsObject, this.props.setGroupObject);
                  this.handleClose();
                  reset();
                  this.props.updateList();
                }} color="primary" autoFocus>
                  Готово
            </Button>
                : ""

            }
          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}
export default reduxForm({
  form: 'OneVariantForm',     // a unique identifier for this form

})(oneVarQuest)