import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class oneVarQuest extends Component {
  state = {
    notFullPriceState: false || (this.props.editQuest && this.props.editQuest.not_full_price_question ? this.props.editQuest.not_full_price_question : false),
    modalOpen: false,
    actualImg: null,
    variantImg: [],
    currentIndexVariantImg: null,

    imgArr: [],
    checkBoxArr: [],
    notFullPriceArr: []
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }); console.log(index) }

  FileSelectedHendler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })

    let files = event.target.files[0];
    let formData = new FormData();
    formData.append("img_field", files);
    console.log(formData);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        console.log(response);
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
    console.log(formData);
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
    let rightCount = 0;
    var objectVariant = {};
    var allVariants = [];
    var roll = 0;
    var index = 0;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;

    formData.forEach(function (value, key) {

      if (key !== 'questImg' && key !== 'question') {

        if (key === "variant_img" + index) {
          if (!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && index !== variantsCount) {

            objectVariant["answer_state"] = 0;
            allVariants[roll] = objectVariant;
            objectVariant = {};
            roll++;
            console.log(key)
          }
          objectVariant["variant_Id"] = variantIndex;
          variantIndex++;
          objectVariant["variant_img"] = variantImg[index];
          if (variantImg[index] == null) {
            objectVariant["variant_img"] = "null"
          }
        }
        if (key === "variants[" + index + "]priceVar") {
          objectVariant["priceVar"] = value;
        }
        if (key === "variants[" + index + "]variant") {
          objectVariant["variant"] = value;
          index++;
        }
        if (key === "answerState") {
          objectVariant["answer_state"] = 1;
          rightCount++;
          allVariants[roll] = objectVariant;
          objectVariant = {};
          roll++;
        }
        if (!objectVariant.hasOwnProperty("answer_state") && index === variantsCount && key === "variants[" + Number(index - 1) + "]variant") {
          objectVariant["answer_state"] = 0;
          allVariants[roll] = objectVariant;
        }
      }

    }
    );
    object["variants"] = allVariants;
    object["number_answers"] = rightCount;
    console.log(object)
    return object;
  }

  secondTypeHandler(object, variantImg, variantsCount) {
    var object1 = {};
    var allVariants = [];
    var roll = 0;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;
    formData.forEach(function (value, key) {
      for (var i = 0; i < variantsCount; i++) {
        if (key === "variant_img" + i) {
          object1["variant_Id"] = variantIndex;
          variantIndex++;
          object1["variant_img"] = variantImg[i];
          if (variantImg[i] == null) {
            object1["variant_img"] = "null"
          }
        }
        if (key === "variants[" + i + "]priceVar") {
          object1["priceVar"] = value;
        }
        if (key === "variants[" + i + "]variant") {
          object1["variant"] = value;
          this.props.variantsCount++;
        }
      }

      if (key === 'groupState') {
        object1["answer_state"] = Number(value);
        allVariants[roll] = object1;
        object1 = {};
        roll++;
      }
    }
    );
    object["variants"] = allVariants;
    object["number_answers"] = variantsCount;
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
    object["question_ID"] = arr.length;
    object["type_question"] = "many_answers";
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
      if (key === 'notFullPriceQuestion') {
        object["not_full_price_question"] = value;
      }
    });

    if (testType === 'first') {
      console.log("asd")
      object = this.firstTypeHandler(object, variantImg, this.props.variantsCount)
    }
    else if (testType === 'second') {
      object = this.secondTypeHandler(object, variantImg, this.props.variantsCount);
    }

    if (typeof editIndex === "number") {
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
  //поправил == ===
  createSelectItems(results, editVariants, index, editCount) {
    let items = [];
    for (let i = 0; i < results.length; i++) {
      let item = <option key={i} value={i} >{results[i].result} </option>;
      if (this.state.checkBoxArr[index] === i) {
        item = <option key={i} value={i} selected>{results[i].result} </option>;
      }
      items.push(item);
    }
    console.log(this.state.checkBoxArr)
    return items;
  }

  saveDataSelect(index, value) {
    let arr = this.state.checkBoxArr;
    arr[index] = value.target.value;
    this.setState({ checkBoxArr: arr })
  }
  insertCurrentData(editVariants) {
    if (typeof editVariants !== "undefined") {
      setTimeout(() => {
        document.getElementById("insertDataManyVariant").click();
      }, 0);
    }
  }

  saveData(index) {
    let arr = this.state.checkBoxArr;
    arr[index] = !arr[index];
    this.setState({ checkBoxArr: arr })
  }
  addToArr(value) {
    let arr = this.state.checkBoxArr;
    arr.push(value);
    this.setState({ checkBoxArr: arr })
  }
  delFromArr(index) {
    let arr = this.state.checkBoxArr;
    arr.splice(index, 1);
    this.setState({ checkBoxArr: arr })
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
      results,
      variantsCount,
      setVariantsCount,
      editIndex,
      groupsObject,
      groupsState,
      groupsTimerState,
      editQuest } = this.props;

    const renderField = ({ input, index, label, type, meta: { touched, error }, answer }) => (
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
    const renderFieldCheck = ({ input, label, editVariants, editCount, index, type, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>
          {
            testType === "first" ?
              <input type="checkbox"
                name="answerState"
                onChange={() => this.saveData(index)}
                defaultChecked={this.state.checkBoxArr[index] ? this.state.checkBoxArr[index] : ""} />
              : ""
          }
          {
            testType === 'second' ?
              <select name="groupState" className="groupClass" onChange={(e) => this.saveDataSelect(index, e)}>
                {this.createSelectItems(results, editVariants, index, editCount)}
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
          <button type="button" id="insertDataManyVariant" onClick={() => {
            setVariantsCount(editVariants.length);
            this.setState({ actualImg: editQuest.questImg  })

            if (fields.length <= editVariants.length) {
              editVariants.forEach((elem, index) => {
                fields.push(elem);
                if (elem.priceVar) {
                  this.addToArrPriceArr(elem.priceVar)
                }

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
                this.setState({ variantImg: imgVarArr })
                console.log(this.state.variantImg);

              });
            };

          }}> Загрузить свои ответы </button> :
          ""
        }

        <button type="button" onClick={() => {
          fields.push({});
          setVariantsCount(variantsCount + 1);
          this.addToArr(false);
          this.addToArrPriceArr(0)
        }}>Добавить вариант ответа</button>
        <ul>

          {fields.map((answer, index) =>

            <li key={index}>

              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"

                onClick={() => {
                  fields.remove(index);
                  setVariantsCount(variantsCount - 1);
                  this.FileVariantsRemove(index);
                  this.delFromArr(index);
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
                  answer={answer}
                  editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  index={index}
                  type="text"
                  component={renderField}
                />

                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  index={index}
                  type="text"
                  component={renderFieldCheck}
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
          this.setState({ checkBoxArr: [] });
          this.setState({ notFullPriceArr: [] });
          this.handleOpen();
          this.insertCurrentData(editQuest && editQuest.variants ? editQuest.variants : undefined);
        }}
          className='manyVariantTrigger'>Многовариантный вопрос</Button>}
          open={this.state.modalOpen} centered={false}>
          <Modal.Header>{"Многовариантный вопрос"}</Modal.Header>
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
                      />
                      <div>
                        <label>Количество баллов за ответ</label>
                        <input name="priceQuestion"
                          defaultValue={editQuest && editQuest.price_question ? editQuest.price_question : 1}
                          disabled={this.state.notFullPriceState}></input>
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
                    <FieldArray
                      name="variants"
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
            <Button type="sumbit" onClick={() => { this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, editIndex); this.props.setGroups(new FormData(document.forms.ManyVariantForm), this.props.groupsObject, this.props.setGroupObject); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
              Готово
            </Button>
          </Modal.Actions>
        </Modal>

      </Container >
    )
  }
}
export default reduxForm({
  form: 'ManyVariantForm',     // a unique identifier for this form
})(oneVarQuest)