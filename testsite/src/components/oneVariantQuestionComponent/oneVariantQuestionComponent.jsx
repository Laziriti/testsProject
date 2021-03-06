import React, { Component } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Button, Image, Modal } from 'semantic-ui-react'
// import validate from '../../validate';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import './style.scss';
class oneVarQuest extends Component {
  state = {
    modalOpen: false,
    actualImg: null,
    variantImg: [],
    currentIndexVariantImg: null,
    imgArr: [],
    checkArr: [],
    notFullPriceArr: [],
    notFullPriceState: false || (this.props.editQuest && this.props.editQuest.not_full_price_question ? this.props.editQuest.not_full_price_question : false)
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  setIndex = (index) => { this.setState({ currentIndexVariantImg: index }) }


  FileSelectedHendler = event => {

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


  FileSelectedHendlerVariants = event => {

    let imgVarArr = this.state.variantImg;
    let files = event.files[0];
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

  createQuestion(questions, setQuests, actualImg, variantImg, testType, editIndex) {

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
    object["price_question"] = 1;
    object["type_question"] = "one_answer";

    formData.forEach(function (value, key) {
      console.log(key)
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
      if (key === 'notFullPriceQuestion') {
        object["not_full_price_question"] = true;
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

    if (!object.hasOwnProperty("not_full_price_question")) {
      object["not_full_price_question"] = false;
    }

    if (testType === 'first') {
      console.log(testType)
      object = this.props.firstTypeHandler(object, document.forms.oneVariantForm, variantImg, this.props.variantsCount, this.state.notFullPriceState)
    }
    else if (testType === 'second') {
      object = this.props.secondTypeHandler(object, document.forms.oneVariantForm, variantImg, this.state.notFullPriceState);
    }

    object["number_answers"] = this.props.variantsCount;

    if (typeof editIndex === "number") {
      questionsArray[editIndex] = object;
    }
    else {
      questionsArray.push(object);
    }

    setQuests(questionsArray);
    this.props.setVariantsCount(0);
    console.log(object)
  }

  createSelectItems(results, editVariants, index, editCount) {
    let items = [];

    for (let i = 0; i < results.length; i++) {
      let item = <option className="variants-block__option" key={i} value={i} >{results[i].result} </option>;

      if (this.state.checkArr[index] === i) {
        item = <option className="variants-block__option" key={i} value={i} selected>{results[i].result} </option>;
      }
      items.push(item);
    }

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
    let arr = this.state.checkArr;
    arr[index] = Number(value);
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

  saveDataPriceArr(index, value) {
    let arr = this.state.notFullPriceArr;
    this.state.notFullPriceArr[index] = value;
    // arr[index] = value;
    // this.setState({ notFullPriceArr: arr })
  }

  addToArrPriceArr(value) {
    let arr = this.state.notFullPriceArr;
    this.state.notFullPriceArr.push(value);
    // arr.push(value);
    // this.setState({ notFullPriceArr: arr })
  }

  delFromArrPriceArr(index) {
    let arr = this.state.notFullPriceArr;
    this.state.notFullPriceArr.splice(index, 1);
    // arr.splice(index, 1);
    // this.setState({ notFullPriceArr: arr })
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
      editQuest,
      title } = this.props;

    const renderField = ({ input, answer, label, type, editVariants, index, meta: { touched, error } }) => (
      <div>

        <label>{label}</label>
        {console.log(this.state.notFullPriceArr)}
        <div className="variants-block__variant-info">
          <input
            className="variants-block__price-var"
            type="number" id={index} name={answer + "priceVar"}
            onChange={(e) => this.saveDataPriceArr(index, e.target.value, e.target.id)}
            disabled={!this.state.notFullPriceState}
            defaultValue={this.state.notFullPriceArr[index] ? Number(this.state.notFullPriceArr[index]) : 0}
          >

          </input>
          <textarea
            className="variants-block__text"
            {...input}
            type={type}
            placeholder="Введите вариант ответа" ></textarea>
          {
            testType === 'first' ?
              <div className="variants-block__state-div">
                <input
                  id={"state-variant" + index}
                  className="variants-block__state-input"
                  type="radio"
                  name="answerState"
                  onChange={() => this.saveData(index)}
                  disabled={this.state.notFullPriceState}
                  defaultChecked={this.state.checkArr[index] ? this.state.checkArr[index] : ""} />
                <label className="variants-block__state-label" for={"state-variant" + index}> </label>
              </div>
              : ""
          }
          {
            testType === 'second' ?
              <div className="variants-block__state-div">
                <select className="variants-block__text variants-block__text_select" name="groupState" onChange={(e) => this.saveDataSelect(index, e.target.value)}>
                  {this.createSelectItems(results, editVariants, index, editQuest ? editQuest.number_answers : "")}
                </select>
              </div>
              : ""
          }
          {touched && error && <span>{error}</span>}
          {testType === 'first' ? <label className="variants-block__label-info">Отметьте вариант ответа,
           если он правильный
          </label>
            :
            ""
          }
        </div>
      </div>
    )

    const renderAnswers = ({ fields, editVariants, variantsImgArray }) => (
      <div className="variants-block__add-variant">
        {typeof editVariants !== "undefined" ?
          <button type="button" id="insertDataOneVariant" onClick={() => {
            setVariantsCount(editVariants.length);
            this.setState({ actualImg: editQuest.questImg })

            if (fields.length <= editVariants.length) {
              editVariants.forEach((elem, index) => {
                if (elem.price_var || elem.price_var === 0) {
                  this.addToArrPriceArr(elem.price_var)
                }
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
              });
            };
          }}> Загрузить свои ответы </button> :
          ""
        }
        <div className="variants-block__main-info">
          <label className="variants-block__label variants-block__label_margin">Варианты ответа: {variantsCount}</label>
          <button
            className="quest-block__btn quest-block__btn_add"
            type="button"
            onClick={() => {
              fields.push({});
              setVariantsCount(variantsCount + 1);
              this.addToArr(false);
              this.addToArrPriceArr(0);
            }}>Добавить вариант ответа</button>
        </div>

        <ul className="variants-block__ul">
          {fields.map((answer, index) =>
            <li className="variants-block__item" key={index}>
                <h4 className="variants-block__title">Вариант {index + 1}</h4>
                <img className="variants-block__var-img" src={variantsImgArray[index] ? variantsImgArray[index] : ""} alt='' />
              <button
                className="variants-block__delete-btn"
                type="button"
                title="Удалить вариант"
                onClick={() => {
                  fields.remove(index);
                  setVariantsCount(variantsCount - 1);
                  this.FileVariantsRemove(index);
                  this.delFromArr(index);
                  this.delFromArrPriceArr(index);
                }}
              >Удалить</button>

              <input
                className="quest-block__img-inpt"
                type="file"
                id={index}
                name={"variant_img" + index}
                onChange={(e) => { this.setIndex(index); this.FileSelectedHendlerVariants(e.target); }} />

              <label className="quest-block__file-label" for={index}>Выберите файл</label>
              
              <div className='variants-block__answer-field'>
                <Field
                  name={answer + "variant"}
                  editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                  editCount={editQuest ? editQuest.number_answers : ""}
                  type="text"
                  index={index}
                  component={renderField}
                  answer={answer}
                />
              </div>
            </li>
          )}
        </ul>

      </div>
    )

    return (
      <div className="quest-block">
        <Container className="quest-block__container" id="zxc">
          <Modal
            trigger={<Button onClick={() => {
              this.setState({ checkArr: [] });
              this.handleOpen();
              this.setState({ notFullPriceArr: [] });
              this.insertCurrentData(editQuest && editQuest.variants ? editQuest.variants : undefined);
            }}
              className={title === "Редактировать" ? 'quest-block__trigger quest-block__trigger_edit' : 'quest-block__trigger'} >{title}</Button>}
            open={this.state.modalOpen}
            centered={false}>
            <Modal.Header>{"Одновариантный вопрос"}</Modal.Header>
            <Modal.Content image>
              <Image wrapped size='small' src={this.state.actualImg ? this.state.actualImg : 'https://react.semantic-ui.com/images/avatar/large/rachel.png'} />
              <Modal.Description>

                <form className="quest-block__form" onSubmit={handleSubmit} name='oneVariantForm'>

                  <div className="quest-block__div">
                    <label className="quest-block__label quest-block__label_position">Введите вопрос</label>
                    <textarea
                      className="quest-block__quest-text"
                      name="question"
                      placeholder="Текст результата"
                      defaultValue={editQuest ? editQuest.question : ""}
                    >
                    </textarea>
                  </div>
                  <div className="quest-block__div">
                    <label className="quest-block__label">Количество баллов за ответ</label>
                    <input
                      className="quest-block__input"
                      name="priceQuestion"
                      id="priceQuestion"
                      defaultValue={editQuest && editQuest.price_question ? editQuest.price_question : 1}
                      disabled={this.state.notFullPriceState}></input>
                  </div>
                  <div className="quest-block__div">

                    <input
                      id="nf-answer"
                      className="quest-block__check"
                      name="notFullPriceQuestion"
                      defaultChecked={this.state.notFullPriceState}
                      type="checkBox"
                      onClick={() => { this.setState({ notFullPriceState: !this.state.notFullPriceState }) }}></input>
                    <label className="quest-block__label" for="nf-answer">Неполный ответ</label>
                  </div>
                  <div className="quest-block__div">
                    <label className="quest-block__label">Изображение</label>
                    <input
                      className="quest-block__img-inpt"
                      id="file"
                      name="questImg"
                      type="file"
                      onChange={this.FileSelectedHendler}
                    />
                    <label className="quest-block__file-label" for="file">Выберите файл</label>
                  </div>

                  {groupsState ? <div className="quest-block__div">
                    <label className="quest-block__label">Номер/название группы</label>
                    <input
                      className="quest-block__input"
                      name="groupName"
                      type="string"
                      defaultValue={editQuest && editQuest.group ? editQuest.group : 0}
                      onLoad={(event) => { this.props.handleGroups(event.target.value, groupsObject, groupsTimerState) }}
                      onChange={(event) => { this.props.handleGroups(event.target.value, groupsObject, groupsTimerState) }}></input>
                  </div>
                    : ""}
                  {groupsTimerState ? <div className="quest-block__div">
                    <label className="quest-block__label">Таймер группы</label>
                    <input
                      className="quest-block__input"
                      name="groupTimer"
                      id="groupTimer"
                      type="string"
                      placeholder="10:22 = 10 минут 22 секунды"
                      defaultValue={editQuest && editQuest.group ? this.props.groupsObject[editQuest.group] : "0:0"}></input>
                  </div> : ""}

                  <div className="quest-block__div">
                    <label className="quest-block__label">Таймер для вопроса</label>
                    <input
                      className="quest-block__input"
                      name="timerQuestion"
                      type="string"
                      placeholder="10:22 = 10 минут 22 секунды"
                      defaultValue={editQuest && editQuest.timer_question ? editQuest.timer_question : "0:0"}></input>
                  </div>



                  <div className="variants-block">
                    <div className='variants-block__container'>
                      <FieldArray name="variants"
                        component={renderAnswers}
                        editVariants={editQuest && editQuest.variants ? editQuest.variants : ""}
                        variantsImgArray={this.state.variantImg}
                      />
                    </div>
                  </div>
                </form>

              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => {
                this.handleClose(); reset();
                this.setState({ notFullPriceArr: [] });
                this.setState({ actualImg: null })
                setVariantsCount(0);
              }} color="primary">
                Отмена
            </Button>

              {
                variantsCount > 1 ?
                  <Button type="sumbit" onClick={() => {
                    this.createQuestion(questions, setQuests, this.state.actualImg, this.state.variantImg, testType, editIndex);
                    this.props.setGroups(new FormData(document.forms.oneVariantForm), this.props.groupsObject, this.props.setGroupObject);
                    this.handleClose();
                    this.setState({ notFullPriceArr: [] });
                    this.setState({ actualImg: null })
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
      </div>
    )
  }
}
export default reduxForm({
  form: 'OneVariantForm'

})(oneVarQuest)