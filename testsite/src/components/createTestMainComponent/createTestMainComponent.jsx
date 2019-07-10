import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Grid, GridColumn } from 'semantic-ui-react';
import '../../indexStyles.css';
import './style.css';
import axios from 'axios';
import OneVariantQuestion from '../oneVariantQuestionComponent/oneVariantQuestionContainer';
import ManyVariantQuestion from '../manyVariantsQuestionComponent/manyVariantsQuestionContainer';
import SequenceQuestion from '../sequenceQuestionComponent/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../writeByYourselfQuestionCompoent/writeByYourselfQuestionContainer';
import TestResults from '../testResultsComponent/testResultsContainer';
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
      groupResultsState:false
    };
  }
  componentWillMount() {
    this.props.changeTestType(this.props.match.params.testType);
    // if (!this.props.questions) {
    //   this.props.setQuests({});
    // }
  }
  componentDidMount(){
    document.getElementById('switchGroupsTimers').disabled=true;
    document.getElementById('switchGroupResults').disabled=true;
  }
  OpenHandler = () => this.setState({ isOpen: true })

  FileSelectedHendler = event => {

    let files = event.target.files[0];

    const formData = new FormData();
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

  handleClose(setOneVariantState) {
    setOneVariantState(true);
  }
  handleSubmit = () => {
    console.log(this.state.groupsState);
    console.log(this.state.groupsTimerState)
  console.log(this.state.groupResultsState)
    var object = {};

    var formData = new FormData(document.forms.createTestForm);

    formData.append("test_content", JSON.stringify(this.props.questions));
    formData.append("test_check_sum", JSON.stringify(this.props.results));
    formData.append("test_type", this.props.testType);
    formData.set("test_img", this.state.actualImg);
    if (this.state.groupsTimerState) {
      formData.append("groups_object", JSON.stringify(this.props.groupsObject));
    }

    formData.forEach(function (value, key) {
      console.log(key)
      console.log(value)
      object[key] = value;
    })
    formData.append("test_question_count", this.props.questions.length)
    console.log(JSON.stringify(object));
    console.log(object);
    axios.post('https://psychotestmodule.herokuapp.com/tests/', formData)
      .then((response) => {
        console.log(response);
      }).catch(e => {
        console.log(e)
      })
    console.log(formData)
  }

  check = () => {
    console.log(this.props.questions)
  }

  setGroups(form, groupsObject, setGroupObject) {
    console.log(groupsObject)
    var formData = form;
    var propName = null;
    var propValue = null;
    let groupObj = groupsObject;
    formData.forEach((value, key) => {
      if (key === "groupNumber") {
        propName = value;
      }
      if (key === "groupTimer") {
        propValue = value;
      }
    })
    groupObj[propName] = propValue;
    setGroupObject(groupObj);
  }
  handleGroups(value, groupsObject) {
    console.log(groupsObject)
    if (groupsObject.hasOwnProperty(value)) {
      document.querySelector('#groupTimer').value = groupsObject[value];
    }
  }
  switchGroupsHandler() {
    this.setState({ groupsState: !this.state.groupsState })
    
    if (this.state.groupsState) {
      this.setState({ groupsTimerState: false })
      this.setState({ groupResultsState: false })
      document.getElementById('switchGroupsTimers').checked = false;
      document.getElementById('switchGroupsTimers').disabled=true;
      document.getElementById('switchGroupResults').checked = false;
      document.getElementById('switchGroupResults').disabled=true;
    }
    else{
      document.getElementById('switchGroupsTimers').disabled=false;
      document.getElementById('switchGroupResults').disabled=false;
    }
   
  }
  render() {

    const { handleSubmit, pristine, reset, submitting, questions, isReady, results, testType, groupsObject } = this.props
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

          <div className="triggerDiv">
            <div className="triggerDivItem">
              <OneVariantQuestion
                groupsState={this.state.groupsState}
                groupsTimerState={this.state.groupsTimerState}
                setGroups={this.setGroups}
                handleGroups={this.handleGroups}
                updateList={this.OpenHandler} />
            </div>

            {testType === 'third' ? "" :
              <div className="triggerDivItem">
                <ManyVariantQuestion
                  groupsState={this.state.groupsState}
                  groupsTimerState={this.state.groupsTimerState}
                  setGroups={this.setGroups}
                  handleGroups={this.handleGroups}
                  updateList={this.OpenHandler} />
              </div>}
            {
              testType === 'second' || testType === 'third' ?
                ""
                : <div className="triggerDivItem">
                  <SequenceQuestion
                    groupsState={this.state.groupsState}
                    groupsTimerState={this.state.groupsTimerState}
                    setGroups={this.setGroups}
                    handleGroups={this.handleGroups}
                    updateList={this.OpenHandler} />
                </div>
            }
            {
              testType === 'second' || testType === 'third' ?
                ""
                : <div className="triggerDivItem">
                  <WriteByYourselfQuestion
                    groupsState={this.state.groupsState}
                    groupsTimerState={this.state.groupsTimerState}
                    setGroups={this.setGroups}
                    handleGroups={this.handleGroups}
                    updateList={this.OpenHandler} />
                </div>
            }

            <div className="triggerDivItem">
              <TestResults editResults={results} groupResultsState={this.state.groupResultsState} />
            </div>
          </div>
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
  form: 'createTestForm' // a unique identifier for this form
})(createTestForm)