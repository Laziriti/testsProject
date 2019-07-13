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
  }
  componentDidMount() {
    document.getElementById('switchGroupsTimers').disabled = true;
    document.getElementById('switchGroupResults').disabled = true;
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
    formData.append("test_group_results_state", this.state.groupResultsState)
    formData.set("test_img", this.state.actualImg);
    if (this.state.groupsTimerState) {
      formData.append("test_groups_object", JSON.stringify(this.props.groupsObject));
    }
    else {
      formData.append("test_groups_object", null);
    }

    formData.forEach(function (value, key) {
      object[key] = value;
    })
    formData.append("test_question_count", this.props.questions.length)
    axios.post('https://psychotestmodule.herokuapp.com/tests/', formData)
      .then((response) => {
      }).catch(e => {
        console.log(e)
      })
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
          }
          objectVariant["variant_Id"] = variantIndex;
          variantIndex++;
          objectVariant["variant_img"] = variantImg[index];
          if (variantImg[index] == null) {
            objectVariant["variant_img"] = "null"
          }
        }
        if (key === "variants[" + index + "]priceVar") {
          objectVariant["price_var"] = Number(value);
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
    return object;
  }
  secondTypeHandler(object, variantImg, variantsCountProp) {
    var objectVariant = {};
    var allVariants = [];
    var roll = 0;
    let variantsCount = variantsCountProp;
    var formData = new FormData(document.forms.oneVariantForm);
    var variantIndex = 0;
    var index = 0;
    formData.forEach(function (value, key) {

      if (key === "variant_img" + index) {
        objectVariant["variant_Id"] = variantIndex;
        variantIndex++;
        objectVariant["variant_img"] = variantImg[index];
        if (variantImg[index] == null) {
          objectVariant["variant_img"] = "null"
        }
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
    let groupObj = groupsObject;
    formData.forEach((value, key) => {
      if (key === "groupName") {
        propName = value;
      }
      if (key === "groupTimer") {
        propValue = value;
      }
    })
    groupObj[propName] = propValue;
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
  render() {

    const { pristine, reset, submitting, questions } = this.props
    return (
      <div className='wrapper'>
        <div className='createTestBody'>
          <form name="createTestForm" className="createTestForm" >
            <div className='inputField'>
              <label>Название теста</label>
              <div className='testInput'>
                <Field
                  name="test_name"
                  component="textarea"
                  type="text"
                  placeholder="Название теста"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Имя автора</label>
              <div className='testInput'>
                <Field
                  name="test_author"
                  component="textarea"
                  type="text"
                  placeholder="Автор теста"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Логотип теста</label>
              <div className='testInput'>
                <input type="file" name="test_img" onChange={this.FileSelectedHendler}></input><br></br>
              </div>
            </div>
            <div className='inputField'>
              <label>Комментарий к тесту</label>
              <div className='testInput'>
                <Field
                  name="test_comment"
                  component="textarea"
                  type="text"
                  placeholder="Комментарий"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Включить группы</label>
              <div className='testInput'>
                <Field
                  onClick={() => this.switchGroupsHandler()}
                  name="switch_groups"
                  component="input"
                  type="checkBox"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Включить групповые таймеры</label>
              <div className='testInput'>
                <Field
                  onClick={() => this.setState({ groupsTimerState: !this.state.groupsTimerState })}
                  name="switch_groups_timers"
                  id="switchGroupsTimers"
                  component="input"
                  type="checkBox"

                />
              </div>
            </div>
            <div className='inputField'>
              <label>Включить ответы по группам</label>
              <div className='testInput'>
                <Field
                  onClick={() => this.setState({ groupResultsState: !this.state.groupResultsState })}
                  name="switch_groups_timers"
                  id="switchGroupResults"
                  component="input"
                  type="checkBox"
                />
              </div>
            </div>
            <div className="createFormTestMainBtn">
              <button className="formButton" type="button" onClick={this.handleSubmit} disabled={pristine || submitting}>
                Submit
        </button>
              <button className="formButton" type="button" disabled={pristine || submitting} onClick={reset}>
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

        <div className="questionCard">
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