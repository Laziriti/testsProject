import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Grid, GridColumn } from 'semantic-ui-react';
import '../../indexStyles.css';
import './style.css';
import axios from 'axios';
import CreateTestContent from "../createTestContentComponent/createTestContentContainer"
import AddToList from '../addToListComponent/addToListContainer';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Card } from 'semantic-ui-react';

class createTestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      isOpen: false,
      actualImg: null,
      groupsState: false,
      groupsTimerState: false,
      groupResultsState: false
    };
  }
  componentWillMount() {
    this.props.changeTestType(this.props.match.params.testType);
    if (this.props.editTest) {
      this.props.changeTestType(this.props.editTest.test_type);
      this.props.setQuests(this.props.editTestContent);
      this.props.setResults(this.props.editTestResults);
      this.props.setGroupObject(JSON.parse(this.props.editTest.test_groups_object))
      if(this.props.editTest.test_type){
        this.props.clearEditTest();
      this.props.setQuests([]);
      this.props.setResults([]);
      }
    }
  
  }


  componentWillUnmount() {
    if (this.props.editTest) {
      this.props.clearEditTest();
      this.props.setQuests([]);
      this.props.setResults([]);
    }
  }
  componentDidMount() {
    // this.setState({ groupsTimerState: false })
    // this.setState({ groupResultsState: false })
    document.getElementById('switchGroupsTimers').disabled = true;
    document.getElementById('switchGroupResults').disabled = true;
    console.log(this.state.groupsState)
    if (this.props.editTest) {
      // this.switchGroupsHandler();
      if (this.props.editTest.test_group_timers_state || this.props.editTest.test_group_results_state || this.props.editTest.test_groups_object !== "null") {
        console.log(!JSON.parse(this.props.editTest.test_groups_object).hasOwnProperty("null"))
        console.log(this.props.editTest.test_group_results_state)
        this.switchGroupsHandler();
        this.setState({ groupsTimerState: this.props.editTest.test_group_timers_state })
        this.setState({ groupResultsState: this.props.editTest.test_group_results_state })
      }
    }



  }
  OpenHandler = () => this.setState({ isOpen: true })

  FileSelectedHendler = event => {

    let files = event.target.files[0];

    const formData = new FormData();
    formData.append("img_field", files);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        this.setState({ actualImg: response.data.img_field })
      }).catch(e => {
        console.log(e)
      })

  }

  handleSubmit = () => {

    var object = {};

    var formData = new FormData(document.forms.createTestForm);

    formData.append("test_content", JSON.stringify(this.props.questions));
    formData.append("test_check_sum", JSON.stringify(this.props.results));
    formData.append("test_type", this.props.testType);
    formData.append("test_group_results_state", this.state.groupResultsState);
    formData.append("test_group_timers_state", this.state.groupsTimerState);
    formData.set("test_img", this.state.actualImg);
    console.log(this.props.groupsObject)
    if (this.props.groupsObject && this.props.groupsObject['null'] !== null && this.state.groupsState) {
      formData.append("test_groups_object", JSON.stringify(this.props.groupsObject));
    }
    else {
      formData.append("test_groups_object", null);
    }

    formData.forEach(function (value, key) {
      object[key] = value;
    })
    formData.append("test_question_count", this.props.questions.length);
    formData.append("test_old_versions", "");
    formData.forEach(function (value, key) {
      console.log(key);
      console.log(value);
      if (key == "test_question_count") {
        console.log(typeof value);
      }
    });
    if (this.props.editTest) {
      let saveOldTest = window.confirm("Сохранять предыдущую версию теста?");
      if (saveOldTest) {
        let OldTestName = null;
        OldTestName = prompt('Введите имя предыдущей версии теста или отмените сохранение', "");
        if (OldTestName) {
          axios.get('https://psychotestmodule.herokuapp.com/save_old_version/?id=' + this.props.editTest.id + "&name=" + OldTestName)
            .then((response) => {
              console.log("пред версия сохранена")
              axios.put('https://psychotestmodule.herokuapp.com/tests/' + this.props.editTest.id + "/", formData)
                .then((response) => {
                  console.log("изменено")
                }).catch(e => {
                  console.log(e)
                })
            }).catch(e => {
              console.log(e)
            })
        }
      }
      else {
        axios.put('https://psychotestmodule.herokuapp.com/tests/' + this.props.editTest.id + "/", formData)
          .then((response) => {
            console.log("изменено")
          }).catch(e => {
            console.log(e)
          })
      }

    }
    else {
      axios.post('https://psychotestmodule.herokuapp.com/tests/', formData)
        .then((response) => {
        }).catch(e => {
          console.log(e)
        })
    }

  }
  firstTypeHandler(object, currentForm, variantImg, variantsCount, notFullPriceState) {
    let rightCount = 0;
    var objectVariant = {};
    var allVariants = [];
    var roll = 0;
    var index = 0;
    var variantIndex = 0;
    var formData = new FormData(currentForm);

    formData.forEach(function (value, key) {
      console.log(key)
      if (key !== 'questImg' && key !== 'question') {

        if (key === "variant_img" + index) {
          if (!objectVariant.hasOwnProperty("answer_state") && objectVariant.hasOwnProperty("variant_Id") && index !== variantsCount) {

            if (notFullPriceState) {
              objectVariant["answer_state"] = 1;
            }
            else {
              objectVariant["answer_state"] = 0;
            }
            allVariants[roll] = objectVariant;
            objectVariant = {};
            roll++;
          }
          objectVariant["variant_Id"] = variantIndex;
          variantIndex++;
          objectVariant["variant_img"] = variantImg[index];
        }
        if (key === "variants[" + index + "]priceVar") {
          objectVariant["price_var"] = Number(value);
        }
        if (key === "variants[" + index + "]variant") {
          objectVariant["variant"] = value;
          index++;
        }
        if (key === "answerState") {
          console.log("Выпало")
          objectVariant["answer_state"] = 1;
          rightCount++;
          allVariants[roll] = objectVariant;
          objectVariant = {};
          roll++;
        }
        if (!objectVariant.hasOwnProperty("answer_state") && index === variantsCount && key === "variants[" + Number(index - 1) + "]variant") {
          if (notFullPriceState) {
            objectVariant["answer_state"] = 1;
          }
          else {
            objectVariant["answer_state"] = 0;
          }

          allVariants[roll] = objectVariant;
        }
      }

    }
    );
    object["variants"] = allVariants;
    console.log(allVariants)
    object["number_answers"] = rightCount;
    return object;
  }
  secondTypeHandler(object, currentForm, variantImg, variantsCountProp) {
    var objectVariant = {};
    var allVariants = [];
    var roll = 0;
    let variantsCount = variantsCountProp;
    var formData = new FormData(currentForm);
    var variantIndex = 0;
    var index = 0;
    formData.forEach(function (value, key) {

      if (key === "variant_img" + index) {
        objectVariant["variant_Id"] = variantIndex;
        variantIndex++;
        objectVariant["variant_img"] = variantImg[index];

      }
      if (key === "variants[" + index + "]priceVar") {
        objectVariant["price_var"] = value;
      }
      if (key === "variants[" + index + "]variant") {
        objectVariant["variant"] = value;
        index++
        variantsCount++;
      }


      if (key === 'groupState') {
        objectVariant["answer_state"] = Number(value);
        allVariants[roll] = objectVariant;
        objectVariant = {};
        roll++;
      }
    }
    );
    object["variants"] = allVariants;
    object["number_answers"] = variantsCount;
    return object;
  }
  setGroups(form, groupsObject, setGroupObject) {
    var formData = form;
    var propName = null;
    var propValue = null;
    console.log(form)
    let groupObj = groupsObject;
    formData.forEach((value, key) => {

      if (key === "groupName") {
        console.log(value)
        propName = value;
      }
      if (key === "groupTimer") {
        propValue = value;
        console.log(value)
      }
    })
    if (propName) {
      if (groupObj === null) {
        groupObj = {};
      }
      groupObj[propName] = propValue;
    }
    console.log(groupObj)
    setGroupObject(groupObj);
  }
  handleGroups(value, groupsObject, groupsTimerState) {
    if (groupsObject.hasOwnProperty(value) && groupsTimerState) {
      document.querySelector('#groupTimer').value = groupsObject[value];
    }
  }
  switchGroupsHandler() {
    this.setState({ groupsState: !this.state.groupsState })

    if (this.state.groupsState) {
      this.setState({ groupsTimerState: false })
      this.setState({ groupResultsState: false })
      document.getElementById('switchGroupsTimers').checked = false;
      document.getElementById('switchGroupsTimers').disabled = true;
      document.getElementById('switchGroupResults').checked = false;
      document.getElementById('switchGroupResults').disabled = true;
    }
    else {
      document.getElementById('switchGroupsTimers').disabled = false;
      document.getElementById('switchGroupResults').disabled = false;
    }

  }
  sortQuestions() {
    let questArr = this.props.questions;
    let numGroupsArr = [];
    let stringGroupsArr = [];
    let resultArr = [];
    if (questArr.length > 0) {
      questArr.forEach(
        elem => {
          if (Number(elem.group)) {
            console.log(elem)
            numGroupsArr.push(elem);
          }
          else {
            console.log(elem)
            stringGroupsArr.push(elem);
          }
        }
      )
      numGroupsArr.sort(this.sortNumber);
      stringGroupsArr.sort(this.sortStrings)
      console.log(numGroupsArr)
      resultArr = [...numGroupsArr, ...stringGroupsArr]
      this.props.setQuests(resultArr);
      this.OpenHandler();
    }

  }

  sortNumber(a, b) {
    return a.group - b.group;
  }
  sortStrings(a, b) {
    if (a.group < b.group) return -1;  // any negative number works
    if (a.group > b.group) return 1;   // any positive number works
    return 0; // equal values MUST yield zero
  }

  render() {

    const { pristine, reset, submitting, questions, editTest, editTestResults, editTestContent } = this.props
    return (
      <div className="create-block">
        <div className='create-block__container'>
          <form name="createTestForm" className="create-block__main-form" >
            <div className='create-block__input-field'>
              <label className="create-block__label">Название теста</label>
              <div className='create-block__test-input'>
                <textarea
                  className="create-block__input-textarea"
                  name="test_name"
                  type="text"
                  placeholder="Название теста"
                  defaultValue={editTest ? editTest.test_name : ""}
                />
              </div>
            </div>
            <div className='create-block__input-field'>
              <label className="create-block__label">Имя автора</label>
              <div className='create-block__test-input'>
                <textarea
                  className="create-block__input-textarea"
                  name="test_author"
                  type="text"
                  placeholder="Автор теста"
                  defaultValue={editTest ? editTest.test_author : ""}
                />
              </div>
            </div>
            <div className='create-block__input-field'>
              <label className="create-block__label">Логотип теста</label>
              <div className='create-block__test-input'>
                <input type="file" name="test_img" onChange={this.FileSelectedHendler}></input><br></br>
              </div>
            </div>
            <div className='create-block__input-field'>
              <label className="create-block__label">Комментарий к тесту</label>
              <div className='create-block__test-input'>
                <textarea
                  className="create-block__input-textarea create-block__input-textarea_large"
                  name="test_comment"
                  type="text"
                  placeholder="Комментарий"
                  defaultValue={editTest ? editTest.test_comment : ""}
                />
              </div>
            </div>
            <div className="create-block__switches">

              <div className='create-block__input-field create-block__input-field_switch'>
                <input
                  id="sw-group"
                  className="create-block__check"
                  onClick={() => this.switchGroupsHandler()}
                  name="switch_groups"
                  type="checkBox"
                  defaultChecked={editTest && (this.props.editTest.test_groups_object !== "null" || this.props.editTest.test_group_results_state) ? true : false}
                />
                <label for="sw-group" className="create-block__label">Включить группы</label>
              </div>

              <div className='create-block__input-field create-block__input-field_switch'>
                <input
                  className="create-block__check"
                  onClick={() => this.setState({ groupsTimerState: !this.state.groupsTimerState })}
                  name="switch_groups_timers"
                  id="switchGroupsTimers"
                  type="checkBox"
                  defaultChecked={editTest ? editTest.test_group_timers_state : false}
                />
                <label for="switchGroupsTimers" className="create-block__label">Включить групповые таймеры</label>
              </div>

              <div
                className={this.props.testType === "first"
                  ? "create-block__input-field create-block__input-field_switch"
                  : "create-block__input-field create-block__input-field_hidden create-block__input-field_switch"}>
                <input
                  className="create-block__check"
                  onClick={() => this.setState({ groupResultsState: !this.state.groupResultsState })}
                  name="switch_groups_chapter_state"
                  id="switchGroupResults"
                  type="checkBox"
                  defaultChecked={editTest ? editTest.test_group_results_state : false}
                />
                <label for="switchGroupResults" className="create-block__label">Включить ответы по группам</label>
              </div>
            </div>
            <div className="create-block__button-div">
              <button className="create-block__form-button" type="button" onClick={this.handleSubmit}>
                Submit
        </button>
              <button className="create-block__form-button" type="button" onClick={reset}>
                Clear Values
        </button>
            </div>
          </form>

          <CreateTestContent
            groupsState={this.state.groupsState}
            groupsTimerState={this.state.groupsTimerState}
            groupResultsState={this.state.groupResultsState}
            setGroups={this.setGroups}
            handleGroups={this.handleGroups}
            updateList={this.OpenHandler}
            firstTypeHandler={this.firstTypeHandler}
            secondTypeHandler={this.secondTypeHandler}
          ></CreateTestContent>
        </div>

        <div className="create-block__questions-cards">
          {this.state.groupsState ? <button className="create-block__sort-btn" onClick={() => this.sortQuestions()}>Сортировать по группам</button> : ""}
          <Card.Group itemsPerRow={1}>
            {

              !questions ? "" :
                questions.map((quest, index) => <AddToList
                  key={index}
                  groupsState={this.state.groupsState}
                  groupsTimerState={this.state.groupsTimerState}
                  updateList={this.OpenHandler}
                  setGroups={this.setGroups}
                  handleGroups={this.handleGroups}
                  index={index}
                  firstTypeHandler={this.firstTypeHandler}
                  secondTypeHandler={this.secondTypeHandler}
                  className="testi"
                  {...quest}
                  editQuest={quest} />)
            }
          </Card.Group>
        </div>


      </div>

    )
  }
}

export default reduxForm({
  form: 'createTestForm'
})(createTestForm)