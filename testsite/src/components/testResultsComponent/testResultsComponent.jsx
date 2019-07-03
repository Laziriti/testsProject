import React, { Component } from 'react'
import { Field, FieldArray, reduxForm, getFormValues } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import { Radio } from 'semantic-ui-react'
// import validate from '../validate';
import axios from 'axios';

import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react'

class testResults extends Component {
  state = {
    modalOpenResult: false,
    variantImg: [],
    currentIndexVariantImg: null,
    editState: false,
  }

  handleOpen = () => this.setState({ modalOpenResult: true })

  handleClose = () => this.setState({ modalOpenResult: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }); console.log(index) }

  handleEdit = () => {
    this.setState({ editState: true });
  }
  handleEditClose = () => {
    this.setState({ editState: false });
  }

  FileSelectedHendlerVariants = img => {

    let imgVarArr = this.state.variantImg;
    let files = img;
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

  firstTypeHandler(formData, variantImg) {
    var resultArr = [];
    var resultObject = {};
    var check = 0;
    var index = 0;
    formData.forEach(function (value, key) {
      console.log(key);
      check++;
      if (check === 1) {
        if (key === "result_img" + index) {
          resultObject["result_img"] = variantImg[index];
        }
        if (variantImg[index] == null) {
          resultObject["result_img"] = "null"
        }
      }
      if (check === 2) {
        resultObject["min"] = Number(value);
      }
      if (check === 3) {
        resultObject["max"] = Number(value);
      }
      if (check === 4) {
        resultObject["result"] = value;
        check = 0;
        resultArr.push(resultObject);
        resultObject = {};
        index++;
      }
    });
    return resultArr;
  }
  secondTypeHandler(formData, variantImg) {
    var resultArr = [];
    var resultObject = {};
    var check = 0;
    var index = 0;
    formData.forEach(function (value, key) {
      console.log(key);
      check++;
      if (check === 1) {
        if (key === "result_img" + index) {
          resultObject["index"] = index;
          resultObject["result_img"] = variantImg[index];
        }
        if (variantImg[index] == null) {
          resultObject["result_img"] = "null"
        }
      }
      if (check === 2) {
        resultObject["result"] = value;
      }
      if (check === 3) {
        resultObject["description"] = value;
        check = 0;
        resultArr.push(resultObject);
        resultObject = {};
        index++;
      }
    });
    return resultArr;
  }
  serv(results, setResults, questions, variantImg, testType) {
    var resultArr = [];
    var formData = new FormData(document.forms.resultsForm);
    if (testType === "first") {
      resultArr = this.firstTypeHandler(formData, variantImg)
    }
    if (testType === "second") {
      resultArr = this.secondTypeHandler(formData, variantImg)
    }
    if (testType === "third") {
      resultArr = this.thirdTypeHandler(formData, variantImg)
    }
    setResults(resultArr);
    var json = JSON.stringify(resultArr);
    console.log(json);
  }

  insertCurrentData(currentVariants) {
    if (typeof currentVariants !== "undefined") {
      setTimeout(() => {
        document.getElementById("insertDataResult").click();
      }, 0);

    }
  }


  render() {
    const { results, setResults, questions, testType, currentResults, reset } = this.props
    const renderField = ({ input, label, type, globalField, textValue, index, meta: { touched, error } }) => (
      <div>
        <label>{label}</label>
        <div>
          {this.state.editState && globalField.length > index ?
            <textarea {...input} type={type} />
            : <textarea {...input} type={type} />}
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    )

    const renderNumberField = ({ input, label, type, globalField, index, meta: { touched, error } }) => (
      <div>
        {
          testType === "first" ?
            <div>
              <label>{label}</label>
              {this.state.editState && globalField.length > index ?
                label === "Промежуток от:" ? <input {...input} type={type} value={globalField[index].min} />
                  : <input {...input} type={type} value={globalField[index].max} />
                : <input {...input} type={type} />}
              {touched && error && <span>{error}</span>}
            </div>
            : ""
        }
      </div>
    )

    const renderAnswers = ({ fields, globalField, variantsImgArray }) => (
      <div>
        {typeof globalField !== "undefined" ?
          <button type="button" id="insertDataResult" onClick={() => {
            this.handleEdit();
            if (fields.length <= globalField.length) {
              globalField.forEach((elem, index) => {
                fields.push(elem);
                let imgVarArr = this.state.variantImg;
                if (fields.length > 0) {
                  imgVarArr[fields.length + index + 1] = globalField[index].result_img;
                }
                else {
                  if (index === 0) {
                    imgVarArr[fields.length] = globalField[index].result_img;
                  }
                  else {
                    imgVarArr[fields.length + index] = globalField[index].result_img;
                  }
                }
                this.setState({ variantImg: imgVarArr })
                console.log(this.state.variantImg)

              });
            };
          }}> Загрузить свои ответы </button> :
          ""
        }
        <button type="button" onClick={() => { fields.push({}); }}>Добавить результат</button>
        <ul>
          {fields.map((answer, index) =>
            <li key={index}>
              <h4>Результат #{index + 1}</h4>
              <button
                type="button"
                title="Удалить результат"
                onClick={() => { fields.remove(index); }}>Удалить</button>
              {variantsImgArray[index] ? <img src={variantsImgArray[index]} alt='' />
                : ""}
              <input type="file" name={"result_img" + index} onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target.files[0]); }}></input>
              <div className="resultGap">
                <Field
                  label="Промежуток от:"
                  className="answerVar"
                  name={index + `from`}
                  type="number"
                  component={renderNumberField}
                  globalField={globalField}
                  index={index}
                />
                <Field
                  label="до:"
                  className="answerVar"
                  name={index + `to`}
                  type="number"
                  component={renderNumberField}
                  globalField={globalField}
                  index={index}
                />
              </div>
              <div>
                <Field
                  className="answerVar"
                  name={index + `result`}
                  type="text"
                  label="Краткий вариант"
                  component={renderField}
                  globalField={globalField}
                  index={index}
                  textValue={this.state.editState && globalField.length > index ? globalField[index].description : ""}
                />
                {testType === "second" ?
                  <div>
                    <Field
                      className="answerVar"
                      name={index + `description`}
                      type="text"
                      label="Текст результата"
                      component={renderField}
                      globalField={globalField}
                      index={index}
                      textValue={this.state.editState && globalField.length > index ? globalField[index].description : ""}
                    />
                  </div>
                  : ""
                }
              </div>
            </li>
          )}
        </ul>
      </div>
    )

    return (
      <Container>
        <Modal trigger={<Button onClick={() => { this.handleOpen(); }} className='resultsTrigger' id="22">Результаты</Button>} open={this.state.modalOpenResult} centered={false}>
          <Modal.Header>{"Результаты"}</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
              <div>
                <form name='resultsForm'>
                  <label>Результаты</label>
                  <div className='answers'>
                    <FieldArray
                      name="allResults"
                      component={renderAnswers}
                      globalField={currentResults}
                      variantsImgArray={this.state.variantImg} />
                  </div>
                </form>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose(); }} color="primary">
              Отмена
            </Button>
            <Button type="submit" onClick={() => { this.serv(results, setResults, questions, this.state.variantImg, testType); this.handleClose(); }} color="primary" autoFocus>
              Готово
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}
export default reduxForm({
  form: 'ResultForm',     // a unique identifier for this form
})(testResults)