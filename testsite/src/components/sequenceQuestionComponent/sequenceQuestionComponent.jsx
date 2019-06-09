import React, { Component } from 'react'
import { Field, FieldArray, reduxForm, getFormValues } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
// import validate from '../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
var arr = [];
var count = 0;
class sequenceQuestion extends Component {
  state = {
    notFullPriceState: false || this.props.currentPriceState,
    modalOpen: false,
    actualImg: null,
    actualImgVariant: null,
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
  firstTypeHandler(object, variantImg) {
    var object1 = {};
    var checkState = 0;
    var allVariants = [];
    var roll = 0;
    var i = 0;
    var formData = new FormData(document.forms.sequenceForm);
    var variantIndex = 0;

    formData.forEach(function (value, key) {


      if (key === "variant_img" + i) {

        object1["variant_Id"] = variantIndex;
        variantIndex++;
        object1["variant_img"] = variantImg[i];
        if (variantImg[i] == null) {
          object1["variant_img"] = "null";
        }
      }
      if (key === "variants[" + i + "]priceVar") {
        object1["priceVar"] = value;
      }
      if (key === "variants[" + i + "]variant") {
        object1["variant"] = value;

      }

      if (key === "variants[" + i + "]answerState") {
        console.log(11)
        object1["answer_state"] = Number(value);
        allVariants[roll] = object1;
        i++;
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
    var formData = new FormData(document.forms.sequenceForm);
    var variantIndex = 0;

    object["question_ID"] = questions.length + 1;
    object["type_question"] = "sequence_answer";

    // formData.forEach(function (value, key) {
    //   console.log(key);
    // })
    formData.forEach(function (value, key) {
      console.log(key);

      if (variantIndex === count) {
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
        object["not_full_price_question"] = value;
      }

    });
    console.log(testType)
    if (testType === 'first') {
      object = this.firstTypeHandler(object, variantImg);
    }

    object["number_answers"] = count;

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


    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", '/submit', true)
    // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    // // Отсылаем объект в формате JSON и с Content-Type application/json
    // xhr.send(json);

  }
  insertCurrentData(currentVariants) {
    if (typeof currentVariants !== "undefined") {
      setTimeout(() => {
        document.getElementById("insertDataSequenceVariant").click();
      }, 0);
      document.querySelectorAll("input").forEach(elem => {
        elem.focus()
      })
    }

  }

  deleteFromEditArr(index) {
    if (index < this.props.currentCount) {
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



    const { handleSubmit, questions, setQuests, reset, testType, className, currentVariants, currentQuestion, currentIndex, currentCount, currentPrice, currentPriceState } = this.props

    const renderField = ({ input, label, type, answer, currentVariants, index, meta: { touched, error } }) => (
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
    const renderFieldInput = ({ input, label, type, currentVariants, index, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>

          {
            this.state.editState && currentCount > index ?
              delete input.value && <input {...input} type={type} placeholder={label} defaultValue={currentVariants[index].answer_state} />
              : <input {...input} type={type} placeholder={label} />
          }
          {console.log(document.getElementsByName(input.name))}
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderAnswers = ({ fields, globalField, currentIndex, currentVariants, currentCount, variantsImgArray }) => (
      <div>
        {typeof currentVariants !== "undefined" ?
          <button type="button" id="insertDataSequenceVariant" onClick={() => {

            if (fields.length <= globalField.length) {
              globalField.forEach((elem, index) => {

                this.setState({ currentVarIndex: index })
                if (elem.priceVar) {
                  this.addToArrPriceArr(elem.priceVar)
                }
                this.handleEdit();
                fields.push(elem);
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

        <button type="button" onClick={() => { fields.push({}); count++; this.addToArrPriceArr(0) }}>Добавить вариант ответа</button>
        <ul>



          {fields.map((answer, index, item) =>
            <li key={index}>
              {console.log(item)}
              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"

                onClick={() => { fields.remove(index); count--; this.FileVariantsRemove(index); this.deleteFromEditArr(index); this.delFromArrPriceArr(index) }}>Удалить</button>
              <img src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <input type="file" name={"variant_img" + index} onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target.files[0]); }}></input>
              <div className='answerFeild'>

                <Field
                  className="answerVar"

                  name={answer + "variant"}
                  currentVariants={currentVariants}
                  currentCount={currentCount}
                  index={index}
                  answer={answer}
                  component={renderField}
                />
                <Field
                  className="answerVar"
                  type="number"
                  name={answer + "answerState"}
                  currentVariants={currentVariants}
                  currentCount={currentCount}
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


        <Modal trigger={<Button onClick={() => { this.handleOpen(); this.insertCurrentData(currentVariants) }} className='sequenceTrigger'>Последовательность</Button>} open={this.state.modalOpen} centered={false}>
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
                      >
                        {currentQuestion}
                      </textarea>

                      <div>
                        <label>Количество баллов за ответ</label>
                        <input name="priceQuestion" defaultValue={currentPrice ? currentPrice : 1} disabled={this.state.notFullPriceState}></input>
                      </div>
                      <div>
                        <label>Неполный ответ</label>
                        <input name="notFullPriceQuestion" defaultChecked={currentPriceState ? currentPriceState : false} type="checkBox" onClick={() => { this.setState({ notFullPriceState: !this.state.notFullPriceState }) }}></input>
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
                    <FieldArray name="variants"
                      globalField={currentVariants}
                      component={renderAnswers}
                      currentIndex={currentIndex}
                      currentVariants={currentVariants}
                      currentCount={currentCount}
                      variantsImgArray={this.state.variantImg} />

                  </div>
                </form>
              </div>
            </Modal.Description>

          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose(); reset(); }} color="primary">
              Отмена
            </Button>
            <Button type="sumbit" onClick={() => { this.serv(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
              Готово
            </Button>

          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}

export default reduxForm({
  form: 'SequenceVariantForm',     // a unique identifier for this form

})(sequenceQuestion)