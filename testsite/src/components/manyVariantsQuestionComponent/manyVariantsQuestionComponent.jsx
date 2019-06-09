import React, { Component } from 'react'
import { Field, FieldArray, reduxForm, getFormValues } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
var arr = [];
var count = 0;
var rightCount = 0;
class oneVarQuest extends Component {
  state = {
    notFullPriceState: false || this.props.currentPriceState,
    modalOpen: false,
    actualImg: null,
    actualImgVariant: null,
    variantImg: [],
    currentIndexVariantImg: null,
    editState: false,
    imgArr: [],
    checkBoxArr: [],
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

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }); console.log(index) }

  SetSelect = (results, event) => {
    var select = event.target;
    console.log(event.target.className)
    if (event.target.className !== "groupClass Active") {
      for (var i = 0; i < results.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", results[i].result);
        option.text = results[i].result;
        select.appendChild(option);
      }
      event.target.className += " Active";
    }
  }

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

  firstTypeHandler(object, variantImg) {
    var objectVariant = {};
    var checkState = 0;
    var checkStateForCount = 0;
    var allVariants = [];
    var roll = 0;
    var i = 0;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;

    formData.forEach(function (value, key) {

      if (key !== 'questImg' && key !== 'question') {
        if (key === "variant_img" + i) {
          if (!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && i !== count) {
            console.log(objectVariant)
            objectVariant["answer_state"] = 0;
            allVariants[roll] = objectVariant;
            objectVariant = {};
            roll++;
          }
          checkState = 1;
          objectVariant["variant_Id"] = variantIndex;
          variantIndex++;
          objectVariant["variant_img"] = variantImg[i];
          if (variantImg[i] == null) {
            objectVariant["variant_img"] = "null"
          }
        }
        if (key === "variants[" + i + "]priceVar") {
          objectVariant["priceVar"] = value;
        }
        if (key === "variants[" + i + "]variant") {
          objectVariant["variant"] = value;
          checkStateForCount = 1
          i++;
        }
        if (key === "answerState") {
          objectVariant["answer_state"] = 1;
          checkStateForCount = 0;
          rightCount++;
          allVariants[roll] = objectVariant;
          objectVariant = {};
          roll++;
        }
        if (!objectVariant.hasOwnProperty("answer_state") && i === count && key === "variants[" + Number(i - 1) + "]variant") {
          objectVariant["answer_state"] = 0;
          allVariants[roll] = objectVariant;
        }
      }
    }
    );
    object["variants"] = allVariants;
    return object;
  }

  secondTypeHandler(object, variantImg) {
    var object1 = {};
    var allVariants = [];
    var roll = 0;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;
    formData.forEach(function (value, key) {
      for (var i = 0; i < count; i++) {
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
    return object;
  }
  serv(questions, setQuests, actualImg, variantImg, testType, currentIndex) {
    arr = questions;
    var object = {};
    var formData = new FormData(document.forms.oneVariantForm);
    object["question_ID"] = questions.length;
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
      object = this.firstTypeHandler(object, variantImg)
      object["number_answers"] = rightCount;
    }
    else if (testType === 'second') {
      object = this.secondTypeHandler(object, variantImg);
      object["number_answers"] = count;
    }

    if (typeof currentIndex === "number") {
      arr[currentIndex] = object;
    }
    else {
      arr.push(object);
    }
    setQuests(arr);
    count = 0;
    var json = JSON.stringify(questions);
    console.log(json);
  }

  createSelectItems(results, currentVariants, index, currentCount) {
    let items = [];
    for (let i = 0; i < results.length; i++) {
      let item = <option key={i} value={i} >{results[i].result} </option>;
      if (this.state.checkBoxArr[index] == i) {
        item = <option key={i} value={i} selected>{results[i].result} </option>;
      }
      items.push(item);
    }
    console.log(this.state.checkBoxArr)
    return items;
  }

  saveDataSelect(index, value) {
    // console.log(value.target.value)
    let arr = this.state.checkBoxArr;
    arr[index] = value.target.value;
    this.setState({ checkBoxArr: arr })
  }
  insertCurrentData(currentVariants) {
    if (typeof currentVariants !== "undefined") {
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
 
    const { handleSubmit, questions, setQuests, reset, testType, results, currentVariants, currentQuestion, currentIndex, currentCount, currentPrice,currentPriceState } = this.props;

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
    const renderFieldCheck = ({ input, label, currentVariants, currentCount, index, type, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>
          {
            testType === "first" ?
              <input type="checkbox" name="answerState" onChange={() => this.saveData(index)} defaultChecked={this.state.checkBoxArr[index] ? this.state.checkBoxArr[index] : ""} />
              : ""
          }
          {
            testType === 'second' ?
              <select name="groupState" className="groupClass" onChange={(e) => this.saveDataSelect(index, e)}>
                {this.createSelectItems(results, currentVariants, index, currentCount)}
              </select>
              : ""
          }
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderAnswers = ({ fields, globalField, currentIndex, currentVariants, currentCount, variantsImgArray }) => (
      <div>
        {typeof currentVariants !== "undefined" ?
          <button type="button" id="insertDataManyVariant" onClick={() => {
            this.handleEdit();
            if (fields.length <= globalField.length) {
              globalField.forEach((elem, index) => {
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
                  imgVarArr[fields.length + index + 1] = currentVariants[elem.variant_Id].variant_img;
                }
                else {
                  if (index === 0) {
                    imgVarArr[fields.length] = currentVariants[elem.variant_Id].variant_img;
                  }
                  else {
                    imgVarArr[fields.length + index] = currentVariants[elem.variant_Id].variant_img;
                  }
                }
                this.setState({ variantImg: imgVarArr })
                console.log(this.state.variantImg)
                count++
              });
            };

          }}> Загрузить свои ответы </button> :
          ""
        }

        <button type="button" onClick={() => { fields.push({}); count++; this.addToArr(false); this.addToArrPriceArr(0) }}>Добавить вариант ответа</button>
        <ul>

          {fields.map((answer, index) =>

            <li key={index}>

              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"

                onClick={() => { fields.remove(index); count--; this.FileVariantsRemove(index); this.handleEditClose(); this.delFromArr(index); this.delFromArrPriceArr(index) }}>Удалить</button>
              <img src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <input type="file" name={"variant_img" + index} onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target.files[0]); }}></input>
              <div className='answerFeild'>

                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  answer={answer}
                  currentVariants={currentVariants}
                  currentCount={currentCount}
                  index={index}
                  type="text"
                  component={renderField}
                />

                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  currentVariants={currentVariants}
                  currentCount={currentCount}
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

        <Modal trigger={<Button onClick={() => { this.setState({ checkBoxArr: [] }); this.setState({ notFullPriceArr: [] }); this.handleOpen(); this.insertCurrentData(currentVariants); }} className='manyVariantTrigger'>Многовариантный вопрос</Button>} open={this.state.modalOpen} centered={false}>
          <Modal.Header>{"Многовариантный вопрос"}</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='small' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
              <div>
                <form onSubmit={handleSubmit} name='oneVariantForm'>
                  <div className='inputQuest'>
                    <label>Введите вопрос:</label>
                    <div className='quest'>
                      <Field
                        name="question"
                        component="textarea"
                        type="text"
                        placeholder="Текст результата"
                      />
                      <div>
                        <label>Количество баллов за ответ</label>
                        <input name="priceQuestion" defaultValue={currentPrice ? currentPrice : 1} disabled={this.state.notFullPriceState}></input>
                      </div>
                      <div>
                        <label>Неполный ответ</label>
                        <input name="notFullPriceQuestion" defaultChecked={currentPriceState?currentPriceState:false} type="checkBox" onClick={() => { this.setState({ notFullPriceState: !this.state.notFullPriceState }) }}></input>
                      </div>
                      <input
                        name="questImg"
                        type="file"
                        onChange={this.FileSelectedHendler}
                      />
                    </div>
                  </div>
                  <label>Варианты ответа</label>
                  <div className='answers'>
                    <FieldArray
                      name="variants"
                      globalField={currentVariants}
                      component={renderAnswers}
                      currentIndex={currentIndex}
                      currentVariants={currentVariants}
                      currentCount={currentCount}
                      variantsImgArray={this.state.variantImg}
                    />
                  </div>
                </form>
              </div>
            </Modal.Description>

          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose(); reset(); rightCount = 0 }} color="primary">
              Отмена
            </Button>
            <Button type="sumbit" onClick={() => { this.serv(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex); this.handleClose(); reset(); this.props.updateList(); rightCount = 0 }} color="primary" autoFocus>
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