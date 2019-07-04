import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class oneVarQuest extends Component {
  state = {
    modalOpen: false,
    actualImg: null,
    variantImg: [1],
    currentIndexVariantImg: null,
    editState: false,
    imgArr: [],
    checkArr: [],
    questionsCount: 0
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

    object["type_question"] = "one_answer";

    object["groups_object"] = this.props.groupsObject;
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
    if (typeof currentIndex === "number") {
      arr[currentIndex] = object;
    }
    else {
      arr.push(object);
    }

    setQuests(arr);
    this.props.setVariantsCount(0);

    var json = JSON.stringify(questions);

    console.log(json);
  }

  createSelectItems(results, currentVariants, index, currentCount) {
    let items = [];

    for (let i = 0; i < results.length; i++) {
      let item = <option key={i} value={i} >{results[i].result} </option>;
      console.log(this.state.checkArr[index])

      if (this.state.checkArr[index] == i) {
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

  setGroups() {
    var formData = new FormData(document.forms.oneVariantForm);
    var propName = null;
    var propValue = null;
    let groupObj = this.props.groupsObject;
    formData.forEach((value, key) => {
      if (key === "groupNumber") {
        propName = value;
      }
      if (key === "groupTimer") {
        propValue = value;
      }
    })
    groupObj[propName] = propValue;
    this.props.setGroupObject(groupObj);
    console.log(this.props.groupsObject)
  }
  handleGroups(value) {
    if (this.props.groupsObject.hasOwnProperty(value)) {
      document.querySelector('#groupTimer').value = this.props.groupsObject[value];
    }
  }

  render() {
    const {
      setGroupObject,
      groupsObject,
      handleSubmit,
      questions,
      setQuests,
      reset,
      testType,
      results,
      variantsCount,
      setVariantsCount,
      currentVariants,
      currentQuestion,
      currentIndex,
      currentCount,
      currentPrice,
      currentQuestImg } = this.props;

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

    const renderAnswers = ({ fields, currentVariantsArr, currentIndex, currentVariants, currentCount, variantsImgArray }) => (
      <div>
        {typeof currentVariants !== "undefined" ?
          <button type="button" id="insertDataOneVariant" onClick={() => {
            setVariantsCount(currentVariantsArr.length);
            this.handleEdit();
            this.setState({ actualImg: currentQuestImg })
            if (fields.length <= currentVariantsArr.length) {
              currentVariantsArr.forEach((elem, index) => {
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
                this.setState({ variantImg: imgVarArr });
                console.log(this.state.variantImg);

              });
            };
          }}> Загрузить свои ответы </button> :
          ""
        }

        <button type="button" onClick={() => { fields.push({}); setVariantsCount(variantsCount + 1); this.setState({ questionsCount: this.state.questionsCount + 1 }); this.addToArr(false) }}>Добавить вариант ответа</button>
        <ul>
          {fields.map((answer, index) =>
            <div>
              <h4>Answer #{index + 1}</h4>
              <button
                type="button"
                title="Удалить вариант"
                onClick={() => { this.handleEditClose(); fields.remove(index); setVariantsCount(variantsCount - 1); this.FileVariantsRemove(index); this.delFromArr(index) }}
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
                <form onSubmit={handleSubmit} name='oneVariantForm'>
                  <div className='inputQuest'>
                    <label>Введите вопрос:</label>
                    <div className='quest'>
                      <textarea
                        name="question"
                        placeholder="Текст результата"
                        defaultValue={currentQuestion}
                      >

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



                      <div>
                        <label>Номер/название группы (опционально)</label>
                        <input name="groupNumber" type="string" defaultValue={0} onChange={(event) => { this.handleGroups(event.target.value) }}></input>
                      </div>
                      <div>
                        <label>Таймер группы</label>
                        <input name="groupTimer" id="groupTimer" type="string" placeholder="10:22 = 10 минут 22 секунды" defaultValue="0:0"></input>
                      </div>
                      <div>
                        <label>Таймер для вопроса</label>
                        <input name="timerQuestion" type="string" placeholder="10:22 = 10 минут 22 секунды" defaultValue="0:0"></input>
                      </div>

                    </div>
                  </div>
                  <label>Варианты ответа</label>
                  <div className='answers'>
                    <FieldArray name="variants"
                      currentVariantsArr={currentVariants}
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

            {
              this.state.questionsCount > 1 ?

                <Button type="sumbit" onClick={() => { this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, currentIndex, currentVariants); this.setGroups(); this.handleClose(); reset(); this.props.updateList(); }} color="primary" autoFocus>
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