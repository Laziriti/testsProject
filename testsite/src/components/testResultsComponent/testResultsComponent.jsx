import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class testResults extends Component {
  state = {
    modalOpenResult: false,
    variantImg: [],
    currentIndexVariantImg: null,
    currentResults: []
  }

  handleOpen = () => this.setState({ modalOpenResult: true })

  handleClose = () => this.setState({ modalOpenResult: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }); console.log(index) }

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

    resultObject["group"] = document.getElementById("group").value;

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
  createResults(results, setResults, questions, variantImg, testType) {
    var resultArr = [];
    var formData = new FormData(document.forms.resultsForm);
    if (testType === "first") {
      resultArr = this.firstTypeHandler(formData, variantImg)
    }
    if (testType === "second") {
      resultArr = this.secondTypeHandler(formData, variantImg)
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
  deleteFromArr(index) {
    let imgVarArr = this.state.variantImg;

    imgVarArr.splice(index, 1);
    this.setState({ variantImg: imgVarArr });


    // let resultsArr = this.state.currentResults;
    this.state.currentResults.splice(index, 1);
    console.log(this.state.currentResults)
    // this.setState({ currentResults: resultsArr })
  }
  createSelectItems(index, groupsObject) {
    let items = [];
    console.log(groupsObject)
    // groupsObject.forEach((elem, index) => {
    //   console.log(elem);
    //   console.log(index)
    // })
    for (let objKey in groupsObject) {

      console.log(objKey);
      console.log(groupsObject[objKey])
      let item = <option key={objKey} value={objKey} >{objKey} </option>;

      if (this.state.currentResults[index] && groupsObject.hasOwnProperty(this.state.currentResults[index].group)) {
        item = <option key={objKey} value={objKey} selected>{objKey} </option>;
      }
      items.push(item);
    }

    return items;
  }
  render() {
    const { results, setResults, questions, testType, editResults, reset, groupResultsState } = this.props
    const renderField = ({ input, label, type, globalField, textValue, index, meta: { touched, error } }) => (
      <div>

        {this.state.currentResults[index] ? delete input.value : ""}


        {groupResultsState
          ? <div>
            <label>Группа:</label>
            <select id="group" >
              {this.createSelectItems(index, this.props.groupsObject)}
            </select>
          </div> : ""}

        <label>{label}</label>

        <div>
          <textarea {...input} type={type} defaultValue={textValue} />

        </div>
        {touched && error && <span>{error}</span>}
      </div>
    )

    const renderNumberField = ({ input, label, type, globalField, index, meta: { touched, error } }) => (
      <div>
        {
          testType === "first" ?
            <div>
              <label>{label}</label>
              {this.state.currentResults[index] ? delete input.value : ""}
              {label === "Промежуток от:" ? <input
                {...input}
                type={type}
                defaultValue={this.state.currentResults[index] ? this.state.currentResults[index].min : ""} />
                : <input {...input} type={type} defaultValue={this.state.currentResults[index] ? this.state.currentResults[index].max : ""} />}


            </div>
            : ""
        }
      </div>
    )

    const renderAnswers = ({ fields, globalField, variantsImgArray, editResults }) => (
      <div>
        {typeof globalField !== "undefined" ?
          <button type="button" id="insertDataResult" onClick={() => {
            console.log(editResults)

            if (fields.length <= editResults.length) {
              editResults.forEach((elem, index) => {

                let resultsArr = this.state.currentResults;
                resultsArr.push(elem);
                this.setState({ currentResults: resultsArr });

                fields.push(elem);

                let imgVarArr = this.state.variantImg;
                // if (fields.length > 0) {
                //   imgVarArr[fields.length + index + 1] = elem.result_img;
                // }
                // else {
                //   if (index === 0) {
                //     imgVarArr[fields.length] = elem.result_img;
                //   }
                //   else {
                //     imgVarArr[fields.length + index] = elem.result_img;
                //   }
                // }
                imgVarArr[index] = elem.result_img
                this.setState({ variantImg: imgVarArr });
                console.log(this.state.variantImg);
                editResults = [];
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
                onClick={() => { fields.remove(index); this.deleteFromArr(index); }}>Удалить</button>
              {variantsImgArray[index] ? <img src={variantsImgArray[index]} alt='' />
                : ""}
              <input type="file"
                name={"result_img" + index}
                onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target.files[0]); }}></input>
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
                  label={testType === 'first' ? "Текст результата" : "Краткий вариант"}
                  component={renderField}
                  globalField={globalField}
                  index={index}
                  textValue={this.state.currentResults[index] ? this.state.currentResults[index].result : ""}
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
                      textValue={this.state.currentResults[index] ? this.state.currentResults[index].description : ""}
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
        <Modal trigger={<Button onClick={() => { this.handleOpen(); this.insertCurrentData(editResults); }}
          className='resultsTrigger' id="22">Результаты</Button>}
          open={this.state.modalOpenResult}
          centered={false}>
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
                      globalField={editResults}
                      editResults={editResults}
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
            <Button type="submit"
              onClick={() => { this.createResults(results, setResults, questions, this.state.variantImg, testType); this.handleClose(); reset(); }}
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
  form: 'ResultForm',     // a unique identifier for this form
})(testResults)