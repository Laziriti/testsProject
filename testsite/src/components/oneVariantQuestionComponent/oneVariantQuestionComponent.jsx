import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { func } from 'prop-types';
var arr = [];
var count = 0;
var globalField = [{}, {}];
class oneVarQuest extends Component {
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
  firstTypeHandler(object, variantImg) {
    var objectVariant = {};

    var allVariants = [];
    var roll = 0;
    var i = 0;

    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;

    formData.forEach(function (value, key) {
      if (key !== 'questImg' && key !== 'question') {

        if (key === "variant_img" + i) {

          if (!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && i !== count) {
            console.log(i)
            objectVariant["answer_state"] = 0;
            allVariants[roll] = objectVariant;
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

        if (!objectVariant.hasOwnProperty("answer_state") && i === count && key === "variants[" + Number(i - 1) + "]variant") {
          console.log(objectVariant.hasOwnProperty("answer_state"))
          console.log(objectVariant)
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

  serv(questions, setQuests, actualImg, variantImg, testType, currentIndex, currentVariants) {

    arr = questions;
    var object = {};
    var formData = new FormData(document.forms.oneVariantForm);
    if (typeof currentIndex === "number") {
      object["question_ID"] = currentIndex + 1;
    }
    else {
      object["question_ID"] = questions.length;
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
    });

    // formData.forEach(function (value, key) {
    //   console.log(key);
    // })

    if (testType === 'first') {
      object = this.firstTypeHandler(object, variantImg)
    }
    else if (testType === 'second') {
      object = this.secondTypeHandler(object, variantImg);
    }
    else if (testType === 'third') {
      object = this.thirdTypeHandler(object, variantImg)
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
  }

  createSelectItems(results, currentVariants, index, currentCount) {
    let items = [];

    for (let i = 0; i < results.length; i++) {
      let item = <option key={i} value={i} >{results[i].result} </option>;
      console.log(this.state.checkArr[index])

      if (this.state.checkArr[index] == i) {
        console.log(12312)
        item = <option key={i} value={i} selected>{results[i].result} </option>;
      }
      items.push(item);
    }

    console.log(this.state.checkArr)
    return items;
  }
  insertCurrentData(currentVariants) {
    if (typeof currentVariants !== "undefined") {
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


  // neuronTest(){
  //   axios.get('https://gifts4every2.herokuapp.com/neuron/')
  //   .then((response) => {
  //     console.log(response);
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // }

  neuronTestJson() {

    let formData11 = new FormData();
    let asd = {
      "gift_name": "test",
      "gift_image": null,
      "gift_sex": "f",
      "gift_reason": "birthday",
      "gift_forwho": "wife",
      "gift_hobbies": "sport",
      "gift_age": 20,
      "gift_cost_max": 100,
      "gift_cost_min": 0
    }
    Object.keys(asd).forEach(elem => {
      console.log(elem)
      console.log(asd[elem])
      formData11.append(elem, asd[elem])
    })
    formData11.forEach((value, key) => {
      console.log(key);
      console.log(value)
    })
    let zxc = JSON.stringify(asd);
    console.log(zxc)
    axios.post('https://gifts4every2.herokuapp.com/filter2/', formData11)
      .then((response) => {
        console.log(response);
      }).catch(e => {
        console.log(e)
      })
  }
  render() {
    const { handleSubmit, questions, setQuests, reset, testType, results, currentVariants, currentQuestion, currentIndex, currentCount, currentPrice } = this.props;

    const renderField = ({ input, label, type, currentVariants, index, meta: { touched, error } }) => (
      <div>

        <label>{label}</label>
        <div>
          <textarea {...input} type={type} ></textarea>
          {
            testType === 'first' ?
              <input type="radio" name="answerState" onChange={() => this.saveData(index)} defaultChecked={this.state.checkArr[index] ? this.state.checkArr[index] : ""} />
              : ""
          }
          {
            testType === 'second' ?
              <select name="answerState" className="groupClass" onChange={(e) => this.saveDataSelect(index, e)}>
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
          <button type="button" id="insertDataOneVariant" onClick={() => {
            this.handleEdit();
            if (fields.length <= globalField.length) {
              globalField.forEach((elem, index) => {
                fields.push(elem);
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

        <button type="button" onClick={() => { fields.push({}); count++; console.log(this.state.imgArr); this.addToArr(false) }}>Добавить вариант ответа</button>
        <ul>
          {fields.map((answer, index) =>
            <div>
              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"
                onClick={() => { this.handleEditClose(); fields.remove(index); count--; this.FileVariantsRemove(index); this.delFromArr(index) }}
              >Удалить</button>
              <img src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <input type="file" id={index} name={"variant_img" + index} onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target); }} />
              <div className='answerFeild'>
                <Field
                  className="answerVar"
                  name={answer + "variant"}
                  currentVariants={currentVariants}
                  currentCount={currentCount}
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
        <Modal trigger={<Button onClick={() => { this.setState({ checkArr: [] }); this.handleOpen(); this.insertCurrentData(currentVariants); }} className='oneVariantTrigger'>Одновариантный вопрос</Button>} open={this.state.modalOpen} centered={false}>
          <Modal.Header>{"Одновариантный вопрос"}</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='small' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
              <div>
                <button onClick={() => this.neuronTestJson()}>asdsadsad</button>
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
                  </div>
                  <label>Варианты ответа</label>
                  <div className='answers'>
                    <FieldArray name="variants"
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
            <Button onClick={() => { this.handleClose(); reset(); }} color="primary">
              Отмена
            </Button>
            {typeof currentIndex === "number" ?
              <Button type="sumbit" onClick={() => { this.serv(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex, currentVariants); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
                Готово
            </Button>
              :
              <Button type="sumbit" onClick={() => { console.log(this.state.variantImg); this.serv(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex, currentVariants); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
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
  form: 'OneVariantForm',     // a unique identifier for this form

})(oneVarQuest)